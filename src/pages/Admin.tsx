import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminTransactions from '@/components/admin/AdminTransactions';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminRates from '@/components/admin/AdminRates';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminAdvancedSettings from '@/components/admin/AdminAdvancedSettings';
import AdminCurrencies from '@/components/admin/AdminCurrencies';
import AdminPartners from '@/components/admin/AdminPartners';
import AdminOrderSearch from '@/components/admin/AdminOrderSearch';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

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
  const [showHints, setShowHints] = useState(true);

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
      <AdminHeader onLogout={handleLogout} showHints={showHints} setShowHints={setShowHints} />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-card/50 border border-border/40">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary">
              <Icon name="LayoutDashboard" size={18} className="mr-2" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary">
              <Icon name="BarChart3" size={18} className="mr-2" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-primary">
              <Icon name="Search" size={18} className="mr-2" />
              Поиск
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary">
              <Icon name="ArrowLeftRight" size={18} className="mr-2" />
              Транзакции
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary">
              <Icon name="Users" size={18} className="mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="currencies" className="data-[state=active]:bg-primary">
              <Icon name="Coins" size={18} className="mr-2" />
              Валюты
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-primary">
              <Icon name="Handshake" size={18} className="mr-2" />
              Партнёры
            </TabsTrigger>
            <TabsTrigger value="rates" className="data-[state=active]:bg-primary">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Курсы
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
              <Icon name="Settings" size={18} className="mr-2" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-primary">
              <Icon name="Wrench" size={18} className="mr-2" />
              Управление
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard stats={stats} transactions={transactions} users={users} showHints={showHints} />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="search">
            <AdminOrderSearch />
          </TabsContent>

          <TabsContent value="transactions">
            <AdminTransactions transactions={transactions} onCancelTransaction={handleCancelTransaction} />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers users={users} onBlockUser={handleBlockUser} onApproveKYC={handleApproveKYC} />
          </TabsContent>

          <TabsContent value="currencies">
            <AdminCurrencies />
          </TabsContent>

          <TabsContent value="partners">
            <AdminPartners />
          </TabsContent>

          <TabsContent value="rates">
            <AdminRates />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>

          <TabsContent value="advanced">
            <AdminAdvancedSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;