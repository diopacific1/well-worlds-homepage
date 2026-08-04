const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if (!content.includes('BarChart2')) {
  content = content.replace(
    "LayoutDashboard, LineChart, Leaf",
    "LayoutDashboard, LineChart, BarChart2, Leaf"
  );
}

content = content.replace(
  "{ name: '머니월드(주식)', path: '/stock', icon: LineChart },",
  "{ name: '머니월드(주식)', path: '/stock', icon: BarChart2 },"
);

fs.writeFileSync('src/components/Layout.tsx', content);
