import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const ADMIN_API_URL = 'https://functions.poehali.dev/d081ce90-f0f7-4af5-b43e-73f17edf6d7c';

interface RateSource {
  id: number;
  name: string;
  api_url: string;
  api_key_required: boolean;
  is_active: boolean;
  priority: number;
}

interface Sponsor {
  id: number;
  name: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

const AdminRates = () => {
  const { toast } = useToast();
  const [rateSources, setRateSources] = useState<RateSource[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRateSources();
    loadSponsors();
  }, []);

  const loadRateSources = async () => {
    try {
      const res = await fetch(`${ADMIN_API_URL}?resource=rate_sources`);
      const data = await res.json();
      setRateSources(data.rate_sources);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить источники курсов',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSponsors = async () => {
    try {
      const res = await fetch(`${ADMIN_API_URL}?resource=sponsors`);
      const data = await res.json();
      setSponsors(data.sponsors);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить спонсоров',
        variant: 'destructive',
      });
    }
  };

  const createRateSource = async (source: Partial<RateSource>) => {
    try {
      await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'rate_source', ...source }),
      });
      loadRateSources();
      toast({ title: 'Успешно', description: 'Источник добавлен' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить источник', variant: 'destructive' });
    }
  };

  const updateRateSource = async (source: RateSource) => {
    try {
      await fetch(ADMIN_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'rate_source', ...source }),
      });
      loadRateSources();
      toast({ title: 'Успешно', description: 'Источник обновлен' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить источник', variant: 'destructive' });
    }
  };

  const deleteRateSource = async (id: number) => {
    try {
      await fetch(`${ADMIN_API_URL}?resource=rate_source&id=${id}`, {
        method: 'DELETE',
      });
      loadRateSources();
      toast({ title: 'Успешно', description: 'Источник удален' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить источник', variant: 'destructive' });
    }
  };

  const createSponsor = async (sponsor: Partial<Sponsor>) => {
    try {
      await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'sponsor', ...sponsor }),
      });
      loadSponsors();
      toast({ title: 'Успешно', description: 'Спонсор добавлен' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить спонсора', variant: 'destructive' });
    }
  };

  const updateSponsor = async (sponsor: Sponsor) => {
    try {
      await fetch(ADMIN_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'sponsor', ...sponsor }),
      });
      loadSponsors();
      toast({ title: 'Успешно', description: 'Спонсор обновлен' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить спонсора', variant: 'destructive' });
    }
  };

  const deleteSponsor = async (id: number) => {
    try {
      await fetch(`${ADMIN_API_URL}?resource=sponsor&id=${id}`, {
        method: 'DELETE',
      });
      loadSponsors();
      toast({ title: 'Успешно', description: 'Спонсор удален' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить спонсора', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Источники курсов</h3>
          <RateSourceDialog onSave={createRateSource} />
        </div>

        <div className="space-y-4">
          {rateSources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-lg">{source.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-xs ${source.is_active ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'}`}>
                    {source.is_active ? 'Активен' : 'Отключен'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                    Приоритет: {source.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{source.api_url}</p>
                {source.api_key_required && (
                  <p className="text-xs text-yellow-400 mt-1">Требуется API ключ</p>
                )}
              </div>
              <div className="flex gap-2">
                <RateSourceDialog source={source} onSave={updateRateSource} />
                <Button variant="destructive" size="sm" onClick={() => deleteRateSource(source.id)}>
                  <Icon name="Trash" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Спонсоры</h3>
          <SponsorDialog onSave={createSponsor} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {sponsor.logo_url ? (
                    <img src={sponsor.logo_url} alt={sponsor.name} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                      <Icon name="Building" size={24} />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold">{sponsor.name}</h4>
                    <span className={`text-xs ${sponsor.is_active ? 'text-green-400' : 'text-gray-400'}`}>
                      {sponsor.is_active ? 'Активен' : 'Отключен'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <SponsorDialog sponsor={sponsor} onSave={updateSponsor} />
                  <Button variant="destructive" size="sm" onClick={() => deleteSponsor(sponsor.id)}>
                    <Icon name="Trash" size={16} />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{sponsor.description}</p>
              {sponsor.website_url && (
                <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  {sponsor.website_url}
                </a>
              )}
            </div>
          ))}
          {sponsors.length === 0 && (
            <p className="col-span-2 text-center py-8 text-muted-foreground">Нет спонсоров</p>
          )}
        </div>
      </Card>
    </div>
  );
};

function RateSourceDialog({ source, onSave }: { source?: RateSource; onSave: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<RateSource>>(
    source || { name: '', api_url: '', api_key_required: false, is_active: true, priority: 1 }
  );

  const handleSubmit = () => {
    onSave(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Icon name={source ? 'Edit' : 'Plus'} size={16} className="mr-2" />
          {source ? 'Изменить' : 'Добавить источник'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{source ? 'Редактировать источник' : 'Новый источник'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Название</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label>API URL</Label>
            <Input
              value={formData.api_url}
              onChange={(e) => setFormData({ ...formData, api_url: e.target.value })}
            />
          </div>
          <div>
            <Label>Приоритет</Label>
            <Input
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Требуется API ключ</Label>
            <Switch
              checked={formData.api_key_required}
              onCheckedChange={(checked) => setFormData({ ...formData, api_key_required: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Активен</Label>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SponsorDialog({ sponsor, onSave }: { sponsor?: Sponsor; onSave: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Sponsor>>(
    sponsor || { name: '', logo_url: '', website_url: '', description: '', is_active: true, display_order: 0 }
  );

  const handleSubmit = () => {
    onSave(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Icon name={sponsor ? 'Edit' : 'Plus'} size={16} className="mr-2" />
          {sponsor ? 'Изменить' : 'Добавить спонсора'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sponsor ? 'Редактировать спонсора' : 'Новый спонсор'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Название</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label>URL логотипа</Label>
            <Input
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            />
          </div>
          <div>
            <Label>Веб-сайт</Label>
            <Input
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            />
          </div>
          <div>
            <Label>Описание</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Порядок отображения</Label>
            <Input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Активен</Label>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminRates;
