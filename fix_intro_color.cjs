const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const replacement1 = `bg-gradient-to-b from-white via-white/90 to-white/20`;
const new1 = `bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500`;

const replacement2 = `text-white border border-white/20`;
const new2 = `text-slate-900 border border-slate-900/20`;

const replacement3 = `bg-white/10 hover:bg-white/20`;
const new3 = `bg-slate-900/5 hover:bg-slate-900/10`;

const replacement4 = `hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]`;
const new4 = `hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]`;

const replacement5 = `text-amber-200 uppercase`;
const new5 = `text-amber-600 uppercase`;

const replacement6 = `bg-white/5 border border-white/10`;
const new6 = `bg-slate-900/5 border border-slate-900/10`;

const replacement7 = `bg-gradient-to-r from-amber-200 via-orange-400 to-rose-500`;
const new7 = `bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600`;

const replacement8 = `text-on-surface-variant/70 font-medium tracking-wide max-w-xl mx-auto leading-relaxed`;
const new8 = `text-on-surface-variant font-medium tracking-wide max-w-xl mx-auto leading-relaxed`;

code = code.replace(replacement1, new1);
code = code.replace(replacement2, new2);
code = code.replace(replacement3, new3);
code = code.replace(replacement4, new4);
code = code.replace(replacement5, new5);
code = code.replace(replacement6, new6);
code = code.replace(replacement7, new7);
code = code.replace(replacement8, new8);

fs.writeFileSync('src/pages/Home.tsx', code);
console.log("Done");
