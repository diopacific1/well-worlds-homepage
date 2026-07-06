const fs = require('fs');

// CryptoDashboard.tsx
let cryptoCode = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

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
  fdv?: string;
  volume?: string;
  volChange?: string;
}`
);

cryptoCode = cryptoCode.replace(
  /const cryptoCoins: Record<string, any> = \{/g,
  'const cryptoCoins: Record<string, CoinInfo> = {'
);

cryptoCode = cryptoCode.replace(
  /label="시가총액"\s*value=\{formatUSDToKRWMacro\(cryptoData\?\.marketCap \|\| coin\.marketCap\)\}\s*badges=\{\[\{ text: coin\.rank, isAccent: true \}\]\}\s*footerText=\{coin\.fdv\}/,
  'label="시가총액"\n              value={formatUSDToKRWMacro(cryptoData?.marketCap || coin.marketCap)}\n              unit=""\n              badges={[{ text: coin.rank, isAccent: true }]}\n              footerText={coin.fdv}'
);

cryptoCode = cryptoCode.replace(
  /label="24시간 거래량"\s*value=\{formatUSDToKRWMacro\(cryptoData\?\.volume \|\| coin\.volume\)\}\s*trend=\{coin\.volChange\}\s*trendUp=\{\!coin\.volChange\.includes\("↓"\)\}\s*footerText="전일 대비"/,
  'label="24시간 거래량"\n              value={formatUSDToKRWMacro(cryptoData?.volume || coin.volume)}\n              unit=""\n              trend={coin.volChange}\n              trendUp={!coin.volChange?.includes("↓")}\n              footerText="전일 대비"'
);

fs.writeFileSync('src/pages/CryptoDashboard.tsx', cryptoCode);

// PlantJournal.tsx
let journalCode = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');
journalCode = journalCode.replace(
  /setEntries\(snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\), date: doc\.data\(\)\.createdAt\?\.toDate\(\)\.toISOString\(\)\.split\("T"\)\[0\] \|\| "" \}\) as unknown as PlantJournalEntry\)\);/g,
  'setEntries(snapshot.docs.map(doc => { const data = doc.data(); return { id: doc.id, ...data, date: data.createdAt?.toDate().toISOString().split("T")[0] || "" } as unknown as PlantJournalEntry; }));'
);
fs.writeFileSync('src/pages/PlantJournal.tsx', journalCode);

