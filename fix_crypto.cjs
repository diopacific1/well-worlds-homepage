const fs = require('fs');
let content = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

const start = content.indexOf('const MOCK_COINS: Record');
if (start !== -1) {
  let braceCount = 0;
  let end = -1;
  let i = start + 20; 
  while (i < content.length) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (braceCount === 0 && content[i] === ';') {
      end = i + 1;
      break;
    }
    i++;
  }
  if (end !== -1) {
    content = content.slice(0, start) + content.slice(end);
  }
}
fs.writeFileSync('src/pages/CryptoDashboard.tsx', content);

