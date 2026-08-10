const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');
content = content.replace(/예: 삼성전자, 테슬라/g, "예: 삼성전자, 현대차");
fs.writeFileSync('src/pages/StockDashboard.tsx', content);
