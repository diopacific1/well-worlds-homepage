const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    'return [minLow * 0.997, maxHigh * 1.003];',
    'return [minLow * 0.997, maxHigh * 1.003] as [number, number];'
  );
  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');
