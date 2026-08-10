const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace(/localStorage\.setItem\("stock_buy_prices_krw"/g, 'localStorage.setItem("stock_buy_prices_v1"');
content = content.replace(/localStorage\.setItem\("stock_quantities"/g, 'localStorage.setItem("stock_quantities_v1"');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
