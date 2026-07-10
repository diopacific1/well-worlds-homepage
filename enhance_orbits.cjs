const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target1 = `            {/* Elegant Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface/50 border border-outline/20 text-on-surface-variant text-xs sm:text-sm font-medium backdrop-blur-md shadow-lg group cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-mono tracking-widest uppercase font-semibold text-[10px] sm:text-xs opacity-90 group-hover:text-primary transition-colors">
                Crypto · Plants · Archive
              </span>
            </motion.div>`;

code = code.replace(target1, ``);

const target2 = `            {/* Complex 3D Orbital Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={\`orbit-\${i}\`}
                className="absolute inset-4 sm:inset-8 border-t border-b border-primary/40 rounded-full"
                style={{
                  rotateX: 65 + i * 15,
                  rotateY: i * 30,
                }}
                animate={{
                  rotateZ: [0, 360],
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  rotateZ: { duration: 15 + i * 5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            ))}

            {/* Inner Particle Cloud */}`;

const replace2 = `            {/* Complex 3D Orbital Rings */}
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
            </div>

            {/* Inner Particle Cloud */}`;

code = code.replace(target2, replace2);

const target3 = `            {/* The Core Orb */}
            <motion.div 
              animate={{ 
                scale: [0.95, 1.05, 0.95],
                boxShadow: [
                  "0 0 40px rgba(var(--color-primary), 0.4), inset 0 0 20px rgba(255,255,255,0.2)",
                  "0 0 80px rgba(var(--color-primary), 0.8), inset 0 0 40px rgba(255,255,255,0.4)",
                  "0 0 40px rgba(var(--color-primary), 0.4), inset 0 0 20px rgba(255,255,255,0.2)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-on-surface via-on-surface-variant to-background rounded-full backdrop-blur-2xl border border-white/20 flex items-center justify-center overflow-hidden"
            >
              {/* Inner Core Glow */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.3),transparent)]" 
              />
              <div className="absolute inset-1 bg-surface rounded-full shadow-inner" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(255,255,255,0.4),_transparent_70%)]" />
            </motion.div>`;

const replace3 = `            {/* The Core Orb (Enhanced) */}
            <motion.div 
              animate={{ 
                scale: [0.95, 1.05, 0.95],
                boxShadow: [
                  "0 0 50px rgba(var(--color-primary), 0.6), inset 0 0 30px rgba(255,255,255,0.4)",
                  "0 0 100px rgba(var(--color-secondary), 0.8), inset 0 0 50px rgba(255,255,255,0.6)",
                  "0 0 50px rgba(var(--color-primary), 0.6), inset 0 0 30px rgba(255,255,255,0.4)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/10 via-surface to-secondary/20 rounded-full backdrop-blur-3xl border border-white/30 flex items-center justify-center overflow-hidden shadow-2xl"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
            >
              {/* Dynamic Inner Swirl */}
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(var(--color-primary),0.4),rgba(var(--color-secondary),0.4),transparent)] blur-md" 
              />
              {/* Inner Sphere Volume */}
              <div className="absolute inset-2 bg-gradient-to-br from-surface to-background/50 rounded-full shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)]" />
              {/* Sharp Light Reflection */}
              <div className="absolute top-2 left-3 w-8 h-4 bg-white/40 rounded-full blur-[2px] rotate-[-45deg]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.6),_transparent_60%)] mix-blend-overlay" />
            </motion.div>`;

code = code.replace(target3, replace3);

fs.writeFileSync('src/pages/Home.tsx', code);
