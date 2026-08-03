const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /<h1 className=\{\`text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 transition-all duration-700 drop-shadow-\[0_0_30px_rgba\(255,255,255,0\.2\)\] opacity-100 pointer-events-auto\`\}>\s*우물 그리고 세계들\s*<\/h1>/;

const replacement = `<h1 className={\`text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 transition-all duration-700 [text-shadow:_0_4px_24px_rgba(0,0,0,0.8)] opacity-100 pointer-events-auto\`}>
                 우물 그리고 세계들
               </h1>`;

// Also let's wrap the motion.div contents in a subtle glass card so the whole typography section is more legible
const typographyRegex = /<motion\.div \s*initial=\{\{ opacity: 0, y: 30 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}\s*transition=\{\{ duration: 1\.2, delay: 0\.5, ease: \[0\.16, 1, 0\.3, 1\] \}\}\s*className="text-center pointer-events-none"\s*>\s*<h1 className=\{\`text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 transition-all duration-700 drop-shadow-\[0_0_30px_rgba\(255,255,255,0\.2\)\] opacity-100 pointer-events-auto\`\}>\s*우물 그리고 세계들\s*<\/h1>\s*<\/motion\.div>/;

const typographyReplacement = `<motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className="text-center pointer-events-none"
            >
               <div className="inline-block bg-black/20 backdrop-blur-md px-10 py-8 rounded-[2.5rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-auto">
                 <h1 className={\`text-5xl md:text-7xl font-extrabold tracking-tighter text-white transition-all duration-700 [text-shadow:_0_4px_24px_rgba(0,0,0,0.8)]\`}>
                   우물 그리고 세계들
                 </h1>
               </div>
            </motion.div>`;

content = content.replace(typographyRegex, typographyReplacement);

fs.writeFileSync('src/pages/Home.tsx', content);
