# 📦 Экспорт проекта и работа с GitHub

## 🎯 Три способа получить код проекта

### 1. **Скачать из poehali.dev** (самый простой)
### 2. **Подключить GitHub** (рекомендуется)
### 3. **Экспорт статического HTML** (для простого хостинга)

---

## 📥 Способ 1: Скачать из poehali.dev

### Скачать исходный код:
1. В редакторе poehali.dev нажмите **Скачать → Скачать код**
2. Получите ZIP архив со всеми файлами
3. Распакуйте в удобное место

**Что внутри:**
```
overnight-exchange/
├── src/              # Исходный код React
├── public/           # Статические файлы
├── backend/          # Backend функции (пустая папка)
├── docs/             # Документация
├── package.json      # Зависимости
├── vite.config.ts    # Конфигурация Vite
└── README.md         # Описание проекта
```

### Скачать готовый билд:
1. **Скачать → Скачать билд**
2. Получите готовые статические файлы
3. Можно сразу залить на любой хостинг

**Что внутри:**
```
dist/
├── index.html        # Главная страница
├── assets/           # CSS, JS, изображения
└── favicon.ico       # Иконка сайта
```

---

## 🔗 Способ 2: Подключить GitHub (рекомендуется)

### Преимущества:
- ✅ Автоматическая синхронизация кода
- ✅ История изменений (Git)
- ✅ Легкое развертывание на Vercel/Netlify
- ✅ Совместная работа
- ✅ Backup вашего кода

### Шаг 1: Подключите GitHub

В poehali.dev:
1. Нажмите **Скачать → Подключить GitHub**
2. Войдите в аккаунт GitHub
3. Выберите **Все репозитории** или конкретные
4. Подтвердите доступ

### Шаг 2: Выберите аккаунт
1. Вернитесь в poehali.dev
2. **GitHub → Выберите аккаунт**
3. Код автоматически создаст новый репозиторий

### Шаг 3: Проверьте GitHub
Зайдите на GitHub.com — там появился репозиторий `overnight-exchange`!

**Структура репозитория:**
```
github.com/ваш-username/overnight-exchange
├── main (branch)
└── Все файлы проекта
```

---

## 🔄 Работа с GitHub репозиторием

### Клонирование на компьютер:

**Windows (PowerShell):**
```bash
# Клонируйте репозиторий
git clone https://github.com/ваш-username/overnight-exchange.git
cd overnight-exchange

# Установите зависимости
npm install

# Запустите проект
npm run dev
```

**Linux/Mac:**
```bash
git clone https://github.com/ваш-username/overnight-exchange.git
cd overnight-exchange
npm install
npm run dev
```

### Внесение изменений:

```bash
# Создайте новую ветку
git checkout -b feature/my-changes

# Внесите изменения в код
# ...

# Зафиксируйте изменения
git add .
git commit -m "Add my awesome feature"

# Отправьте на GitHub
git push origin feature/my-changes
```

### Создание Pull Request:
1. Зайдите на GitHub.com
2. Ваш репозиторий → Pull Requests → New
3. Выберите ветку `feature/my-changes`
4. Create Pull Request
5. Merge после проверки

---

## 🌐 Развертывание с GitHub

### Vercel (30 секунд):

1. https://vercel.com/new
2. **Import Git Repository**
3. Выберите `overnight-exchange`
4. Deploy

**Автоматическое развертывание:**
- Каждый push в `main` → автодеплой
- Preview для Pull Requests
- Environment Variables в настройках

### Netlify:

1. https://app.netlify.com/start
2. **Import from Git → GitHub**
3. Выберите репозиторий
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy

### GitHub Pages:

Создайте `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - run: npm install
    - run: npm run build
    
    - name: Deploy
      uses: JamesIves/github-pages-deploy-action@v4
      with:
        folder: dist
```

Settings → Pages → Source: `gh-pages`

**URL:** `https://ваш-username.github.io/overnight-exchange`

---

## 📤 Способ 3: Экспорт статического билда

