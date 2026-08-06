const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

if (!content.includes('focus-visible')) {
  content += `\n/* A11Y: Global Focus Ring for Keyboard Navigation */\na:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {\n  @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background rounded-sm;\n}\n`;
  fs.writeFileSync('src/index.css', content);
}
