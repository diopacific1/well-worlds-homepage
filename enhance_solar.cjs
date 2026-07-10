const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target2 = `            {/* Complex 3D Orbital Rings */}
            <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              {/* Ring 1 - Outer thin dashed */}
              <motion.div
                className="absolute inset-0 border border-dashed border-primary/30 rounded-full"
                style={{ rotateX: 75, rotateY: 10, transformStyle: "preserve-3d" }}
                animate={{ rotateZ: [0, 360], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Ring 2 - Inner glowing thick */}
              <motion.div
                className="absolute inset-8 sm:inset-12 border-t-2 border-b border-primary/50 rounded-full shadow-[0_0_30px_rgba(var(--color-primary),0.5)]"
                style={{ rotateX: 60, rotateY: -20, transformStyle: "preserve-3d" }}
                animate={{ rotateZ: [360, 0], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              {/* Ring 3 - Intersecting vertical-ish */}
              <motion.div
                className="absolute inset-6 sm:inset-10 border-l border-r-2 border-secondary/40 rounded-full"
                style={{ rotateX: 45, rotateY: 60, transformStyle: "preserve-3d" }}
                animate={{ rotateZ: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Ring 4 - Abstract glow track */}
              <motion.div
                className="absolute inset-2 sm:inset-4 rounded-full"
                style={{ 
                  rotateX: 80, 
                  rotateY: -10, 
                  background: "conic-gradient(from 0deg, transparent 0%, rgba(var(--color-primary), 0.1) 40%, rgba(var(--color-secondary), 0.4) 50%, transparent 60%)",
                  transformStyle: "preserve-3d"
                }}
                animate={{ rotateZ: [0, -360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
            </div>`;

const replace2 = `            {/* 3D Solar System Planetary Orbits */}
            <div className="absolute inset-[-10%] sm:inset-[-20%] pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
              
              {/* Orbit 1: Inner Emerald Planet */}
              <div className="absolute inset-[30%] rounded-full border border-primary/25 shadow-[0_0_15px_rgba(var(--color-primary),0.2)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(75deg) rotateY(10deg)" }}>
                <motion.div 
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateZ: [0, 360] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-7 sm:h-7"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [360, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 via-primary to-emerald-800 shadow-[0_0_20px_rgba(var(--color-primary),0.8)] border border-white/40" 
                      style={{ transform: "rotateY(-10deg) rotateX(-75deg)" }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_60%)] rounded-full mix-blend-overlay" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 2: Middle Purple Planet with Saturn-like Ring */}
              <div className="absolute inset-[12%] rounded-full border border-secondary/20 shadow-[0_0_20px_rgba(var(--color-secondary),0.1)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(65deg) rotateY(-20deg)" }}>
                <motion.div 
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateZ: [0, -360] }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [-360, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300 via-secondary to-purple-900 shadow-[0_0_30px_rgba(var(--color-secondary),0.6)] border border-white/30 flex items-center justify-center" 
                      style={{ transform: "rotateY(20deg) rotateX(-65deg)", transformStyle: "preserve-3d" }}
                    >
                      {/* Planetary Ring */}
                      <div className="absolute w-[180%] h-[180%] border-4 border-secondary/40 rounded-full shadow-[0_0_15px_rgba(var(--color-secondary),0.5)]" style={{ transform: "rotateX(75deg) rotateY(15deg)" }} />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_60%)] rounded-full mix-blend-overlay" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 3: Outer Fast Blue Planet */}
              <div className="absolute inset-[-5%] rounded-full border border-sky-400/15 border-dashed" style={{ transformStyle: "preserve-3d", transform: "rotateX(70deg) rotateY(25deg)" }}>
                <motion.div 
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateZ: [0, 360] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [360, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-200 via-sky-500 to-blue-800 shadow-[0_0_20px_rgba(56,189,248,0.7)] border border-white/50" 
                      style={{ transform: "rotateY(-25deg) rotateX(-70deg)" }}
                    >
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_60%)] rounded-full mix-blend-overlay" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Ambient Glowing Dust Tracks */}
              <motion.div 
                animate={{ rotateZ: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[30%] rounded-full border border-primary/20 blur-[3px]" style={{ transform: "rotateX(75deg) rotateY(10deg)" }} 
              />
              <motion.div 
                animate={{ rotateZ: [0, -360] }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[12%] rounded-full border border-secondary/15 blur-[4px]" style={{ transform: "rotateX(65deg) rotateY(-20deg)" }} 
              />
            </div>`;

if(code.includes(target2)) {
    code = code.replace(target2, replace2);
} else {
    console.log("Could not find target block");
}

fs.writeFileSync('src/pages/Home.tsx', code);
