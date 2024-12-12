import { openDB } from 'idb';
import { generateId } from '../utils/helpers';
import { Event, Category, Reminder, Comment, CategoryType } from '../types/event';

const DB_NAME = 'event-manager';
const DB_VERSION = 4;

const DEFAULT_CATEGORIES: CategoryType[] = [
  'training',
  'conference',
  'social',
  'webinar',
  'workshop',
  'meetup'
];

const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      if (oldVersion < 1) {
        const eventStore = db.createObjectStore('events', { keyPath: 'id' });
        eventStore.createIndex('date', 'date');
        
        const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
        
        const attendeeStore = db.createObjectStore('attendees', { keyPath: 'id' });
        attendeeStore.createIndex('eventId', 'eventId');
      }
      
      if (oldVersion < 2) {
        const reminderStore = db.createObjectStore('reminders', { keyPath: 'id' });
        reminderStore.createIndex('eventId', 'eventId');
      }

      if (oldVersion < 3) {
        const commentStore = db.createObjectStore('comments', { keyPath: 'id' });
        commentStore.createIndex('eventId', 'eventId');
        commentStore.createIndex('created', 'created');
      }
    },
  });

  // Seed categories if empty
  const categoriesCount = await db.count('categories');
  if (categoriesCount === 0) {
    const categories: Category[] = DEFAULT_CATEGORIES.map(name => ({
      id: generateId(),
      name
    }));

    const tx = db.transaction('categories', 'readwrite');
    await Promise.all(categories.map(category => tx.store.add(category)));
    await tx.done;
  }

  return db;
};

let dbPromise = initDB();

export const getEvents = async (): Promise<Event[]> => {
  const db = await dbPromise;
  const events = await db.getAll('events');
  const attendees = await db.getAll('attendees');
  const comments = await db.getAll('comments');

  return events.map(event => ({
    ...event,
    date: new Date(event.date),
    attendees: attendees.filter(a => a.eventId === event.id),
    comments: comments
      .filter(c => c.eventId === event.id)
      .map(c => ({ ...c, created: new Date(c.created) }))
      .sort((a, b) => b.created.getTime() - a.created.getTime()),
  }));
};

export const addEvent = async (event: Omit<Event, 'id' | 'attendees' | 'comments'>): Promise<Event> => {
  const db = await dbPromise;
  const id = generateId();
  const newEvent = {
    id,
    ...event,
    date: event.date.toISOString(),
  };

  await db.add('events', newEvent);

  return {
    ...newEvent,
    date: event.date,
    attendees: [],
    comments: [],
  };
};

export const deleteEvent = async (id: string): Promise<void> => {
  const db = await dbPromise;
  const tx = db.transaction(['events', 'attendees', 'reminders', 'comments'], 'readwrite');

  await tx.objectStore('events').delete(id);

  // Delete associated records
  const stores = ['attendees', 'reminders', 'comments'];
  await Promise.all(stores.map(async (storeName) => {
    const store = tx.objectStore(storeName);
    const index = store.index('eventId');
    const keys = await index.getAllKeys(id);
    await Promise.all(keys.map(key => store.delete(key)));
  }));

  await tx.done;
};

export const getCategories = async (): Promise<Category[]> => {
  const db = await dbPromise;
  return db.getAll('categories');
};

export const addReminder = async (reminder: Omit<Reminder, 'id'>): Promise<Reminder> => {
  const db = await dbPromise;
  const id = generateId();
  const newReminder = { 
    id, 
    ...reminder,
    created: new Date().toISOString()
  };
  
  await db.add('reminders', newReminder);
  return {
    ...newReminder,
    created: new Date(newReminder.created)
  };
};

export const getReminders = async (): Promise<Reminder[]> => {
  const db = await dbPromise;
  const reminders = await db.getAll('reminders');
  return reminders.map(reminder => ({
    ...reminder,
    created: new Date(reminder.created)
  }));
};

export const deleteReminder = async (id: string): Promise<void> => {
  const db = await dbPromise;
  await db.delete('reminders', id);
};

export const addComment = async (comment: Omit<Comment, 'id' | 'created'>): Promise<Comment> => {
  const db = await dbPromise;
  const id = generateId();
  const newComment = {
    id,
    ...comment,
    created: new Date().toISOString(),
  };

  await db.add('comments', newComment);
  return {
    ...newComment,
    created: new Date(newComment.created),
  };
};