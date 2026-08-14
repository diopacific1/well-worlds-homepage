import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Droplets, Leaf, Scissors, Sprout } from 'lucide-react';
import { PlantJournalEntry } from '../pages/PlantJournal';

interface PlantCalendarProps {
  entries: PlantJournalEntry[];
}

const ACTIVITY_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  observation: { color: 'bg-sage', icon: Sprout },
  watering: { color: 'bg-blue-400', icon: Droplets },
  fertilizing: { color: 'bg-amber-400', icon: Leaf },
  repotting: { color: 'bg-purple-400', icon: Scissors },
};

export const PlantCalendar: React.FC<PlantCalendarProps> = ({ entries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = useMemo(() => {
    const d = [];
    let day = startDate;
    while (day <= endDate) {
      d.push(day);
      day = addDays(day, 1);
    }
    return d;
  }, [startDate, endDate]);

  const getEntriesForDay = (date: Date) => {
    return entries.filter(entry => {
      try {
        const entryDate = parseISO(entry.date);
        return isSameDay(entryDate, date);
      } catch (e) {
        return false;
      }
    });
  };

  const getActivitiesForDay = (date: Date) => {
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
  };

  return (
    <div className="bg-surface rounded-3xl border border-outline/10 shadow-sm overflow-hidden flex flex-col p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-on-surface tracking-tight">식물 관리 달력</h2>
        <div className="flex items-center gap-4">
          <button aria-label="이전 달" onClick={prevMonth} className="p-2 hover:bg-surface-dim rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
          </button>
          <span className="font-mono font-bold text-lg">{format(currentDate, 'yyyy. MM')}</span>
          <button aria-label="다음 달" onClick={nextMonth} className="p-2 hover:bg-surface-dim rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="text-sm font-bold text-on-surface-variant/60 py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 lg:gap-2">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const activities = getActivitiesForDay(day);
          
          return (
            <div 
              key={i} 
              className={`
                min-h-[60px] lg:min-h-[80px] p-1.5 lg:p-2 rounded-xl flex flex-col justify-start items-center border transition-all
                ${isCurrentMonth ? 'bg-surface border-outline/10' : 'bg-surface-dim/30 border-transparent text-on-surface-variant/30'}
                ${isToday ? 'border-sage/50 bg-sage/5 shadow-sm' : ''}
              `}
            >
              <span className={`text-xs lg:text-sm font-mono font-semibold mb-1 ${isToday ? 'text-sage' : ''}`}>
                {format(day, 'd')}
              </span>
              
              <div className="flex flex-wrap justify-center gap-1 mt-auto pb-1">
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
                      className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full ${config.color} shadow-sm cursor-help`}
                      title={`${activityLabels[activity] || activity}: ${titleText}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-outline/10">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
          <div className="w-3 h-3 rounded-full bg-sage shadow-sm"></div>
          관찰
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
          <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm"></div>
          물주기
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
          <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></div>
          영양제
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
          <div className="w-3 h-3 rounded-full bg-purple-400 shadow-sm"></div>
          분갈이/관리
        </div>
      </div>
    </div>
  );
};
