import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Settings, Calendar, MessageSquare, BarChart, FileDown } from 'lucide-react';
import { EventForm } from './components/EventForm';
import { EventList } from './components/EventList';
import { EventCalendar } from './components/Calendar/EventCalendar';
import { UserGuide } from './components/Guide/UserGuide';
import { Header } from './components/Layout/Header';
import { Button } from './components/ui/Button';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { AnalyticsPanel } from './components/EventAnalytics/AnalyticsPanel';
import { ExportPanel } from './components/Export/ExportPanel';
import { useEventStore } from './store/eventStore';
import { useReminders } from './hooks/useReminders';
import { useLanguageStore } from './store/languageStore';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerChildren, slideIn } from './components/animations/variants';

type Tab = 'events' | 'settings' | 'guide' | 'analytics' | 'export';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const { loadEvents, loadCategories, loadReminders } = useEventStore();
  const { t } = useLanguageStore();
  useReminders();

  useEffect(() => {
    loadEvents();
    loadCategories();
    loadReminders();
  }, [loadEvents, loadCategories, loadReminders]);

  const renderContent = () => {
    const content = {
      settings: <SettingsPanel />,
      guide: (
        <div className="mb-8">
          <Button
            variant="secondary"
            onClick={() => setActiveTab('events')}
            className="mb-4"
          >
            {t('guide.back')}
          </Button>
          <UserGuide />
        </div>
      ),
      analytics: <AnalyticsPanel />,
      export: <ExportPanel />,
      events: (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 mb-8"
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('events.create')}
              </h2>
              <EventForm />
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('events.upcoming')}
              </h2>
              <EventList />
            </motion.div>
          </div>
          
          <motion.div 
            className="space-y-8"
            variants={slideIn}
          >
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('events.calendar')}
              </h2>
              <EventCalendar />
            </div>
            <AnalyticsPanel />
          </motion.div>
        </motion.div>
      ),
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {content[activeTab]}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      <Header onShowGuide={() => setActiveTab('guide')} />

      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-wrap gap-4 mb-6"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <Button
            variant={activeTab === 'events' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('events')}
            className="flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('events.upcoming')}</span>
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('analytics')}
            className="flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <BarChart className="w-4 h-4" />
            <span>{t('analytics.title')}</span>
          </Button>
          <Button
            variant={activeTab === 'export' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('export')}
            className="flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <FileDown className="w-4 h-4" />
            <span>{t('export.title')}</span>
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('settings')}
            className="flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <Settings className="w-4 h-4" />
            <span>{t('settings.title')}</span>
          </Button>
          <Button
            variant={activeTab === 'guide' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('guide')}
            className="flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('guide.show')}</span>
          </Button>
        </motion.div>

        <main>{renderContent()}</main>
      </div>
    </div>
  );
}