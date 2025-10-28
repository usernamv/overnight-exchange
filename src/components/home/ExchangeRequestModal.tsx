import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const EXCHANGE_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';

interface ExchangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromAmount: string;
  fromCrypto: string;
  toCrypto: string;
  toAmount: string;
  exchangeRate: number;
}

const ExchangeRequestModal = ({
  isOpen,
  onClose,
  fromAmount,
  fromCrypto,
  toCrypto,
  toAmount,
  exchangeRate,
}: ExchangeRequestModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    telegram: '',
    fromAddress: '',
    toAddress: '',
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.toAddress) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля: Email и адрес получения',
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
          email: formData.email,
          telegram: formData.telegram,
          from_currency: fromCrypto,
          to_currency: toCrypto,
          from_amount: parseFloat(fromAmount),
          to_amount: parseFloat(toAmount),
          exchange_rate: exchangeRate,
          from_address: formData.fromAddress,
          to_address: formData.toAddress,
          comment: formData.comment,
          status: 'pending',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Заявка создана',
          description: `Заявка №${result.exchange_id} принята. Мы свяжемся с вами в ближайшее время.`,
        });
        onClose();
        setFormData({
          email: '',
          telegram: '',
          fromAddress: '',
          toAddress: '',
          comment: '',
        });
      } else {
        throw new Error('Failed to create exchange');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать заявку. Попробуйте снова.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Заявка на обмен</DialogTitle>
          <DialogDescription>
            Заполните форму, и наш оператор обработает вашу заявку
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Вы отправляете</p>
              <p className="font-bold text-lg">{fromAmount} {fromCrypto}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Вы получаете</p>
              <p className="font-bold text-lg">{toAmount} {toCrypto}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Курс: 1 {fromCrypto} = {exchangeRate.toFixed(6)} {toCrypto}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram (необязательно)</Label>
            <Input
              id="telegram"
              placeholder="@username"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromAddress">Адрес отправки {fromCrypto} (необязательно)</Label>
            <Input
              id="fromAddress"
              placeholder={`Адрес вашего кошелька ${fromCrypto}`}
              value={formData.fromAddress}
              onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Укажите, если хотите, чтобы мы проверили поступление с конкретного адреса
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toAddress">Адрес получения {toCrypto} <span className="text-destructive">*</span></Label>
            <Input
              id="toAddress"
              placeholder={`Адрес кошелька ${toCrypto} для получения средств`}
              value={formData.toAddress}
              onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий (необязательно)</Label>
            <Textarea
              id="comment"
              placeholder="Дополнительная информация..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={3}
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex gap-3">
              <Icon name="AlertTriangle" size={20} className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold mb-1 text-yellow-500">Как работает обмен</p>
                <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                  <li>Вы создаёте заявку и получаете адрес для отправки {fromCrypto}</li>
                  <li>Отправляете средства на указанный адрес</li>
                  <li>Оператор проверяет платёж и отправляет {toCrypto} на ваш адрес</li>
                  <li>Вы получаете уведомление о завершении обмена</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" size={18} className="mr-2" />
                  Создать заявку
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExchangeRequestModal;
