import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const ADMIN_API_URL = 'https://functions.poehali.dev/d081ce90-f0f7-4af5-b43e-73f17edf6d7c';

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch(`${ADMIN_API_URL}?resource=settings`);
      const data = await res.json();
      const settingsMap: Record<string, string> = {};
      data.settings.forEach((s: any) => {
        settingsMap[s.setting_key] = s.setting_value;
      });
      setSettings(settingsMap);
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить настройки', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'setting', setting_key: key, setting_value: value }),
      });
      setSettings({ ...settings, [key]: value });
      toast({ title: 'Успешно', description: 'Настройка обновлена' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить настройку', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="Percent" size={20} />
          Общие комиссии
        </h3>
        <div className="space-y-4">
          <div>
            <Label>Комиссия обмена (%)</Label>
            <Input 
              type="number" 
              value={settings.commission_percent || '0.5'}
              onChange={(e) => setSettings({ ...settings, commission_percent: e.target.value })}
            />
          </div>
          <div>
            <Label>Минимальная сумма обмена ($)</Label>
            <Input 
              type="number" 
              value={settings.min_exchange_amount || '10'}
              onChange={(e) => setSettings({ ...settings, min_exchange_amount: e.target.value })}
            />
          </div>
          <div>
            <Label>Источник курсов по умолчанию</Label>
            <Input 
              value={settings.default_rate_source || 'cryptocompare'}
              onChange={(e) => setSettings({ ...settings, default_rate_source: e.target.value })}
            />
          </div>
          <Button 
            className="w-full bg-primary"
            onClick={() => {
              updateSetting('commission_percent', settings.commission_percent);
              updateSetting('min_exchange_amount', settings.min_exchange_amount);
              updateSetting('default_rate_source', settings.default_rate_source);
            }}
          >
            Сохранить изменения
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} />
          Лимиты безопасности
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Макс. сумма без KYC ($)</label>
            <Input type="number" defaultValue="10000" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Макс. дневной лимит ($)</label>
            <Input type="number" defaultValue="50000" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Время удержания (мин)</label>
            <Input type="number" defaultValue="15" />
          </div>
          <Button className="w-full bg-primary">Сохранить изменения</Button>
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="Bell" size={20} />
          Уведомления
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Email уведомления</p>
              <p className="text-sm text-muted-foreground">О новых транзакциях</p>
            </div>
            <Button variant="outline" size="sm">Включено</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Telegram уведомления</p>
              <p className="text-sm text-muted-foreground">Важные события</p>
            </div>
            <Button variant="outline" size="sm">Включено</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">SMS уведомления</p>
              <p className="text-sm text-muted-foreground">Критичные алерты</p>
            </div>
            <Button variant="outline" size="sm">Выключено</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="Database" size={20} />
          Резервное копирование
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Последний бэкап: 27.10.2024 12:00</p>
            <Button className="w-full" variant="outline">
              <Icon name="Download" size={16} className="mr-2" />
              Создать резервную копию
            </Button>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Автоматический бэкап</label>
            <Select defaultValue="daily">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Каждый час</SelectItem>
                <SelectItem value="daily">Ежедневно</SelectItem>
                <SelectItem value="weekly">Еженедельно</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;