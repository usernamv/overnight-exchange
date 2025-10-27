import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl">🌙</span>
              </div>
              <span className="text-lg font-bold">overnight exchange</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Быстрый и безопасный обмен криптовалют 24/7
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Продукты</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#exchange" className="hover:text-primary transition-colors">Обмен</a>
              </li>
              <li>
                <a href="#rates" className="hover:text-primary transition-colors">Курсы</a>
              </li>
              <li>
                <a href="/help" className="hover:text-primary transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Компания</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">О нас</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Контакты</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Карьера</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Поддержка</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Icon name="Mail" size={16} />
                <a href="mailto:support@overnight.exchange" className="hover:text-primary transition-colors">
                  support@overnight.exchange
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="MessageCircle" size={16} />
                <a href="https://t.me/poehalidev" className="hover:text-primary transition-colors">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 overnight exchange. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Условия использования
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Правила
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
