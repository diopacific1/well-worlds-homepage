const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  /text-white mb-6 transition-all duration-700 drop-shadow-\[0_0_30px_rgba\(255,255,255,0\.2\)\] opacity-100/g,
  'text-slate-900 mb-6 transition-all duration-700 opacity-100'
);

fs.writeFileSync('src/pages/Home.tsx', content);
