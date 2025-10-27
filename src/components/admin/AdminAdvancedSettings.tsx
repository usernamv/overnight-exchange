import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ADMIN_API_URL = 'https://functions.poehali.dev/d081ce90-f0f7-4af5-b43e-73f17edf6d7c';

interface Commission {
  id: number;
  from_currency: string;
  to_currency: string;
  commission_percent: number;
  min_commission: number;
  max_commission: number | null;
  is_active: boolean;
}

interface SiteContent {
  id: number;
  key: string;
  value: string;
  type: string;
  category: string;
  description: string;
  is_active: boolean;
}

interface RateSource {
  id: number;
  source_name: string;
  api_url: string;
  priority: number;
  is_active: boolean;
  rate_multiplier: number;
  cache_duration_seconds: number;
}

interface PaymentProvider {
  id: number;
  name: string;
  type: string;
  is_active: boolean;
  supported_currencies: string[];
  config: Record<string, any>;
}

const AdminAdvancedSettings = () => {
  const { toast } = useToast();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [rateSources, setRateSources] = useState<RateSource[]>([]);
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    try {
      const [commissionsRes, contentRes, rateSourcesRes, providersRes] = await Promise.all([
        fetch(`${ADMIN_API_URL}?resource=commissions`),
        fetch(`${ADMIN_API_URL}?resource=site_content`),
        fetch(`${ADMIN_API_URL}?resource=rate_sources`),
        fetch(`${ADMIN_API_URL}?resource=payment_providers`),
      ]);

      const commissionsData = await commissionsRes.json();
      const contentData = await contentRes.json();
      const rateSourcesData = await rateSourcesRes.json();
      const providersData = await providersRes.json();

      setCommissions(commissionsData.commissions || []);
      setSiteContent(contentData.content || []);
      setRateSources(rateSourcesData.rate_sources || []);
      setPaymentProviders(providersData.providers || []);
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить настройки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCommission = async (id: number, updates: Partial<Commission>) => {
    try {
      const response = await fetch(ADMIN_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'commission', id, ...updates }),
      });

      if (response.ok) {
        toast({ title: "Комиссия обновлена" });
        fetchAllSettings();
      }
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        variant: "destructive",
      });
    }
  };

  const updateSiteContent = async (id: number, value: string) => {
    try {
      const response = await fetch(ADMIN_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'site_content', id, value }),
      });

      if (response.ok) {
        toast({ title: "Контент обновлен" });
        fetchAllSettings();
      }
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        variant: "destructive",
      });
    }
  };

  const updateRateSource = async (id: number, updates: Partial<RateSource>) => {
    try {
      const response = await fetch(ADMIN_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'rate_source', id, ...updates }),
      });

      if (response.ok) {
        toast({ title: "Источник курсов обновлен" });
        fetchAllSettings();
      }
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        variant: "destructive",
      });
    }
  };

  const toggleProviderStatus = async (providerId: number, isActive: boolean) => {
    try {
      const response = await fetch(ADMIN_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resource: 'payment_provider', 
          provider_id: providerId, 
          is_active: isActive 
        }),
      });

      if (response.ok) {
        toast({ title: `Провайдер ${isActive ? 'включен' : 'выключен'}` });
        fetchAllSettings();
      }
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader2" className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Icon name="Settings" className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Расширенные настройки</h2>
      </div>

      <Tabs defaultValue="commissions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="commissions">
            <Icon name="Percent" className="h-4 w-4 mr-2" />
            Комиссии
          </TabsTrigger>
          <TabsTrigger value="content">
            <Icon name="FileText" className="h-4 w-4 mr-2" />
            Тексты и ссылки
          </TabsTrigger>
          <TabsTrigger value="rates">
            <Icon name="TrendingUp" className="h-4 w-4 mr-2" />
            Источники курсов
          </TabsTrigger>
          <TabsTrigger value="payments">
            <Icon name="CreditCard" className="h-4 w-4 mr-2" />
            Платежи
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commissions" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Настройка комиссий по валютным парам</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Из валюты</TableHead>
                  <TableHead>В валюту</TableHead>
                  <TableHead>Комиссия %</TableHead>
                  <TableHead>Мин. комиссия</TableHead>
                  <TableHead>Макс. комиссия</TableHead>
                  <TableHead>Активна</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell className="font-medium">{commission.from_currency}</TableCell>
                    <TableCell className="font-medium">{commission.to_currency}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={commission.commission_percent}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);
                          setCommissions(commissions.map(c => 
                            c.id === commission.id ? { ...c, commission_percent: newValue } : c
                          ));
                        }}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.00001"
                        value={commission.min_commission}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);
                          setCommissions(commissions.map(c => 
                            c.id === commission.id ? { ...c, min_commission: newValue } : c
                          ));
                        }}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.00001"
                        value={commission.max_commission || ''}
                        onChange={(e) => {
                          const newValue = e.target.value ? parseFloat(e.target.value) : null;
                          setCommissions(commissions.map(c => 
                            c.id === commission.id ? { ...c, max_commission: newValue } : c
                          ));
                        }}
                        className="w-24"
                        placeholder="∞"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={commission.is_active}
                        onCheckedChange={(checked) => {
                          setCommissions(commissions.map(c => 
                            c.id === commission.id ? { ...c, is_active: checked } : c
                          ));
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => updateCommission(commission.id, {
                          commission_percent: commission.commission_percent,
                          min_commission: commission.min_commission,
                          max_commission: commission.max_commission,
                          is_active: commission.is_active,
                        })}
                      >
                        <Icon name="Save" className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Редактирование текстов и ссылок на сайте</h3>
            <div className="space-y-6">
              {['hero', 'contact', 'footer', 'limits'].map((category) => (
                <div key={category}>
                  <h4 className="text-md font-semibold mb-3 capitalize">
                    {category === 'hero' && 'Главная страница'}
                    {category === 'contact' && 'Контакты'}
                    {category === 'footer' && 'Футер'}
                    {category === 'limits' && 'Лимиты'}
                  </h4>
                  <div className="grid gap-4">
                    {siteContent
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <div key={item.id} className="grid gap-2">
                          <Label htmlFor={`content-${item.id}`}>
                            {item.description || item.key}
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`content-${item.id}`}
                              value={item.value}
                              onChange={(e) => {
                                setSiteContent(siteContent.map(c => 
                                  c.id === item.id ? { ...c, value: e.target.value } : c
                                ));
                              }}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => updateSiteContent(item.id, item.value)}
                            >
                              <Icon name="Save" className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Источники курсов валют</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>API URL</TableHead>
                  <TableHead>Приоритет</TableHead>
                  <TableHead>Множитель</TableHead>
                  <TableHead>Кэш (сек)</TableHead>
                  <TableHead>Активен</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rateSources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">{source.source_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {source.api_url}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={source.priority}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          setRateSources(rateSources.map(s => 
                            s.id === source.id ? { ...s, priority: newValue } : s
                          ));
                        }}
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.000001"
                        value={source.rate_multiplier}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);
                          setRateSources(rateSources.map(s => 
                            s.id === source.id ? { ...s, rate_multiplier: newValue } : s
                          ));
                        }}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={source.cache_duration_seconds}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          setRateSources(rateSources.map(s => 
                            s.id === source.id ? { ...s, cache_duration_seconds: newValue } : s
                          ));
                        }}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={source.is_active}
                        onCheckedChange={(checked) => {
                          setRateSources(rateSources.map(s => 
                            s.id === source.id ? { ...s, is_active: checked } : s
                          ));
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => updateRateSource(source.id, {
                          priority: source.priority,
                          rate_multiplier: source.rate_multiplier,
                          cache_duration_seconds: source.cache_duration_seconds,
                          is_active: source.is_active,
                        })}
                      >
                        <Icon name="Save" className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Платежные провайдеры</h3>
            <div className="grid gap-4">
              {paymentProviders.map((provider) => (
                <Card key={provider.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{provider.name}</h4>
                      <p className="text-sm text-muted-foreground">Тип: {provider.type}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Поддерживаемые валюты: {provider.supported_currencies.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`provider-${provider.id}`}>
                          {provider.is_active ? 'Активен' : 'Отключен'}
                        </Label>
                        <Switch
                          id={`provider-${provider.id}`}
                          checked={provider.is_active}
                          onCheckedChange={(checked) => toggleProviderStatus(provider.id, checked)}
                        />
                      </div>
                      <Icon 
                        name={provider.is_active ? 'CheckCircle2' : 'XCircle'} 
                        className={`h-6 w-6 ${provider.is_active ? 'text-green-500' : 'text-gray-400'}`}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAdvancedSettings;
