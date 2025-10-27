import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const EXCHANGE_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';
const KYC_AML_API_URL = 'https://functions.poehali.dev/4f24f2ad-e009-45ce-9f47-ee953647179a';

interface ExchangeFlowProps {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  exchangeRate: number;
  onComplete?: () => void;
}

export default function ExchangeFlow({
  fromCurrency,
  toCurrency,
  fromAmount,
  toAmount,
  exchangeRate,
  onComplete,
}: ExchangeFlowProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [clientData, setClientData] = useState({
    email: '',
    full_name: '',
    from_wallet: '',
    to_wallet: '',
  });
  
  const [exchangeId, setExchangeId] = useState<number | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);
  const [complianceCheck, setComplianceCheck] = useState<any>(null);

  const handleStartExchange = () => {
    setOpen(true);
    setStep(1);
  };

  const handleSubmitClientData = async () => {
    if (!clientData.email || !clientData.from_wallet || !clientData.to_wallet) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(EXCHANGE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_exchange',
          email: clientData.email,
          name: clientData.full_name || 'Anonymous',
          from_currency: fromCurrency,
          to_currency: toCurrency,
          from_amount: parseFloat(fromAmount),
          to_amount: parseFloat(toAmount),
          exchange_rate: exchangeRate,
          from_wallet: clientData.from_wallet,
          to_wallet: clientData.to_wallet,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setExchangeId(result.exchange_id);
        setClientId(result.client_id);
        setStep(2);
        
        const complianceResponse = await fetch(KYC_AML_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'verify_exchange',
            exchange_id: result.exchange_id,
            client_id: result.client_id,
            amount_usd: parseFloat(fromAmount) * exchangeRate,
          }),
        });
        
        const complianceResult = await complianceResponse.json();
        setComplianceCheck(complianceResult);
        
        if (!complianceResult.can_proceed) {
          toast({
            title: 'Требуется верификация',
            description: complianceResult.issues.join(', '),
            variant: 'destructive',
          });
          setStep(3);
        } else {
          setStep(4);
        }
      } else {
        throw new Error(result.error || 'Failed to create exchange');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать обмен',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteExchange = () => {
    toast({
      title: 'Обмен создан',
      description: `ID обмена: ${exchangeId}. Отправьте ${fromAmount} ${fromCurrency} на указанный адрес.`,
    });
    setOpen(false);
    if (onComplete) onComplete();
  };

  return (
    <>
      <Button
        onClick={handleStartExchange}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-cyan"
        size="lg"
      >
        Обменять сейчас
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && 'Шаг 1: Ваши данные'}
              {step === 2 && 'Шаг 2: Проверка KYC/AML'}
              {step === 3 && 'Шаг 3: Требуется верификация'}
              {step === 4 && 'Шаг 4: Подтверждение обмена'}
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <Label>Имя (необязательно)</Label>
                <Input
                  value={clientData.full_name}
                  onChange={(e) => setClientData({ ...clientData, full_name: e.target.value })}
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <Label>Адрес кошелька отправителя ({fromCurrency}) *</Label>
                <Input
                  value={clientData.from_wallet}
                  onChange={(e) => setClientData({ ...clientData, from_wallet: e.target.value })}
                  placeholder="0x..."
                />
              </div>

              <div>
                <Label>Адрес кошелька получателя ({toCurrency}) *</Label>
                <Input
                  value={clientData.to_wallet}
                  onChange={(e) => setClientData({ ...clientData, to_wallet: e.target.value })}
                  placeholder="0x..."
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Отдаете</span>
                  <span className="font-semibold">{fromAmount} {fromCurrency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Получаете</span>
                  <span className="font-semibold">{toAmount} {toCurrency}</span>
                </div>
              </div>

              <Button onClick={handleSubmitClientData} disabled={loading} className="w-full">
                {loading ? 'Обработка...' : 'Продолжить'}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Проверка KYC/AML...</p>
              </div>
            </div>
          )}

          {step === 3 && complianceCheck && (
            <div className="space-y-4">
              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={24} className="text-yellow-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Требуется верификация</h4>
                    <ul className="text-sm space-y-1">
                      {complianceCheck.issues.map((issue: string, idx: number) => (
                        <li key={idx}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Ваш текущий уровень: <span className="font-semibold">{complianceCheck.verification_level}</span>
                </p>
                
                {complianceCheck.requires_kyc && (
                  <Button variant="outline" className="w-full">
                    <Icon name="FileText" size={16} className="mr-2" />
                    Пройти KYC верификацию
                  </Button>
                )}
                
                {complianceCheck.requires_aml && (
                  <Button variant="outline" className="w-full">
                    <Icon name="Shield" size={16} className="mr-2" />
                    Пройти AML проверку
                  </Button>
                )}
              </div>

              <Button onClick={() => setOpen(false)} variant="secondary" className="w-full">
                Закрыть
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-green-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Обмен создан успешно!</h4>
                    <p className="text-sm text-muted-foreground">ID обмена: #{exchangeId}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Отправьте</span>
                  <span className="font-semibold">{fromAmount} {fromCurrency}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">На адрес</span>
                  <span className="font-mono text-xs">0xABC...DEF</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Получите</span>
                  <span className="font-semibold text-green-400">{toAmount} {toCurrency}</span>
                </div>
              </div>

              <Button onClick={handleCompleteExchange} className="w-full">
                Понятно, закрыть
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
