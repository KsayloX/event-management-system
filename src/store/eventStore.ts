import { create } from 'zustand';
import { Event, Category, Reminder, Comment } from '../types/event';
import * as db from '../db';
import { sendEventNotification } from '../services/notificationService';

interface EventStore {
  events: Event[];
  categories: Category[];
  reminders: Reminder[];
  addEvent: (event: Omit<Event, 'id' | 'attendees' | 'comments'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  loadEvents: () => Promise<void>;
  loadCategories: () => Promise<void>;
  addReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>;
  loadReminders: () => Promise<void>;
  checkReminders: () => Promise<void>;
  addComment: (comment: Omit<Comment, 'id' | 'created'>) => Promise<void>;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  categories: [],
  reminders: [],
  
  addEvent: async (eventData) => {
    try {
      const event = await db.addEvent(eventData);
      set((state) => ({
        events: [event, ...state.events],
      }));
      await sendEventNotification('eventCreated', event);
    } catch (error) {
      console.error('Failed to add event:', error);
      throw error;
    }
  },

  deleteEvent: async (id) => {
    try {
      await db.deleteEvent(id);
      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        reminders: state.reminders.filter((reminder) => reminder.eventId !== id),
      }));
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  },

  loadEvents: async () => {
    try {
      const events = await db.getEvents();
      set({ events });
    } catch (error) {
      console.error('Failed to load events:', error);
      throw error;
    }
  },

  loadCategories: async () => {
    try {
      const categories = await db.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to load categories:', error);
      throw error;
    }
  },

  addReminder: async (reminderData) => {
    try {
      const reminder = await db.addReminder(reminderData);
      set((state) => ({
        reminders: [...state.reminders, reminder],
      }));
    } catch (error) {
      console.error('Failed to add reminder:', error);
      throw error;
    }
  },

  loadReminders: async () => {
    try {
      const reminders = await db.getReminders();
      set({ reminders });
    } catch (error) {
      console.error('Failed to load reminders:', error);
      throw error;
    }
  },

  checkReminders: async () => {
    try {
      const { reminders, events } = get();
      const now = new Date();

      for (const reminder of reminders) {
        const event = events.find(e => e.id === reminder.eventId);
        if (!event) continue;

        const timeUntilEvent = event.date.getTime() - now.getTime();
        if (timeUntilEvent > 0 && timeUntilEvent <= reminder.minutesBefore * 60 * 1000) {
          await sendEventNotification('eventReminder', event);
          await db.deleteReminder(reminder.id);
          set((state) => ({
            reminders: state.reminders.filter(r => r.id !== reminder.id),
          }));
        }
      }
    } catch (error) {
      console.error('Failed to check reminders:', error);
      throw error;
    }
  },

  addComment: async (commentData) => {
    try {
      const comment = await db.addComment(commentData);
      const event = get().events.find(e => e.id === commentData.eventId);
      
      if (event) {
        set((state) => ({
          events: state.events.map(e =>
            e.id === commentData.eventId
              ? { ...e, comments: [comment, ...e.comments] }
              : e
          ),
        }));

        await sendEventNotification('newComment', {
          ...event,
          comments: [comment, ...event.comments],
        });
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  },
}));