const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const startMarker = `          {/* Enhanced Abstract Core Animation */}`;
const endMarker = `            </motion.div>\n          </motion.div>`;

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find boundaries");
  process.exit(1);
}

const replacement = `          {/* Enhanced Abstract Core Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] mx-auto flex items-center justify-center perspective-[1200px]"
          >
            {/* Deep Intense Aura */}
            <motion.div
              animate={{
                scale: [0.8, 1.4, 0.8],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-primary/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
            />

            {/* 3D Solar System Planetary Orbits */}
            <div className="absolute inset-[-15%] sm:inset-[-25%] pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
              
              {/* Orbit 1: Inner Emerald Planet (Earth) */}
              <div className="absolute inset-[30%] rounded-full border border-primary/25 shadow-[0_0_20px_rgba(var(--color-primary),0.2)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(75deg) rotateY(10deg)" }}>
                <motion.div 
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateZ: [0, 360] }}
                  transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 pointer-events-auto group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [360, 0] }}
                    transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22c55e] via-[#3b82f6] to-[#1d4ed8] shadow-[0_0_30px_rgba(59,130,246,0.8)] border border-white/50" 
                      style={{ transform: "rotateY(-10deg) rotateX(-75deg)" }}
                    >
                      {/* Cloud Layer */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.95),_transparent_60%)] rounded-full mix-blend-overlay" />
                      
                      {/* Tooltip */}
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-5 py-4 bg-surface/90 backdrop-blur-2xl border border-outline/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[280px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] scale-95 group-hover:scale-100 z-50">
                         <p className="text-base font-bold text-blue-400 mb-2 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" /> 지구 (Earth)</p>
                         <p className="text-sm text-on-surface-variant leading-relaxed break-keep">태양계에서 유일하게 액체 상태의 물과 생명체가 존재하는 것으로 알려진 아름다운 푸른 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 2: Middle Purple Planet with Saturn-like Ring (Saturn) */}
              <div className="absolute inset-[10%] rounded-full border border-secondary/25 shadow-[0_0_25px_rgba(var(--color-secondary),0.15)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(65deg) rotateY(-20deg)" }}>
                <motion.div 
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateZ: [0, -360] }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20 pointer-events-auto group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [-360, 0] }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fcd34d] via-[#d97706] to-[#78350f] shadow-[0_0_40px_rgba(217,119,6,0.6)] border border-white/40 flex items-center justify-center" 
                      style={{ transform: "rotateY(20deg) rotateX(-65deg)", transformStyle: "preserve-3d" }}
                    >
                      {/* Planetary Ring */}
                      <div className="absolute w-[200%] h-[200%] border-[6px] md:border-[8px] border-[#fde68a]/50 rounded-full shadow-[0_0_20px_rgba(253,230,138,0.5)] pointer-events-none" style={{ transform: "rotateX(75deg) rotateY(15deg)" }} />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.85),_transparent_60%)] rounded-full mix-blend-overlay" />
                      
                      {/* Tooltip */}
                      <div className="absolute top-[140%] left-1/2 -translate-x-1/2 px-5 py-4 bg-surface/90 backdrop-blur-2xl border border-outline/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[280px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] scale-95 group-hover:scale-100 z-50">
                         <p className="text-base font-bold text-amber-400 mb-2 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]" /> 토성 (Saturn)</p>
                         <p className="text-sm text-on-surface-variant leading-relaxed break-keep">물보다 밀도가 낮아 거대한 수조에 넣으면 물에 뜰 수 있는 유일한 행성이며, 웅장한 얼음 고리를 가졌습니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 3: Outer Fast Blue Planet (Neptune) */}
              <div className="absolute inset-[-12%] rounded-full border border-sky-400/20 border-dashed shadow-[0_0_30px_rgba(56,189,248,0.1)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(70deg) rotateY(25deg)" }}>
                <motion.div 
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateZ: [0, 360] }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-8 sm:h-8 md:w-12 md:h-12 pointer-events-auto group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [360, 0] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7dd3fc] via-[#0284c7] to-[#1e3a8a] shadow-[0_0_25px_rgba(2,132,199,0.7)] border border-white/50" 
                      style={{ transform: "rotateY(-25deg) rotateX(-70deg)" }}
                    >
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.95),_transparent_60%)] rounded-full mix-blend-overlay" />
                       
                       {/* Tooltip */}
                       <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-5 py-4 bg-surface/90 backdrop-blur-2xl border border-outline/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[280px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] scale-95 group-hover:scale-100 z-50">
                         <p className="text-base font-bold text-sky-400 mb-2 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.8)]" /> 해왕성 (Neptune)</p>
                         <p className="text-sm text-on-surface-variant leading-relaxed break-keep">태양계에서 가장 강한 바람이 부는 곳으로, 시속 2,100km에 달하는 초음속 폭풍이 몰아칩니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Ambient Glowing Dust Tracks */}
              <motion.div 
                animate={{ rotateZ: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[30%] rounded-full border-[2px] border-primary/20 blur-[4px]" style={{ transform: "rotateX(75deg) rotateY(10deg)" }} 
              />
              <motion.div 
                animate={{ rotateZ: [0, -360] }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[10%] rounded-full border-[2px] border-secondary/15 blur-[5px]" style={{ transform: "rotateX(65deg) rotateY(-20deg)" }} 
              />
            </div>

            {/* Inner Particle Cloud */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={\`particle-\${i}\`}
                  className="absolute w-2 h-2 md:w-3 md:h-3 bg-white/80 rounded-full blur-[1px] shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  style={{ top: "50%", left: "50%" }}
                  animate={{
                    x: [Math.cos(i) * 100, Math.sin(i) * 250, Math.cos(i) * 100],
                    y: [Math.sin(i) * 100, Math.cos(i) * 250, Math.sin(i) * 100],
                    scale: [0.5, 2, 0.5],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* The Core Orb (Sun) */}
            <motion.div 
              animate={{ 
                scale: [0.95, 1.05, 0.95],
                boxShadow: [
                  "0 0 80px rgba(251, 146, 60, 0.6), inset 0 0 40px rgba(253, 224, 71, 0.6)",
                  "0 0 160px rgba(250, 204, 21, 0.9), inset 0 0 80px rgba(255, 255, 255, 0.8)",
                  "0 0 80px rgba(251, 146, 60, 0.6), inset 0 0 40px rgba(253, 224, 71, 0.6)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 w-24 h-24 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 rounded-full border border-yellow-200/50 flex items-center justify-center overflow-hidden shadow-2xl pointer-events-auto cursor-pointer group"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
            >
              {/* Dynamic Inner Swirl (Solar Flares) */}
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.3, 1] }} 
                transition={{ 
                  rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                  scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(253,224,71,0.7),rgba(239,68,68,0.6),transparent)] blur-xl mix-blend-screen pointer-events-none" 
              />
              <motion.div 
                animate={{ rotate: -360, scale: [1, 1.1, 1] }} 
                transition={{ 
                  rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                  scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_90deg,transparent,rgba(251,146,60,0.9),transparent)] blur-lg mix-blend-screen pointer-events-none" 
              />
              {/* Inner Sphere Volume */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_70%)] mix-blend-overlay rounded-full pointer-events-none" />
              {/* Sharp Light Reflection */}
              <div className="absolute top-4 left-6 w-12 h-6 md:w-16 md:h-8 bg-white/70 rounded-full blur-[4px] rotate-[-45deg] pointer-events-none" />
              
              {/* Tooltip for Sun */}
              <div className="absolute top-[110%] left-1/2 -translate-x-1/2 px-5 py-4 bg-surface/90 backdrop-blur-2xl border border-outline/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 w-max max-w-[280px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] scale-95 group-hover:scale-100 z-50">
                 <p className="text-base font-bold text-yellow-400 mb-2 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.8)]" /> 태양 (The Sun)</p>
                 <p className="text-sm text-on-surface-variant leading-relaxed break-keep">태양계 중심에 있는 G형 주계열성으로, 지구 생명체의 근원이 되는 막대한 에너지를 뿜어냅니다.</p>
              </div>
            </motion.div>
          </motion.div>`;

const newCode = code.slice(0, startIndex) + replacement + code.slice(endIndex);
fs.writeFileSync('src/pages/Home.tsx', newCode);
console.log("Done");
