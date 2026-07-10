const fs = require('fs');
let code = fs.readFileSync('src/pages/Guestbook.tsx', 'utf8');

const target1 = `      <section className="flex flex-col gap-6 pt-4">
        <h2 className="text-xl font-bold text-on-surface px-2">우물가에 새겨진 기록들</h2>`;

const replace1 = `      <section className="flex flex-col gap-8 pt-8 border-t border-outline/10">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-display font-bold text-on-surface">우물가에 새겨진 기록들</h2>
          <span className="text-sm font-medium text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">{entries.length}개의 기록</span>
        </div>`;

code = code.replace(target1, replace1);

const target2 = `        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                key={entry.id} 
                className="bg-surface p-6 rounded-2xl border border-outline/10 shadow-sm"
              >`;

const replace2 = `        ) : (
          <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {entries.map((entry, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                key={entry.id} 
                className="break-inside-avoid bg-surface/80 backdrop-blur-md p-7 rounded-3xl border border-outline/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group"
              >`;

code = code.replace(target2, replace2);

const target3 = `                <p className="text-on-surface font-medium leading-relaxed whitespace-pre-wrap word-break-all">
                  {entry.message}
                </p>`;
const replace3 = `                <div className="relative z-10">
                  <span className="absolute -top-4 -left-2 text-4xl text-primary/10 font-serif">"</span>
                  <p className="text-on-surface font-medium leading-relaxed whitespace-pre-wrap word-break-all relative z-10 pt-2">
                    {entry.message}
                  </p>
                </div>`;

code = code.replace(target3, replace3);

const target4 = `      <div className="max-w-3xl mx-auto flex flex-col gap-10 w-full animate-in fade-in duration-700 pb-12">`;
const replace4 = `      <div className="max-w-4xl mx-auto flex flex-col gap-12 w-full animate-in fade-in duration-700 pb-16 px-4">`;
code = code.replace(target4, replace4);


fs.writeFileSync('src/pages/Guestbook.tsx', code);
