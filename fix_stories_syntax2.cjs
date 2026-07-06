const fs = require('fs');
let code = fs.readFileSync('src/pages/Stories.tsx', 'utf8');

// Remove custom toast implementation
code = code.replace(
  /const toast\.error = \(message: string\) => \{[\s\S]*?\}, 3000\);\n\s*\};\n/,
  ''
);

// Remove `toasts` state
code = code.replace(
  /const \[toasts, setToasts\] = useState<\{ id: number; message: string \}\[\]>\(\[\]\);\n/,
  ''
);

// Remove the inline UI for toasts
code = code.replace(
  /\{\/\* Toast Notifications \*\/\}\n\s*<div className="fixed bottom-4 left-1\/2 -translate-x-1\/2 z-50 flex flex-col gap-2 pointer-events-none">[\s\S]*?<\/div>\n/,
  ''
);

fs.writeFileSync('src/pages/Stories.tsx', code);
