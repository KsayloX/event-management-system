import { sendTelegramNotification } from './telegramService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Event } from '../types/event';
import { useLanguageStore } from '../store/languageStore';

const formatEventMessage = (event: Event, language: 'en' | 'ru') => {
  const locale = language === 'ru' ? ru : undefined;
  
  return `${language === 'ru' ? '🎉 Создано новое событие!' : '🎉 New Event Created!'}\n
${event.title}
📅 ${format(event.date, 'PPpp', { locale })}
📍 ${event.location}
👤 ${language === 'ru' ? 'Организатор' : 'Organized by'}: ${event.organizer}
${event.description ? `\n📝 ${language === 'ru' ? 'Описание' : 'Description'}:\n${event.description}` : ''}
${event.categories.length ? `\n🏷 ${language === 'ru' ? 'Категории' : 'Categories'}: ${event.categories.join(', ')}` : ''}`;
};

const formatReminderMessage = (event: Event, timeUntil: string, language: 'en' | 'ru') => {
  const locale = language === 'ru' ? ru : undefined;
  
  return `${language === 'ru' ? '⏰ Напоминание о событии!' : '⏰ Event Reminder!'}\n
${event.title} ${language === 'ru' ? 'начнется через' : 'starts in'} ${timeUntil}\n
📅 ${format(event.date, 'PPpp', { locale })}
📍 ${event.location}
👤 ${language === 'ru' ? 'Организатор' : 'Organized by'}: ${event.organizer}\n
${language === 'ru' ? 'Не забудьте прийти! 🌟' : "Don't forget to attend! 🌟"}`;
};

const formatCommentMessage = (event: Event, language: 'en' | 'ru') => {
  const locale = language === 'ru' ? ru : undefined;
  const latestComment = event.comments[0];
  
  return `${language === 'ru' ? '💬 Новый комментарий к событию' : '💬 New Comment on Event'}: ${event.title}\n
${language === 'ru' ? 'От' : 'From'}: ${latestComment.author}
${latestComment.content}\n
📅 ${language === 'ru' ? 'Дата события' : 'Event Date'}: ${format(event.date, 'PPpp', { locale })}`;
};

export const sendEventNotification = async (
  type: 'eventCreated' | 'eventReminder' | 'newComment',
  event: Event,
  timeUntil?: string
) => {
  const language = useLanguageStore.getState().language;
  let message: string;

  switch (type) {
    case 'eventCreated':
      message = formatEventMessage(event, language);
      break;
    case 'eventReminder':
      message = formatReminderMessage(event, timeUntil || '', language);
      break;
    case 'newComment':
      message = formatCommentMessage(event, language);
      break;
  }

  return sendTelegramNotification(message);
};