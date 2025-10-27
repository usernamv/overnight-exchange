import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { currencies, getCurrenciesByType } from '@/data/currencies';
import { notifyNewExchange } from '@/utils/telegramNotifications';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import ExchangeCalculator from '@/components/home/ExchangeCalculator';
import CryptoRatesSection from '@/components/home/CryptoRatesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';
import AdminLoginModal from '@/components/home/AdminLoginModal';

const EXCHANGE_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';

interface CryptoRate {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isAdmin, login } = useAuth();
  const [fromAmount, setFromAmount] = useState('1');
  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toCrypto, setToCrypto] = useState('USDT');
  const [toAmount, setToAmount] = useState('0');
  const [rates, setRates] = useState<CryptoRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const displayCryptos = getCurrenciesByType('crypto').filter(c => 
    ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOT', 'MATIC', 'LINK', 'UNI'].includes(c.symbol)
  );

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    calculateExchange();
  }, [fromAmount, fromCrypto, toCrypto, rates]);

  const fetchRates = async () => {
    try {
      const cryptoSymbols = currencies.filter(c => c.type === 'crypto').map(c => c.symbol).join(',');
      const fiatSymbols = currencies.filter(c => c.type === 'fiat').map(c => c.symbol).join(',');
      
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoSymbols}&tsyms=${fiatSymbols}`
      );
      const data = await response.json();
      
      const ratesData: CryptoRate[] = currencies
        .filter(c => c.type === 'crypto')
        .map(crypto => ({
          symbol: crypto.symbol,
          name: crypto.name,
          price: data.RAW?.[crypto.symbol]?.USD?.PRICE || 0,
          change24h: data.RAW?.[crypto.symbol]?.USD?.CHANGEPCT24HOUR || 0,
        }));
      
      setRates(ratesData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      setLoading(false);
    }
  };

  const calculateExchange = () => {
    if (!fromAmount || isNaN(Number(fromAmount)) || rates.length === 0) {
      setToAmount('0');
      return;
    }

    const fromRate = rates.find(r => r.symbol === fromCrypto);
    const toRate = rates.find(r => r.symbol === toCrypto);

    if (fromRate && toRate) {
      const fromValueUSD = Number(fromAmount) * fromRate.price;
      const toValue = fromValueUSD / toRate.price;
      setToAmount(toValue.toFixed(6));
    }
  };

  const handleSwap = () => {
    const tempCrypto = fromCrypto;
    setFromCrypto(toCrypto);
    setToCrypto(tempCrypto);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(adminEmail, adminPassword);
    if (success) {
      setShowAdminLogin(false);
      setAdminEmail('');
      setAdminPassword('');
      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать в админ-панель!',
      });
      navigate('/admin');
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный email или пароль',
        variant: 'destructive',
      });
    }
  };

  const handleExchange = async () => {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onAdminLoginClick={() => setShowAdminLogin(true)}
      />

      <HeroSection />

      <ExchangeCalculator
        fromAmount={fromAmount}
        fromCrypto={fromCrypto}
        toCrypto={toCrypto}
        toAmount={toAmount}
        onFromAmountChange={setFromAmount}
        onFromCryptoChange={setFromCrypto}
        onToCryptoChange={setToCrypto}
        onSwap={handleSwap}
        onExchange={handleExchange}
      />

      <CryptoRatesSection
        displayCryptos={displayCryptos}
        rates={rates}
        loading={loading}
      />

      <FeaturesSection />

      <FAQSection />

      <Footer />

      <AdminLoginModal
        open={showAdminLogin}
        onOpenChange={setShowAdminLogin}
        email={adminEmail}
        password={adminPassword}
        onEmailChange={setAdminEmail}
        onPasswordChange={setAdminPassword}
        onSubmit={handleAdminLogin}
      />
    </div>
  );
};

export default Index;
