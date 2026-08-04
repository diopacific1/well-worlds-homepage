const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  '<h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">\n                  크립토시장\n                </h2>',
  '<h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">\n                  머니월드 <span className="text-lg opacity-70">| 가상자산</span>\n                </h2>'
);

content = content.replace(
  '<h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3 tracking-tight group-hover:text-emerald-500 transition-colors duration-300">\n                  주식시장\n                </h2>',
  '<h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3 tracking-tight group-hover:text-emerald-500 transition-colors duration-300">\n                  머니월드 <span className="text-lg opacity-70">| 글로벌 주식</span>\n                </h2>'
);

fs.writeFileSync('src/pages/Home.tsx', content);
