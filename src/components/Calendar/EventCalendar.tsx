import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { useEventStore } from '../../store/eventStore';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import 'react-calendar/dist/Calendar.css';

export function EventCalendar() {
  const { events } = useEventStore();
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const getEventsForDate = (date: Date) => {
    return events.filter(
      event => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const tileContent = ({ date }: { date: Date }) => {
    const eventsOnDay = getEventsForDate(date);
    if (eventsOnDay.length === 0) return null;

    return (
      <div className="absolute bottom-0 right-0 left-0 flex justify-center">
        <Badge 
          variant={eventsOnDay.length > 1 ? 'warning' : 'primary'} 
          className="text-xs px-1.5"
        >
          {eventsOnDay.length}
        </Badge>
      </div>
    );
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const eventsOnDay = getEventsForDate(date);
    return clsx(
      'relative hover:bg-blue-50 transition-colors',
      eventsOnDay.length > 0 && 'font-semibold',
      format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && 'text-blue-600'
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <style>{`
        .react-calendar {
          border: none;
          width: 100%;
          background: white;
          font-family: inherit;
        }
        .react-calendar__tile {
          height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding-top: 8px;
          position: relative;
        }
        .react-calendar__month-view__days__day--weekend {
          color: #f43f5e;
        }
        .react-calendar__tile--active {
          background: #3b82f6 !important;
          color: white;
        }
        .react-calendar__tile--now {
          background: #eff6ff;
        }
        .react-calendar__navigation button {
          font-size: 1.2em;
          padding: 8px;
        }
        .react-calendar__navigation button:hover {
          background: #eff6ff;
        }
      `}</style>

      <div className="relative">
        <Calendar
          tileContent={tileContent}
          tileClassName={tileClassName}
          onMouseOver={({ target, date }) => {
            if (target instanceof HTMLElement && date) {
              setHoveredDate(date);
            }
          }}
          onMouseOut={() => setHoveredDate(null)}
        />
        
        {hoveredDate && (
          <Tooltip 
            events={getEventsForDate(hoveredDate)}
            date={hoveredDate}
            onClose={() => setHoveredDate(null)}
          />
        )}
      </div>
    </div>
  );
}