import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

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

interface AdminTransactionsProps {
  transactions: Transaction[];
  onCancelTransaction: (txId: string) => void;
}

const AdminTransactions = ({ transactions, onCancelTransaction }: AdminTransactionsProps) => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Все транзакции</h3>
        <div className="flex gap-2">
          <Select defaultValue="all">
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
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono">{tx.id}</TableCell>
              <TableCell>{tx.date}</TableCell>
              <TableCell>{tx.user}</TableCell>
              <TableCell>{tx.from} → {tx.to}</TableCell>
              <TableCell>{tx.fromAmount} → {tx.toAmount}</TableCell>
              <TableCell>
                <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}>
                  {tx.status === 'completed' ? 'Выполнено' : tx.status === 'pending' ? 'В обработке' : 'Ошибка'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Icon name="Eye" size={16} />
                  </Button>
                  {tx.status === 'pending' && (
                    <Button size="sm" variant="destructive" onClick={() => onCancelTransaction(tx.id)}>
                      <Icon name="X" size={16} />
                    </Button>
                  )}
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
