const fs = require('fs');

// Layout.tsx
let layoutCode = fs.readFileSync('src/components/Layout.tsx', 'utf8');
if (!layoutCode.includes('import BackToTop')) {
  layoutCode = layoutCode.replace(
    'import { useState, useEffect } from \'react\';',
    'import { useState, useEffect } from \'react\';\nimport BackToTop from "./BackToTop";'
  );
  fs.writeFileSync('src/components/Layout.tsx', layoutCode);
}

// CryptoDashboard.tsx
let cryptoCode = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');
// Fix CoinInfo interface
cryptoCode = cryptoCode.replace(
  /interface CoinInfo \{[\s\S]*?\}/,
  `interface CoinInfo {
  id: string;
  name: string;
  symbol: string;
  symbolLength?: string;
  color: string;
  price: string;
  trend: string;
  trendUp: boolean;
  volatility: string;
  volLow: string;
  volHigh: string;
  marketCap: string;
  rank: string;
  desc: string;
  targetPrice: string;
  english: string;
  targetColor?: string;
  volPercent?: string;
  volColor?: string;
  image?: string;
}`
);

cryptoCode = cryptoCode.replace(
  /label="최대 공급량"[\s\S]*?value="2,100만 BTC"[\s\S]*?badges=\{\[\{ text: "한정", isAccent: true \}\]\}/g,
  'label="최대 공급량"\n                  value="2,100만 BTC"\n                  unit=""\n                  badges={[{ text: "한정", isAccent: true }]}'
);
cryptoCode = cryptoCode.replace(
  /label="현재 시총순위"[\s\S]*?value="1위"[\s\S]*?trend="변동없음"[\s\S]*?trendUp=\{true\}/g,
  'label="현재 시총순위"\n                  value="1위"\n                  unit=""\n                  trend="변동없음"\n                  trendUp={true}'
);

fs.writeFileSync('src/pages/CryptoDashboard.tsx', cryptoCode);

// PlantJournal.tsx
let journalCode = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');
journalCode = journalCode.replace(
  /setEntries\(snapshot\.docs\.map\([\s\S]*?\)\);\s*\/\//g,
  'setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().createdAt?.toDate().toISOString().split("T")[0] || "" }) as unknown as PlantJournalEntry)); //'
);
fs.writeFileSync('src/pages/PlantJournal.tsx', journalCode);

