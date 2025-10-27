import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import CurrencySelector from '@/components/CurrencySelector';
import ExchangeFlow from '@/components/ExchangeFlow';
import { currencies, getCurrenciesByType } from '@/data/currencies';

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
  const { isAuthenticated, isAdmin } = useAuth();
  const [fromAmount, setFromAmount] = useState('1');
  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toCrypto, setToCrypto] = useState('USDT');
  const [toAmount, setToAmount] = useState('0');
  const [rates, setRates] = useState<CryptoRate[]>([]);
  const [loading, setLoading] = useState(true);

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
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan">
              <span className="text-2xl">🌙</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              overnight exchange
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#exchange" className="hover:text-primary transition-colors">Обмен</a>
            <a href="#rates" className="hover:text-primary transition-colors">Курсы</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-primary transition-colors">Контакты</a>
            {!isAuthenticated ? (
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate('/login')}
              >
                Войти
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  <Icon name="User" size={18} className="mr-2" />
                  Кабинет
                </Button>
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                    onClick={() => navigate('/admin')}
                  >
                    <Icon name="Shield" size={18} className="mr-2" />
                    Админ
                  </Button>
                )}
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Обменивай криптовалюту
            <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent text-glow-cyan">
              круглосуточно
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Быстрый и безопасный обмен криптовалют по лучшим курсам. Работаем 24/7 без выходных.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-primary hover:bg-primary/90 glow-cyan">
              <Icon name="Zap" size={20} className="mr-2" />
              Начать обмен
            </Button>
            <Button size="lg" variant="outline" className="border-primary/50">
              <Icon name="Shield" size={20} className="mr-2" />
              AML/KYC
            </Button>
          </div>
        </div>
      </section>

      {/* Exchange Calculator */}
      <section id="exchange" className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-8 bg-card/50 backdrop-blur-sm border-border/40 animate-scale-in">
          <h2 className="text-3xl font-bold mb-6 text-center">Калькулятор обмена</h2>
          
          <div className="space-y-6">
            {/* From */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Отдаете</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1 bg-background/50 border-border/40"
                  placeholder="0.00"
                />
                <CurrencySelector value={fromCrypto} onChange={setFromCrypto} />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleSwap}
                variant="outline"
                size="icon"
                className="rounded-full border-primary/50 hover:bg-primary/10 hover:rotate-180 transition-all duration-300"
              >
                <Icon name="ArrowDownUp" size={20} />
              </Button>
            </div>

            {/* To */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Получаете</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={toAmount}
                  readOnly
                  className="flex-1 bg-background/50 border-border/40"
                  placeholder="0.00"
                />
                <CurrencySelector value={toCrypto} onChange={setToCrypto} />
              </div>
            </div>

            <ExchangeFlow
              fromCurrency={fromCrypto}
              toCurrency={toCrypto}
              fromAmount={fromAmount}
              toAmount={toAmount}
              exchangeRate={rates.find(r => r.symbol === fromCrypto)?.price || 0}
              onComplete={() => {
                setFromAmount('1');
                setToAmount('0');
              }}
            />
          </div>
        </Card>
      </section>

      {/* Rates */}
      <section id="rates" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-10 text-center">Курсы криптовалют</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 bg-card/50 backdrop-blur-sm border-border/40 animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </Card>
            ))
          ) : (
            rates.filter(r => displayCryptos.some(c => c.symbol === r.symbol)).map((rate) => {
              const currency = displayCryptos.find(c => c.symbol === rate.symbol);
              return (
                <Card
                  key={rate.symbol}
                  className="p-6 bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{rate.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{rate.name}</p>
                    </div>
                    <div className="text-3xl">
                      {currency?.icon}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">${rate.price.toLocaleString()}</p>
                    <p className={`text-sm flex items-center gap-1 ${rate.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <Icon name={rate.change24h >= 0 ? 'TrendingUp' : 'TrendingDown'} size={16} />
                      {rate.change24h >= 0 ? '+' : ''}{rate.change24h.toFixed(2)}%
                    </p>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-10 text-center">Почему выбирают нас</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 glow-cyan">
              <Icon name="Zap" size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Мгновенный обмен</h3>
            <p className="text-muted-foreground">Обмен происходит за считанные секунды. Автоматическая обработка заявок.</p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40 hover:border-secondary/50 transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 glow-purple">
              <Icon name="Shield" size={24} className="text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Безопасность</h3>
            <p className="text-muted-foreground">SSL шифрование и двухфакторная аутентификация. Ваши средства под защитой.</p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 glow-cyan">
              <Icon name="TrendingUp" size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Лучшие курсы</h3>
            <p className="text-muted-foreground">Актуальные рыночные курсы без скрытых комиссий. Прозрачные условия.</p>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-10 text-center">Частые вопросы</h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1" className="border-border/40">
            <AccordionTrigger className="text-lg hover:text-primary">
              Как долго занимает обмен?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Обмен происходит автоматически в течение 5-15 минут после получения подтверждений в блокчейне. 
              Обычно это занимает не более 10 минут.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-border/40">
            <AccordionTrigger className="text-lg hover:text-primary">
              Есть ли лимиты на обмен?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Минимальная сумма обмена зависит от выбранной криптовалюты. Максимальных лимитов нет, 
              но для сумм свыше $10,000 может потребоваться верификация KYC.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-border/40">
            <AccordionTrigger className="text-lg hover:text-primary">
              Какие комиссии берет сервис?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Наша комиссия составляет 0.5% от суммы обмена. Это одна из самых низких комиссий на рынке. 
              Комиссия уже включена в отображаемый курс.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-border/40">
            <AccordionTrigger className="text-lg hover:text-primary">
              Нужна ли регистрация для обмена?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Для небольших сумм регистрация не требуется. Достаточно указать адрес кошелька для получения. 
              Для сумм свыше $10,000 потребуется пройти верификацию.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-border/40">
            <AccordionTrigger className="text-lg hover:text-primary">
              Что такое AML/KYC политика?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              AML (Anti-Money Laundering) и KYC (Know Your Customer) - это процедуры проверки пользователей 
              для предотвращения отмывания денег. Мы следуем международным стандартам безопасности.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Contact */}
      <section id="contact" className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-8 bg-card/50 backdrop-blur-sm border-border/40">
          <h2 className="text-4xl font-bold mb-6 text-center">Поддержка 24/7</h2>
          <p className="text-center text-muted-foreground mb-8">
            Наша команда всегда готова помочь вам с любыми вопросами
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center glow-cyan">
                <Icon name="Mail" size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">support@overnight.exchange</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center glow-purple">
                <Icon name="MessageCircle" size={24} className="text-secondary" />
              </div>
              <h3 className="font-semibold">Telegram</h3>
              <p className="text-sm text-muted-foreground">@overnight_support</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center glow-cyan">
                <Icon name="Clock" size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold">Время работы</h3>
              <p className="text-sm text-muted-foreground">24/7 без выходных</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl">🌙</span>
              </div>
              <span className="font-bold">overnight exchange</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 overnight exchange. Все права защищены.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                О нас
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                AML/KYC
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Правила
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;