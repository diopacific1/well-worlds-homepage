const fs = require('fs');

let code = fs.readFileSync('src/pages/Stories.tsx', 'utf8');

code = code.replace(
  /alert\([\s\S]*?\);/,
  'toast.info("파이어베이스 스토리지 업로드가 실패하여 브라우저 로컬 데이터로 전환했습니다. 콘솔을 확인해주세요.");'
);
// wait, we also have showToast ?
code = code.replace(/showToast/g, 'toast.error'); // ensure we don't have showToast instead of toast

fs.writeFileSync('src/pages/Stories.tsx', code);
