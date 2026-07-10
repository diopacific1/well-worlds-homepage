const fs = require('fs');
let code = fs.readFileSync('src/pages/Guestbook.tsx', 'utf8');

const targetForm = `      {/* 방명록 작성 폼 */}
      <section className="bg-surface border border-outline/20 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">`;

const replaceForm = `      {/* 방명록 작성 폼 */}
      <section className="relative overflow-hidden rounded-[2rem] border border-outline/10 bg-surface/50 p-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 pointer-events-none"></div>
        <div className="absolute inset-0 backdrop-blur-xl"></div>
        <div className="relative bg-surface/80 rounded-[1.75rem] p-6 md:p-8 shadow-inner border border-white/5">`;

code = code.replace(targetForm, replaceForm);

const targetFormEnd = `        )}
      </section>`;

const replaceFormEnd = `        )}
        </div>
      </section>`;

code = code.replace(targetFormEnd, replaceFormEnd);

const targetInput1 = `className="w-full bg-surface-container-lowest border border-outline/20 p-4 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-on-surface"`;
const replaceInput1 = `className="w-full bg-surface-container-lowest border border-outline/20 p-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface shadow-sm"`;

code = code.replace(targetInput1, replaceInput1);

const targetInput2 = `className="w-full bg-surface-container-lowest border border-outline/20 p-4 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-on-surface resize-none"`;
const replaceInput2 = `className="w-full bg-surface-container-lowest border border-outline/20 p-4 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface resize-none shadow-sm"`;

code = code.replace(targetInput2, replaceInput2);

const targetButton = `className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-primary"`;
const replaceButton = `className="px-8 py-3.5 bg-on-surface text-surface rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-offset-2 focus:ring-primary"`;

code = code.replace(targetButton, replaceButton);


fs.writeFileSync('src/pages/Guestbook.tsx', code);
