const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

// The regex might have missed it because the exact trailing pattern differed or it wasn't named StockInfo anymore.
// Let's strip using awk or just indexOf.
const start = content.indexOf('const MOCK_STOCKS: Record');
if (start !== -1) {
  let braceCount = 0;
  let end = -1;
  let i = start + 20; // skipping the beginning
  while (i < content.length) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (braceCount === 0 && content[i] === ';') {
      end = i + 1;
      break;
    }
    i++;
  }
  if (end !== -1) {
    content = content.slice(0, start) + content.slice(end);
  }
}

// Ensure the import is correct
content = content.replace(
  'import { MOCK_STOCKS as MOCK_COINS, AssetInfo as CoinInfo } from "../data/mockData";',
  'import { MOCK_STOCKS, AssetInfo as CoinInfo } from "../data/mockData";'
);

// We need to keep references to MOCK_STOCKS in StockDashboard as MOCK_STOCKS
fs.writeFileSync('src/pages/StockDashboard.tsx', content);

