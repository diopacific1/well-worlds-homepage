const fs = require('fs');

let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

if (!content.includes('StockMarketOverview')) {
  content = content.replace(
    'import { AssetSearch } from "../components/dashboard/AssetSearch";',
    'import { AssetSearch } from "../components/dashboard/AssetSearch";\nimport { StockMarketOverview } from "../components/StockMarketOverview";'
  );
  
  content = content.replace(
    '<AssetSearch',
    '<StockMarketOverview />\n          <AssetSearch'
  );
}

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
