import React from 'react';
import { BarChart, Calendar, Clock } from 'lucide-react';
import { useEventStore } from '../../store/eventStore';
import { useLanguageStore } from '../../store/languageStore';
import { format, isSameMonth, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';

export function AnalyticsPanel() {
  const { events } = useEventStore();
  const { language, t } = useLanguageStore();
  const locale = language === 'ru' ? ru : undefined;

  const currentMonth = new Date();
  const eventsThisMonth = events.filter(event => 
    isSameMonth(event.date, currentMonth)
  );

  const upcomingEvents = events.filter(event => 
    event.date > new Date()
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const mostPopularCategory = React.useMemo(() => {
    const categories = events.flatMap(event => event.categories);
    const categoryCounts = categories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || '';
  }, [events]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <BarChart className="w-6 h-6 mr-2 text-blue-600" />
        {t('analytics.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">{t('analytics.thisMonth')}</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{eventsThisMonth.length}</p>
          <p className="text-sm text-gray-600">
            {format(currentMonth, 'MMMM yyyy', { locale })}
          </p>
        </div>

        {upcomingEvents[0] && (
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-amber-600 mr-2" />
              <h3 className="font-medium text-gray-900">{t('analytics.nextEvent')}</h3>
            </div>
            <p className="font-medium text-gray-900">{upcomingEvents[0].title}</p>
            <p className="text-sm text-gray-600">
              {format(upcomingEvents[0].date, 'PPp', { locale })}
            </p>
            <p className="text-sm text-amber-600 mt-1">
              {t('analytics.inDays', { 
                days: differenceInDays(upcomingEvents[0].date, new Date()) 
              })}
            </p>
          </div>
        )}

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <BarChart className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="font-medium text-gray-900">{t('analytics.popularCategory')}</h3>
          </div>
          <p className="text-xl font-medium text-purple-600">{mostPopularCategory}</p>
          <p className="text-sm text-gray-600">{t('analytics.mostUsed')}</p>
        </div>
      </div>
    </div>
  );
}