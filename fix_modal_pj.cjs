const fs = require('fs');

let pj = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');
pj = pj.replace(/className="fixed inset-0 z-\[100\] flex items-center justify-center p-4 sm:p-6 bg-on-surface\/40 backdrop-blur-md overflow-y-auto"/g, 'role="dialog" aria-modal="true" aria-labelledby="journal-modal-title" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-on-surface/40 backdrop-blur-md overflow-y-auto"');
pj = pj.replace(/<h2 className="text-2xl font-display font-bold text-on-surface">/g, '<h2 id="journal-modal-title" className="text-2xl font-display font-bold text-on-surface">');
fs.writeFileSync('src/pages/PlantJournal.tsx', pj);

