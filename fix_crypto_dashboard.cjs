const fs = require('fs');

let content = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

// Add import if missing
if (!content.includes('MarketOverview')) {
  content = content.replace(
    'import { AssetSearch } from "../components/dashboard/AssetSearch";',
    'import { AssetSearch } from "../components/dashboard/AssetSearch";\nimport { MarketOverview } from "../components/MarketOverview";'
  );
}

// Add component if missing
if (!content.includes('<MarketOverview />')) {
  content = content.replace(
    '<AssetSearch',
    '<MarketOverview />\n          <AssetSearch'
  );
}

fs.writeFileSync('src/pages/CryptoDashboard.tsx', content);
