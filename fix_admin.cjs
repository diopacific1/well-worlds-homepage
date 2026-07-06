const fs = require('fs');

let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /useState<\{id: string, author\?: string, content\?: string, createdAt\?: any\}\[\]>\(\[\]\);/g,
  'useState<{id: string, nickname?: string, message?: string, createdAt?: any}[]>([]);'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
