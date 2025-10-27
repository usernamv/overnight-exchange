import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    toast({
      title: "Выход выполнен",
      description: "До скорой встречи!",
    });
    navigate('/');
  };

  const stats = [
    { label: 'Всего транзакций', value: '12,458', change: '+12.5%', icon: 'Repeat', positive: true },
    { label: 'Объём за 24ч', value: '$2.4M', change: '+8.3%', icon: 'TrendingUp', positive: true },
    { label: 'Активных пользователей', value: '3,247', change: '+5.1%', icon: 'Users', positive: true },
    { label: 'Доход', value: '$12,450', change: '-2.4%', icon: 'DollarSign', positive: false },
  ];

  const transactions: Transaction[] = [
    { id: 'TX001', date: '2024-10-27 14:32', from: 'BTC', to: 'USDT', fromAmount: 0.5, toAmount: 32500, status: 'completed', user: 'user@example.com' },
    { id: 'TX002', date: '2024-10-27 14:28', from: 'ETH', to: 'BTC', fromAmount: 10, toAmount: 0.15, status: 'completed', user: 'trader@mail.com' },
    { id: 'TX003', date: '2024-10-27 14:15', from: 'USDT', to: 'SOL', fromAmount: 5000, toAmount: 120.5, status: 'pending', user: 'crypto@test.com' },
    { id: 'TX004', date: '2024-10-27 13:45', from: 'BNB', to: 'ETH', fromAmount: 50, toAmount: 3.2, status: 'failed', user: 'user123@mail.ru' },
    { id: 'TX005', date: '2024-10-27 13:30', from: 'SOL', to: 'USDT', fromAmount: 100, toAmount: 4150, status: 'completed', user: 'sol_trader@gmail.com' },
  ];

  const users: User[] = [
    { id: 'U001', email: 'user@example.com', name: 'Иван Петров', status: 'active', kycStatus: 'verified', totalTrades: 45, totalVolume: 125000 },
    { id: 'U002', email: 'trader@mail.com', name: 'Алексей Смирнов', status: 'active', kycStatus: 'verified', totalTrades: 128, totalVolume: 580000 },
    { id: 'U003', email: 'crypto@test.com', name: 'Мария Козлова', status: 'active', kycStatus: 'pending', totalTrades: 12, totalVolume: 45000 },
    { id: 'U004', email: 'user123@mail.ru', name: 'Дмитрий Волков', status: 'blocked', kycStatus: 'none', totalTrades: 3, totalVolume: 8500 },
    { id: 'U005', email: 'sol_trader@gmail.com', name: 'Елена Новикова', status: 'active', kycStatus: 'verified', totalTrades: 67, totalVolume: 320000 },
  ];

  const handleBlockUser = (userId: string) => {
    toast({
      title: "Пользователь заблокирован",
      description: `ID: ${userId}`,
    });
  };

  const handleApproveKYC = (userId: string) => {
    toast({
      title: "KYC верификация одобрена",
      description: `ID: ${userId}`,
    });
  };

  const handleCancelTransaction = (txId: string) => {
    toast({
      title: "Транзакция отменена",
      description: `ID: ${txId}`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan">
                <span className="text-2xl">🌙</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  overnight exchange
                </span>
                <Badge className="ml-2 bg-secondary">Admin</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Icon name="Bell" size={18} className="mr-2" />
              Уведомления
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-card/50 border border-border/40">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary">
              <Icon name="LayoutDashboard" size={18} className="mr-2" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary">
              <Icon name="ArrowLeftRight" size={18} className="mr-2" />
              Транзакции
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary">
              <Icon name="Users" size={18} className="mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="rates" className="data-[state=active]:bg-primary">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Курсы
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
              <Icon name="Settings" size={18} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
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
              {/* Recent Transactions */}
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

              {/* Top Users */}
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
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions">
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
                            <Button size="sm" variant="destructive" onClick={() => handleCancelTransaction(tx.id)}>
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
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Управление пользователями</h3>
                <Input placeholder="Поиск пользователя..." className="w-[300px]" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Сделок</TableHead>
                    <TableHead>Объём</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono">{user.id}</TableCell>
                      <TableCell className="font-semibold">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.kycStatus === 'verified' ? 'default' : user.kycStatus === 'pending' ? 'secondary' : 'outline'}>
                          {user.kycStatus === 'verified' ? 'Верифицирован' : user.kycStatus === 'pending' ? 'На проверке' : 'Не пройден'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.totalTrades}</TableCell>
                      <TableCell>${user.totalVolume.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Icon name="Eye" size={16} />
                          </Button>
                          {user.kycStatus === 'pending' && (
                            <Button size="sm" variant="default" onClick={() => handleApproveKYC(user.id)}>
                              <Icon name="Check" size={16} />
                            </Button>
                          )}
                          {user.status === 'active' && (
                            <Button size="sm" variant="destructive" onClick={() => handleBlockUser(user.id)}>
                              <Icon name="Ban" size={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Rates */}
          <TabsContent value="rates">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
              <h3 className="text-2xl font-bold mb-6">Управление курсами</h3>
              <div className="space-y-4">
                {['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP'].map((crypto) => (
                  <div key={crypto} className="p-4 rounded-lg bg-background/50 border border-border/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                          {crypto === 'BTC' ? '₿' : crypto === 'ETH' ? 'Ξ' : crypto === 'USDT' ? '₮' : crypto === 'BNB' ? '🔶' : crypto === 'SOL' ? '◎' : '✕'}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold">{crypto}</h4>
                          <p className="text-sm text-muted-foreground">
                            {crypto === 'BTC' ? 'Bitcoin' : crypto === 'ETH' ? 'Ethereum' : crypto === 'USDT' ? 'Tether' : crypto === 'BNB' ? 'Binance Coin' : crypto === 'SOL' ? 'Solana' : 'Ripple'}
                          </p>
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
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;