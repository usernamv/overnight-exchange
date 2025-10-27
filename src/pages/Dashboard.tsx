import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const EXCHANGE_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';
const KYC_AML_API_URL = 'https://functions.poehali.dev/4f24f2ad-e009-45ce-9f47-ee953647179a';

interface Exchange {
  id: number;
  order_number?: string;
  from_currency: string;
  to_currency: string;
  from_amount: number;
  to_amount: number;
  status: string;
  created_at: string;
  exchange_rate: number;
  deposit_tx_hash?: string;
  withdrawal_tx_hash?: string;
  from_wallet?: string;
  to_wallet?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboard();
  }, [user, navigate]);

  const loadDashboard = async () => {
    try {
      const clientId = localStorage.getItem('client_id') || '1';
      
      const exchangesResponse = await fetch(`${EXCHANGE_API_URL}?action=list_exchanges&client_id=${clientId}`);
      const exchangesData = await exchangesResponse.json();
      setExchanges(exchangesData.exchanges || []);
      
      const kycResponse = await fetch(`${KYC_AML_API_URL}?action=get_kyc_status&client_id=${clientId}`);
      const kycData = await kycResponse.json();
      setKycStatus(kycData.kyc);
      
      const completedCount = exchangesData.exchanges.filter((e: Exchange) => e.status === 'completed').length;
      const totalVolume = exchangesData.exchanges
        .filter((e: Exchange) => e.status === 'completed')
        .reduce((sum: number, e: Exchange) => sum + e.from_amount, 0);
      
      setStats({
        total_exchanges: exchangesData.exchanges.length,
        completed_exchanges: completedCount,
        pending_exchanges: exchangesData.exchanges.filter((e: Exchange) => e.status === 'pending').length,
        total_volume: totalVolume,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: 'Ожидание', className: 'bg-yellow-400/10 text-yellow-400' },
      processing: { label: 'Обработка', className: 'bg-blue-400/10 text-blue-400' },
      completed: { label: 'Завершен', className: 'bg-green-400/10 text-green-400' },
      failed: { label: 'Ошибка', className: 'bg-red-400/10 text-red-400' },
      cancelled: { label: 'Отменен', className: 'bg-gray-400/10 text-gray-400' },
    };
    
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <h1 className="text-2xl font-bold">Личный кабинет</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Всего обменов</p>
                <p className="text-3xl font-bold">{stats?.total_exchanges || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="ArrowLeftRight" size={24} className="text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Завершено</p>
                <p className="text-3xl font-bold text-green-400">{stats?.completed_exchanges || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-400/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">В обработке</p>
                <p className="text-3xl font-bold text-yellow-400">{stats?.pending_exchanges || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                <Icon name="Clock" size={24} className="text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Объем</p>
                <p className="text-2xl font-bold">{stats?.total_volume?.toFixed(4) || '0'}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-secondary" />
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="exchanges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="exchanges">Мои обмены</TabsTrigger>
            <TabsTrigger value="verification">Верификация</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="exchanges">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">История обменов</h3>
                <Button onClick={() => navigate('/')}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Новый обмен
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№ Заявки</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Обмен</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>TX Hash</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exchanges.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                          <p>У вас пока нет обменов</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      exchanges.map((ex) => (
                        <TableRow key={ex.id}>
                          <TableCell className="font-mono font-semibold">
                            {ex.order_number || `#${ex.id}`}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(ex.created_at).toLocaleString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-primary">{ex.from_currency}</span>
                              <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                              <span className="font-semibold text-secondary">{ex.to_currency}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{ex.from_amount} {ex.from_currency}</p>
                              <p className="text-sm text-green-400">→ {ex.to_amount} {ex.to_currency}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {ex.deposit_tx_hash && (
                                <div className="flex items-center gap-1">
                                  <Icon name="Download" size={12} className="text-blue-400" />
                                  <span className="text-xs font-mono text-muted-foreground">
                                    {ex.deposit_tx_hash.slice(0, 8)}...
                                  </span>
                                </div>
                              )}
                              {ex.withdrawal_tx_hash && (
                                <div className="flex items-center gap-1">
                                  <Icon name="Upload" size={12} className="text-green-400" />
                                  <span className="text-xs font-mono text-muted-foreground">
                                    {ex.withdrawal_tx_hash.slice(0, 8)}...
                                  </span>
                                </div>
                              )}
                              {!ex.deposit_tx_hash && !ex.withdrawal_tx_hash && (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(ex.status)}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost">
                              <Icon name="Eye" size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                    ))}
                  </TableBody>
                </Table>
                
                {exchanges.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">У вас пока нет обменов</p>
                    <Button onClick={() => navigate('/')}>
                      Создать первый обмен
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
              <h3 className="text-xl font-bold mb-6">KYC Верификация</h3>
              
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold mb-1">Статус верификации</h4>
                      <p className="text-sm text-muted-foreground">
                        {kycStatus ? kycStatus.status : 'Не пройдена'}
                      </p>
                    </div>
                    <Badge className={kycStatus?.status === 'approved' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}>
                      {kycStatus?.verification_level || 'none'}
                    </Badge>
                  </div>
                  
                  {!kycStatus && (
                    <Button className="w-full">
                      <Icon name="FileText" size={16} className="mr-2" />
                      Пройти верификацию
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-border/40 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Базовая верификация</h4>
                    <p className="text-sm text-muted-foreground mb-3">Лимит: $5,000/день</p>
                    <ul className="text-sm space-y-1 mb-4">
                      <li>✓ Email подтверждение</li>
                      <li>✓ Фото документа</li>
                      <li>✓ Селфи</li>
                    </ul>
                  </div>

                  <div className="border border-border/40 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Продвинутая верификация</h4>
                    <p className="text-sm text-muted-foreground mb-3">Лимит: $50,000/день</p>
                    <ul className="text-sm space-y-1 mb-4">
                      <li>✓ Все из базовой</li>
                      <li>✓ Подтверждение адреса</li>
                      <li>✓ AML проверка</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
              <h3 className="text-xl font-bold mb-6">Настройки профиля</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border/40 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Email уведомления</h4>
                    <p className="text-sm text-muted-foreground">Получать уведомления об обменах</p>
                  </div>
                  <Button variant="outline" size="sm">Включено</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border/40 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Двухфакторная аутентификация</h4>
                    <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
                  </div>
                  <Button variant="outline" size="sm">Настроить</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}