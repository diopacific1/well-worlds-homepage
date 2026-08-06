const fs = require('fs');

function replaceColors(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace utility classes
  content = content.replace(/text-\[\#E13030\]/g, 'text-kr-up');
  content = content.replace(/bg-\[\#E13030\]\/10/g, 'bg-kr-up/10');
  content = content.replace(/text-\[\#1261C4\]/g, 'text-kr-down');
  content = content.replace(/bg-\[\#1261C4\]\/10/g, 'bg-kr-down/10');
  
  content = content.replace(/text-\[\#00C853\]/g, 'text-kr-up');
  content = content.replace(/bg-\[\#00C853\]/g, 'bg-kr-up');
  content = content.replace(/text-\[\#ba1a1a\]/g, 'text-kr-down');
  content = content.replace(/bg-\[\#ba1a1a\]/g, 'bg-kr-down');
  
  // Also fix tooltip bg
  content = content.replace(/bg-\[\#151b2e\]\/98/g, 'bg-tooltip-bg/98');
  content = content.replace(/bg-\[\#F59E0B\]/g, 'bg-ma5');
  content = content.replace(/bg-\[\#8B5CF6\]/g, 'bg-ma10');

  fs.writeFileSync(file, content);
}

replaceColors('src/pages/CryptoDashboard.tsx');
replaceColors('src/pages/StockDashboard.tsx');
replaceColors('src/components/dashboard/AssetChart.tsx');

// In AssetChart, we also have JS props like stroke="#E13030"
function replaceJsColors(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // We can't use tailwind class in Recharts stroke={} directly unless we use CSS variables
  // Actually, Recharts requires valid color strings like "#E13030" or "var(--color-kr-up)"
  content = content.replace(/\"#E13030\"/g, '"var(--color-kr-up)"');
  content = content.replace(/\"#1261C4\"/g, '"var(--color-kr-down)"');
  content = content.replace(/\"#E2E8F0\"/g, '"var(--color-chart-grid)"');
  content = content.replace(/\"#1E293B\"/g, '"var(--color-chart-text)"');
  content = content.replace(/\"#F59E0B\"/g, '"var(--color-ma5)"');
  content = content.replace(/\"#8B5CF6\"/g, '"var(--color-ma10)"');
  content = content.replace(/\"#94A3B8\"/g, '"#94A3B8"'); // leave slate-400 as is or use hex

  fs.writeFileSync(file, content);
}

replaceJsColors('src/components/dashboard/AssetChart.tsx');

