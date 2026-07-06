const fs = require('fs');

// CryptoDashboard.tsx
let cryptoCode = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

cryptoCode = cryptoCode.replace(
  /id: string;\n\s*name: string;/,
  'id?: string;\n  name: string;'
);
cryptoCode = cryptoCode.replace(
  /desc: string;/,
  'desc?: string;'
);

cryptoCode = cryptoCode.replace(
  /const cryptoCoins: Record<string, CoinInfo> = \{/g,
  'const cryptoCoins: Record<string, any> = {'
);

fs.writeFileSync('src/pages/CryptoDashboard.tsx', cryptoCode);

// PlantJournal.tsx
let journalCode = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');
journalCode = journalCode.replace(
  /setEntries\(snapshot\.docs\.map\(doc => \{ const data = doc\.data\(\); return \{ id: doc\.id, \.\.\.data, date: data\.createdAt\?\.toDate\(\)\.toISOString\(\)\.split\("T"\)\[0\] \|\| "" \} as unknown as PlantJournalEntry; \}\)\);/g,
  'setEntries(snapshot.docs.map(doc => { const data = doc.data(); return { id: doc.id, ...data, date: data.createdAt?.toDate().toISOString().split("T")[0] || "" }; }) as unknown as PlantJournalEntry[]);'
);
fs.writeFileSync('src/pages/PlantJournal.tsx', journalCode);

