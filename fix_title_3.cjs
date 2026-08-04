const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /<motion\.div \s*initial=\{\{ opacity: 0, y: 30 \}\}[\s\S]*?<\/motion\.div>/;
const typographyReplacement = `<motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className="text-center pointer-events-none"
            >
               <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white transition-all duration-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] [text-shadow:0_4px_12px_rgba(0,0,0,1)] pointer-events-auto">
                 우물 그리고 세계들
               </h1>
            </motion.div>`;

content = content.replace(regex, typographyReplacement);
fs.writeFileSync('src/pages/Home.tsx', content);
