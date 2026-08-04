const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

// Add ma20
content = content.replace(/ma50: string \| number;/g, 'ma20: string | number;\n    ma50: string | number;');

// Fix parseFloat
content = content.replace(/parseFloat\(cryptoData\?\.rsi \|\| "50"\)/g, 'parseFloat(String(cryptoData?.rsi || "50"))');
content = content.replace(/parseFloat\(cryptoData\?\.rsi \|\| "62"\)/g, 'parseFloat(String(cryptoData?.rsi || "62"))');

// Any other parseKRW etc. Wait, I already did parseKRW in previous script!
// What about formatKRW? I did formatKRW(String(...)) in the previous script.
// Wait, indicator card value: `value={cryptoData?.rsi || "62.4"}` is passing string | number. IndicatorCard expects `value: string;`.
// Let's cast it to string as well: `value={String(cryptoData?.rsi || "62.4")}`

content = content.replace(/value=\{cryptoData\?\.rsi \|\| "62\.4"\}/g, 'value={String(cryptoData?.rsi || "62.4")}');

// Wait, I should also make sure IndicatorCard takes string | number
content = content.replace(/IndicatorCard \(\{\n  title,\n  value,\n  sub,/g, 'IndicatorCard ({\n  title,\n  value,\n  sub,');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
