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
            className="relative w-[225px] h-[225px] sm:w-[340px] sm:h-[340px] md:w-[450px] md:h-[450px] lg:w-[600px] lg:h-[600px] mx-auto flex items-center justify-center perspective-[1200px]"
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
              className="absolute inset-0 bg-primary/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none"
            />

            {/* 3D Solar System Planetary Orbits */}
            <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
              
              {/* Orbit 1: 수성 (Mercury) */}
              <div className="absolute inset-[38%] rounded-full border border-white/10" style={{ transformStyle: "preserve-3d", transform: "rotateX(75deg) rotateY(5deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-[0_0_10px_rgba(156,163,175,0.5)] border border-white/30" style={{ transform: "rotateY(-5deg) rotateX(-75deg)" }}>
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-gray-300 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" /> 수성 (Mercury)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">태양에 가장 가까운 작고 뜨거운 암석 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 2: 금성 (Venus) */}
              <div className="absolute inset-[28%] rounded-full border border-white/10" style={{ transformStyle: "preserve-3d", transform: "rotateX(72deg) rotateY(-5deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200 to-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] border border-white/30" style={{ transform: "rotateY(5deg) rotateX(-72deg)" }}>
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-orange-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> 금성 (Venus)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">두꺼운 온실가스로 덮여 태양계에서 가장 뜨거운 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 3: 지구 (Earth) */}
              <div className="absolute inset-[17%] rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(75deg) rotateY(10deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22c55e] via-[#3b82f6] to-[#1d4ed8] shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-white/50" style={{ transform: "rotateY(-10deg) rotateX(-75deg)" }}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_60%)] rounded-full mix-blend-overlay" />
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-blue-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> 지구 (Earth)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">액체 상태의 물과 생명체가 존재하는 유일한 푸른 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 4: 화성 (Mars) */}
              <div className="absolute inset-[8%] rounded-full border border-red-500/15" style={{ transformStyle: "preserve-3d", transform: "rotateX(70deg) rotateY(-10deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-white/30" style={{ transform: "rotateY(10deg) rotateX(-70deg)" }}>
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> 화성 (Mars)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">산화철로 인해 붉게 보이는 과거 물이 흘렀던 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 5: 목성 (Jupiter) */}
              <div className="absolute inset-[-6%] rounded-full border border-orange-400/20" style={{ transformStyle: "preserve-3d", transform: "rotateX(74deg) rotateY(15deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200 via-amber-600 to-amber-900 shadow-[0_0_25px_rgba(217,119,6,0.5)] border border-white/30 overflow-hidden" style={{ transform: "rotateY(-15deg) rotateX(-74deg)" }}>
                      {/* Jupiter Stripes */}
                      <div className="absolute top-[20%] left-0 w-full h-[15%] bg-amber-800/40 rounded-[50%]" />
                      <div className="absolute top-[50%] left-0 w-full h-[25%] bg-orange-900/30 rounded-[50%]" />
                      <div className="absolute top-[60%] left-[60%] w-[25%] h-[20%] bg-red-700/60 rounded-full blur-[2px]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.7),_transparent_60%)] rounded-full mix-blend-overlay" />
                      
                      <div className="absolute top-[120%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-amber-500 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> 목성 (Jupiter)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">태양계에서 가장 거대한 가스 행성으로 웅장한 대적점이 있습니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 6: 토성 (Saturn) */}
              <div className="absolute inset-[-20%] rounded-full border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(68deg) rotateY(-20deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 65, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 65, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fcd34d] via-[#d97706] to-[#78350f] shadow-[0_0_30px_rgba(217,119,6,0.6)] border border-white/40 flex items-center justify-center" style={{ transform: "rotateY(20deg) rotateX(-68deg)", transformStyle: "preserve-3d" }}>
                      {/* Planetary Ring */}
                      <div className="absolute w-[220%] h-[220%] border-[4px] md:border-[6px] border-[#fde68a]/60 rounded-full shadow-[0_0_15px_rgba(253,230,138,0.5)] pointer-events-none" style={{ transform: "rotateX(75deg) rotateY(15deg)" }} />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_60%)] rounded-full mix-blend-overlay" />
                      
                      <div className="absolute top-[140%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-yellow-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" /> 토성 (Saturn)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">아름다운 얼음 고리를 가진 물에 뜰 정도로 가벼운 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 7: 천왕성 (Uranus) */}
              <div className="absolute inset-[-32%] rounded-full border border-cyan-400/15" style={{ transformStyle: "preserve-3d", transform: "rotateX(73deg) rotateY(8deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-white/40 flex items-center justify-center" style={{ transform: "rotateY(-8deg) rotateX(-73deg)", transformStyle: "preserve-3d" }}>
                      <div className="absolute w-[150%] h-[150%] border-[1px] md:border-[2px] border-cyan-200/40 rounded-full pointer-events-none" style={{ transform: "rotateY(80deg) rotateX(20deg)" }} />
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-cyan-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> 천왕성 (Uranus)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">자전축이 극단적으로 기울어져 누워서 자전하는 얼음 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 8: 해왕성 (Neptune) */}
              <div className="absolute inset-[-42%] rounded-full border border-blue-600/20 border-dashed" style={{ transformStyle: "preserve-3d", transform: "rotateX(71deg) rotateY(25deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-7 sm:h-7 md:w-9 md:h-9 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-300 via-blue-600 to-indigo-900 shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-white/50" style={{ transform: "rotateY(-25deg) rotateX(-71deg)" }}>
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_60%)] rounded-full mix-blend-overlay" />
                       <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-blue-500 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> 해왕성 (Neptune)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">태양계 가장 바깥쪽의 강력한 폭풍이 부는 거대한 푸른 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

            </div>

            {/* Inner Particle Cloud */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={\`particle-\${i}\`}
                  className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white/70 rounded-full blur-[1px] shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                  style={{ top: "50%", left: "50%" }}
                  animate={{
                    x: [Math.cos(i) * 120, Math.sin(i) * 280, Math.cos(i) * 120],
                    y: [Math.sin(i) * 120, Math.cos(i) * 280, Math.sin(i) * 120],
                    scale: [0.3, 1.5, 0.3],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{
                    duration: 5 + (i % 5),
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* The Core Orb (Sun) */}
            <motion.div 
              animate={{ 
                scale: [0.95, 1.02, 0.95],
                boxShadow: [
                  "0 0 60px rgba(251, 146, 60, 0.5), inset 0 0 30px rgba(253, 224, 71, 0.5)",
                  "0 0 120px rgba(250, 204, 21, 0.7), inset 0 0 60px rgba(255, 255, 255, 0.7)",
                  "0 0 60px rgba(251, 146, 60, 0.5), inset 0 0 30px rgba(253, 224, 71, 0.5)"
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 rounded-full border border-yellow-200/50 flex items-center justify-center overflow-hidden shadow-2xl pointer-events-auto cursor-pointer group"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
            >
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                transition={{ 
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  scale: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(253,224,71,0.6),rgba(239,68,68,0.5),transparent)] blur-lg mix-blend-screen pointer-events-none" 
              />
              <motion.div 
                animate={{ rotate: -360, scale: [1, 1.1, 1] }} 
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 9, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_90deg,transparent,rgba(251,146,60,0.8),transparent)] blur-md mix-blend-screen pointer-events-none" 
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_70%)] mix-blend-overlay rounded-full pointer-events-none" />
              <div className="absolute top-2 left-4 w-8 h-4 md:w-10 md:h-5 bg-white/60 rounded-full blur-[3px] rotate-[-45deg] pointer-events-none" />
              
              <div className="absolute top-[110%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50 pointer-events-none">
                 <p className="text-sm font-bold text-yellow-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.8)]" /> 태양 (The Sun)</p>
                 <p className="text-xs text-on-surface-variant leading-relaxed break-keep">지구 생명체의 근원이 되는 막대한 에너지를 뿜어내는 G형 주계열성입니다.</p>
              </div>
            </motion.div>
          </motion.div>`;

const newCode = code.slice(0, startIndex) + replacement + code.slice(endIndex);
fs.writeFileSync('src/pages/Home.tsx', newCode);
console.log("Done");
