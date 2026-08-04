const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  /className="relative pt-\[40px\] md:pt-\[80px\] pb-32 flex flex-col items-center justify-start text-center min-h-\[80vh\] pointer-events-none w-full overflow-hidden"/g,
  'className="relative pt-4 md:pt-8 pb-32 flex flex-col items-center justify-start text-center min-h-[80vh] pointer-events-none w-full overflow-hidden"'
);

fs.writeFileSync('src/pages/Home.tsx', content);
