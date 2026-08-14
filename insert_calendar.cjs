const fs = require('fs');

let content = fs.readFileSync('src/pages/PlantJournal.tsx', 'utf8');

// Add import
const importStatement = "import { PlantCalendar } from '../components/PlantCalendar';\n";
content = content.replace('import Markdown from "react-markdown";', 'import Markdown from "react-markdown";\n' + importStatement);

// Insert Calendar
const feedAreaMarker = '{/* Feed Area */}\n      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-12 mt-8 relative">';
const calendarInsertion = `
      {/* Calendar Area */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 mb-12">
        <PlantCalendar entries={entries} />
      </div>

`;
content = content.replace(feedAreaMarker, calendarInsertion + feedAreaMarker);

fs.writeFileSync('src/pages/PlantJournal.tsx', content);
