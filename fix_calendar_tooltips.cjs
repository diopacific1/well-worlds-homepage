const fs = require('fs');
let content = fs.readFileSync('src/components/PlantCalendar.tsx', 'utf8');

content = content.replace(
  `  const getActivitiesForDay = (date: Date) => {
    const dayEntries = getEntriesForDay(date);
    const activities = new Set<string>();
    dayEntries.forEach(entry => {
      if (entry.activity) activities.add(entry.activity);
    });
    return Array.from(activities);
  };`,
  `  const getActivitiesForDay = (date: Date) => {
    const dayEntries = getEntriesForDay(date);
    const activityMap = new Map<string, string[]>();
    dayEntries.forEach(entry => {
      if (entry.activity) {
        if (!activityMap.has(entry.activity)) {
          activityMap.set(entry.activity, []);
        }
        activityMap.get(entry.activity)!.push(entry.title || entry.type || "식물");
      }
    });
    return Array.from(activityMap.entries()).map(([activity, titles]) => ({
      activity,
      titles
    }));
  };`
);

content = content.replace(
  `          const activities = getActivitiesForDay(day);
          
          return (
            <div `,
  `          const activities = getActivitiesForDay(day);
          
          return (
            <div `
);

content = content.replace(
  `              <div className="flex flex-wrap justify-center gap-1 mt-auto pb-1">
                {activities.map(activity => {
                  const config = ACTIVITY_CONFIG[activity];
                  if (!config) return null;
                  return (
                    <div 
                      key={activity}
                      className={\`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full \${config.color} shadow-sm\`}
                      title={activity}
                    />
                  );
                })}
              </div>`,
  `              <div className="flex flex-wrap justify-center gap-1 mt-auto pb-1">
                {activities.map(({ activity, titles }) => {
                  const config = ACTIVITY_CONFIG[activity];
                  if (!config) return null;
                  const titleText = titles.join(', ');
                  const activityLabels: Record<string, string> = {
                    observation: '관찰',
                    watering: '물주기',
                    fertilizing: '영양제',
                    repotting: '분갈이/관리'
                  };
                  return (
                    <div 
                      key={activity}
                      className={\`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full \${config.color} shadow-sm cursor-help\`}
                      title={\`\${activityLabels[activity] || activity}: \${titleText}\`}
                    />
                  );
                })}
              </div>`
);

fs.writeFileSync('src/components/PlantCalendar.tsx', content);
