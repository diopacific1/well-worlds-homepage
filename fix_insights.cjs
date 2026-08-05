const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove the old duplicate insight declaration entirely.
  // The old block was:
  const oldInsightsStr = `  interface Insight {
    date: string;
    label: string;
    color: string;
    link?: string;
  }
  const [insights, setInsights] = useState<Insight[]>([]);`;

  content = content.replace(oldInsightsStr, '');

  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');

