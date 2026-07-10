const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target1 = `               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                 className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-slate-900/5 border border-slate-900/10 backdrop-blur-md"
               >
                 <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-2" />
                 <span className="text-xs font-semibold tracking-widest text-amber-600 uppercase">Cosmic Explorer</span>
               </motion.div>`;

const target2 = `               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 2, ease: "easeOut" }}
                 className="mt-10"
               >
                 <button className="px-8 py-4 bg-slate-900/5 hover:bg-slate-900/10 text-slate-900 border border-slate-900/20 rounded-full font-bold tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 backdrop-blur-md">
                   탐험 시작하기
                 </button>
               </motion.div>`;

code = code.replace(target1, ``);
code = code.replace(target2, ``);

fs.writeFileSync('src/pages/Home.tsx', code);
console.log("Done");
