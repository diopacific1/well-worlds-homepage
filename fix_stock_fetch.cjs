const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

// Replace the fetch block
const startFetch = "const fetchController = new AbortController();";
const endFetch = "return () => fetchController.abort();";

const startIndex = content.indexOf(startFetch);
const endIndex = content.indexOf(endFetch, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `const fetchData = async () => {
      setLoadingCrypto(true);
      try {
        await new Promise(res => setTimeout(res, 600));
        const stockInfo = MOCK_STOCKS[activeCoinId];
        const basePriceStr = stockInfo?.price.replace(/[^0-9]/g, '') || "50000";
        const basePrice = parseInt(basePriceStr);
        
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
          candles: generateCandles()
        });
      } catch (err) {
        console.error("Failed to generate mock data", err);
      } finally {
        setLoadingCrypto(false);
      }
    };
    fetchData();`;
  
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex + endFetch.length);
}

// Remove SEARCH_MAPPINGS block since we're using static stocks now, or update it
const searchMappingsStart = content.indexOf("const SEARCH_MAPPINGS: Record<string, string[]> = {");
if (searchMappingsStart !== -1) {
  const searchMappingsEnd = content.indexOf("};", searchMappingsStart) + 2;
  const newMappings = `const SEARCH_MAPPINGS: Record<string, string[]> = {
    samsung: ["samsung", "삼성전자", "삼성", "005930"],
    hynix: ["hynix", "sk하이닉스", "하이닉스", "000660"],
    hyundai: ["hyundai", "현대차", "현대자동차", "현대", "005380"]
  };`;
  content = content.substring(0, searchMappingsStart) + newMappings + content.substring(searchMappingsEnd);
}

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
