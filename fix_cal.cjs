const fs = require('fs');
let content = fs.readFileSync('src/components/PlantCalendar.tsx', 'utf8');
content = content.replace(/<button onClick=\{prevMonth\} className="p-2 hover:bg-surface-dim rounded-full transition-colors">/g, '<button aria-label="이전 달" onClick={prevMonth} className="p-2 hover:bg-surface-dim rounded-full transition-colors">');
content = content.replace(/<button onClick=\{nextMonth\} className="p-2 hover:bg-surface-dim rounded-full transition-colors">/g, '<button aria-label="다음 달" onClick={nextMonth} className="p-2 hover:bg-surface-dim rounded-full transition-colors">');
fs.writeFileSync('src/components/PlantCalendar.tsx', content);
