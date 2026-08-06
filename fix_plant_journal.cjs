const fs = require('fs');

function optimizePlantJournal(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add limit to firestore import
  if (!content.includes('limit,')) {
    content = content.replace(
      'orderBy,\n  onSnapshot,',
      'orderBy,\n  limit,\n  onSnapshot,'
    );
  }

  // Update query
  if (!content.includes('limit(50)')) {
    content = content.replace(
      'orderBy("createdAt", "desc"),',
      'orderBy("createdAt", "desc"),\n      limit(50)'
    );
  }

  fs.writeFileSync(file, content);
}

optimizePlantJournal('src/pages/PlantJournal.tsx');
