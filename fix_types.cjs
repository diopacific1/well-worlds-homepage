const fs = require('fs');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

// 1. Fix standard catch (err: any) blocks
const catchReplacements = [
  { from: /catch \(err: any\)/g, to: 'catch (err: unknown)' },
  { from: /\(err as any\)\.message/g, to: '(err instanceof Error ? err.message : String(err))' },
  { from: /\(fallbackErr as any\)\.message/g, to: '(fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr))' }
];

[
  'src/hooks/useAssetData.ts',
  'src/pages/Guestbook.tsx',
  'src/pages/PlantJournal.tsx',
  'src/pages/Stories.tsx',
  'src/pages/AdminLogin.tsx'
].forEach(file => replaceInFile(file, catchReplacements));

// 2. Fix AssetChart
replaceInFile('src/components/dashboard/AssetChart.tsx', [
  { from: /payload\?: any;/g, to: 'payload?: Record<string, string | number>;' },
  { from: /data: any\[\];/g, to: 'data: Array<Record<string, string | number>>;' }
]);

// 3. Fix Layout RSS parser
replaceInFile('src/components/Layout.tsx', [
  { from: /item: any/g, to: 'item: { title: string }' }
]);

// 4. Fix PlantCalendar icons
replaceInFile('src/components/PlantCalendar.tsx', [
  { from: /icon: React\.FC<any>/g, to: 'icon: React.ElementType' }
]);

// 5. Fix Dashboards (Crypto, Stock)
[
  'src/pages/CryptoDashboard.tsx',
  'src/pages/StockDashboard.tsx'
].forEach(file => replaceInFile(file, [
  { from: /item: any/g, to: 'item: { title: string, link: string }' },
  { from: /\(baseData\[0\] as any\)/g, to: 'Number(baseData[0])' }
]));

// 6. Fix AdminDashboard createdAt sorting
replaceInFile('src/pages/AdminDashboard.tsx', [
  { from: /createdAt\?: any/g, to: 'createdAt?: any // TODO: refine type' }, // Will fix properly in next step
  { from: /as any\)\.createdAt/g, to: 'as { createdAt?: { toMillis?: () => number } | string | Date }).createdAt' }
]);

