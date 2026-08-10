const fs = require('fs');

let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace(
  '<StockMarketOverview />',
  '<StockMarketOverview onSelectAsset={setActiveCoinId} />'
);

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
