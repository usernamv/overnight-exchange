import React from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'Zap',
      title: 'Мгновенный обмен',
      description: 'Обмен происходит автоматически в течение нескольких минут'
    },
    {
      icon: 'Shield',
      title: 'Безопасность',
      description: 'AML/KYC проверки и защита от мошенничества'
    },
    {
      icon: 'DollarSign',
      title: 'Лучшие курсы',
      description: 'Актуальные курсы с ведущих криптобирж мира'
    },
    {
      icon: 'Clock',
      title: '24/7 Поддержка',
      description: 'Круглосуточная поддержка пользователей'
    },
    {
      icon: 'Lock',
      title: 'Приватность',
      description: 'Ваши данные надежно защищены и зашифрованы'
    },
    {
      icon: 'TrendingUp',
      title: 'Без скрытых комиссий',
      description: 'Прозрачная структура комиссий без скрытых платежей'
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Почему выбирают нас</h2>
        <p className="text-muted-foreground">Преимущества работы с нашей платформой</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Card 
            key={index}
            className="p-6 bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 glow-cyan">
              <Icon name={feature.icon as any} size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default React.memo(FeaturesSection);