import React from 'react';
import { FileDown, Calendar as CalendarIcon } from 'lucide-react';
import { useEventStore } from '../../store/eventStore';
import { useLanguageStore } from '../../store/languageStore';
import { Button } from '../ui/Button';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function ExportPanel() {
  const { events } = useEventStore();
  const { language, t } = useLanguageStore();
  const locale = language === 'ru' ? ru : undefined;

  const exportToICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Event Manager//NONSGML v1.0//EN',
    ];

    events.forEach(event => {
      icsContent = icsContent.concat([
        'BEGIN:VEVENT',
        `UID:${event.id}`,
        `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`,
        `DTSTART:${format(event.date, "yyyyMMdd'T'HHmmss'Z'")}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        'END:VEVENT'
      ]);
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `events-${format(new Date(), 'yyyy-MM-dd')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const data = events.map(event => ({
      ...event,
      date: format(event.date, 'yyyy-MM-dd HH:mm:ss')
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `events-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <FileDown className="w-6 h-6 mr-2 text-blue-600" />
        {t('export.title')}
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('export.calendar')}</h3>
          <p className="text-gray-600 mb-4">{t('export.calendarDesc')}</p>
          <Button
            onClick={exportToICS}
            className="w-full flex items-center justify-center"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {t('export.downloadICS')}
          </Button>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('export.backup')}</h3>
          <p className="text-gray-600 mb-4">{t('export.backupDesc')}</p>
          <Button
            onClick={exportToJSON}
            variant="secondary"
            className="w-full flex items-center justify-center"
          >
            <FileDown className="w-4 h-4 mr-2" />
            {t('export.downloadJSON')}
          </Button>
        </div>
      </div>
    </div>
  );
}