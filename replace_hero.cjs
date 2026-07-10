const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target = `          {/* Majestic Hero Title - Elegantly Staggered with Custom Glow Text Effect */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-[3.5rem] sm:text-6xl md:text-[6rem] lg:text-[7.5rem] font-display font-black tracking-tight text-on-surface leading-[1.05] break-keep"
          >
            우물 속 <span className="relative inline-block mt-2 md:mt-0 px-2">
              <span className="relative z-10 text-transparent bg-gradient-to-r from-primary via-primary/95 to-secondary bg-clip-text select-none filter drop-shadow-[0_2px_15px_rgba(var(--color-primary),0.15)]">
                세계
              </span>
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                className="absolute inset-x-0 bottom-1 md:bottom-2.5 h-3 md:h-[18px] bg-primary/15 -z-10 -rotate-1 skew-x-12 blur-[1.5px] origin-left" 
              />
            </span>
          </motion.h1>
          
          {/* Conceptual subheaders matching of professional level copywriting */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-[1.4rem] text-on-surface-variant/85 font-medium max-w-2xl mx-auto mt-6 leading-relaxed tracking-wide break-keep"
          >
            수면 아래 고요히 부유하는 사유의 공간.
          </motion.p>`;

const replace = `          {/* Elegant Abstract Animation Replacing Text */}
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
          </motion.div>`;

if(code.includes(target)) {
    code = code.replace(target, replace);
} else {
    console.log("Not found target");
}
fs.writeFileSync('src/pages/Home.tsx', code);
