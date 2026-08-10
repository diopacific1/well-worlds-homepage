const fs = require('fs');
let content = fs.readFileSync('src/components/StockCard.tsx', 'utf8');

content = content.replace(
  '<div className="flex flex-col">\n          <h3 className="font-bold text-on-surface line-clamp-1">{stock.name}</h3>\n          <span className="text-[10px] text-on-surface-variant font-mono">{stock.code}</span>\n        </div>',
  '<div className="flex items-center gap-2">\n          <h3 className="font-bold text-on-surface line-clamp-1">{stock.name}</h3>\n          <span className="text-[10px] text-on-surface-variant font-mono">{stock.code}</span>\n        </div>'
);

fs.writeFileSync('src/components/StockCard.tsx', content);
