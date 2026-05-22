import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Parser from "rss-parser";

const parser = new Parser();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/match-result", async (req, res) => {
    try {
      const { GoogleGenAI, Type } = await import("@google/genai");
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
      }
      
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
      
      const prompt = "KBO 리그 LG 트윈스의 가장 최신(최근) 경기 결과를 검색해줘. 경기 날짜(예: 5월 21일), 상대팀, LG 트윈스의 점수, 상대팀의 점수, 승리팀, MVP(수훈선수 또는 주요선수), 승리투수, 세이브투수(없으면 '없음')를 찾아서 반환해.";
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "경기 날짜 (예: 5월 21일)" },
              opponent: { type: Type.STRING, description: "상대팀 이름 (예: 두산, 키움, KIA 등)" },
              lgScore: { type: Type.NUMBER, description: "LG 트윈스 득점" },
              opponentScore: { type: Type.NUMBER, description: "상대팀 득점" },
              winner: { type: Type.STRING, description: "승리팀 이름 (예: LG 트윈스)" },
              mvp: { type: Type.STRING, description: "경기 MVP 또는 수훈선수" },
              winPitcher: { type: Type.STRING, description: "승리투수 이름" },
              savePitcher: { type: Type.STRING, description: "세이브투수 이름 (없으면 '없음')" }
            },
            required: ["date", "opponent", "lgScore", "opponentScore", "winner", "mvp", "winPitcher", "savePitcher"]
          }
        }
      });
      
      res.json(JSON.parse(response.text?.trim() || "{}"));
    } catch (error) {
      console.error("Error fetching match result:", error);
      res.status(500).json({ error: "Failed to fetch match result via Gemini." });
    }
  });

  app.get("/api/crypto", async (req, res) => {
    try {
      const { GoogleGenAI, Type } = await import("@google/genai");
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
      }
      
      const coinId = req.query.id as string || 'bitcoin';
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
      
      const prompt = `${coinId} 가상화폐의 실시간 정보를 검색해줘. 현재 가격(USD), 24시간 등락률, 시가총액, 24시간 거래량, 24시간 내 최고가/최저가를 정확히 검색해. 
또한 최근 7일간의 가격 추세를 시각화하기 위해 12개의 가격 데이터 포인트 배열을 생성해줘 (오래된 순에서 최신 순). RSI와 이동평균(MA 50, MA 200) 같은 기술적 지표와 최근 시장 심리(1~100 사이 숫자)도 함께 반환해줘.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              price: { type: Type.STRING, description: "현재 가격 (예: $72,450)" },
              trend: { type: Type.STRING, description: "24시간 등락률 (예: +1.25% 또는 -2.10%)" },
              marketCap: { type: Type.STRING, description: "시가총액" },
              volume: { type: Type.STRING, description: "24시간 거래량" },
              high24h: { type: Type.STRING, description: "24시간 최고가" },
              low24h: { type: Type.STRING, description: "24시간 최저가" },
              chartData: { 
                type: Type.ARRAY, 
                items: { type: Type.NUMBER },
                description: "최근 7일 가격 추세를 나타내는 12개의 숫자 데이터 포인트 (과거->현재)"
              },
              rsi: { type: Type.STRING, description: "RSI 지표 수치 (예: 62.4)" },
              ma50: { type: Type.STRING, description: "50일 이동평균선 (예: $65,000)" },
              ma200: { type: Type.STRING, description: "200일 이동평균선 (예: $50,000)" },
              sentimentScore: { type: Type.NUMBER, description: "시장 심리 점수 (1~100)" },
              sentimentStatus: { type: Type.STRING, description: "시장 심리 상태 (예: 낙관적, 공포 등)" },
              analysis: { type: Type.STRING, description: "시장 및 기술 분석 보고서 텍스트 요약 (2-3문장)" }
            },
            required: ["price", "trend", "marketCap", "volume", "high24h", "low24h", "chartData", "rsi", "ma50", "ma200", "sentimentScore", "sentimentStatus", "analysis"]
          }
        }
      });
      
      res.json(JSON.parse(response.text?.trim() || "{}"));
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      res.status(500).json({ error: "Failed to fetch crypto data via Gemini." });
    }
  });

  app.get("/api/news", async (req, res) => {
    try {
      const query = req.query.q as string || 'KBO 야구';
      const encodedQuery = encodeURIComponent(query);
      const feed = await parser.parseURL(`https://news.google.com/rss/search?q=${encodedQuery}&hl=ko&gl=KR&ceid=KR:ko`);
      return res.json({
        items: feed.items.map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          contentSnippet: item.contentSnippet,
        }))
      });
    } catch (error) {
      console.error('Error fetching RSS:', error);
      return res.status(500).json({ error: 'Failed to fetch news' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
