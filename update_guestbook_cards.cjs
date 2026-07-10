const fs = require('fs');
let code = fs.readFileSync('src/pages/Guestbook.tsx', 'utf8');

const targetCard = `                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-primary">{entry.nickname}</span>
                  <div className="flex items-center gap-3">`;

const replaceCard = `                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-serif text-primary font-bold text-lg border border-primary/10">
                      {entry.nickname.charAt(0)}
                    </div>
                    <span className="font-bold text-on-surface text-lg">{entry.nickname}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">`;

code = code.replace(targetCard, replaceCard);

const targetHeader = `      <header className="flex flex-col gap-3 text-center items-center pt-8">
        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-on-surface">탐험가의 흔적</h1>
        <p className="text-on-surface-variant font-medium text-sm md:text-base max-w-lg">`;

const replaceHeader = `      <header className="flex flex-col gap-4 text-center items-center pt-10 pb-4">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-2">Guestbook</div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-on-surface">방명록</h1>
        <p className="text-on-surface-variant font-medium text-sm md:text-base max-w-lg mt-2 leading-relaxed">`;

code = code.replace(targetHeader, replaceHeader);

fs.writeFileSync('src/pages/Guestbook.tsx', code);
