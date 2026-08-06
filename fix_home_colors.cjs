const fs = require('fs');

function addTheme(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('--color-sky-dust')) {
    content = content.replace(
      '--color-tooltip-bg: #151b2e;',
      '--color-tooltip-bg: #151b2e;\n  --color-sky-dust: #7D91B4;'
    );
    fs.writeFileSync(file, content);
  }
}
addTheme('src/index.css');

function replaceHome(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\[\#5D7964\]/g, 'sage');
  content = content.replace(/rgba\(93,121,100,/g, 'rgba(var(--color-sage-rgb),');
  
  content = content.replace(/\[\#7D91B4\]/g, 'sky-dust');
  content = content.replace(/rgba\(125,145,180,/g, 'rgba(var(--color-sky-dust-rgb),');
  fs.writeFileSync(file, content);
}
replaceHome('src/pages/Home.tsx');
