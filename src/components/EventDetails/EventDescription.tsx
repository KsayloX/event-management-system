import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../../types/event';
import { Badge } from '../ui/Badge';

interface EventDescriptionProps {
  event: Event;
}

export function EventDescription({ event }: EventDescriptionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {event.categories.map((category) => (
          <Badge key={category}>{category}</Badge>
        ))}
      </div>

      <div className="prose prose-blue">
        <ReactMarkdown>{event.description}</ReactMarkdown>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{format(event.date, 'PPP')}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{format(event.date, 'p')}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{event.attendees.length} attendees</span>
        </div>
      </div>
    </div>
  );
}