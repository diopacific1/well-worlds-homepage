const fs = require('fs');

function addFnG(file, label) {
  let content = fs.readFileSync(file, 'utf8');

  // Add import
  if (!content.includes('FearAndGreed')) {
    content = content.replace(
      'import { MetricCard',
      'import { FearAndGreed } from "../components/dashboard/FearAndGreed";\nimport { MetricCard'
    );
  }
  
  // Add component in right column of Report Section
  const targetPattern = /<div className="bg-surface border border-outline\/20 p-6 md:p-8 rounded-2xl shadow-sm">/;
  const replacement = `<FearAndGreed score={cryptoData?.sentimentScore || 42} label="${label}" />\n                  <div className="bg-surface border border-outline/20 p-6 md:p-8 rounded-2xl shadow-sm">`;

  if (content.includes('<FearAndGreed')) {
    console.log('FearAndGreed already added to', file);
    return;
  }
  
  content = content.replace(targetPattern, replacement);
  fs.writeFileSync(file, content);
}

addFnG('src/pages/CryptoDashboard.tsx', 'AI 시장 공포/탐욕 지수');
addFnG('src/pages/StockDashboard.tsx', 'AI 투자자 심리 지수');
