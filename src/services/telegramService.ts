import axios from 'axios';

const TELEGRAM_API = 'https://api.telegram.org/bot';

export const sendTelegramNotification = async (message: string): Promise<boolean> => {
  const botToken = localStorage.getItem('telegram_bot_token') || import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = localStorage.getItem('telegram_chat_id') || import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.info('Telegram notifications are not configured');
    return false;
  }

  try {
    const response = await axios.post(`${TELEGRAM_API}${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });

    return response.status === 200;
  } catch (error) {
    console.error('Failed to send Telegram notification');
    return false;
  }
};