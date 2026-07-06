const fs = require('fs');

let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if (!code.includes('import BackToTop')) {
  code = code.replace(
    'import ErrorBoundary from "./ErrorBoundary";',
    'import ErrorBoundary from "./ErrorBoundary";\nimport BackToTop from "./BackToTop";'
  );
  
  // Right before footer
  code = code.replace(
    '      <footer className="w-full border-t border-outline/20 bg-surface mt-12 py-10">',
    '      <BackToTop />\n\n      <footer className="w-full border-t border-outline/20 bg-surface mt-12 py-10">'
  );
  
  fs.writeFileSync('src/components/Layout.tsx', code);
}
