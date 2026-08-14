const fs = require('fs');
let content = fs.readFileSync('src/components/Toast.tsx', 'utf8');
content = content.replace(/<button\n              onClick=\{\(\) => removeToast\(t.id\)\}/g, '<button\n              aria-label="알림 닫기"\n              onClick={() => removeToast(t.id)}');
fs.writeFileSync('src/components/Toast.tsx', content);
