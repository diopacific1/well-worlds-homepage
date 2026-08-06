const fs = require('fs');
let content = fs.readFileSync('src/pages/Guestbook.tsx', 'utf8');
content = content.replace('orderBy("createdAt", "desc"),\n      limit(100)', 'limit(100)');
fs.writeFileSync('src/pages/Guestbook.tsx', content);
