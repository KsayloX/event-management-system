import React from 'react';
import { Book, Bell, Calendar, MessageSquare, Users, Zap, Globe } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

export function UserGuide() {
  const { t } = useLanguageStore();
  
  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
      title: t('guide.features.calendar.title'),
      description: t('guide.features.calendar.description')
    },
    {
      icon: <Bell className="w-6 h-6 text-blue-500" />,
      title: t('guide.features.notifications.title'),
      description: t('guide.features.notifications.description')
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      title: t('guide.features.comments.title'),
      description: t('guide.features.comments.description')
    },
   
    {
      icon: <Globe className="w-6 h-6 text-blue-500" />,
      title: t('guide.features.language.title'),
      description: t('guide.features.language.description')
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: t('guide.features.offline.title'),
      description: t('guide.features.offline.description')
    }
  ];

  const quickStartSteps = t('guide.quickStart.steps').split('|');
  const proTips = t('guide.proTips.tips').split('|');
  const telegramSetupSteps = t('guide.telegram.setup.steps').split('|');

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Book className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('guide.welcome')}</h1>
          <p className="text-lg text-gray-600">
            {t('guide.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('guide.quickStart.title')}
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            {quickStartSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="mt-8 p-6 bg-amber-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('guide.proTips.title')}
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            {proTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 p-6 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('guide.telegram.title')}
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">{t('guide.telegram.description')}</p>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-gray-900 mb-2">
                {t('guide.telegram.setup.title')}
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {telegramSetupSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}