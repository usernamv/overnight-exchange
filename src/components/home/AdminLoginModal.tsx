import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AdminLoginModal = ({
  open,
  onOpenChange,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="ShieldCheck" size={24} className="text-secondary" />
            Вход в админ-панель
          </DialogTitle>
          <DialogDescription>
            Введите учетные данные администратора для доступа к панели управления
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@overnight.exchange"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium">
              Пароль
            </label>
            <Input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-secondary hover:bg-secondary/90"
            >
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
          </div>
          <div className="text-xs text-muted-foreground text-center pt-2">
            Доступ только для администраторов платформы
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginModal;
