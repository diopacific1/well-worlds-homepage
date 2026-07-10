const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target2 = `              {/* Orbit 1: Inner Emerald Planet */}
              <div className="absolute inset-[30%] rounded-full border border-primary/25 shadow-[0_0_15px_rgba(var(--color-primary),0.2)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(75deg) rotateY(10deg)" }}>
                <motion.div 
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateZ: [0, 360] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-7 sm:h-7 pointer-events-auto group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [360, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 via-primary to-emerald-800 shadow-[0_0_20px_rgba(var(--color-primary),0.8)] border border-white/40" 
                      style={{ transform: "rotateY(-10deg) rotateX(-75deg)" }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_60%)] rounded-full mix-blend-overlay" />
                      
                      {/* Tooltip */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-2.5 bg-surface/85 backdrop-blur-xl border border-outline/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-primary mb-1 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Verdant Prime</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed">A gas dwarf entirely composed of dense botanical matter, retaining the universe's oldest seeds.</p>
                      </div>
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
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 pointer-events-auto group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [-360, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300 via-secondary to-purple-900 shadow-[0_0_30px_rgba(var(--color-secondary),0.6)] border border-white/30 flex items-center justify-center" 
                      style={{ transform: "rotateY(20deg) rotateX(-65deg)", transformStyle: "preserve-3d" }}
                    >
                      {/* Planetary Ring */}
                      <div className="absolute w-[180%] h-[180%] border-4 border-secondary/40 rounded-full shadow-[0_0_15px_rgba(var(--color-secondary),0.5)] pointer-events-none" style={{ transform: "rotateX(75deg) rotateY(15deg)" }} />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_60%)] rounded-full mix-blend-overlay" />
                      
                      {/* Tooltip */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 px-4 py-2.5 bg-surface/85 backdrop-blur-xl border border-outline/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-secondary mb-1 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> Aethelgard</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed">Known for its majestic crystallised rings formed from shattered moons across eons.</p>
                      </div>
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
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-auto group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [360, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-200 via-sky-500 to-blue-800 shadow-[0_0_20px_rgba(56,189,248,0.7)] border border-white/50" 
                      style={{ transform: "rotateY(-25deg) rotateX(-70deg)" }}
                    >
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_60%)] rounded-full mix-blend-overlay" />
                       
                       {/* Tooltip */}
                       <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-2.5 bg-surface/85 backdrop-blur-xl border border-outline/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-sky-400 mb-1 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" /> Glacies VI</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed">An ice giant hurtling through space at record speeds, harboring deep subglacial oceans.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>`;

const replace2 = `              {/* Orbit 1: Inner Emerald Planet (Earth) */}
              <div className="absolute inset-[30%] rounded-full border border-primary/25 shadow-[0_0_15px_rgba(var(--color-primary),0.2)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(75deg) rotateY(10deg)" }}>
                <motion.div 
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateZ: [0, 360] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-7 sm:h-7 pointer-events-auto group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [360, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 via-primary to-emerald-800 shadow-[0_0_20px_rgba(var(--color-primary),0.8)] border border-white/40" 
                      style={{ transform: "rotateY(-10deg) rotateX(-75deg)" }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_60%)] rounded-full mix-blend-overlay" />
                      
                      {/* Tooltip */}
                      <div className="absolute top-[120%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-2xl border border-outline/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-primary mb-1.5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> 지구 (Earth)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">태양계에서 유일하게 액체 상태의 물과 생명체가 존재하는 것으로 알려진 아름다운 푸른 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 2: Middle Purple Planet with Saturn-like Ring (Saturn) */}
              <div className="absolute inset-[12%] rounded-full border border-secondary/20 shadow-[0_0_20px_rgba(var(--color-secondary),0.1)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(65deg) rotateY(-20deg)" }}>
                <motion.div 
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateZ: [0, -360] }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 pointer-events-auto group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [-360, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300 via-secondary to-purple-900 shadow-[0_0_30px_rgba(var(--color-secondary),0.6)] border border-white/30 flex items-center justify-center" 
                      style={{ transform: "rotateY(20deg) rotateX(-65deg)", transformStyle: "preserve-3d" }}
                    >
                      {/* Planetary Ring */}
                      <div className="absolute w-[180%] h-[180%] border-4 border-secondary/40 rounded-full shadow-[0_0_15px_rgba(var(--color-secondary),0.5)] pointer-events-none" style={{ transform: "rotateX(75deg) rotateY(15deg)" }} />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_60%)] rounded-full mix-blend-overlay" />
                      
                      {/* Tooltip */}
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-2xl border border-outline/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-secondary mb-1.5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> 토성 (Saturn)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">물보다 밀도가 낮아 거대한 수조에 넣으면 물에 뜰 수 있는 유일한 행성이며, 웅장한 얼음 고리를 가졌습니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 3: Outer Fast Blue Planet (Neptune) */}
              <div className="absolute inset-[-5%] rounded-full border border-sky-400/15 border-dashed" style={{ transformStyle: "preserve-3d", transform: "rotateX(70deg) rotateY(25deg)" }}>
                <motion.div 
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateZ: [0, 360] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-auto group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateZ: [360, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-200 via-sky-500 to-blue-800 shadow-[0_0_20px_rgba(56,189,248,0.7)] border border-white/50" 
                      style={{ transform: "rotateY(-25deg) rotateX(-70deg)" }}
                    >
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_60%)] rounded-full mix-blend-overlay" />
                       
                       {/* Tooltip */}
                       <div className="absolute top-[120%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-2xl border border-outline/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-sky-400 mb-1.5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" /> 해왕성 (Neptune)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">태양계에서 가장 강한 바람이 부는 곳으로, 시속 2,100km에 달하는 초음속 폭풍이 몰아칩니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>`;

if(code.includes(target2)) {
    code = code.replace(target2, replace2);
} else {
    console.log("Could not find target block");
}

fs.writeFileSync('src/pages/Home.tsx', code);
