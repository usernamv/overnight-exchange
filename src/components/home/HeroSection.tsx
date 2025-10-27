import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative container mx-auto px-4 py-20 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 blur-3xl animate-pulse" />
      
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
      
      <div className="relative max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium mb-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {t.hero.description}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          {t.hero.title}
          <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-x">
            {t.hero.subtitle}
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t.hero.description}
        </p>

        <div className="flex gap-4 justify-center flex-wrap pt-4">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300 text-lg px-8 py-6 group"
            onClick={() => {
              document.getElementById('exchange')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Icon name="Zap" size={24} className="mr-2 group-hover:animate-pulse" />
            {t.hero.cta}
            <Icon name="ArrowRight" size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-primary/50 hover:bg-primary/10 text-lg px-8 py-6"
            onClick={() => navigate('/help')}
          >
            <Icon name="Shield" size={24} className="mr-2" />
            AML/KYC
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">10K+</div>
            <div className="text-sm text-muted-foreground">{t.hero.stats.exchanges}</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-secondary">5K+</div>
            <div className="text-sm text-muted-foreground">{t.hero.stats.users}</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">$2M+</div>
            <div className="text-sm text-muted-foreground">{t.hero.stats.volume}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);