import React from 'react';
import { Calendar } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

interface HeaderProps {
  onShowGuide: () => void;
}

export function Header({ onShowGuide }: HeaderProps) {
  const { t } = useLanguageStore();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">{t('app.title')}</h1>
          </div>
        </div>
      </div>
    </header>
  );
}