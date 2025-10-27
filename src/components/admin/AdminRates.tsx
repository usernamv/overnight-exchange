import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

const AdminRates = () => {
  const cryptoList = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { symbol: 'USDT', name: 'Tether', icon: '₮' },
    { symbol: 'BNB', name: 'Binance Coin', icon: '🔶' },
    { symbol: 'SOL', name: 'Solana', icon: '◎' },
    { symbol: 'XRP', name: 'Ripple', icon: '✕' },
  ];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
      <h3 className="text-2xl font-bold mb-6">Управление курсами</h3>
      <div className="space-y-4">
        {cryptoList.map((crypto) => (
          <div key={crypto.symbol} className="p-4 rounded-lg bg-background/50 border border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                  {crypto.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold">{crypto.symbol}</h4>
                  <p className="text-sm text-muted-foreground">{crypto.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Комиссия</p>
                  <Input type="number" defaultValue="0.5" className="w-24 text-right" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Мин. сумма</p>
                  <Input type="number" defaultValue="0.001" className="w-32 text-right" />
                </div>
                <Button size="sm" className="bg-primary">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AdminRates;
