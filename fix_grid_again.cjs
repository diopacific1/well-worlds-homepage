const fs = require('fs');

for (const file of ['src/pages/StockDashboard.tsx', 'src/pages/CryptoDashboard.tsx']) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Make it responsive on lg instead of xl
  content = content.replace('xl:grid-cols-12', 'lg:grid-cols-12');
  content = content.replace('xl:col-span-8', 'lg:col-span-8');
  content = content.replace('xl:col-span-4', 'lg:col-span-4');
  
  // Inside ROI Analyzer, Bento dynamic stats are grid-cols-2 lg:grid-cols-4
  // If it was taking too much vertical space on mobile, maybe we can simplify it or let it be.
  // We can change "grid-cols-2 lg:grid-cols-4" to "grid-cols-2 md:grid-cols-4" to prevent stacking on tablet
  content = content.replace('grid-cols-2 lg:grid-cols-4 gap-4 mt-8', 'grid-cols-2 md:grid-cols-4 gap-4 mt-8');
  
  // Make Indicators grid "grid-cols-2 md:grid-cols-4" wait, if it's in the main column (lg:col-span-8),
  // it might be squished. But lg:col-span-8 is 2/3 of screen, so md:grid-cols-4 is fine.
  
  fs.writeFileSync(file, content);
}
