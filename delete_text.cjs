const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target1 = `               <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500 tracking-tighter mb-6 drop-shadow-2xl">
                 태양계 너머의<br/>
                 <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">새로운 여정</span>
               </h1>`;

const target2 = `               <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 1.5, delay: 1.5 }}
                 className="text-base sm:text-lg text-on-surface-variant font-medium tracking-wide max-w-xl mx-auto leading-relaxed"
               >
                 아득한 우주 공간에 떠오른 찬란한 행성들.<br className="hidden sm:block"/>
                 우리의 상상력이 닿는 그곳까지, 고요하고 신비로운 탐험을 시작하세요.
               </motion.p>`;

code = code.replace(target1, ``);
code = code.replace(target2, ``);

fs.writeFileSync('src/pages/Home.tsx', code);
console.log("Done");
