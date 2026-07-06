const fs = require('fs');

const pages = [
  'src/pages/Home.tsx',
  'src/pages/CryptoDashboard.tsx',
  'src/pages/PlantJournal.tsx',
  'src/pages/Stories.tsx',
  'src/pages/Guestbook.tsx'
];

pages.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes('import AnimatedPage')) {
    code = code.replace(
      'import {',
      'import AnimatedPage from "../components/AnimatedPage";\nimport {'
    );
  }

  // Find export default function XYZ() { ... return ( ... )
  // The challenge is finding the return statement of the MAIN component, not a sub component.
  // We can just rely on the fact that `export default function` usually has a `return (` after some hooks.
  // Instead of complex regex, let's just do a string replacement on the main component name.
  // For example, in Home.tsx:
  // export default function Home() {
  // ...
  // return (
  //   <div
  
  // Actually, wait! An easier way is to just wrap the routes inside App.tsx or Layout.tsx!
  // If we wrap the `<Outlet />` inside `AnimatedPage` in `Layout.tsx`, we don't need to wrap every individual page!
});

