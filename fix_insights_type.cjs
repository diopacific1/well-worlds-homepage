const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /const \[insights, setInsights\] = useState<Array<\{ date: string; label: string \}>>\(\[\]\);/g,
    'const [insights, setInsights] = useState<Array<{ date: string; label: string; link?: string; color?: string }>>([]);'
  );
  
  // also the actual logic mapping doesn't have link or color, which is fine they are optional.
  
  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');

