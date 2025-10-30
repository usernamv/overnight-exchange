import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const KYC_AML_API_URL = 'https://functions.poehali.dev/4f24f2ad-e009-45ce-9f47-ee953647179a';

interface KYCLevel {
  level: number;
  name: string;
  description: string;
  limits: {
    daily: string;
    monthly: string;
  };
  requirements: string[];
  status: 'not_started' | 'pending' | 'verified' | 'rejected';
}

interface KYCVerificationProps {
  clientId: string;
  onUpdate?: () => void;
}

export default function KYCVerification({ clientId, onUpdate }: KYCVerificationProps) {
  const { toast } = useToast();
  const [activeLevel, setActiveLevel] = useState(1);
  const [uploading, setUploading] = useState(false);

  const levels: KYCLevel[] = [
    {
      level: 1,
      name: 'Базовая',
      description: 'Email и телефон',
      limits: {
        daily: '$1,000',
        monthly: '$10,000',
      },
      requirements: [
        'Подтверждённый email',
        'Номер телефона',
        'Двухфакторная аутентификация (2FA)',
      ],
      status: 'verified',
    },
    {
      level: 2,
      name: 'Стандартная',
      description: 'Личные данные',
      limits: {
        daily: '$50,000',
        monthly: '$500,000',
      },
      requirements: [
        'ФИО',
        'Дата рождения',
        'Страна проживания',
        'Адрес',
        'Фото паспорта (разворот с фото)',
      ],
      status: 'not_started',
    },
    {
      level: 3,
      name: 'Расширенная',
      description: 'Полная верификация',
      limits: {
        daily: 'Без лимита',
        monthly: 'Без лимита',
      },
      requirements: [
        'Паспорт (все страницы)',
        'Селфи с паспортом',
        'Proof of Address (счёт за коммунальные услуги)',
        'Источник дохода',
        'Видеозвонок с поддержкой',
      ],
      status: 'not_started',
    },
  ];

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    country: '',
    address: '',
    city: '',
    postal_code: '',
    document_type: 'passport',
    document_number: '',
    selfie_url: '',
    document_front_url: '',
    document_back_url: '',
    proof_of_address_url: '',
  });

  const handleFileUpload = async (field: string, file: File) => {
    setUploading(true);
    try {
      // Здесь будет загрузка файла на S3 или другое хранилище
      const formData = new FormData();
      formData.append('file', file);
      
      // Временно сохраняем как base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: reader.result as string,
        }));
        toast({
          title: 'Файл загружен',
          description: `${file.name} успешно загружен`,
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить файл',
        variant: 'destructive',
      });
      setUploading(false);
    }
  };

  const submitKYC = async (level: number) => {
    setUploading(true);
    try {
      const response = await fetch(KYC_AML_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_kyc',
          client_id: clientId,
          level,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Заявка отправлена',
          description: 'Мы проверим ваши документы в течение 1-3 рабочих дней',
        });
        if (onUpdate) onUpdate();
      } else {
        throw new Error(data.error || 'Ошибка отправки');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const renderLevelCard = (level: KYCLevel) => {
    const isActive = activeLevel === level.level;
    const isCompleted = level.status === 'verified';
    const isPending = level.status === 'pending';
    const isRejected = level.status === 'rejected';

    return (
      <Card
        key={level.level}
        className={`p-6 cursor-pointer transition-all ${
          isActive ? 'border-primary shadow-lg' : 'border-border/40'
        } ${isCompleted ? 'bg-green-500/5' : ''}`}
        onClick={() => setActiveLevel(level.level)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCompleted
                  ? 'bg-green-500/20'
                  : isPending
                  ? 'bg-yellow-500/20'
                  : isRejected
                  ? 'bg-red-500/20'
                  : 'bg-primary/10'
              }`}
            >
              {isCompleted ? (
                <Icon name="CheckCircle" size={24} className="text-green-400" />
              ) : isPending ? (
                <Icon name="Clock" size={24} className="text-yellow-400" />
              ) : isRejected ? (
                <Icon name="XCircle" size={24} className="text-red-400" />
              ) : (
                <Icon name="Shield" size={24} className="text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">Уровень {level.level}</h3>
              <p className="text-sm text-muted-foreground">{level.name}</p>
            </div>
          </div>
          {isCompleted && (
            <div className="px-3 py-1 bg-green-500/20 rounded-full">
              <span className="text-xs text-green-400 font-medium">Подтверждён</span>
            </div>
          )}
          {isPending && (
            <div className="px-3 py-1 bg-yellow-500/20 rounded-full">
              <span className="text-xs text-yellow-400 font-medium">На проверке</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Лимиты</p>
            <div className="flex gap-4">
              <div>
                <p className="text-sm font-semibold">{level.limits.daily}</p>
                <p className="text-xs text-muted-foreground">в день</p>
              </div>
              <div>
                <p className="text-sm font-semibold">{level.limits.monthly}</p>
                <p className="text-xs text-muted-foreground">в месяц</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Требования:</p>
            <ul className="space-y-1">
              {level.requirements.map((req, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Icon name="Check" size={14} className="text-green-400" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    );
  };

  const renderForm = () => {
    const level = levels.find(l => l.level === activeLevel);
    if (!level || level.status === 'verified') {
      return (
        <Card className="p-8 text-center">
          <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-green-400" />
          <h3 className="text-xl font-bold mb-2">Уровень {activeLevel} подтверждён</h3>
          <p className="text-muted-foreground">
            Ваша верификация успешно пройдена
          </p>
        </Card>
      );
    }

    if (level.status === 'pending') {
      return (
        <Card className="p-8 text-center">
          <Icon name="Clock" size={48} className="mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl font-bold mb-2">Документы на проверке</h3>
          <p className="text-muted-foreground">
            Мы проверим ваши документы в течение 1-3 рабочих дней
          </p>
        </Card>
      );
    }

    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">
          Верификация - Уровень {activeLevel}
        </h3>

        {activeLevel === 2 && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ФИО *</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Иванов Иван Иванович"
                />
              </div>
              <div className="space-y-2">
                <Label>Дата рождения *</Label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Страна *</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Россия"
                />
              </div>
              <div className="space-y-2">
                <Label>Город *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Москва"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Адрес *</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="ул. Ленина, д. 1, кв. 1"
              />
            </div>

            <div className="space-y-2">
              <Label>Номер паспорта *</Label>
              <Input
                value={formData.document_number}
                onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                placeholder="1234 567890"
              />
            </div>

            <div className="space-y-2">
              <Label>Фото паспорта (разворот с фото) *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('document_front_url', file);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Загрузите чёткое фото разворота паспорта с вашей фотографией
              </p>
            </div>

            <Button
              onClick={() => submitKYC(2)}
              disabled={uploading}
              className="w-full"
              size="lg"
            >
              {uploading ? 'Отправка...' : 'Отправить на проверку'}
            </Button>
          </div>
        )}

        {activeLevel === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Все страницы паспорта *</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('document_back_url', file);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Селфи с паспортом *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('selfie_url', file);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Сделайте фото, держа паспорт рядом с лицом
              </p>
            </div>

            <div className="space-y-2">
              <Label>Proof of Address *</Label>
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('proof_of_address_url', file);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Счёт за коммунальные услуги не старше 3 месяцев
              </p>
            </div>

            <Button
              onClick={() => submitKYC(3)}
              disabled={uploading}
              className="w-full"
              size="lg"
            >
              {uploading ? 'Отправка...' : 'Отправить на проверку'}
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">KYC Верификация</h2>
        <p className="text-muted-foreground">
          Пройдите верификацию для увеличения лимитов обмена
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {levels.map(level => renderLevelCard(level))}
      </div>

      {renderForm()}
    </div>
  );
}
