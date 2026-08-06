const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find start of interface CandlestickProps
  const startIdx = content.indexOf('// Upbit/Stock-Market style custom Candlestick rendering shape');
  // Find end of CandlestickShape function
  const match = content.match(/const CandlestickShape = \(props: CandlestickProps\) => \{[\s\S]*?return \([\s\S]*?<\/g>\s*\);\s*\};/);
  
  if (startIdx !== -1 && match) {
    const endIdx = match.index + match[0].length;
    content = content.substring(0, startIdx) + content.substring(endIdx);
  }

  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');
