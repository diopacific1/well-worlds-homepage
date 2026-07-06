const fs = require('fs');
let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

code = code.replace(
  'const candles = cryptoData?.candles || defaultChartData;',
  'const baseData = cryptoData?.candles || defaultChartData;'
);

code = code.replace(
  'let currentOpen = candles[0] * 0.992;',
  'let currentOpen = (baseData[0] as any) * 0.992;'
);

code = code.replace(
  'return candles.map((closeVal: number, i: number) => {',
  'return (baseData as number[]).map((closeVal: number, i: number) => {'
);

code = code.replace(
  'const openVal = i === 0 ? currentOpen : candles[i - 1];',
  'const openVal = i === 0 ? currentOpen : (baseData as number[])[i - 1];'
);

fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
