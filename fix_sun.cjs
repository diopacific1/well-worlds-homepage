const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target3 = `            {/* The Core Orb (Enhanced) */}
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

const replace3 = `            {/* The Core Orb (Sun) */}
            <motion.div 
              animate={{ 
                scale: [0.95, 1.05, 0.95],
                boxShadow: [
                  "0 0 60px rgba(251, 146, 60, 0.6), inset 0 0 30px rgba(253, 224, 71, 0.5)",
                  "0 0 120px rgba(250, 204, 21, 0.8), inset 0 0 60px rgba(255, 255, 255, 0.7)",
                  "0 0 60px rgba(251, 146, 60, 0.6), inset 0 0 30px rgba(253, 224, 71, 0.5)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 rounded-full border border-yellow-200/50 flex items-center justify-center overflow-hidden shadow-2xl"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
            >
              {/* Dynamic Inner Swirl (Solar Flares) */}
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.3, 1] }} 
                transition={{ 
                  rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                  scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(253,224,71,0.6),rgba(239,68,68,0.5),transparent)] blur-lg mix-blend-screen" 
              />
              <motion.div 
                animate={{ rotate: -360, scale: [1, 1.1, 1] }} 
                transition={{ 
                  rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                  scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_90deg,transparent,rgba(251,146,60,0.8),transparent)] blur-md mix-blend-screen" 
              />
              {/* Inner Sphere Volume */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_70%)] mix-blend-overlay rounded-full" />
              {/* Sharp Light Reflection */}
              <div className="absolute top-3 left-4 w-10 h-5 bg-white/60 rounded-full blur-[3px] rotate-[-45deg]" />
            </motion.div>`;

if(code.includes(target3)) {
    code = code.replace(target3, replace3);
} else {
    console.log("Could not find target block");
}

fs.writeFileSync('src/pages/Home.tsx', code);
