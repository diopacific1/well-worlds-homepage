const fs = require('fs');

function cleanDashboard(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add the import statement near the top
  const importStatement = `import { MetricCard, IndicatorCard, InsightItem } from "../components/dashboard/SharedCards";\n`;
  content = content.replace('import { TrendingUp, Activity, BarChart2', 'import { Activity, BarChart2');
  
  const lastImportIndex = content.lastIndexOf('import ');
  const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
  content = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);

  // Remove the functions from the end
  const metricCardIndex = content.indexOf('function MetricCard(');
  if (metricCardIndex !== -1) {
    content = content.slice(0, metricCardIndex);
  }
  
  fs.writeFileSync(file, content);
}

cleanDashboard('src/pages/CryptoDashboard.tsx');
cleanDashboard('src/pages/StockDashboard.tsx');
