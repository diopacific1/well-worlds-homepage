const fs = require('fs');
let code = fs.readFileSync('src/pages/Stories.tsx', 'utf8');

// The `PostItem` arguments
code = code.replace(
  /toast\.error,\n\s*isAdmin,/g,
  'isAdmin,'
);
code = code.replace(
  /toast\.error: \(msg: string\) => void;\n\s*isAdmin: boolean;/g,
  'isAdmin: boolean;'
);
code = code.replace(
  /toast\.error=\{toast\.error\}/g,
  ''
);

// Any remaining `toast.error(...)` inside PostItem will work because we can import `toast` globally.
// Let's check `showToast` usages that might have been replaced.

// wait, did I replace `showToast` with `toast.error` everywhere?
// In Stories.tsx: `const [showToast, setShowToast] = useState(...)` ? Or was it just a function?
fs.writeFileSync('src/pages/Stories.tsx', code);
