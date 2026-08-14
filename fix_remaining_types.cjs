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

// 1. AssetChart.tsx
replaceInFile('src/components/dashboard/AssetChart.tsx', [
  { from: /payload\?: Record<string, string \| number>;/g, to: 'payload?: Record<string, any>;' },
  { from: /data: Array<Record<string, string \| number>>;/g, to: 'data: Array<Record<string, any>>;' }
]);

// 2. useAssetData.ts
replaceInFile('src/hooks/useAssetData.ts', [
  { from: /if \(err\.name === 'AbortError'\)/g, to: 'if (err instanceof Error && err.name === "AbortError")' },
  { from: /toast\.error\("데이터를 불러오는데 실패했습니다: " \+ err\.message\);/g, to: 'toast.error("데이터를 불러오는데 실패했습니다: " + (err instanceof Error ? err.message : String(err)));' },
  { from: /setError\(err\.message \|\| '알 수 없는 오류'\);/g, to: 'setError(err instanceof Error ? err.message : String(err));' }
]);

// 3. AdminDashboard.tsx
replaceInFile('src/pages/AdminDashboard.tsx', [
  { from: /entry\.createdAt\?\.toDate \? entry\.createdAt\.toDate\(\)\.toLocaleDateString\(\) : \(entry\.createdAt \? new Date\(entry\.createdAt\)\.toLocaleDateString\(\) : ''\)/g, to: '(entry.createdAt as { toDate?: () => Date })?.toDate ? (entry.createdAt as { toDate: () => Date }).toDate().toLocaleDateString() : (entry.createdAt ? new Date(entry.createdAt as string | number | Date).toLocaleDateString() : "")' }
]);

// 4. AdminLogin.tsx
replaceInFile('src/pages/AdminLogin.tsx', [
  { from: /if \(err\.code === 'auth\/invalid-credential'\)/g, to: 'if ((err as any).code === "auth/invalid-credential")' },
  { from: /} else if \(err\.code === 'auth\/too-many-requests'\) {/g, to: '} else if ((err as any).code === "auth/too-many-requests") {' },
  { from: /setError\(err\.message \|\| "로그인에 실패했습니다\."\);/g, to: 'setError((err instanceof Error ? err.message : (err as any).message) || "로그인에 실패했습니다.");' },
  { from: /if \(err\.code === 'auth\/invalid-email'\)/g, to: 'if ((err as any).code === "auth/invalid-email")' },
  { from: /} else if \(err\.code === 'auth\/user-not-found'\) {/g, to: '} else if ((err as any).code === "auth/user-not-found") {' },
  { from: /} else if \(err\.code === 'auth\/user-disabled' \|\| err\.code === 'auth\/invalid-credential'\) {/g, to: '} else if ((err as any).code === "auth/user-disabled" || (err as any).code === "auth/invalid-credential") {' },
  { from: /toast\.error\("비밀번호 재설정 이메일 발송에 실패했습니다: " \+ err\.message\);/g, to: 'toast.error("비밀번호 재설정 이메일 발송에 실패했습니다: " + (err instanceof Error ? err.message : String(err)));' }
]);

// 5. CryptoDashboard.tsx & StockDashboard.tsx
const itemReplacement = [
  { from: /item: \{ title: string, link: string \}/g, to: 'item: { title: string, link: string, pubDate?: string }' }
];
replaceInFile('src/pages/CryptoDashboard.tsx', itemReplacement);
replaceInFile('src/pages/StockDashboard.tsx', itemReplacement);

// 6. Guestbook.tsx
replaceInFile('src/pages/Guestbook.tsx', [
  { from: /toast\.error\("방명록을 등록하는 동안 오류가 발생했습니다: " \+ err\.message\);/g, to: 'toast.error("방명록을 등록하는 동안 오류가 발생했습니다: " + (err instanceof Error ? err.message : String(err)));' }
]);

