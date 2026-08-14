const fs = require('fs');

// 1. Add color-surface-container-lowest to index.css
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('--color-surface-container-lowest')) {
  css = css.replace('--color-surface: #ffffff;', '--color-surface: #ffffff;\n  --color-surface-container-lowest: #ffffff;');
  fs.writeFileSync('src/index.css', css);
}

const files = [
  'src/pages/Home.tsx',
  'src/pages/PlantJournal.tsx',
  'src/pages/Stories.tsx',
  'src/pages/Guestbook.tsx',
  'src/pages/CryptoDashboard.tsx',
  'src/pages/StockDashboard.tsx',
  'src/pages/AdminDashboard.tsx',
  'src/components/PlantCalendar.tsx',
  'src/components/CoinCard.tsx',
  'src/components/StockCard.tsx',
  'src/components/MarketOverview.tsx',
  'src/components/StockMarketOverview.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/text-outline-variant/g, 'text-on-surface-variant/50');
  
  content = content.replace(/rounded-\[2rem\]/g, 'rounded-3xl');
  content = content.replace(/rounded-\[32px\]/g, 'rounded-3xl');
  
  content = content.replace(
    /className="text-2xl md:text-3xl font-display font-bold text-on-surface"/g,
    'className="text-2xl md:text-3xl font-display font-extrabold text-on-surface tracking-tight"'
  );

  fs.writeFileSync(file, content);
});

console.log("Style standardization complete");
