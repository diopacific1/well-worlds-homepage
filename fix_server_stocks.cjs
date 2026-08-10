const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// replace the stockSymbolMap definition
const newStockSymbolMap = `const stockSymbolMap = {
        samsung: { ticker: "005930.KS", label: "삼성전자", shares: 5969782550 },
        hynix: { ticker: "000660.KS", label: "SK하이닉스", shares: 728002365 },
        hyundai: { ticker: "005380.KS", label: "현대차", shares: 211531506 }
      };`;
content = content.replace(/const stockSymbolMap = \{[\s\S]*?\};\n/, newStockSymbolMap + '\n');

// replace the mock cap scaling
content = content.replace(/marketCap: priceNum \* 10000000, \/\/ mock cap scaling/, 'marketCap: priceNum * stockInfo.shares,');

// volume was correct in shares, but maybe frontend expects KRW volume?
// If frontend uses `formatKRWMacro`, it expects currency. So price * volume is correct for KRW volume.
// let's leave volume as `meta.regularMarketVolume * priceNum` which is transaction amount in KRW.

// also make sure MA calculations are reasonable
// actually, the user said "실시간 데이터가 정확하지 않아". It could just be the market cap / high / low hardcodings.

fs.writeFileSync('server.ts', content);
