import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  return (
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
          <Button variant="outline" size="sm" onClick={onLogout}>
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;
