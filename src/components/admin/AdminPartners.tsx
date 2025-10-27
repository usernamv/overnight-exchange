import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const PARTNERS_API_URL = 'https://functions.poehali.dev/cb22a964-580b-490f-a97e-6a94308c6580';

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
  description: string;
  is_active: boolean;
  display_order: number;
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newPartner, setNewPartner] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    display_order: 0,
  });

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const response = await fetch(`${PARTNERS_API_URL}?action=list_partners`);
      const data = await response.json();
      setPartners(data.partners || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить партнёров',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPartner = async () => {
    try {
      const response = await fetch(PARTNERS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_partner',
          ...newPartner,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Партнёр добавлен',
        });
        setIsAddDialogOpen(false);
        setNewPartner({ name: '', logo_url: '', website_url: '', description: '', display_order: 0 });
        loadPartners();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить партнёра',
        variant: 'destructive',
      });
    }
  };

  const togglePartner = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(PARTNERS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_partner',
          partner_id: id,
          is_active: !isActive,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Статус партнёра обновлён',
        });
        loadPartners();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };

  const deletePartner = async (id: number) => {
    if (!confirm('Удалить партнёра?')) return;

    try {
      const response = await fetch(PARTNERS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_partner',
          partner_id: id,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Партнёр удалён',
        });
        loadPartners();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить партнёра',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Управление партнёрами</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Добавляйте и управляйте партнёрами платформы
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить партнёра
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Добавить нового партнёра</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="Название компании"
                />
              </div>
              <div className="space-y-2">
                <Label>URL логотипа</Label>
                <Input
                  value={newPartner.logo_url}
                  onChange={(e) => setNewPartner({ ...newPartner, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label>URL сайта</Label>
                <Input
                  value={newPartner.website_url}
                  onChange={(e) => setNewPartner({ ...newPartner, website_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={newPartner.description}
                  onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
                  placeholder="Краткое описание партнёра"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Порядок отображения</Label>
                <Input
                  type="number"
                  value={newPartner.display_order}
                  onChange={(e) => setNewPartner({ ...newPartner, display_order: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={handleAddPartner} className="w-full">
                Добавить партнёра
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {partners.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Партнёры ещё не добавлены</p>
          <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            Добавить первого партнёра
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Логотип</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Сайт</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Порядок</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    {partner.logo_url ? (
                      <img 
                        src={partner.logo_url} 
                        alt={partner.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <Icon name="Image" size={24} className="text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">{partner.name}</TableCell>
                  <TableCell>
                    {partner.website_url && (
                      <a 
                        href={partner.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Icon name="ExternalLink" size={14} />
                        Сайт
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {partner.description}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-muted rounded text-xs">
                      {partner.display_order}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={partner.is_active}
                      onCheckedChange={() => togglePartner(partner.id, partner.is_active)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deletePartner(partner.id)}
                      >
                        <Icon name="Trash2" size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">Всего партнёров: {partners.length}</p>
            <p className="text-xs text-muted-foreground">
              Активных: {partners.filter(p => p.is_active).length} • 
              Неактивных: {partners.filter(p => !p.is_active).length}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
