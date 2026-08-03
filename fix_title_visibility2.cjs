const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /<motion\.div \s*initial=\{\{ opacity: 0, y: 30 \}\}[\s\S]*?<\/motion\.div>/;

const typographyReplacement = `<motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className="text-center pointer-events-none"
            >
               <div className="inline-block bg-black/30 backdrop-blur-md px-10 py-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto">
                 <h1 className={\`text-5xl md:text-7xl font-extrabold tracking-tighter text-white transition-all duration-700 [text-shadow:_0_4px_24px_rgba(0,0,0,0.9)]\`}>
                   우물 그리고 세계들
                 </h1>
               </div>
            </motion.div>`;

content = content.replace(regex, typographyReplacement);
fs.writeFileSync('src/pages/Home.tsx', content);
