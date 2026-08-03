const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

const target = `<button id="to-replace"
                  onClick={() => setShow3D(true)}
                  className={\`group relative flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold text-cyan-50 bg-black/40 rounded-full hover:bg-black/60 transition-all duration-700 delay-200 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-xl border border-cyan-500/30 overflow-hidden \${show3D ? "opacity-0 select-none pointer-events-none" : "opacity-100 pointer-events-auto"}\`}
               >
                 {/* Internal Glow Effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                 
                 <Orbit className="w-5 h-5 text-cyan-400 group-hover:animate-spin-slow" />
                 <span className="tracking-widest">우주 탐험하기</span>
                 <ArrowRight className="w-4 h-4 text-cyan-400/70 group-hover:translate-x-1 group-hover:text-cyan-400 transition-all" />
               </button>`;

const replacement = `<motion.div
                 className={\`relative group \${show3D ? "opacity-0 select-none pointer-events-none" : "opacity-100 pointer-events-auto"}\`}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
               >
                 {/* Glowing Aura behind button */}
                 <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-cyan-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-700 opacity-70 group-hover:opacity-100 animate-glow-pulse" />
                 
                 <button
                    onClick={() => setShow3D(true)}
                    className="relative flex items-center justify-center gap-3 px-10 py-4 text-sm font-bold text-cyan-50 bg-[#0A0A0F]/80 rounded-full transition-all duration-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl border border-white/10 overflow-hidden hover:border-cyan-500/50"
                 >
                   {/* Cosmic Dust Particles inside button */}
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-full">
                     {[...Array(5)].map((_, i) => (
                       <div 
                         key={i}
                         className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-float-particle"
                         style={{
                           left: \`\${Math.random() * 100}%\`,
                           top: \`\${Math.random() * 100}%\`,
                           animationDelay: \`\${Math.random() * 2}s\`,
                           animationDuration: \`\${2 + Math.random() * 2}s\`
                         }}
                       />
                     ))}
                   </div>

                   {/* Shimmer sweep effect */}
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                   
                   <Orbit className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-1000 ease-in-out" />
                   <span className="tracking-[0.2em] uppercase text-xs md:text-sm">우주 탐험하기</span>
                   <ArrowRight className="w-4 h-4 text-cyan-400/70 group-hover:translate-x-1.5 group-hover:text-cyan-300 transition-all duration-300" />
                 </button>
               </motion.div>`;

// using regex to ignore exact whitespace
const targetRegex = /<button id="to-replace"[\s\S]*?<\/button>/;
content = content.replace(targetRegex, replacement);
fs.writeFileSync('src/pages/Home.tsx', content);
