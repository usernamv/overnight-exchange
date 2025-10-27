import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { currencies, getCurrenciesByType, searchCurrencies, type Currency } from '@/data/currencies';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'all' | 'crypto' | 'fiat';
}

const CurrencySelector = ({ value, onChange, type = 'all' }: CurrencySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'crypto' | 'fiat'>('crypto');

  const selectedCurrency = currencies.find(c => c.symbol === value);
  
  const displayCurrencies = search 
    ? searchCurrencies(search)
    : type === 'all' 
      ? getCurrenciesByType(activeTab)
      : getCurrenciesByType(type as 'crypto' | 'fiat');

  const cryptoCurrencies = displayCurrencies.filter(c => c.type === 'crypto');
  const fiatCurrencies = displayCurrencies.filter(c => c.type === 'fiat');

  const handleSelect = (currency: Currency) => {
    onChange(currency.symbol);
    setOpen(false);
    setSearch('');
  };

  const groupedCrypto = {
    major: cryptoCurrencies.filter(c => c.category === 'major'),
    stablecoin: cryptoCurrencies.filter(c => c.category === 'stablecoin'),
    altcoin: cryptoCurrencies.filter(c => c.category === 'altcoin'),
    defi: cryptoCurrencies.filter(c => c.category === 'defi'),
    new: cryptoCurrencies.filter(c => c.category === 'new'),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-[160px] justify-between bg-background/50 border-border/40">
          <span className="flex items-center gap-2">
            <span className="text-lg">{selectedCurrency?.icon}</span>
            <span>{selectedCurrency?.symbol}</span>
          </span>
          <Icon name="ChevronDown" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[600px] bg-card/95 backdrop-blur-xl border-border/40">
        <DialogHeader>
          <DialogTitle>Выберите валюту</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск валюты..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background/50 border-border/40"
            />
          </div>

          {type === 'all' && !search && (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'crypto' | 'fiat')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="crypto">
                  <Icon name="Coins" size={16} className="mr-2" />
                  Криптовалюты
                </TabsTrigger>
                <TabsTrigger value="fiat">
                  <Icon name="Banknote" size={16} className="mr-2" />
                  Фиатные валюты
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {search ? (
              <div className="grid grid-cols-2 gap-2">
                {displayCurrencies.map((currency) => (
                  <Button
                    key={currency.symbol}
                    variant="outline"
                    className="justify-start gap-3 h-auto py-3"
                    onClick={() => handleSelect(currency)}
                  >
                    <span className="text-2xl">{currency.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold">{currency.symbol}</p>
                      <p className="text-xs text-muted-foreground">{currency.name}</p>
                    </div>
                    {currency.type === 'fiat' && (
                      <Badge variant="secondary" className="ml-auto">Fiat</Badge>
                    )}
                  </Button>
                ))}
              </div>
            ) : activeTab === 'crypto' ? (
              <>
                {groupedCrypto.major.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                      <Icon name="Star" size={14} />
                      Основные
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {groupedCrypto.major.map((currency) => (
                        <Button
                          key={currency.symbol}
                          variant="outline"
                          className="justify-start gap-3 h-auto py-3"
                          onClick={() => handleSelect(currency)}
                        >
                          <span className="text-2xl">{currency.icon}</span>
                          <div className="text-left">
                            <p className="font-semibold">{currency.symbol}</p>
                            <p className="text-xs text-muted-foreground">{currency.name}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {groupedCrypto.stablecoin.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                      <Icon name="Shield" size={14} />
                      Стейблкоины
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {groupedCrypto.stablecoin.map((currency) => (
                        <Button
                          key={currency.symbol}
                          variant="outline"
                          className="justify-start gap-3 h-auto py-3"
                          onClick={() => handleSelect(currency)}
                        >
                          <span className="text-2xl">{currency.icon}</span>
                          <div className="text-left">
                            <p className="font-semibold">{currency.symbol}</p>
                            <p className="text-xs text-muted-foreground">{currency.name}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {groupedCrypto.altcoin.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                      <Icon name="Coins" size={14} />
                      Альткоины
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {groupedCrypto.altcoin.map((currency) => (
                        <Button
                          key={currency.symbol}
                          variant="outline"
                          className="justify-start gap-3 h-auto py-3"
                          onClick={() => handleSelect(currency)}
                        >
                          <span className="text-2xl">{currency.icon}</span>
                          <div className="text-left">
                            <p className="font-semibold">{currency.symbol}</p>
                            <p className="text-xs text-muted-foreground">{currency.name}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {groupedCrypto.defi.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                      <Icon name="TrendingUp" size={14} />
                      DeFi токены
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {groupedCrypto.defi.map((currency) => (
                        <Button
                          key={currency.symbol}
                          variant="outline"
                          className="justify-start gap-3 h-auto py-3"
                          onClick={() => handleSelect(currency)}
                        >
                          <span className="text-2xl">{currency.icon}</span>
                          <div className="text-left">
                            <p className="font-semibold">{currency.symbol}</p>
                            <p className="text-xs text-muted-foreground">{currency.name}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {groupedCrypto.new.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                      <Icon name="Sparkles" size={14} />
                      Новые проекты
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {groupedCrypto.new.map((currency) => (
                        <Button
                          key={currency.symbol}
                          variant="outline"
                          className="justify-start gap-3 h-auto py-3"
                          onClick={() => handleSelect(currency)}
                        >
                          <span className="text-2xl">{currency.icon}</span>
                          <div className="text-left">
                            <p className="font-semibold">{currency.symbol}</p>
                            <p className="text-xs text-muted-foreground">{currency.name}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {fiatCurrencies.map((currency) => (
                  <Button
                    key={currency.symbol}
                    variant="outline"
                    className="justify-start gap-3 h-auto py-3"
                    onClick={() => handleSelect(currency)}
                  >
                    <span className="text-2xl">{currency.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold">{currency.symbol}</p>
                      <p className="text-xs text-muted-foreground">{currency.name}</p>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencySelector;
