const fs = require('fs');

let journalCode = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');
journalCode = journalCode.replace(
  /setEntries\(postsData\);/g,
  'setEntries(postsData as unknown as PlantJournalEntry[]);'
);
fs.writeFileSync('src/pages/PlantJournal.tsx', journalCode);

