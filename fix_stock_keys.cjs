const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace(/crypto_balance_v1/g, 'stock_balance_v1');
content = content.replace(/crypto_positions_v1/g, 'stock_positions_v1');
content = content.replace(/crypto_buy_prices_v1/g, 'stock_buy_prices_v1');
content = content.replace(/crypto_quantities_v1/g, 'stock_quantities_v1');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
