import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

export default function Help() {
  const navigate = useNavigate();
  const [activeGuide, setActiveGuide] = useState<'client' | 'admin'>('client');

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
              <h1 className="text-2xl font-bold">Помощь и инструкции</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card 
              className={`p-6 cursor-pointer transition-all ${activeGuide === 'client' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
              onClick={() => setActiveGuide('client')}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="User" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Для клиентов</h3>
                  <p className="text-sm text-muted-foreground">Как пользоваться сервисом</p>
                </div>
              </div>
            </Card>

            <Card 
              className={`p-6 cursor-pointer transition-all ${activeGuide === 'admin' ? 'border-secondary bg-secondary/5' : 'hover:border-secondary/50'}`}
              onClick={() => setActiveGuide('admin')}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Для администраторов</h3>
                  <p className="text-sm text-muted-foreground">Управление системой</p>
                </div>
              </div>
            </Card>
          </div>

          {activeGuide === 'client' && <ClientGuide />}
          {activeGuide === 'admin' && <AdminGuide />}
        </div>
      </div>
    </div>
  );
}

function ClientGuide() {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
      <h2 className="text-2xl font-bold mb-6">Руководство пользователя</h2>
      
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="start">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="Rocket" size={20} />
              Начало работы
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Быстрый обмен</h4>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Выберите валюту которую отдаете</li>
                <li>Введите сумму</li>
                <li>Выберите валюту которую получите</li>
                <li>Нажмите "Обменять сейчас"</li>
                <li>Заполните форму с вашими данными</li>
                <li>Отправьте средства на указанный адрес</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="exchange">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="ArrowLeftRight" size={20} />
              Как сделать обмен
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                  Выбор валют
                </h4>
                <p className="text-sm text-muted-foreground ml-8">
                  Выберите пару для обмена и введите сумму. Курс рассчитывается автоматически.
                </p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                  Ввод данных
                </h4>
                <p className="text-sm text-muted-foreground ml-8">
                  Укажите email, адреса кошельков отправителя и получателя.
                </p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
                  Проверка KYC/AML
                </h4>
                <p className="text-sm text-muted-foreground ml-8">
                  Автоматическая проверка лимитов и требований безопасности.
                </p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">4</span>
                  Отправка средств
                </h4>
                <p className="text-sm text-muted-foreground ml-8">
                  Отправьте криптовалюту на указанный адрес и ожидайте подтверждений.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verification">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheck" size={20} />
              Верификация (KYC)
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid gap-4">
              <div className="border border-border/40 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Без верификации</h4>
                  <span className="text-sm text-muted-foreground">$500/день</span>
                </div>
                <p className="text-sm text-muted-foreground">Базовый функционал без документов</p>
              </div>

              <div className="border border-primary/40 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Базовая</h4>
                  <span className="text-sm text-primary">$5,000/день</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Требуется: документ + селфи</p>
              </div>

              <div className="border border-secondary/40 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Продвинутая</h4>
                  <span className="text-sm text-secondary">$50,000/день</span>
                </div>
                <p className="text-sm text-muted-foreground">+ подтверждение адреса, AML</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="referral">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="Users" size={20} />
              Реферальная программа
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p className="text-muted-foreground">
              Получайте <span className="text-primary font-semibold">10% комиссии</span> с каждого обмена ваших рефералов!
            </p>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Как получить код?</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Зайдите в личный кабинет</li>
                <li>Откройте раздел "Реферальная программа"</li>
                <li>Скопируйте ваш уникальный код</li>
                <li>Делитесь с друзьями!</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="HelpCircle" size={20} />
              Частые вопросы
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Сколько времени занимает обмен?</h4>
              <p className="text-sm text-muted-foreground">
                Депозит: 5-60 минут (зависит от сети). Обработка: мгновенно. Вывод: 5-30 минут.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Какая комиссия?</h4>
              <p className="text-sm text-muted-foreground">
                Стандартная комиссия 0.5%. С реферальным кодом — скидка до 50%.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Можно ли отменить обмен?</h4>
              <p className="text-sm text-muted-foreground">
                До отправки средств — да. После отправки — нет, транзакции необратимы.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="MessageCircle" size={24} className="text-primary flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">Нужна помощь?</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Свяжитесь с нами в Telegram для быстрой поддержки
            </p>
            <Button size="sm" variant="outline">
              <Icon name="Send" size={16} className="mr-2" />
              Открыть Telegram
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AdminGuide() {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
      <h2 className="text-2xl font-bold mb-6">Руководство администратора</h2>
      
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="dashboard">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="LayoutDashboard" size={20} />
              Дашборд и аналитика
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p className="text-muted-foreground">
              Дашборд показывает ключевые метрики в реальном времени:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle" size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                <span>Всего обменов, завершенных, в ожидании</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="TrendingUp" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <span>Популярные валютные пары</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Activity" size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                <span>График активности за 30 дней</span>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="exchanges">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="ArrowLeftRight" size={20} />
              Управление обменами
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Просмотр обменов</h4>
                <p className="text-sm text-muted-foreground">
                  Вкладка "Транзакции" → полная таблица со всеми обменами, фильтры по статусу, поиск по ID/email.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Проблемные обмены</h4>
                <p className="text-sm text-muted-foreground">
                  Если обмен завис &gt;24ч в pending:
                </p>
                <ol className="list-decimal list-inside text-sm text-muted-foreground mt-1 ml-2">
                  <li>Проверьте TX hash в blockchain explorer</li>
                  <li>Свяжитесь с клиентом</li>
                  <li>Решите вопрос (возврат/продолжить)</li>
                </ol>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="kyc">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheck" size={20} />
              KYC/AML проверки
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Проверка документов</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Фото документа — четкое, читаемое, не просрочен</li>
                <li>✓ Селфи — лицо совпадает с документом</li>
                <li>✓ Адрес — документ не старше 3 месяцев</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-400 bg-yellow-400/10 p-3 rounded">
              <p className="text-sm">
                <strong>AML риски:</strong> Low (0-30) — авто-одобрение, 
                Medium (30-60) — опционально, 
                High (60-80) — обязательная проверка, 
                Critical (80-100) — блокировка
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sources">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="Database" size={20} />
              Источники курсов
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p className="text-muted-foreground">
              Управление API для получения курсов валют:
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <span className="text-sm font-semibold">CryptoCompare</span>
                <span className="text-xs text-muted-foreground">Priority: 1 (основной)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <span className="text-sm font-semibold">CoinGecko</span>
                <span className="text-xs text-muted-foreground">Priority: 2 (резервный)</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="blockchain">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="Link" size={20} />
              Блокчейн интеграция
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid gap-3">
              <div className="p-3 border border-border/40 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Ethereum</span>
                  <span className="text-xs text-muted-foreground">12 confirmations</span>
                </div>
                <p className="text-xs text-muted-foreground">ETH, USDT, USDC, все ERC-20</p>
              </div>

              <div className="p-3 border border-border/40 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">BSC</span>
                  <span className="text-xs text-muted-foreground">15 confirmations</span>
                </div>
                <p className="text-xs text-muted-foreground">BNB, все BEP-20</p>
              </div>

              <div className="p-3 border border-border/40 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Bitcoin</span>
                  <span className="text-xs text-muted-foreground">3 confirmations</span>
                </div>
                <p className="text-xs text-muted-foreground">BTC</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="daily">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Icon name="CheckSquare" size={20} />
              Ежедневные задачи
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Утро (начало смены)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>☐ Проверить uptime и статус сервисов</li>
                <li>☐ Просмотреть pending exchanges (&gt;24ч)</li>
                <li>☐ Обработать KYC заявки</li>
                <li>☐ Проверить high-risk AML alerts</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Вечер (конец смены)</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>☐ Проверить что все обмены обработаны</li>
                <li>☐ Сделать краткий отчет по дню</li>
                <li>☐ Убедиться что backup прошел</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={24} className="text-destructive flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">Критические проблемы</h4>
            <p className="text-sm text-muted-foreground">
              При downtime, массовых failed exchanges или утечке данных — 
              немедленно обращайтесь к разработчикам!
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
