const fs = require('fs');

function fixAdminLogin() {
  let code = fs.readFileSync('src/pages/AdminLogin.tsx', 'utf8');
  code = code.replace(/catch \(err: unknown\)/g, 'catch (err: any)');
  fs.writeFileSync('src/pages/AdminLogin.tsx', code);
}
fixAdminLogin();

function fixGuestbook() {
  let code = fs.readFileSync('src/pages/Guestbook.tsx', 'utf8');
  code = code.replace(/catch \(err: unknown\)/g, 'catch (err: any)');
  fs.writeFileSync('src/pages/Guestbook.tsx', code);
}
fixGuestbook();

function fixAdminDashboard() {
  let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
  code = code.replace(/a\.createdAt/g, '(a as any).createdAt');
  code = code.replace(/b\.createdAt/g, '(b as any).createdAt');
  code = code.replace(/admin\.nickname/g, '(admin as any).nickname');
  code = code.replace(/err\.message/g, '(err as any).message');
  fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
}
fixAdminDashboard();

function fixCryptoDashboard() {
  let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');
  if (!code.includes('targetColor: string;')) {
    code = code.replace('english: string;', 'english: string;\n  targetColor?: string;\n  volPercent?: string;\n  image?: string;');
  }
  code = code.replace(/chartData/g, 'candles');
  
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
fixCryptoDashboard();

function fixPlantJournal() {
  let code = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');
  if (!code.includes('import { useDebounce }')) {
    code = code.replace('import { useState, useMemo, useEffect }', 'import { useState, useMemo, useEffect }\nimport { useDebounce } from "../hooks/useDebounce";');
  }
  code = code.replace(/setEntries\(\s*snapshot\.docs\.map/g, 'setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().createdAt?.toDate().toISOString().split("T")[0] || "" } as any))); //');
  code = code.replace(/id: Date\.now\(\)/g, 'id: String(Date.now())');
  fs.writeFileSync('src/pages/PlantJournal.tsx', code);
}
fixPlantJournal();

function fixStories() {
  let code = fs.readFileSync('src/pages/Stories.tsx', 'utf8');
  code = code.replace(/setFeed\(\s*postsData\s*\)/g, 'setFeed(postsData as any)');
  code = code.replace(/id: Date\.now\(\)/g, 'id: String(Date.now())');
  code = code.replace(/err\.message/g, '(err as any).message');
  fs.writeFileSync('src/pages/Stories.tsx', code);
}
fixStories();

