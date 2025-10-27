import { useToast } from '@/hooks/use-toast';
import { notifyNewExchange } from '@/utils/telegramNotifications';

const EXCHANGE_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';

interface CryptoRate {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

interface ExchangeSubmitParams {
  fromCrypto: string;
  toCrypto: string;
  fromAmount: string;
  toAmount: string;
  rates: CryptoRate[];
  isAuthenticated: boolean;
}

export const useExchangeSubmit = () => {
  const { toast } = useToast();

  const handleExchange = async ({
    fromCrypto,
    toCrypto,
    fromAmount,
    toAmount,
    rates,
    isAuthenticated,
  }: ExchangeSubmitParams) => {
    try {
      const fromRate = rates.find(r => r.symbol === fromCrypto);
      const toRate = rates.find(r => r.symbol === toCrypto);
      
      if (!fromRate || !toRate) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось получить курс',
          variant: 'destructive',
        });
        return;
      }

      const exchangeRate = fromRate.price / toRate.price;

      const response = await fetch(EXCHANGE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_exchange',
          from_currency: fromCrypto,
          to_currency: toCrypto,
          from_amount: parseFloat(fromAmount),
          to_amount: parseFloat(toAmount),
          exchange_rate: exchangeRate,
          status: 'pending',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Обмен создан',
          description: `${fromAmount} ${fromCrypto} → ${toAmount} ${toCrypto}. ID: ${result.exchange_id}`,
        });
        
        notifyNewExchange({
          from_currency: fromCrypto,
          to_currency: toCrypto,
          from_amount: fromAmount,
          to_amount: toAmount,
          exchange_id: result.exchange_id,
          user_email: isAuthenticated ? 'authenticated-user' : 'guest',
        });
      } else {
        throw new Error('Failed to create exchange');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать обмен',
        variant: 'destructive',
      });
    }
  };

  return { handleExchange };
};
