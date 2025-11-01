import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const ANALYTICS_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';

interface Analytics {
  total_revenue: number;
  total_exchanges: number;
  total_volume: number;
  avg_exchange_rate: number;
  today_revenue: number;
  today_exchanges: number;
  commission_earned: number;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`${ANALYTICS_API_URL}?action=get_analytics`);
      const data = await response.json();
      setAnalytics(data.analytics || {
        total_revenue: 0,
        total_exchanges: 0,
        total_volume: 0,
        avg_exchange_rate: 0,
        today_revenue: 0,
        today_exchanges: 0,
        commission_earned: 0,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить аналитику',
        variant: 'destructive',
      });
      setAnalytics({
        total_revenue: 0,
        total_exchanges: 0,
        total_volume: 0,
        avg_exchange_rate: 0,
        today_revenue: 0,
        today_exchanges: 0,
        commission_earned: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      title: 'Общая выручка',
      value: `$${analytics.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: 'DollarSign',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: '+12.5%',
    },
    {
      title: 'Всего обменов',
      value: analytics.total_exchanges.toLocaleString(),
      icon: 'ArrowLeftRight',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+8.3%',
    },
    {
      title: 'Объём торгов',
      value: `$${(analytics.total_volume / 1000000).toFixed(2)}M`,
      icon: 'TrendingUp',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: '+15.7%',
    },
    {
      title: 'Заработано комиссий',
      value: `$${analytics.commission_earned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: 'Coins',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      change: '+9.2%',
    },
    {
      title: 'Выручка сегодня',
      value: `$${analytics.today_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: 'Calendar',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      change: '+5.1%',
    },
    {
      title: 'Обменов сегодня',
      value: analytics.today_exchanges.toString(),
      icon: 'Activity',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      change: '+3.8%',
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Аналитика и доходность</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Статистика платформы в реальном времени
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-400/10 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Live</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <Icon name="TrendingUp" size={14} className="text-green-400" />
                    <span className="text-sm text-green-400">{stat.change}</span>
                    <span className="text-xs text-muted-foreground ml-1">vs прошлый месяц</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon name={stat.icon as any} size={24} className={stat.color} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Калькулятор прибыли</h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Средняя комиссия</span>
                <span className="text-lg font-bold">0.5%</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Объём за месяц</span>
                <span className="text-lg font-bold">${(analytics.total_volume / 12).toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm font-medium">Прибыль за месяц</span>
                <span className="text-xl font-bold text-green-400">
                  ${(analytics.commission_earned / 12).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">За день</p>
                <p className="text-lg font-bold text-primary">
                  ${(analytics.commission_earned / 365).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">За год</p>
                <p className="text-lg font-bold text-secondary">
                  ${(analytics.commission_earned * 12).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Топ направления</h3>
          <div className="space-y-3">
            {[
              { from: 'BTC', to: 'USDT', count: 342, percentage: 27.4 },
              { from: 'ETH', to: 'USDT', count: 289, percentage: 23.2 },
              { from: 'USDT', to: 'BTC', count: 215, percentage: 17.2 },
              { from: 'BNB', to: 'USDT', count: 187, percentage: 15.0 },
              { from: 'SOL', to: 'USDT', count: 143, percentage: 11.5 },
            ].map((pair, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{pair.from}</span>
                    <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                    <span className="font-semibold">{pair.to}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{pair.count}</span>
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${pair.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{pair.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}