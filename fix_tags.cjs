const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('</main>', '  </div>\n      </main>');
  fs.writeFileSync(file, content);
}
fix('src/pages/StockDashboard.tsx');
fix('src/pages/CryptoDashboard.tsx');
