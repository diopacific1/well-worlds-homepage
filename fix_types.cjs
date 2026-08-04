const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

// Change types in CryptoData
content = content.replace(/price: string;/g, 'price: string | number;');
content = content.replace(/marketCap: string;/g, 'marketCap: string | number;');
content = content.replace(/volume: string;/g, 'volume: string | number;');
content = content.replace(/high24h: string;/g, 'high24h: string | number;');
content = content.replace(/low24h: string;/g, 'low24h: string | number;');
content = content.replace(/rsi: string;/g, 'rsi: string | number;');
content = content.replace(/ma50: string;/g, 'ma50: string | number;');
content = content.replace(/ma200: string;/g, 'ma200: string | number;');
content = content.replace(/ma20: basePrice \* 0.98,/g, 'ma20: String(basePrice * 0.98),'); // Fix any other missing string cast

// Fix formatKRW and formatKRWMacro
const formatters = `
  const parseKRW = (val: string | number | undefined) => {
    if (val === undefined) return 0;
    if (typeof val === 'number') return val;
    const clean = val.replace(/[^0-9.]/g, "");
    return parseFloat(clean) || 0;
  };

  const parseKRWWithUnit = (val: string | number | undefined) => {
    if (val === undefined) return 0;
    if (typeof val === 'number') return val;
    let multiplier = 1;
    const upper = val.toUpperCase();
    if (upper.includes('조')) multiplier = 1e12;
    else if (upper.includes('억')) multiplier = 1e8;
    else if (upper.includes('만')) multiplier = 1e4;
    
    // For previous USD strings
    if (upper.includes('T')) multiplier = 1e12;
    if (upper.includes('B')) multiplier = 1e9;
    if (upper.includes('M')) multiplier = 1e6;
    if (upper.includes('K')) multiplier = 1e3;
    
    const clean = val.replace(/[^0-9.]/g, "");
    return (parseFloat(clean) || 0) * multiplier;
  };

  const formatKRW = (val: string | number | undefined) => {
    if (val === undefined || val === "-") return "-";
    const num = parseKRW(val);
    return \`₩\${Math.round(num).toLocaleString()}\`;
  };

  const formatKRWMacro = (val: string | number | undefined) => {
    if (val === undefined || val === "-") return "-";
    const num = parseKRWWithUnit(val);
    if (num >= 1e12) return \`₩\${(num / 1e12).toFixed(1)}조\`;
    if (num >= 1e8) return \`₩\${Math.round(num / 1e8).toLocaleString()}억\`;
    return \`₩\${num.toLocaleString()}\`;
  };
`;

const oldFormattersRegex = /const parseKRW = \([\s\S]*?const currentPriceUSD = parseKRW\(cryptoData\?.price \|\| coin\.price\);/;

content = content.replace(oldFormattersRegex, formatters + '\n  const currentPriceKRW = parseKRW(cryptoData?.price || coin.price);');

// Replace currentPriceUSD with currentPriceKRW across the file
content = content.replace(/currentPriceUSD/g, 'currentPriceKRW');

// Remove currentPriceKRW assignment if it exists twice
content = content.replace(/const currentPriceKRW = parseKRW\(cryptoData\?.price \|\| coin\.price\);\n\n  const currentPriceKRW = parseKRW\(cryptoData\?.price \|\| coin\.price\);/g, 'const currentPriceKRW = parseKRW(cryptoData?.price || coin.price);');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
