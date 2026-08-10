const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace(/return `₩\$\{Math\.round\(num\)\.toLocaleString\(\)\}`;/g, 'return `${Math.round(num).toLocaleString()}원`;');
content = content.replace(/return `₩\$\{\(num \/ 1e12\)\.toFixed\(1\)\}조`;/g, 'return `${(num / 1e12).toFixed(1)}조원`;');
content = content.replace(/return `₩\$\{Math\.round\(num \/ 1e8\)\.toLocaleString\(\)\}억`;/g, 'return `${Math.round(num / 1e8).toLocaleString()}억원`;');
content = content.replace(/return `₩\$\{num\.toLocaleString\(\)\}`;/g, 'return `${num.toLocaleString()}원`;');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
