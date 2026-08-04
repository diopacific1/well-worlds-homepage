const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace(/const openKRW = open \* USD_TO_KRW;/g, 'const openKRW = open;');
content = content.replace(/const highKRW = high \* USD_TO_KRW;/g, 'const highKRW = high;');
content = content.replace(/const lowKRW = low \* USD_TO_KRW;/g, 'const lowKRW = low;');
content = content.replace(/const closeKRW = close \* USD_TO_KRW;/g, 'const closeKRW = close;');
content = content.replace(/volume: \(candle\.volume \|\| 1000000\) \* USD_TO_KRW \* 100,/g, 'volume: (candle.volume || 1000000),');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
