const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/setShowSearchDropdown\(false\);\n/g, '');
  content = content.replace(/cryptoSearch/g, 'assetSearch');
  fs.writeFileSync(file, content);
}
fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');
