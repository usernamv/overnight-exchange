import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const EXCHANGE_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';

interface Exchange {
  id: number;
  order_number: string;
  from_currency: string;
  to_currency: string;
  from_amount: number;
  to_amount: number;
  status: string;
  created_at: string;
  deposit_tx_hash?: string;
  withdrawal_tx_hash?: string;
  from_wallet?: string;
  to_wallet?: string;
}

export default function AdminOrderSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchOrder = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите номер заявки',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${EXCHANGE_API_URL}?action=search_order&order_number=${searchQuery}`);
      const data = await response.json();
      
      if (data.exchange) {
        setExchange(data.exchange);
      } else {
        toast({
          title: 'Не найдено',
          description: 'Заявка с таким номером не найдена',
          variant: 'destructive',
        });
        setExchange(null);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось найти заявку',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: 'Ожидание', className: 'bg-yellow-400/10 text-yellow-400' },
      processing: { label: 'Обработка', className: 'bg-blue-400/10 text-blue-400' },
      completed: { label: 'Завершен', className: 'bg-green-400/10 text-green-400' },
      failed: { label: 'Ошибка', className: 'bg-red-400/10 text-red-400' },
      cancelled: { label: 'Отменен', className: 'bg-gray-400/10 text-gray-400' },
    };
    
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Поиск заявки</h2>
          <p className="text-sm text-muted-foreground">
            Найдите заявку по номеру для быстрого доступа к деталям
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Введите номер заявки (например: ORD-00000001)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchOrder()}
            className="font-mono"
          />
          <Button onClick={searchOrder} disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Icon name="Search" size={18} />
            )}
          </Button>
        </div>

        {exchange && (
          <div className="border border-border rounded-lg p-6 space-y-4 bg-card/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="FileText" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-mono">{exchange.order_number}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(exchange.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
              {getStatusBadge(exchange.status)}
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Обмен</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-primary">{exchange.from_currency}</span>
                    <Icon name="ArrowRight" size={20} />
                    <span className="text-lg font-semibold text-secondary">{exchange.to_currency}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Суммы</p>
                  <div className="space-y-1">
                    <p className="font-medium">
                      <Icon name="Download" size={14} className="inline mr-1 text-blue-400" />
                      {exchange.from_amount} {exchange.from_currency}
                    </p>
                    <p className="font-medium text-green-400">
                      <Icon name="Upload" size={14} className="inline mr-1" />
                      {exchange.to_amount} {exchange.to_currency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {exchange.from_wallet && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Кошелёк отправителя</p>
                    <p className="font-mono text-sm bg-muted px-3 py-2 rounded">
                      {exchange.from_wallet}
                    </p>
                  </div>
                )}

                {exchange.to_wallet && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Кошелёк получателя</p>
                    <p className="font-mono text-sm bg-muted px-3 py-2 rounded">
                      {exchange.to_wallet}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {(exchange.deposit_tx_hash || exchange.withdrawal_tx_hash) && (
              <div className="pt-4 border-t space-y-3">
                <p className="text-sm font-medium">TX Hashes</p>
                {exchange.deposit_tx_hash && (
                  <div className="flex items-center gap-2">
                    <Icon name="Download" size={16} className="text-blue-400" />
                    <span className="text-xs text-muted-foreground">Deposit:</span>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {exchange.deposit_tx_hash}
                    </code>
                  </div>
                )}
                {exchange.withdrawal_tx_hash && (
                  <div className="flex items-center gap-2">
                    <Icon name="Upload" size={16} className="text-green-400" />
                    <span className="text-xs text-muted-foreground">Withdrawal:</span>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {exchange.withdrawal_tx_hash}
                    </code>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" size="sm">
                <Icon name="Edit" size={16} className="mr-2" />
                Редактировать
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Связаться
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Обновить статус
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
