import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const AdminSettings = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="Percent" size={20} />
          Общие комиссии
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Стандартная комиссия (%)</label>
            <Input type="number" defaultValue="0.5" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Комиссия для VIP (%)</label>
            <Input type="number" defaultValue="0.3" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Минимальная комиссия ($)</label>
            <Input type="number" defaultValue="1" />
          </div>
          <Button className="w-full bg-primary">Сохранить изменения</Button>
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
