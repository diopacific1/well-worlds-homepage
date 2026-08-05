const fs = require('fs');

function stripMock(file, isStock) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace interface and object
  const importStatement = isStock
    ? 'import { MOCK_STOCKS as MOCK_COINS, AssetInfo as CoinInfo } from "../data/mockData";\n'
    : 'import { MOCK_COINS, AssetInfo as CoinInfo } from "../data/mockData";\n';

  if (!content.includes(importStatement)) {
    content = content.replace(
      'import { MetricCard',
      importStatement + 'import { MetricCard'
    );
  }

  // Find interface CoinInfo and MOCK_COINS/MOCK_STOCKS and remove them.
  // We can just use regex for this.
  
  if (isStock) {
     content = content.replace(/export interface StockInfo \{[\s\S]*?\};\n/, '');
     content = content.replace(/const MOCK_STOCKS: Record<string, StockInfo> = \{[\s\S]*?volPercent: "90%",\n  },\n};\n/g, '');
  } else {
     content = content.replace(/export interface CoinInfo \{[\s\S]*?\};\n/, '');
     content = content.replace(/const MOCK_COINS: Record<string, CoinInfo> = \{[\s\S]*?volPercent: "60%",\n  },\n};\n/g, '');
  }
  
  // Clean up any double empty lines
  content = content.replace(/\n\n\n/g, '\n\n');

  fs.writeFileSync(file, content);
}

stripMock('src/pages/CryptoDashboard.tsx', false);
stripMock('src/pages/StockDashboard.tsx', true);
