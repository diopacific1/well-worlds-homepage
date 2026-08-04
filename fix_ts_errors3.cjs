const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace(/ma200: basePrice \* 0\.9,\n          candles: generateCandles\(\)/g, 'ma200: basePrice * 0.9,\n          sentimentScore: 65,\n          sentimentStatus: "긍정적",\n          analysis: "시장 전반적으로 우상향 추세를 그리고 있습니다.",\n          candles: generateCandles()');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
