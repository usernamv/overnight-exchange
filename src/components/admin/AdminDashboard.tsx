import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

const ADMIN_API_URL = 'https://functions.poehali.dev/d081ce90-f0f7-4af5-b43e-73f17edf6d7c';

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

interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'blocked';
  kycStatus: 'none' | 'pending' | 'verified';
  totalTrades: number;
  totalVolume: number;
}

interface AdminDashboardProps {
  stats: Array<{
    label: string;
    value: string;
    change: string;
    icon: string;
    positive: boolean;
  }>;
  transactions: Transaction[];
  users: User[];
  showHints?: boolean;
}

const AdminDashboard = ({ stats, transactions, users, showHints = false }: AdminDashboardProps) => {
  const [apiStats, setApiStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch(`${ADMIN_API_URL}?resource=dashboard`);
      const data = await res.json();
      setApiStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayStats = apiStats ? [
    { label: 'Всего обменов', value: apiStats.exchange_stats.total_exchanges.toString(), change: '+0%', icon: 'Repeat', positive: true },
    { label: 'Завершено', value: apiStats.exchange_stats.completed_exchanges.toString(), change: '+0%', icon: 'CheckCircle', positive: true },
    { label: 'В ожидании', value: apiStats.exchange_stats.pending_exchanges.toString(), change: '+0%', icon: 'Clock', positive: true },
    { label: 'Клиентов', value: apiStats.total_clients.toString(), change: '+0%', icon: 'Users', positive: true },
  ] : stats;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showHints && (
        <Alert className="bg-primary/10 border-primary/50">
          <Icon name="Lightbulb" size={18} className="text-primary" />
          <AlertDescription className="text-sm ml-2">
            <strong>Подсказка:</strong> На этой странице отображается общая статистика платформы. 
            Используйте вкладки выше для управления транзакциями, пользователями и настройками.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
          <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.positive ? 'bg-primary/10 glow-cyan' : 'bg-secondary/10 glow-purple'}`}>
                <Icon name={stat.icon as any} size={24} className={stat.positive ? 'text-primary' : 'text-secondary'} />
              </div>
              <Badge variant={stat.positive ? 'default' : 'destructive'} className={stat.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {stat.change}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Activity" size={20} />
            Последние транзакции
          </h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/20">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${tx.status === 'completed' ? 'bg-green-400' : tx.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                  <div>
                    <p className="font-semibold">{tx.fromAmount} {tx.from} → {tx.toAmount} {tx.to}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}>
                  {tx.status === 'completed' ? 'Выполнено' : tx.status === 'pending' ? 'В обработке' : 'Ошибка'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Crown" size={20} />
            Топ пользователей
          </h3>
          <div className="space-y-4">
            {users.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.totalTrades} сделок</p>
                  </div>
                </div>
                <p className="font-bold">${(user.totalVolume / 1000).toFixed(1)}K</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;