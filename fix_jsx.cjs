const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    /\{loadingCrypto && \(\s*\{loadingCrypto && <DashboardSkeleton \/>\}/g,
    '{loadingCrypto && <DashboardSkeleton />'
  );

  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');
