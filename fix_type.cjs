const fs = require('fs');
let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

code = code.replace(
  /candles: \{ open: number; high: number; low: number; close: number \}\[\];/,
  "candles: { open: number; high: number; low: number; close: number; volume?: number }[];"
);

code = code.replace(
  /candles\.map\(\(candle: \{ open: number; high: number; low: number; close: number \}/,
  "candles.map((candle: { open: number; high: number; low: number; close: number; volume?: number }"
);

code = code.replace(
  /volume: candle\.volume \* USD_TO_KRW \* 100/,
  "volume: (candle.volume || 1000000) * USD_TO_KRW * 100"
);

fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
