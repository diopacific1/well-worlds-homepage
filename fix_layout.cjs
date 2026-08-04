const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

content = content.replace(
  "{ name: '크립토 월드', path: '/crypto', icon: LineChart },",
  "{ name: '머니월드(코인)', path: '/crypto', icon: LineChart },\n    { name: '머니월드(주식)', path: '/stock', icon: LineChart },"
);

fs.writeFileSync('src/components/Layout.tsx', content);
