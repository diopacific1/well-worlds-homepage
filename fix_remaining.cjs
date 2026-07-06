const fs = require('fs');

function fixAnimatedPage() {
  let code = fs.readFileSync('src/components/AnimatedPage.tsx', 'utf8');
  // Add as any to the variants export
  code = code.replace(/variants={pageVariants}/, 'variants={pageVariants as any}');
  fs.writeFileSync('src/components/AnimatedPage.tsx', code);
}

function fixCryptoDashboard() {
  let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');
  
  // Fix duplicate image
  code = code.replace(/image\?: string;\s*image\?: string;/, 'image?: string;');
  
  // Fix getCandles logic
  // Replace the entire getCandles block
  code = code.replace(
    /const getCandles = \(\) => \{[\s\S]*?return candles\.map[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*\n\s*\}\);\n\s*\};/,
    `const getCandles = () => {
    if (cryptoData?.candles && cryptoData.candles.length > 0) {
      return cryptoData.candles;
    }
    const defaultData = defaultChartData;
    let currentOpen = (defaultData[0] as any) * 0.992;
    return defaultData.map((closeVal: number, i: number) => {
      const openVal = i === 0 ? currentOpen : defaultData[i - 1];
      const minOC = Math.min(openVal, closeVal);
      const maxOC = Math.max(openVal, closeVal);
      return {
        open: openVal,
        high: maxOC * 1.002,
        low: minOC * 0.998,
        close: closeVal,
      };
    });
  };`
  );
  
  // Fix 'candles' redeclaration. `const candles = cryptoData?.candles` was removed maybe?
  // Let's just fix the first mapping.
  code = code.replace(/const candles = getCandles\(\);\n\s*const candles = cryptoData\?\.candles \|\| defaultChartData;/, 'const candles = getCandles();');
  
  // Fix `unit` missing
  code = code.replace(
    /label="최대 공급량"\s*value="2,100만 BTC"\s*badges=\{\[\{ text: "한정", isAccent: true \}\]\}/,
    'label="최대 공급량"\n                  value="2,100만 BTC"\n                  unit=""\n                  badges={[{ text: "한정", isAccent: true }]}'
  );
  code = code.replace(
    /label="현재 시총순위"\s*value="1위"\s*trend="변동없음"\s*trendUp=\{true\}/,
    'label="현재 시총순위"\n                  value="1위"\n                  unit=""\n                  trend="변동없음"\n                  trendUp={true}'
  );
  
  fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
}

function fixAdminDashboard() {
  let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
  code = code.replace(/admin\.nickname/g, '(admin as any).nickname');
  code = code.replace(/err\.message/g, '(err as any).message');
  fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
}

function fixPlantJournal() {
  let code = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');
  code = code.replace(/as any\}\)\)\); \/\//g, 'as unknown as PlantJournalEntry))); //');
  fs.writeFileSync('src/pages/PlantJournal.tsx', code);
}

fixAnimatedPage();
fixCryptoDashboard();
fixAdminDashboard();
fixPlantJournal();
