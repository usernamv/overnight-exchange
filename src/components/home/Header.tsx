import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onAdminLoginClick: () => void;
}

const Header = ({ isAuthenticated, isAdmin, onAdminLoginClick }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan">
            <span className="text-2xl">🌙</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            overnight exchange
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#exchange" className="hover:text-primary transition-colors">Обмен</a>
          <a href="#rates" className="hover:text-primary transition-colors">Курсы</a>
          <Button variant="ghost" onClick={() => navigate('/help')}>
            <Icon name="HelpCircle" size={18} className="mr-1" />
            Помощь
          </Button>
          {!isAuthenticated ? (
            <>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate('/login')}
              >
                Войти
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-secondary"
                onClick={onAdminLoginClick}
              >
                <Icon name="ShieldCheck" size={16} className="mr-1" />
                Админ
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                <Icon name="User" size={18} className="mr-2" />
                Кабинет
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => navigate('/admin')}
                >
                  <Icon name="Shield" size={18} className="mr-2" />
                  Админ
                </Button>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
