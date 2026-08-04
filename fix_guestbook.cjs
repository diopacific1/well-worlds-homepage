const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace any remaining `break-keep`
content = content.replace(/break-keep/g, 'break-words whitespace-pre-wrap');

fs.writeFileSync('src/pages/Home.tsx', content);
