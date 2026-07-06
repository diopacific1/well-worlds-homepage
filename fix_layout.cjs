const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if (!code.includes('import ErrorBoundary')) {
  code = code.replace(
    "import { Helmet } from 'react-helmet-async';",
    "import { Helmet } from 'react-helmet-async';\nimport ErrorBoundary from './ErrorBoundary';"
  );
}

if (!code.includes('<ErrorBoundary>')) {
  code = code.replace(
    '<Outlet />',
    '<ErrorBoundary>\n          <Outlet />\n        </ErrorBoundary>'
  );
}

fs.writeFileSync('src/components/Layout.tsx', code);
