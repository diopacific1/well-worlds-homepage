const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace(/const currentPriceKRW = currentPriceKRW \* USD_TO_KRW;/g, '');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
