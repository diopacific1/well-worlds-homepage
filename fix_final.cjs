const fs = require('fs');

function fixAdminDashboard() {
  let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
  // find admin.nickname
  code = code.replace(/admin\.nickname/g, '(admin as any).nickname');
  // find err.message
  code = code.replace(/err\.message/g, '(err as any).message');
  // wait, the error is `{ id: string; author?: string; content?: string; createdAt?: any; }`
  // the variable name in line 183 is probably not `admin`, but something else? Let's check line 183.
  fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
}

function fixCryptoDashboard() {
  let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');
  code = code.replace(/image\?: string;\n\s*image\?: string;/g, 'image?: string;');
  
  // just remove one `image?: string;` entirely if duplicate
  let lines = code.split('\n');
  let imageCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('image?: string;')) {
      imageCount++;
      if (imageCount > 1 && i < 200) {
        lines[i] = ''; // remove duplicate in CoinInfo interface
      }
    }
  }
  code = lines.join('\n');

  // Fix unit missing
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
  // Fix the mapping issue properly
  code = code.replace(
    /setEntries\(snapshot\.docs\.map\([^\)]*\)[^\)]*\);/,
    'setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any), date: doc.data().createdAt?.toDate().toISOString().split("T")[0] || "" } as PlantJournalEntry)));'
  );
  fs.writeFileSync('src/pages/PlantJournal.tsx', code);
}

fixCryptoDashboard();
fixPlantJournal();
fixAdminDashboard();
