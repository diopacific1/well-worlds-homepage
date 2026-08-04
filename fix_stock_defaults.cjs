const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace(/\{[\s\n]*bitcoin: 90000000,[\s\n]*ethereum: 4500000,[\s\n]*solana: 170000,[\s\n]*wormhole: 3500,[\s\n]*ripple: 630,[\s\n]*dogecoin: 154,[\s\n]*\}/g, '{ samsung: 71000, hynix: 156000, hyundai: 230000 }');

content = content.replace(/\{[\s\n]*bitcoin: 0\.25,[\s\n]*ethereum: 1\.5,[\s\n]*solana: 12,[\s\n]*wormhole: 500,[\s\n]*ripple: 2000,[\s\n]*dogecoin: 10000,[\s\n]*\}/g, '{ samsung: 100, hynix: 50, hyundai: 30 }');

content = content.replace(/crypto_buy_prices_krw_v2/g, 'stock_buy_prices_krw');
content = content.replace(/crypto_quantities_v2/g, 'stock_quantities');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
