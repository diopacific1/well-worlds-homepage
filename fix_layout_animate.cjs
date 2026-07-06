const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if (!code.includes('<AnimatePresence mode="wait">')) {
  // Let's replace the Outlet section
  code = code.replace(
    '<ErrorBoundary>\n          <Outlet />\n        </ErrorBoundary>',
    '<ErrorBoundary>\n          <AnimatePresence mode="wait">\n            <div key={location.pathname}>\n              <Outlet />\n            </div>\n          </AnimatePresence>\n        </ErrorBoundary>'
  );
  fs.writeFileSync('src/components/Layout.tsx', code);
}
