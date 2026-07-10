const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target = `        <div className="space-y-8 flex flex-col items-center">
          {/* Badge: Soft, glowing border, slide in vertically */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-surface-variant/40 border border-outline/15 text-on-surface-variant text-xs sm:text-sm font-medium backdrop-blur-lg shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-2 group cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="font-mono tracking-wider font-semibold opacity-90 group-hover:text-primary transition-colors">
              가상자산 · 반려식물 · 개인 아카이브
            </span>
          </motion.div>

          {/* Elegant Abstract Animation Replacing Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] mx-auto flex items-center justify-center pointer-events-none mb-6"
          >
            {/* Glowing Aura */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-primary/40 rounded-full blur-[80px] mix-blend-screen"
            />
            
            {/* Ripple Rings */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border border-on-surface-variant/20 rounded-full"
                initial={{ scale: 0.1, opacity: 0, rotateX: 65 }}
                animate={{
                  scale: [0.1, 1.6],
                  opacity: [0.8, 0],
                  rotateZ: [0, 180]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "linear",
                }}
              />
            ))}
            
            {/* Core Element */}
            <motion.div 
              animate={{ 
                y: [-8, 8, -8],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-on-surface to-on-surface-variant/80 rounded-full shadow-[0_0_60px_rgba(var(--color-primary),0.7)] backdrop-blur-xl border border-white/10 flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.6),_transparent_60%)]" />
            </motion.div>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
             className="text-center"
          >
             <h1 className="text-xl sm:text-2xl font-display font-medium text-on-surface tracking-widest uppercase opacity-90 mb-3">
               우물 속 세계
             </h1>
             <p className="text-xs sm:text-sm text-on-surface-variant/70 font-mono tracking-widest uppercase">
               A space for deep thoughts & traces
             </p>
          </motion.div>
        </div>`;

const replace = `        <div className="space-y-12 flex flex-col items-center justify-center relative">
          
          {/* Enhanced Abstract Core Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px] mx-auto flex items-center justify-center pointer-events-none perspective-[1000px]"
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
              className="absolute inset-0 bg-primary/30 rounded-full blur-[100px] mix-blend-screen"
            />
            
            {/* Complex 3D Orbital Rings */}
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

            {/* Inner Particle Cloud */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={\`particle-\${i}\`}
                className="absolute w-2 h-2 bg-secondary/80 rounded-full blur-[1px]"
                animate={{
                  x: [Math.cos(i) * 50, Math.sin(i) * 100, Math.cos(i) * 50],
                  y: [Math.sin(i) * 50, Math.cos(i) * 100, Math.sin(i) * 50],
                  scale: [0.5, 1.5, 0.5],
                  opacity: [0.2, 0.9, 0.2]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* The Core Orb */}
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
            </motion.div>
          </motion.div>
          
          <div className="flex flex-col items-center gap-6 relative z-20 mt-[-40px]">
            {/* Elegant Badge */}
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
            </motion.div>

            {/* Typography */}
            <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="text-center"
            >
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-on-surface tracking-tight mb-4 drop-shadow-sm">
                 우물 속 세계
               </h1>
               <p className="text-sm sm:text-base text-on-surface-variant/80 font-medium tracking-wide max-w-md mx-auto">
                 수면 아래 고요히 부유하는 사유의 공간.
               </p>
            </motion.div>
          </div>
        </div>`;

if(code.includes(target)) {
    code = code.replace(target, replace);
} else {
    console.log("Could not find target block");
}

fs.writeFileSync('src/pages/Home.tsx', code);
