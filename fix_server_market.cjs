const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const marketApi = `
  app.get("/api/stock/market", async (req, res) => {
    try {
      const symbols = "005930,000660,005380,035420,035720"; // Samsung, Hynix, Hyundai, Naver, Kakao
      const url = \`https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:\${symbols}\`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const data = await response.json();
      
      if (data && data.result && data.result.areas && data.result.areas[0].datas) {
        const stocks = data.result.areas[0].datas.map((item: any) => ({
          code: item.cd,
          name: item.nm,
          price: item.nv,
          prevPrice: item.pcv,
          change: item.cv,
          changeRate: item.cr * (item.nv >= item.pcv ? 1 : -1),
          volume: item.aq,
          tradingValue: item.aa
        }));
        res.json({ stocks });
      } else {
        throw new Error("Invalid response from Naver API");
      }
    } catch (error: any) {
      console.error("Stock Market API Error:", error);
      res.json({ error: true, message: "시장 데이터를 불러오는데 실패했습니다." });
    }
  });
`;

content = content.replace('app.get("/api/stock", async (req, res) => {', marketApi + '\n  app.get("/api/stock", async (req, res) => {');

fs.writeFileSync('server.ts', content);
