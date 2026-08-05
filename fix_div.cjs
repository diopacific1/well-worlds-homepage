const fs = require('fs');

for (const file of ['src/pages/StockDashboard.tsx', 'src/pages/CryptoDashboard.tsx']) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('{/* Sidebar */}', '</div>\n            {/* Sidebar */}');
  fs.writeFileSync(file, content);
}
