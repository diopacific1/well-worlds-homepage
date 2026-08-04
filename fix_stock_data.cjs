const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

// Replace MOCK_COINS block
const mockCoinsRegex = /const MOCK_COINS: Record<string, CoinInfo> = \{[\s\S]*?\};\n\nconst/;

const mockStocks = `const MOCK_STOCKS: Record<string, CoinInfo> = {
  samsung: {
    name: "삼성전자",
    symbol: "005930",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    symbolLength: "w-12 h-12 text-[11px]",
    color: "from-blue-700 to-blue-500",
    price: "72,500원",
    trend: "+1.2%",
    trendUp: true,
    volatility: "안정적",
    volLow: "71,000원",
    volHigh: "73,200원",
    marketCap: "432조원",
    rank: "코스피 1위",
    fdv: "PER: 15.2",
    volume: "1,245만주",
    volChange: "↑ 2.4%",
    english: "SAMSUNG ELEC",
    targetPrice: "85,000원",
    targetColor: "text-bullish",
    volColor: "bg-blue-600",
    volPercent: "60%",
  },
  hynix: {
    name: "SK하이닉스",
    symbol: "000660",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/SK_hynix_logo.svg",
    symbolLength: "w-12 h-12 text-[11px]",
    color: "from-red-600 to-red-400",
    price: "154,200원",
    trend: "-1.5%",
    trendUp: false,
    volatility: "높음",
    volLow: "151,000원",
    volHigh: "156,000원",
    marketCap: "112조원",
    rank: "코스피 2위",
    fdv: "PER: 24.1",
    volume: "354만주",
    volChange: "↓ 1.4%",
    english: "SK HYNIX",
    targetPrice: "180,000원",
    targetColor: "text-bearish",
    volColor: "bg-red-600",
    volPercent: "40%",
  },
  hyundai: {
    name: "현대차",
    symbol: "005380",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg",
    symbolLength: "w-12 h-12 text-[11px]",
    color: "from-blue-900 to-blue-700",
    price: "245,000원",
    trend: "+3.8%",
    trendUp: true,
    volatility: "강한 상승세",
    volLow: "238,000원",
    volHigh: "248,500원",
    marketCap: "52조원",
    rank: "코스피 3위",
    fdv: "PER: 5.3",
    volume: "112만주",
    volChange: "↑ 15.2%",
    english: "HYUNDAI MOTOR",
    targetPrice: "300,000원",
    targetColor: "text-bullish",
    volColor: "bg-blue-800",
    volPercent: "90%",
  }
};

const`;
content = content.replace(mockCoinsRegex, mockStocks);

// Replace "MOCK_COINS" with "MOCK_STOCKS" everywhere else
content = content.replace(/MOCK_COINS/g, 'MOCK_STOCKS');

// Replace activeCoinId state default
content = content.replace(/useState<string>\("apple"\)/g, 'useState<string>("samsung")');

// Favorites default
content = content.replace(/\["bitcoin", "ethereum", "solana"\]/g, '["samsung", "hynix", "hyundai"]');
content = content.replace(/\["apple", "tesla", "nvidia"\]/g, '["samsung", "hynix", "hyundai"]');

// Quantities
content = content.replace(/activeCoinId === "bitcoin" \? 0.25 : activeCoinId === "ethereum" \? 1.5 : activeCoinId === "solana" \? 15 : 200/g, 'activeCoinId === "samsung" ? 100 : activeCoinId === "hynix" ? 50 : 30');
content = content.replace(/\{ bitcoin: 0.25, ethereum: 1.5, solana: 12, wormhole: 500, ripple: 2000, dogecoin: 10000 \}/g, '{ samsung: 100, hynix: 50, hyundai: 30 }');

// Buy prices default
content = content.replace(/Math.round\(currentPriceKRW \* 0.95\)/g, 'Math.round(currentPriceKRW * 0.98)');
content = content.replace(/\{ bitcoin: 90000000, ethereum: 4500000, solana: 180000, wormhole: 3500, ripple: 800, dogecoin: 154 \}/g, '{ samsung: 71000, hynix: 156000, hyundai: 230000 }');

// Replace "가상화폐" with "주식" in news search
content = content.replace(/가상화폐 /g, '주식 ');

// Replace "코인" / "coin" variables where strictly visible as text
content = content.replace(/코인 실시간 시세/g, '주식 실시간 시세');
content = content.replace(/코인 선택/g, '주목할 종목');
content = content.replace(/관심 코인/g, '관심 종목');
content = content.replace(/코인명 검색/g, '종목명 검색');

// Stop API fetch for crypto and use simulated data
const fetchBlock = /const fetchController = new AbortController\(\);[\s\S]*?catch \(err\) \{[\s\S]*?\}\n    \};\n\n    fetchData\(\);/m;

const mockFetchBlock = `const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate network delay
        await new Promise(res => setTimeout(res, 600));
        
        const stockInfo = MOCK_STOCKS[activeCoinId];
        const basePrice = parseInt(stockInfo?.price.replace(/[^0-9]/g, '') || "50000");
        
        const generateCandles = () => {
          const candles = [];
          let currentBase = basePrice * 0.9;
          const numCandles = timeframe === "1D" ? 30 : timeframe === "1W" ? 52 : 24;
          
          for(let i=0; i<numCandles; i++) {
            const open = currentBase + (Math.random() - 0.5) * (basePrice * 0.05);
            const close = open + (Math.random() - 0.5) * (basePrice * 0.06);
            const high = Math.max(open, close) + Math.random() * (basePrice * 0.02);
            const low = Math.min(open, close) - Math.random() * (basePrice * 0.02);
            
            candles.push({
              time: new Date(Date.now() - (numCandles - i) * 86400000).toISOString(),
              open, high, low, close,
              volume: Math.random() * 1000000
            });
            currentBase = close;
          }
          return candles;
        };
        
        const candles = generateCandles();
        
        setCryptoData({
          id: activeCoinId,
          price: basePrice,
          trend: stockInfo?.trend || "+1.0%",
          high24h: basePrice * 1.03,
          low24h: basePrice * 0.97,
          volume: 1500000,
          marketCap: 100000000000,
          rsi: 45 + Math.random() * 20,
          ma20: basePrice * 0.98,
          ma50: basePrice * 0.95,
          ma200: basePrice * 0.9,
          candles
        });
        
      } catch (err) {
        console.error("Failed to generate mock data", err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();`;

content = content.replace(fetchBlock, mockFetchBlock);

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
