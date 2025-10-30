interface NotificationData {
  notification_type: 'new_exchange' | 'new_payment' | 'kyc_pending' | 'aml_alert' | 'system' | 'info';
  message: string;
  extra_data?: Record<string, any>;
}

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_ADMIN_CHAT_ID = import.meta.env.VITE_TELEGRAM_ADMIN_CHAT_ID || '';

export const sendTelegramNotification = async (data: NotificationData): Promise<boolean> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
    console.warn('Telegram credentials not configured. Notification skipped.');
    return false;
  }

  try {
    const formattedMessage = formatNotification(data.notification_type, data.message, data.extra_data || {});
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: formattedMessage,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();
    
    if (!result.ok) {
      console.error('Failed to send Telegram notification:', result);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};

const formatNotification = (
  notificationType: string,
  message: string,
  extraData: Record<string, any>
): string => {
  const emojiMap: Record<string, string> = {
    new_exchange: '🔄',
    new_payment: '💳',
    kyc_pending: '📋',
    aml_alert: '🚨',
    system: '⚙️',
    info: 'ℹ️',
  };

  const emoji = emojiMap[notificationType] || 'ℹ️';
  let formatted = `${emoji} <b>${message}</b>\n\n`;

  if (notificationType === 'new_exchange') {
    formatted += `💱 Обмен: ${extraData.from_currency} → ${extraData.to_currency}\n`;
    formatted += `📊 Сумма: ${extraData.from_amount} → ${extraData.to_amount}\n`;
    formatted += `🆔 ID: ${extraData.exchange_id}\n`;
    formatted += `👤 Пользователь: ${extraData.user_email || 'N/A'}\n`;
  } else if (notificationType === 'new_payment') {
    formatted += `💰 Сумма: ${extraData.amount} ${extraData.currency}\n`;
    formatted += `🏦 Провайдер: ${extraData.provider}\n`;
    formatted += `🆔 ID: ${extraData.transaction_id}\n`;
    formatted += `📍 Статус: ${extraData.status}\n`;
  } else if (notificationType === 'kyc_pending') {
    formatted += `👤 Пользователь: ${extraData.user_email}\n`;
    formatted += `📄 Документы: ${extraData.documents_count || 0}\n`;
    formatted += `🆔 ID: ${extraData.user_id}\n`;
  } else if (notificationType === 'aml_alert') {
    formatted += `⚠️ Риск: ${extraData.risk_level}\n`;
    formatted += `👤 Пользователь: ${extraData.user_email}\n`;
    formatted += `💵 Сумма: ${extraData.amount}\n`;
    formatted += `🆔 Exchange ID: ${extraData.exchange_id}\n`;
  }

  const excludedKeys = [
    'from_currency', 'to_currency', 'from_amount', 'to_amount',
    'exchange_id', 'user_email', 'amount', 'currency', 'provider',
    'transaction_id', 'status', 'documents_count', 'user_id', 'risk_level'
  ];

  Object.entries(extraData).forEach(([key, value]) => {
    if (!excludedKeys.includes(key)) {
      formatted += `${key}: ${value}\n`;
    }
  });

  return formatted;
};

export const notifyNewExchange = (exchangeData: {
  from_currency: string;
  to_currency: string;
  from_amount: string | number;
  to_amount: string | number;
  exchange_id: string;
  user_email?: string;
}) => {
  return sendTelegramNotification({
    notification_type: 'new_exchange',
    message: 'Новый обмен создан',
    extra_data: exchangeData,
  });
};

export const notifyNewPayment = (paymentData: {
  amount: string | number;
  currency: string;
  provider: string;
  transaction_id: string;
  status: string;
}) => {
  return sendTelegramNotification({
    notification_type: 'new_payment',
    message: 'Новый платеж получен',
    extra_data: paymentData,
  });
};

export const notifyKYCPending = (kycData: {
  user_email: string;
  user_id: string;
  documents_count?: number;
}) => {
  return sendTelegramNotification({
    notification_type: 'kyc_pending',
    message: 'Новая заявка на KYC верификацию',
    extra_data: kycData,
  });
};

export const notifyAMLAlert = (amlData: {
  risk_level: string;
  user_email: string;
  amount: string | number;
  exchange_id: string;
}) => {
  return sendTelegramNotification({
    notification_type: 'aml_alert',
    message: 'AML Проверка: Высокий риск!',
    extra_data: amlData,
  });
};
