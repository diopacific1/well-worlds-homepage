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

replaceInFile('src/pages/AdminLogin.tsx', [
  { from: '<label className="text-xs font-semibold text-on-surface-variant block mb-1">', to: '<label htmlFor="email" className="text-xs font-semibold text-on-surface-variant block mb-1">' },
  { from: 'type="email"', to: 'id="email"\n                type="email"' },
  { from: '<label className="text-xs font-semibold text-on-surface-variant block mb-1">\n                {isSignUp ? "신규 가입할 비밀번호" : "비밀번호"}\n              </label>', to: '<label htmlFor="password" className="text-xs font-semibold text-on-surface-variant block mb-1">\n                {isSignUp ? "신규 가입할 비밀번호" : "비밀번호"}\n              </label>' },
  { from: 'type="password"', to: 'id="password"\n                type="password"' }
]);

replaceInFile('src/pages/AdminDashboard.tsx', [
  { from: '<label className="text-sm font-semibold text-on-surface-variant px-1">프로젝트명</label>', to: '<label htmlFor="pf-title" className="text-sm font-semibold text-on-surface-variant px-1">프로젝트명</label>' },
  { from: 'type="text" \n                  placeholder="프로젝트 이름"', to: 'id="pf-title"\n                  type="text" \n                  placeholder="프로젝트 이름"' },
  
  { from: '<label className="text-sm font-semibold text-on-surface-variant px-1">설명</label>', to: '<label htmlFor="pf-desc" className="text-sm font-semibold text-on-surface-variant px-1">설명</label>' },
  { from: 'rows={4}', to: 'id="pf-desc"\n                  rows={4}' },
  
  { from: '<label className="text-sm font-semibold text-on-surface-variant px-1">링크 (선택)</label>', to: '<label htmlFor="pf-link" className="text-sm font-semibold text-on-surface-variant px-1">링크 (선택)</label>' },
  { from: 'type="url"', to: 'id="pf-link"\n                  type="url"' },
  
  { from: '<label className="text-sm font-semibold text-on-surface-variant px-1">기술 스택</label>', to: '<label htmlFor="pf-tech" className="text-sm font-semibold text-on-surface-variant px-1">기술 스택</label>' },
  { from: 'placeholder="React, TypeScript, Firebase (쉼표로 구분)"', to: 'id="pf-tech"\n                  placeholder="React, TypeScript, Firebase (쉼표로 구분)"' }
]);

