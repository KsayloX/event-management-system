import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { useEventStore } from '../store/eventStore';
import toast from 'react-hot-toast';

interface ReminderFormProps {
  eventId: string;
  onClose: () => void;
}

export function ReminderForm({ eventId, onClose }: ReminderFormProps) {
  const { addReminder } = useEventStore();
  const [minutesBefore, setMinutesBefore] = useState(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addReminder({
        eventId,
        minutesBefore,
      });
      toast.success('Reminder set successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to set reminder');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <Clock className="inline-block w-4 h-4 mr-1" />
          Remind me before (minutes)
        </label>
        <select
          value={minutesBefore}
          onChange={(e) => setMinutesBefore(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={120}>2 hours</option>
          <option value={1440}>1 day</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Set Reminder</Button>
      </div>
    </form>
  );
}