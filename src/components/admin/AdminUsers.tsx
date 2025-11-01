import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const EXCHANGE_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';

interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'blocked';
  kycStatus: 'none' | 'pending' | 'verified';
  totalTrades: number;
  totalVolume: number;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${EXCHANGE_API_URL}?action=list_clients`);
      const data = await res.json();
      setUsers(data.clients || []);
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить пользователей', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Управление пользователями</h3>
        <Input 
          placeholder="Поиск пользователя..." 
          className="w-[300px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                Пользователи не найдены
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-mono">#{user.id}</TableCell>
              <TableCell className="font-semibold">{user.full_name || 'Anonymous'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                  {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.verification_level === 'level_3' ? 'default' : user.verification_level === 'level_2' ? 'secondary' : 'outline'}>
                  {user.verification_level === 'level_3' ? 'Уровень 3' : user.verification_level === 'level_2' ? 'Уровень 2' : user.verification_level === 'level_1' ? 'Уровень 1' : 'Не пройден'}
                </Badge>
              </TableCell>
              <TableCell>{user.total_exchanges || 0}</TableCell>
              <TableCell>${parseFloat(user.total_volume || 0).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: `Пользователь #${user.id}`,
                        description: (
                          <div className="space-y-2 mt-2">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Имя:</strong> {user.full_name || 'Anonymous'}</p>
                            <p><strong>Telegram:</strong> {user.telegram_username || 'не указан'}</p>
                            <p><strong>Телефон:</strong> {user.phone || 'не указан'}</p>
                            <p><strong>Верификация:</strong> {user.verification_level || 'none'}</p>
                          </div>
                        ),
                      });
                    }}
                  >
                    <Icon name="Eye" size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default AdminUsers;