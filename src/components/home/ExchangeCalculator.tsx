import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CurrencySelector from '@/components/CurrencySelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ExchangeRequestModal from './ExchangeRequestModal';

interface ExchangeCalculatorProps {
  fromAmount: string;
  fromCrypto: string;
  toCrypto: string;
  toAmount: string;
  exchangeRate: number;
  onFromAmountChange: (value: string) => void;
  onFromCryptoChange: (value: string) => void;
  onToCryptoChange: (value: string) => void;
  onSwap: () => void;
}

const ExchangeCalculator = ({
  fromAmount,
  fromCrypto,
  toCrypto,
  toAmount,
  exchangeRate,
  onFromAmountChange,
  onFromCryptoChange,
  onToCryptoChange,
  onSwap,
}: ExchangeCalculatorProps) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      return;
    }
    
    if (!isAuthenticated) {
      toast({
        title: 'Требуется вход',
        description: 'Для создания заявки необходимо войти в личный кабинет',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="exchange" className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-8 bg-card/50 backdrop-blur-sm border-border/40 animate-scale-in">
          <h2 className="text-3xl font-bold mb-6 text-center">{t.exchange.title}</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t.exchange.youSend}</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => onFromAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 text-lg"
                />
                <CurrencySelector
                  value={fromCrypto}
                  onChange={onFromCryptoChange}
                  className="w-32"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={onSwap}
                className="rounded-full border-border/40 hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                <Icon name="ArrowUpDown" size={20} />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t.exchange.youGet}</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={toAmount}
                  readOnly
                  placeholder="0.00"
                  className="flex-1 text-lg bg-muted/50"
                />
                <CurrencySelector
                  value={toCrypto}
                  onChange={onToCryptoChange}
                  className="w-32"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6 glow-cyan"
              onClick={handleOpenModal}
              disabled={!fromAmount || parseFloat(fromAmount) <= 0}
            >
              <Icon name="Send" size={20} className="mr-2" />
              Создать заявку
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t.language === 'ru' 
                ? 'Курс обновляется каждые 30 секунд. Заявку обрабатывает оператор.'
                : 'Rate updates every 30 seconds. Request processed by operator.'
              }
            </p>
          </div>
        </Card>
      </section>

      <ExchangeRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fromAmount={fromAmount}
        fromCrypto={fromCrypto}
        toCrypto={toCrypto}
        toAmount={toAmount}
        exchangeRate={exchangeRate}
      />
    </>
  );
};

export default ExchangeCalculator;