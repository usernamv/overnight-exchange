import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const EXCHANGE_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';

interface Transaction {
  id: string;
  date: string;
  from: string;
  to: string;
  fromAmount: number;
  toAmount: number;
  status: 'pending' | 'completed' | 'failed';
  user: string;
}

const AdminTransactions = () => {
  const { toast } = useToast();
  const [apiTransactions, setApiTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, [statusFilter]);

  const loadTransactions = async () => {
    try {
      const url = statusFilter === 'all' 
        ? `${EXCHANGE_API_URL}?action=list_exchanges&limit=100`
        : `${EXCHANGE_API_URL}?action=list_exchanges&limit=100&status=${statusFilter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setApiTransactions(data.exchanges);
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить обмены', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(EXCHANGE_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (res.ok) {
        toast({ title: 'Успешно', description: `Статус обновлён на "${newStatus}"` });
        loadTransactions();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить статус', variant: 'destructive' });
    }
  };

  const displayTransactions = apiTransactions;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Все транзакции</h3>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="completed">Выполнено</SelectItem>
              <SelectItem value="pending">В обработке</SelectItem>
              <SelectItem value="failed">Ошибка</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Поиск..." className="w-[250px]" />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Пользователь</TableHead>
            <TableHead>Обмен</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayTransactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono">#{tx.id}</TableCell>
              <TableCell>{tx.created_at ? new Date(tx.created_at).toLocaleString('ru-RU') : tx.date}</TableCell>
              <TableCell>{tx.email || tx.user || 'Аноним'}</TableCell>
              <TableCell>{tx.from_currency || tx.from} → {tx.to_currency || tx.to}</TableCell>
              <TableCell>{tx.from_amount || tx.fromAmount} → {tx.to_amount || tx.toAmount}</TableCell>
              <TableCell>
                <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}>
                  {tx.status === 'completed' ? 'Выполнено' : tx.status === 'pending' ? 'В обработке' : 'Ошибка'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {tx.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="default" 
                        onClick={() => updateStatus(tx.id, 'completed')}
                        title="Завершить"
                      >
                        <Icon name="Check" size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => updateStatus(tx.id, 'failed')}
                        title="Отменить"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: `Заявка #${tx.id}`,
                        description: (
                          <div className="space-y-2 mt-2">
                            <p><strong>Email:</strong> {tx.email}</p>
                            <p><strong>Telegram:</strong> {tx.telegram_username || 'не указан'}</p>
                            <p><strong>Адрес отправки:</strong> {tx.from_wallet || 'не указан'}</p>
                            <p><strong>Адрес получения:</strong> {tx.to_wallet || 'не указан'}</p>
                            {tx.notes && <p><strong>Комментарий:</strong> {tx.notes}</p>}
                          </div>
                        ),
                      });
                    }}
                    title="Детали"
                  >
                    <Icon name="Eye" size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default AdminTransactions;