const fs = require('fs');

const pages = ['src/pages/StockDashboard.tsx'];
pages.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import { PriceTicker } from "\.\.\/components\/PriceTicker";\n/g, '');
    fs.writeFileSync(file, content);
});
