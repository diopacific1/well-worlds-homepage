const fs = require('fs');

function fixCryptoDashboard() {
  let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');
  // Remove duplicate 'image?: string;'
  code = code.replace(/image\?: string;\n\s*image\?: string;/g, 'image?: string;');
  
  // Add 'volColor' to CoinInfo
  if (!code.includes('volColor?: string;')) {
    code = code.replace('volPercent?: string;', 'volPercent?: string;\n  volColor?: string;');
  }
  
  // Fix duplicate 'candles' declaration
  code = code.replace(/const candles = getCandles\(\);\n\s*const candles = /g, 'const candles = ');
  
  // Fix unit error
  code = code.replace(
    'label="최대 공급량"\n                  value="2,100만 BTC"\n                  badges={[{ text: "한정", isAccent: true }]}',
    'label="최대 공급량"\n                  value="2,100만 BTC"\n                  unit=""\n                  badges={[{ text: "한정", isAccent: true }]}'
  );
  code = code.replace(
    'label="현재 시총순위"\n                  value="1위"\n                  trend="변동없음"\n                  trendUp={true}',
    'label="현재 시총순위"\n                  value="1위"\n                  unit=""\n                  trend="변동없음"\n                  trendUp={true}'
  );

  fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
}

function fixPlantJournal() {
  let code = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');
  if (!code.includes('import { useDebounce }')) {
    code = code.replace('import { useState, useEffect, useMemo } from "react";', 'import { useState, useEffect, useMemo } from "react";\nimport { useDebounce } from "../hooks/useDebounce";');
  }
  fs.writeFileSync('src/pages/PlantJournal.tsx', code);
}

fixCryptoDashboard();
fixPlantJournal();
