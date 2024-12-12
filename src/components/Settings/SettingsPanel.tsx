import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useLanguageStore } from '../../store/languageStore';
import toast from 'react-hot-toast';

export function SettingsPanel() {
  const { language, setLanguage, t } = useLanguageStore();
  const [botToken, setBotToken] = useState(localStorage.getItem('telegram_bot_token') || '');
  const [chatId, setChatId] = useState(localStorage.getItem('telegram_chat_id') || '');

  const handleSaveSettings = () => {
    localStorage.setItem('telegram_bot_token', botToken);
    localStorage.setItem('telegram_chat_id', chatId);
    toast.success(t('settings.save'));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('settings.title')}</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('settings.language')}
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'ru')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('settings.telegram')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('settings.botToken')}
              </label>
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('settings.chatId')}
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSaveSettings} className="w-full">
          {t('settings.save')}
        </Button>
      </div>
    </div>
  );
}