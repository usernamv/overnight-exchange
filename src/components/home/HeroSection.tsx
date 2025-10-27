import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Обменивай криптовалюту
          <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent text-glow-cyan">
            круглосуточно
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Быстрый и безопасный обмен криптовалют по лучшим курсам. Работаем 24/7 без выходных.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 glow-cyan"
            onClick={() => {
              document.getElementById('exchange')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Icon name="Zap" size={20} className="mr-2" />
            Начать обмен
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary/50"
            onClick={() => navigate('/help')}
          >
            <Icon name="Shield" size={20} className="mr-2" />
            AML/KYC
          </Button>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);