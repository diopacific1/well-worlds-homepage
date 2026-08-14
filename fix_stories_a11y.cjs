const fs = require('fs');

let content = fs.readFileSync('src/pages/Stories.tsx', 'utf8');

content = content.replace(/className="py-32 flex flex-col items-center justify-center text-center relative bg-surface-container-lowest border border-outline\/10 rounded-3xl shadow-sm overflow-hidden"/g, 'role="status" aria-live="polite" className="py-32 flex flex-col items-center justify-center text-center relative bg-surface-container-lowest border border-outline/10 rounded-3xl shadow-sm overflow-hidden"');

content = content.replace(/className="text-center py-20 bg-surface-container-lowest border border-outline\/10 rounded-3xl shadow-sm relative overflow-hidden"/g, 'role="status" aria-live="polite" className="text-center py-20 bg-surface-container-lowest border border-outline/10 rounded-3xl shadow-sm relative overflow-hidden"');

fs.writeFileSync('src/pages/Stories.tsx', content);

// Let's also do Guestbook's empty state
let guestbook = fs.readFileSync('src/pages/Guestbook.tsx', 'utf8');
guestbook = guestbook.replace(/className="flex flex-col items-center justify-center p-12 text-center bg-surface\/50 rounded-3xl border border-outline\/10 border-dashed"/g, 'role="status" aria-live="polite" className="flex flex-col items-center justify-center p-12 text-center bg-surface/50 rounded-3xl border border-outline/10 border-dashed"');
fs.writeFileSync('src/pages/Guestbook.tsx', guestbook);

