const fs = require('fs');
let code = fs.readFileSync('src/pages/Stories.tsx', 'utf8');

const regex = /\{\/\* Toasts \*\/\}\s*<div className="fixed bottom-8 left-1\/2 -translate-x-1\/2 z-50 flex flex-col gap-3 pointer-events-none">[\s\S]*?<\/AnimatePresence>\s*<\/div>/;
code = code.replace(regex, '');

fs.writeFileSync('src/pages/Stories.tsx', code);
