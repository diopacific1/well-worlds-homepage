const fs = require('fs');

const pages = ['src/pages/StockDashboard.tsx', 'src/pages/CryptoDashboard.tsx'];
pages.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import { MarketOverview } from "\.\.\/components\/MarketOverview";\n/g, '');
    fs.writeFileSync(file, content);
});
