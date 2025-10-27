import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const Header = ({ isAuthenticated, isAdmin }: HeaderProps) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

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
          <a href="#exchange" className="hover:text-primary transition-colors">{t.nav.rates}</a>
          <a href="#rates" className="hover:text-primary transition-colors">{t.nav.rates}</a>
          <Button variant="ghost" onClick={() => navigate('/help')}>
            <Icon name="HelpCircle" size={18} className="mr-1" />
            {t.nav.support}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Icon name="Globe" size={18} className="mr-1" />
                {language === 'ru' ? 'RU' : 'EN'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('ru')}>
                🇷🇺 Русский
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {!isAuthenticated ? (
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => navigate('/login')}
            >
              {t.nav.login}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                <Icon name="User" size={18} className="mr-2" />
                {t.nav.dashboard}
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => navigate('/admin')}
                >
                  <Icon name="Shield" size={18} className="mr-2" />
                  {t.nav.admin}
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