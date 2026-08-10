const fs = require('fs');

let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

if (!content.includes('StockPriceTicker')) {
  content = content.replace(
    'import { StockMarketOverview } from "../components/StockMarketOverview";',
    'import { StockMarketOverview } from "../components/StockMarketOverview";\nimport { StockPriceTicker } from "../components/StockPriceTicker";'
  );
  
  content = content.replace(
    '<main className="w-full flex flex-col pb-20">\n        ',
    '<main className="w-full flex flex-col pb-20">\n        <StockPriceTicker />\n        '
  );
}

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
