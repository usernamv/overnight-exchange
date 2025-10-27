# 🌙 Overnight Exchange - Платформа обмена криптовалют

Быстрый и безопасный обмен криптовалют 24/7 по лучшим курсам.

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)](https://netlify.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Установите зависимости
npm install

# Запустите dev сервер
npm run dev

# Откройте в браузере
http://localhost:5173
```

### Деплой (бесплатно)

#### Vercel (рекомендуется)
```bash
# Установите Vercel CLI
npm i -g vercel

# Разверните проект
vercel
```

#### Netlify
```bash
# Установите Netlify CLI
npm i -g netlify-cli

# Разверните проект
netlify deploy --prod
```

---

## 📋 Технологии

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик
- **Tailwind CSS** - Стили
- **Shadcn/ui** - UI компоненты
- **Lucide React** - Иконки

### Backend (Cloud Functions)
- **PostgreSQL** - База данных
- **Cloud Functions** - Serverless API

### Инструменты
- **ESLint** - Линтер
- **React Router** - Роутинг
- **React Hook Form** - Формы
- **Zod** - Валидация

---

## 📂 Структура проекта

```
overnight-exchange-design/
├── src/
│   ├── components/
│   │   ├── home/              # Компоненты главной страницы
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ExchangeCalculator.tsx
│   │   │   ├── CryptoRatesSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AdminLoginModal.tsx
│   │   └── ui/                # UI компоненты (shadcn/ui)
│   ├── hooks/                 # Custom hooks
│   │   ├── useExchangeCalculator.ts
│   │   ├── useExchangeSubmit.ts
│   │   └── useAdminLogin.ts
│   ├── pages/                 # Страницы
│   │   └── Index.tsx
│   ├── contexts/              # React контексты
│   ├── data/                  # Статические данные
│   ├── utils/                 # Утилиты
│   └── App.tsx                # Главный компонент
├── backend/                   # Cloud Functions
├── docs/                      # Документация
│   ├── COMPONENTS-STRUCTURE.md
│   └── LOCAL-DEVELOPMENT.md
└── public/                    # Статические файлы
```

---

## 🎯 Функциональность

### ✅ Реализовано

- [x] Главная страница с калькулятором обмена
- [x] Отображение актуальных курсов криптовалют
- [x] Система аутентификации (пользователи и админы)
- [x] Админ-панель для управления обменами
- [x] Интеграция с Telegram для уведомлений
- [x] Адаптивный дизайн (mobile-first)
- [x] Темная тема
- [x] FAQ секция
- [x] Футер с контактами

### 🔄 В разработке

- [ ] История обменов пользователя
- [ ] Верификация KYC/AML
- [ ] Поддержка большего количества криптовалют
- [ ] Мультиязычность (i18n)

---

## 🔧 Доступные команды

```bash
# Разработка
npm run dev              # Запустить dev сервер на http://localhost:5173

# Сборка
npm run build            # Собрать проект для продакшена

# Предпросмотр
npm run preview          # Предпросмотр продакшен сборки

# Проверка кода
npm run lint             # Проверить код на ошибки
```

---

## 📖 Документация

### Для пользователей:
- [Локальная разработка и деплой](LOCAL-DEVELOPMENT.md)
- [Структура компонентов](COMPONENTS-STRUCTURE.md)

### Для разработчиков:
- **Компоненты**: Все компоненты находятся в `src/components/`
- **Hooks**: Custom hooks в `src/hooks/`
- **Стили**: Tailwind CSS с кастомной темой в `tailwind.config.ts`
- **API**: Cloud Functions в `backend/`

---

## 🌐 Деплой

### Автоматический деплой (рекомендуется)

1. **Подключите GitHub** в poehali.dev
2. **Выберите платформу:**
   - [Vercel](https://vercel.com) - лучший для React
   - [Netlify](https://netlify.com) - альтернатива
   - [Cloudflare Pages](https://pages.cloudflare.com) - CDN
3. **Импортируйте репозиторий**
4. **Готово!** Автоматическое обновление при каждом коммите

### Ручной деплой

#### Vercel
```bash
npm i -g vercel
vercel --prod
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

#### GitHub Pages
```bash
npm run build
npm run deploy
```

Подробнее: [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md)

---

## 🛠️ Оптимизации

### React.memo
Статические компоненты обернуты в `React.memo` для оптимизации рендеринга:
- `HeroSection`
- `FeaturesSection`
- `FAQSection`
- `Footer`

### Custom Hooks
Бизнес-логика вынесена в custom hooks:
- `useExchangeCalculator` - калькуляция обмена
- `useExchangeSubmit` - отправка обмена
- `useAdminLogin` - логика входа администратора

### Code Splitting
Автоматическое разделение кода с помощью Vite.

---

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта!

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

## 📝 Лицензия

Этот проект распространяется под лицензией MIT.

---

## 📞 Поддержка

### Сообщество
- **Telegram**: https://t.me/+QgiLIa1gFRY4Y2Iy

### Документация
- **poehali.dev docs**: https://docs.poehali.dev/

### Контакты
- **Email**: support@overnight.exchange
- **Telegram**: [@poehalidev](https://t.me/poehalidev)

---

## 🌟 Особенности

### 🎨 Дизайн
- **Темная тема** с градиентами
- **Адаптивный дизайн** для всех устройств
- **Плавные анимации** и эффекты свечения
- **Современный UI** с shadcn/ui

### 🔒 Безопасность
- **AML/KYC** проверки
- **Шифрование данных**
- **Защита от мошенничества**

### ⚡ Производительность
- **React.memo** для оптимизации
- **Code splitting** для быстрой загрузки
- **Lazy loading** изображений
- **CDN** для статики

### 🚀 Разработка
- **TypeScript** для типобезопасности
- **ESLint** для качества кода
- **Hot Reload** для быстрой разработки
- **Модульная архитектура**

---

## 📊 Статистика проекта

- **Компоненты**: 8 основных + UI библиотека
- **Custom Hooks**: 3
- **Страницы**: 4 (Index, Admin, Help, Cabinet)
- **Строк кода**: ~2000
- **Размер бандла**: ~150 KB (gzip)

---

**Создано с помощью [poehali.dev](https://poehali.dev) 🚀**
