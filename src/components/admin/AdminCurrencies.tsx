import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const CURRENCIES_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';

interface Currency {
  id: number;
  symbol: string;
  name: string;
  type: string;
  icon_emoji: string;
  is_active: boolean;
  decimals: number;
}

export default function AdminCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newCurrency, setNewCurrency] = useState({
    symbol: '',
    name: '',
    type: 'crypto',
    icon_emoji: '💎',
    decimals: 8,
  });

  useEffect(() => {
    loadCurrencies();
  }, []);

  const loadCurrencies = async () => {
    try {
      const response = await fetch(`${CURRENCIES_API_URL}?action=list_currencies`);
      const data = await response.json();
      setCurrencies(data.currencies || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить валюты',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCurrency = async () => {
    try {
      const response = await fetch(CURRENCIES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_currency',
          ...newCurrency,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Валюта добавлена',
        });
        setIsAddDialogOpen(false);
        setNewCurrency({ symbol: '', name: '', type: 'crypto', icon_emoji: '💎', decimals: 8 });
        loadCurrencies();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить валюту',
        variant: 'destructive',
      });
    }
  };

  const toggleCurrency = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(CURRENCIES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_currency',
          currency_id: id,
          is_active: !isActive,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Статус валюты обновлён',
        });
        loadCurrencies();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Управление валютами</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Добавляйте и управляйте доступными криптовалютами
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить валюту
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить новую валюту</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Символ (например: BTC)</Label>
                <Input
                  value={newCurrency.symbol}
                  onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value.toUpperCase() })}
                  placeholder="BTC"
                />
              </div>
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  value={newCurrency.name}
                  onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                  placeholder="Bitcoin"
                />
              </div>
              <div className="space-y-2">
                <Label>Эмодзи иконка</Label>
                <Input
                  value={newCurrency.icon_emoji}
                  onChange={(e) => setNewCurrency({ ...newCurrency, icon_emoji: e.target.value })}
                  placeholder="💎"
                />
              </div>
              <div className="space-y-2">
                <Label>Decimals</Label>
                <Input
                  type="number"
                  value={newCurrency.decimals}
                  onChange={(e) => setNewCurrency({ ...newCurrency, decimals: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={handleAddCurrency} className="w-full">
                Добавить валюту
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Иконка</TableHead>
              <TableHead>Символ</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Decimals</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currencies.map((currency) => (
              <TableRow key={currency.id}>
                <TableCell>
                  <span className="text-2xl">{currency.icon_emoji}</span>
                </TableCell>
                <TableCell className="font-mono font-semibold">{currency.symbol}</TableCell>
                <TableCell>{currency.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                    {currency.type}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{currency.decimals}</TableCell>
                <TableCell>
                  <Switch
                    checked={currency.is_active}
                    onCheckedChange={() => toggleCurrency(currency.id, currency.is_active)}
                  />
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost">
                    <Icon name="Settings" size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">Всего валют: {currencies.length}</p>
            <p className="text-xs text-muted-foreground">
              Активных: {currencies.filter(c => c.is_active).length} • 
              Неактивных: {currencies.filter(c => !c.is_active).length}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