### Для чего:
- Загрузка на shared хостинг (Beget, Timeweb)
- Простой веб-сервер (Apache, Nginx)
- CDN (CloudFlare, BunnyCDN)

### Получение билда:

**Вариант А: Через poehali.dev**
1. **Скачать → Скачать билд**
2. Получите `dist.zip`

**Вариант Б: Локальная сборка**
```bash
# В папке проекта
npm run build

# Готовые файлы в папке dist/
```

### Загрузка на хостинг:

**Через FTP:**
1. Подключитесь к хостингу (FileZilla, Total Commander)
2. Перейдите в `public_html/` или `www/`
3. Загрузите все файлы из `dist/`
4. Готово!

**Через cPanel:**
1. Файловый менеджер → `public_html`
2. Загрузить → выберите файлы из `dist/`
3. Распакуйте (если загрузили ZIP)

---

## 🔧 Настройка после экспорта

### Обновление API URLs:

Если используете свои backend функции, измените в коде:

**src/pages/Index.tsx:**
```typescript
const EXCHANGE_API_URL = 'https://your-api.com/exchange';
```

**src/pages/Dashboard.tsx:**
```typescript
const EXCHANGE_API_URL = 'https://your-api.com/exchange';
const KYC_AML_API_URL = 'https://your-api.com/kyc';
```

**src/components/admin/AdminDashboard.tsx:**
```typescript
const ADMIN_API_URL = 'https://your-api.com/admin';
```

После изменений:
```bash
npm run build  # пересоберите проект
```

### Environment Variables:

Создайте `.env`:
```env
VITE_API_BASE_URL=https://your-api.com
VITE_TELEGRAM_BOT_TOKEN=your_token
VITE_TELEGRAM_ADMIN_CHAT_ID=your_chat_id
```

В коде используйте:
```typescript
const API_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## 📊 Сравнение способов:

| Способ | Скорость | Гибкость | Git | Автодеплой |
|--------|----------|----------|-----|------------|
| Скачать ZIP | ⚡⚡⚡ | ⭐⭐ | ❌ | ❌ |
| GitHub интеграция | ⚡⚡ | ⭐⭐⭐ | ✅ | ✅ |
| Статический билд | ⚡⚡⚡ | ⭐ | ❌ | ❌ |

---

## 🎯 Рекомендации:

### Для разработки:
- ✅ **GitHub интеграция** — версионирование + backup

### Для простого сайта:
- ✅ **Статический билд** → shared хостинг

### Для production:
- ✅ **GitHub** → Vercel/Netlify (автодеплой)

---

## 🐛 Частые проблемы:

### GitHub не синхронизируется
**Решение:**
1. Отключите интеграцию в poehali.dev
2. Удалите репозиторий на GitHub
3. Подключите заново

### Файлы не загружаются на хостинг
**Решение:**
- Проверьте права доступа (644 для файлов, 755 для папок)
- Убедитесь, что загружаете в `public_html/` или `www/`

### 404 ошибка на Netlify/Vercel
**Решение:**
Создайте `public/_redirects`:
```
/*    /index.html   200
```

Или `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📚 Дополнительные ресурсы:

- **GitHub Docs:** https://docs.github.com
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Git Tutorial:** https://git-scm.com/docs/gittutorial

---

## ✅ Чеклист перед развертыванием:

- [ ] Смените пароль администратора
- [ ] Обновите API URLs (если нужно)
- [ ] Добавьте Environment Variables
- [ ] Протестируйте локально (`npm run dev`)
- [ ] Соберите проект (`npm run build`)
- [ ] Проверьте билд локально (`npm run preview`)
- [ ] Разверните на хостинг
- [ ] Проверьте все функции на live сайте
- [ ] Настройте домен (если есть)
- [ ] Настройте SSL (HTTPS)

---

**Готово! Ваш код экспортирован и готов к развертыванию! 🚀**

Нужна помощь? 
- Telegram: @poehalidev
- Email: support@overnight.exchange
