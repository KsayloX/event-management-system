import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Trash2, Bell, MessageCircle } from 'lucide-react';
import { Event } from '../types/event';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { ReminderForm } from './ReminderForm';
import { CommentForm } from './Comments/CommentForm';
import { CommentList } from './Comments/CommentList';
import { Dialog } from '@headlessui/react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { fadeInUp, fadeInScale } from './animations/variants';

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF1A1A', '#FF4D4D', '#FF8080']
      });
    }
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        <motion.div 
          className="flex justify-between items-start"
          variants={fadeInScale}
        >
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
            <div className="mt-2 space-x-2">
              {event.categories.map((category) => (
                <Badge key={category}>{category}</Badge>
              ))}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              aria-label="Toggle comments"
              className="hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-4 h-4" />
              {event.comments.length > 0 && (
                <span className="ml-1">{event.comments.length}</span>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsReminderModalOpen(true)}
              aria-label="Set reminder"
              className="hover:scale-105 transition-transform"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant={isLiked ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleLike}
              className="transition-all duration-300 hover:scale-105"
              aria-label={isLiked ? 'Unlike event' : 'Like event'}
            >
              <motion.div
                animate={{ 
                  scale: isLiked ? [1, 1.4, 1] : 1,
                  rotate: isLiked ? [0, 15, -15, 0] : 0
                }}
                transition={{ duration: 0.4 }}
              >
                ❤️
              </motion.div>
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(event.id)}
              aria-label="Delete event"
              className="hover:scale-105 transition-transform"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <motion.p 
          className="mt-3 text-gray-600"
          variants={fadeInUp}
        >
          {event.description}
        </motion.p>

        <motion.div 
          className="mt-4 space-y-2"
          variants={fadeInScale}
        >
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {format(event.date, 'PPp')}
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          {event.attendees?.length > 0 && (
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              {event.attendees.length} {event.attendees.length === 1 ? 'attendee' : 'attendees'}
            </div>
          )}
        </motion.div>

        {isCommentsOpen && (
          <motion.div 
            className="mt-6 border-t pt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Comments</h4>
            <CommentList comments={event.comments} />
            <div className="mt-4">
              <CommentForm eventId={event.id} />
            </div>
          </motion.div>
        )}
      </div>

      <Dialog
        open={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Set Reminder for {event.title}
            </Dialog.Title>
            
            <ReminderForm
              eventId={event.id}
              onClose={() => setIsReminderModalOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
}