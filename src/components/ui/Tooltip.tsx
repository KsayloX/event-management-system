import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Event } from '../../types/event';

interface TooltipProps {
  events: Event[];
  date: Date;
  onClose: () => void;
}

export function Tooltip({ events, date, onClose }: TooltipProps) {
  if (events.length === 0) return null;

  return (
    <div 
      className="absolute z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full"
      style={{
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '8px'
      }}
      onMouseLeave={onClose}
    >
      <div className="text-sm font-medium text-gray-900 mb-2">
        {format(date, 'PPPP')}
      </div>
      
      <div className="space-y-3">
        {events.map((event) => (
          <div 
            key={event.id}
            className="border-l-4 border-blue-500 pl-3 py-1"
          >
            <div className="font-medium text-gray-900">{event.title}</div>
            
            <div className="mt-1 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {format(event.date, 'p')}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {event.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}