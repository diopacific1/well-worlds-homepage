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

replaceInFile('src/pages/PlantJournal.tsx', [
  { from: '<input\n              type="text"\n              placeholder="일지 내용, 태그 검색..."', to: '<input\n              type="text"\n              aria-label="일지 내용 및 태그 검색"\n              placeholder="일지 내용, 태그 검색..."' },
  { from: '<div className="flex flex-col items-center justify-center p-12 text-center bg-surface/50 rounded-3xl border border-outline/10 border-dashed">', to: '<div className="flex flex-col items-center justify-center p-12 text-center bg-surface/50 rounded-3xl border border-outline/10 border-dashed" role="status" aria-live="polite">' }
]);

replaceInFile('src/pages/Guestbook.tsx', [
  { from: '<div className="flex flex-col items-center justify-center p-12 text-center bg-surface/50 rounded-3xl border border-outline/10 border-dashed">', to: '<div className="flex flex-col items-center justify-center p-12 text-center bg-surface/50 rounded-3xl border border-outline/10 border-dashed" role="status" aria-live="polite">' }
]);

replaceInFile('src/pages/Stories.tsx', [
  { from: '<input\n              type="text"\n              placeholder="세계관, 제목, 태그 검색..."', to: '<input\n              type="text"\n              aria-label="세계관, 제목, 태그 검색"\n              placeholder="세계관, 제목, 태그 검색..."' },
  { from: '<div className="flex flex-col items-center justify-center p-16 text-center bg-surface/50 rounded-3xl border border-outline/10 border-dashed">', to: '<div className="flex flex-col items-center justify-center p-16 text-center bg-surface/50 rounded-3xl border border-outline/10 border-dashed" role="status" aria-live="polite">' }
]);

