const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

// Change the main grid
content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">',
  '<div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 relative">'
);

// Main Column
content = content.replace(
  '<div className="lg:col-span-2 space-y-6">',
  '<div className="xl:col-span-8 flex flex-col gap-6 lg:gap-8">'
);

// Sidebar
content = content.replace(
  '{/* Sidebar */}\n            <div className="space-y-6">',
  '{/* Sidebar */}\n            <div className="xl:col-span-4 flex flex-col gap-6 lg:gap-8">'
);

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
