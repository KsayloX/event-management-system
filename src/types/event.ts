export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  categories: CategoryType[];
  attendees: Attendee[];
  comments: Comment[];
}

export interface Attendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
}

export type CategoryType = 'training' | 'conference' | 'social' | 'webinar' | 'workshop' | 'meetup';

export interface Category {
  id: string;
  name: CategoryType;
}

export interface Reminder {
  id: string;
  eventId: string;
  minutesBefore: number;
  created: Date;
}

export interface Comment {
  id: string;
  eventId: string;
  author: string;
  content: string;
  created: Date;
}