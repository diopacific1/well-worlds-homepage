const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const startMarker = `          <div className="flex flex-col items-center gap-6 relative z-20 mt-[-40px]">`;
const endMarker = `          </div>\n        </div>`;

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find boundaries");
  process.exit(1);
}

const replacement = `          <div className="flex flex-col items-center gap-8 relative z-20 mt-8">

            {/* Typography */}
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className="text-center"
            >
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                 className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
               >
                 <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-2" />
                 <span className="text-xs font-semibold tracking-widest text-amber-200 uppercase">Cosmic Explorer</span>
               </motion.div>
               
               <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/20 tracking-tighter mb-6 drop-shadow-2xl">
                 태양계 너머의<br/>
                 <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-rose-500 bg-clip-text text-transparent">새로운 여정</span>
               </h1>
               
               <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 1.5, delay: 1.5 }}
                 className="text-base sm:text-lg text-on-surface-variant/70 font-medium tracking-wide max-w-xl mx-auto leading-relaxed"
               >
                 아득한 우주 공간에 떠오른 찬란한 행성들.<br className="hidden sm:block"/>
                 우리의 상상력이 닿는 그곳까지, 고요하고 신비로운 탐험을 시작하세요.
               </motion.p>
               
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 2, ease: "easeOut" }}
                 className="mt-10"
               >
                 <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 backdrop-blur-md">
                   탐험 시작하기
                 </button>
               </motion.div>
            </motion.div>
          </div>
        </div>`;

const newCode = code.slice(0, startIndex) + replacement + code.slice(endIndex);
fs.writeFileSync('src/pages/Home.tsx', newCode);
console.log("Done");
