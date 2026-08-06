const fs = require('fs');

let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if (!content.includes('import { Toaster }')) {
  content = content.replace(
    'import { Outlet, Link, useLocation } from "react-router-dom";',
    'import { Outlet, Link, useLocation } from "react-router-dom";\nimport { Toaster } from "./Toast";'
  );
}

if (!content.includes('<Toaster />')) {
  content = content.replace(
    '<div className="min-h-screen bg-surface-container flex flex-col font-sans antialiased text-on-surface">',
    '<div className="min-h-screen bg-surface-container flex flex-col font-sans antialiased text-on-surface">\n      <Toaster />'
  );
}

fs.writeFileSync('src/components/Layout.tsx', content);

