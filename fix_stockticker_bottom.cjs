const fs = require('fs');
let content = fs.readFileSync('src/components/StockPriceTicker.tsx', 'utf8');

content = content.replace(
  '{stock.price.toLocaleString()}원',
  '₩{stock.price.toLocaleString()}'
);

fs.writeFileSync('src/components/StockPriceTicker.tsx', content);
