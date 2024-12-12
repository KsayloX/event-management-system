// Environment configuration with fallbacks
export const config = {
  telegram: {
    botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
    chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',
    enabled: import.meta.env.VITE_TELEGRAM_ENABLED === 'true',
  },
} as const;