const fs = require('fs');

function replaceColors(file) {
  let content = fs.readFileSync(file, 'utf8');

  // #5D7964 -> sage
  // #2D4739 -> forest
  content = content.replace(/bg-\[\#5D7964\]/g, 'bg-sage');
  content = content.replace(/border-\[\#5D7964\]/g, 'border-sage');
  content = content.replace(/text-\[\#5D7964\]/g, 'text-sage');
  content = content.replace(/shadow-\[\#5D7964\]/g, 'shadow-sage');
  content = content.replace(/text-\[\#2D4739\]/g, 'text-forest');
  content = content.replace(/bg-\[\#2D4739\]/g, 'bg-forest');

  fs.writeFileSync(file, content);
}

replaceColors('src/pages/PlantJournal.tsx');
