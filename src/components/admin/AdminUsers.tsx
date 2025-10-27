import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'blocked';
  kycStatus: 'none' | 'pending' | 'verified';
  totalTrades: number;
  totalVolume: number;
}

interface AdminUsersProps {
  users: User[];
  onBlockUser: (userId: string) => void;
  onApproveKYC: (userId: string) => void;
}

const AdminUsers = ({ users, onBlockUser, onApproveKYC }: AdminUsersProps) => {
  return (
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
                    <Button size="sm" variant="default" onClick={() => onApproveKYC(user.id)}>
                      <Icon name="Check" size={16} />
                    </Button>
                  )}
                  {user.status === 'active' && (
                    <Button size="sm" variant="destructive" onClick={() => onBlockUser(user.id)}>
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
  );
};

export default AdminUsers;
