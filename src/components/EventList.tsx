import React from 'react';
import { useEventStore } from '../store/eventStore';
import { EventCard } from './EventCard';
import toast from 'react-hot-toast';

export function EventList() {
  const { events, deleteEvent } = useEventStore();

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      toast.success('Event deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No events found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}