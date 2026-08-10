const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

content = content.replace(
  'hyundai: ["hyundai", "현대차", "현대자동차", "현대", "005380"],',
  'hyundai: ["hyundai", "현대차", "현대자동차", "현대", "005380"],\n    naver: ["naver", "네이버", "035420"],\n    kakao: ["kakao", "카카오", "035720"],'
);

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
