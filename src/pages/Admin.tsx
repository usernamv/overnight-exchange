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
    { label: 'Всего транзакций', value: '0', change: '+0%', icon: 'Repeat', positive: true },
    { label: 'Объём за 24ч', value: '$0', change: '+0%', icon: 'TrendingUp', positive: true },
    { label: 'Активных пользователей', value: '0', change: '+0%', icon: 'Users', positive: true },
    { label: 'Доход', value: '$0', change: '+0%', icon: 'DollarSign', positive: true },
  ];

  const transactions: Transaction[] = [];

  const users: User[] = [];

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