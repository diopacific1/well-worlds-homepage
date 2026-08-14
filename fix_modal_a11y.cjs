const fs = require('fs');

let admin = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
admin = admin.replace(/className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black\/50 backdrop-blur-sm"/g, 'role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"');
admin = admin.replace(/<h2 className="text-xl font-bold text-on-surface">새 포트폴리오 추가<\/h2>/g, '<h2 id="portfolio-modal-title" className="text-xl font-bold text-on-surface">새 포트폴리오 추가</h2>');
fs.writeFileSync('src/pages/AdminDashboard.tsx', admin);

