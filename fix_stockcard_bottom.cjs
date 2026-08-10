const fs = require('fs');
let content = fs.readFileSync('src/components/StockCard.tsx', 'utf8');

content = content.replace(
  '{stock.price.toLocaleString()}원',
  '₩{stock.price.toLocaleString()}'
);

content = content.replace(
  '<div className="text-xs text-on-surface-variant mt-2 font-medium flex items-center justify-between">\n          <span>거래량: <span className="font-mono">{Math.floor(stock.volume / 1000).toLocaleString()}K</span></span>\n        </div>',
  '<div className="text-xs text-on-surface-variant mt-2 font-medium">\n          거래대금: <span className="font-mono">₩{Math.floor(stock.tradingValue / 1000000).toLocaleString()}백만</span>\n        </div>'
);

fs.writeFileSync('src/components/StockCard.tsx', content);
