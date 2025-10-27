import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  onLogout: () => void;
  showHints: boolean;
  setShowHints: (show: boolean) => void;
}

const AdminHeader = ({ onLogout, showHints, setShowHints }: AdminHeaderProps) => {

  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="text-muted-foreground hover:text-primary"
              >
                <Icon name="HelpCircle" size={18} className="mr-2" />
                Подсказки
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showHints ? 'Скрыть' : 'Показать'} подсказки для работы</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Icon name="Bell" size={18} className="mr-2" />
                <Badge className="ml-1 bg-secondary text-secondary-foreground px-1.5 py-0.5 text-xs">3</Badge>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Новые уведомления</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Выйти из админ-панели</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;