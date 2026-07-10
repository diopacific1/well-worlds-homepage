const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target1 = `        {/* Dynamic, responsive elegant Call To Actions with advanced interactive elements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4.5 sm:gap-6 pt-10 md:pt-12 w-full sm:w-auto"
        >
          {/* Main Action - Digital Garden */}
          <Link 
            to="/plants" 
            className="group relative overflow-hidden w-full sm:w-60 px-10 py-4.5 bg-on-surface text-surface rounded-full font-bold text-lg transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {/* Shimmer backdrop flash */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/12 to-white/0 -translate-x-[150%] group-hover:animate-[shimmer_1.8s_infinite]" />
            <span className="relative z-10 flex items-center gap-2">
              정원 가꾸기 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </Link>
          
          {/* Secondary Action - Private Journal (Transparent Glass Effect) */}
          <Link 
            to="/stories" 
            className="group relative w-full sm:w-60 px-10 py-4.5 bg-surface/30 hover:bg-surface/60 backdrop-blur-xl text-on-surface border border-outline/30 hover:border-primary/45 rounded-full font-bold text-lg transition-all duration-500 flex items-center justify-center shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)]"
          >
            <span className="relative z-10 flex items-center gap-2 transition-colors group-hover:text-primary">
              기록 펼치기
            </span>
          </Link>
        </motion.div>`;

const target2 = `      {/* Highly immersive, elegant scroll indicator with water ripple animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-on-surface-variant/50 hover:text-primary flex flex-col items-center gap-2.5 transition-colors cursor-pointer group"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
      >
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity font-mono">
          DIVING DEEPER
        </span>
        <div className="w-6 h-10 border-2 border-on-surface-variant/30 group-hover:border-primary/50 rounded-full flex justify-center p-1.5 transition-colors">
          <motion.div 
            animate={{ 
              y: [0, 14, 0],
              opacity: [0.6, 1, 0.4]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1.5 h-1.5 bg-on-surface-variant/60 group-hover:bg-primary rounded-full" 
          />
        </div>
      </motion.div>`;

code = code.replace(target1, '');
code = code.replace(target2, '');

fs.writeFileSync('src/pages/Home.tsx', code);
console.log("Done");
