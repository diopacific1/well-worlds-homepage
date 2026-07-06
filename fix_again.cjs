const fs = require('fs');

function fixCryptoDashboard() {
  let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');
  
  // Remove one duplicate image
  code = code.replace(/image\?: string;\n\s*image\?: string;/, 'image?: string;');
  code = code.replace(/image\?: string;[\s\n]*image\?: string;/, 'image?: string;');
  
  // Add unit
  code = code.replace(
    'label="최대 공급량"\n                  value="2,100만 BTC"\n                  badges={[{ text: "한정", isAccent: true }]}',
    'label="최대 공급량"\n                  value="2,100만 BTC"\n                  unit=""\n                  badges={[{ text: "한정", isAccent: true }]}'
  );
  code = code.replace(
    'label="현재 시총순위"\n                  value="1위"\n                  trend="변동없음"\n                  trendUp={true}',
    'label="현재 시총순위"\n                  value="1위"\n                  unit=""\n                  trend="변동없음"\n                  trendUp={true}'
  );
  
  // If the unit replace didn't work because of indentation, let's just regex it
  code = code.replace(/label="최대 공급량"[\s\n]+value="2,100만 BTC"[\s\n]+badges=\{\[\{ text: "한정", isAccent: true \}\]\}/g, 'label="최대 공급량"\n                  value="2,100만 BTC"\n                  unit=""\n                  badges={[{ text: "한정", isAccent: true }]}');
  code = code.replace(/label="현재 시총순위"[\s\n]+value="1위"[\s\n]+trend="변동없음"[\s\n]+trendUp=\{true\}/g, 'label="현재 시총순위"\n                  value="1위"\n                  unit=""\n                  trend="변동없음"\n                  trendUp={true}');

  fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
}

function fixPlantJournal() {
  let code = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');
  // Just force cast the whole thing inside the map!
  code = code.replace(
    /setEntries\(snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.\(doc\.data\(\) as any\), date: doc\.data\(\)\.createdAt\?\.toDate\(\)\.toISOString\(\)\.split\("T"\)\[0\] \|\| "" \} as PlantJournalEntry\)\)\);/,
    'setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any), date: doc.data().createdAt?.toDate().toISOString().split("T")[0] || "" } as unknown as PlantJournalEntry)));'
  );
  // Also try replacing it directly if it was still the older one
  code = code.replace(/setEntries\([^;]+;\s*\/\//g, 'setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any), date: doc.data().createdAt?.toDate().toISOString().split("T")[0] || "" } as unknown as PlantJournalEntry))); //');
  fs.writeFileSync('src/pages/PlantJournal.tsx', code);
}

fixCryptoDashboard();
fixPlantJournal();
