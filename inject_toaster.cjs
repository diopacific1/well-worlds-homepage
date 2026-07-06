const fs = require('fs');

let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if (!code.includes('import { Toaster }')) {
  code = code.replace(
    'import BackToTop from "./BackToTop";',
    'import BackToTop from "./BackToTop";\nimport { Toaster } from "./Toast";'
  );
  
  // Under <div className="flex flex-col min-h-screen relative overflow-hidden font-sans bg-background text-on-surface">
  code = code.replace(
    '<div className="flex flex-col min-h-screen relative overflow-hidden font-sans bg-background text-on-surface">',
    '<div className="flex flex-col min-h-screen relative overflow-hidden font-sans bg-background text-on-surface">\n      <Toaster />'
  );
  
  fs.writeFileSync('src/components/Layout.tsx', code);
}
