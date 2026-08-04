const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace "break-words break-keep" with just "break-words" or "break-keep word-break-keep"
content = content.replace(/break-words break-keep/g, 'break-words whitespace-pre-wrap');

fs.writeFileSync('src/pages/Home.tsx', content);
