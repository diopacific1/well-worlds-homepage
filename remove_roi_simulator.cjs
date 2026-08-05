const fs = require('fs');

for (const file of ['src/pages/StockDashboard.tsx', 'src/pages/CryptoDashboard.tsx']) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove MarketOverview
  content = content.replace(/<MarketOverview \/>\s*/g, '');
  
  // Find Portfolio ROI Analysis Simulator and remove it
  const roiStart = content.indexOf('{/* Portfolio ROI Analysis Simulator */}');
  if (roiStart !== -1) {
    // Find the end of this block. It ends before {/* Sidebar */}
    const sidebarStart = content.indexOf('{/* Sidebar */}');
    if (sidebarStart !== -1) {
      content = content.substring(0, roiStart) + content.substring(sidebarStart);
    }
  }
  
  fs.writeFileSync(file, content);
}
