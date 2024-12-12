import React, { useState } from 'react';
import { Calendar, MapPin, User } from 'lucide-react';
import { Button } from './ui/Button';
import { useEventStore } from '../store/eventStore';
import { useLanguageStore } from '../store/languageStore';
import { CategoryType } from '../types/event';
import toast from 'react-hot-toast';

export function EventForm() {
  const { addEvent, categories } = useEventStore();
  const { t } = useLanguageStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    organizer: '',
    categories: [] as CategoryType[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEvent({
        ...formData,
        date: new Date(formData.date),
      });
      toast.success(t('form.success'));
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        organizer: '',
        categories: [],
      });
    } catch (error) {
      toast.error(t('form.error'));
    }
  };

  const handleCategoryChange = (category: CategoryType) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          {t('form.title')}
        </label>
        <input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder={t('form.titlePlaceholder')}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          {t('form.description')}
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder={t('form.descriptionPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            {t('form.date')}
          </label>
          <input
            id="date"
            type="datetime-local"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            <MapPin className="inline-block w-4 h-4 mr-1" />
            {t('form.location')}
          </label>
          <input
            id="location"
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={t('form.locationPlaceholder')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
          <User className="inline-block w-4 h-4 mr-1" />
          {t('form.organizer')}
        </label>
        <input
          id="organizer"
          type="text"
          required
          value={formData.organizer}
          onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder={t('form.organizerPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.categories')}
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              type="button"
              variant={formData.categories.includes(category.name) ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleCategoryChange(category.name)}
            >
              {t(`category.${category.name.toLowerCase()}`)}
            </Button>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        {t('form.submit')}
      </Button>
    </form>
  );
}