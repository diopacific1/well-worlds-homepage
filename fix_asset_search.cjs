const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/AssetSearch.tsx', 'utf8');

content = content.replace('color: string;\n  };', 'color: string;\n  };\n  currencyLabel?: string;');
content = content.replace('coinData,\n}: AssetSearchProps) {', 'coinData,\n  currencyLabel = "USD"\n}: AssetSearchProps) {');
content = content.replace('/ USD', '/ {currencyLabel}');

fs.writeFileSync('src/components/dashboard/AssetSearch.tsx', content);
