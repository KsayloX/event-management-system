import { useEffect } from 'react';
import { useEventStore } from '../store/eventStore';
import { sendEventNotification } from '../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useLanguageStore } from '../store/languageStore';

export const useReminders = () => {
  const { events, reminders, checkReminders, deleteReminder } = useEventStore();
  const { language } = useLanguageStore();

  useEffect(() => {
    const checkAndNotify = async () => {
      const now = new Date();
      const locale = language === 'ru' ? ru : undefined;

      for (const reminder of reminders) {
        const event = events.find(e => e.id === reminder.eventId);
        if (!event) continue;

        const timeUntilEvent = event.date.getTime() - now.getTime();
        
        // Check if event is about to start (within 5 minutes)
        if (timeUntilEvent > 0 && timeUntilEvent <= 5 * 60 * 1000) {
          await sendEventNotification('eventStarting', event);
          await deleteReminder(reminder.id);
          continue;
        }

        // Check for regular reminder
        if (timeUntilEvent > 0 && timeUntilEvent <= reminder.minutesBefore * 60 * 1000) {
          const timeUntil = formatDistanceToNow(event.date, { locale });
          await sendEventNotification('eventReminder', event, timeUntil);
          await deleteReminder(reminder.id);
        }
      }
    };

    const interval = setInterval(checkAndNotify, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events, reminders, deleteReminder, language]);

  return { checkReminders };
};