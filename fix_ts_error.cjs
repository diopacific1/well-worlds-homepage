const fs = require('fs');

function fix(file, actualType) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\$\{typeName\}/g, actualType);
  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx', 'crypto');
fix('src/pages/StockDashboard.tsx', 'stock');
