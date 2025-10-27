# 💻 Запуск на Windows (Бесплатно)

## 🎯 Три способа запустить проект на Windows

### 1. **Локальный запуск** (для разработки) — 100% бесплатно
### 2. **Бесплатный хостинг** (Vercel, Netlify) — 100% бесплатно
### 3. **VPS сервер** (Oracle Cloud) — 100% бесплатно навсегда

---

## 🚀 Способ 1: Локальный запуск (для разработки)

### Что нужно установить:

#### Шаг 1: Установите Node.js
1. Скачайте **Node.js 18+** с https://nodejs.org/
2. Выберите **LTS версию** (рекомендуется)
3. Запустите установщик
4. Нажимайте "Next" везде (оставляйте галочки по умолчанию)
5. Дождитесь завершения установки

**Проверка:**
Откройте **CMD** (Win+R → `cmd` → Enter):
```bash
node --version
npm --version
```

Должно показать версии (например: `v20.10.0` и `10.2.3`)

---

#### Шаг 2: Установите Git
1. Скачайте **Git** с https://git-scm.com/download/win
2. Запустите установщик
3. Везде оставляйте настройки по умолчанию
4. Установите

**Проверка:**
```bash
git --version
```

---

#### Шаг 3: Скачайте проект

**Вариант А: Через Git (рекомендуется)**
1. Откройте **PowerShell** или **Git Bash**
2. Перейдите в нужную папку:
```bash
cd C:\Projects
```
3. Клонируйте репозиторий:
```bash
git clone https://github.com/ваш-username/overnight-exchange.git
cd overnight-exchange
```

**Вариант Б: Скачать ZIP**
1. На странице GitHub нажмите **Code → Download ZIP**
2. Распакуйте архив в `C:\Projects\overnight-exchange`
3. Откройте папку в PowerShell:
```bash
cd C:\Projects\overnight-exchange
```

---

#### Шаг 4: Установите зависимости
```bash
npm install
```

Или используйте **Bun** (быстрее):
```bash
# Установка Bun
powershell -c "irm bun.sh/install.ps1 | iex"

# Установка зависимостей
bun install
```

---

#### Шаг 5: Настройте переменные окружения

Создайте файл `.env` в корне проекта:
```bash
notepad .env
```

Вставьте:
```env
# API URLs (замените на ваши)
VITE_EXCHANGE_API_URL=https://functions.poehali.dev/YOUR_FUNCTION_ID
VITE_ADMIN_API_URL=https://functions.poehali.dev/YOUR_FUNCTION_ID
VITE_KYC_AML_API_URL=https://functions.poehali.dev/YOUR_FUNCTION_ID

# Telegram (опционально)
VITE_TELEGRAM_BOT_TOKEN=ваш_токен_бота
VITE_TELEGRAM_ADMIN_CHAT_ID=ваш_chat_id
```

Сохраните: `Ctrl+S` → закройте Notepad

---

#### Шаг 6: Запустите проект
```bash
npm run dev
```

Или с Bun:
```bash
bun dev
```

**Готово!** Откройте браузер: http://localhost:5173

---

### Возможные проблемы:

#### Ошибка: "npm не является внутренней командой"
**Решение:**
1. Переустановите Node.js
2. Перезагрузите компьютер
3. Откройте новый терминал

#### Ошибка: "EACCES: permission denied"
**Решение:**
Запустите PowerShell от администратора:
- Win+X → "Windows PowerShell (Администратор)"

#### Порт 5173 занят
**Решение:**
```bash
# Измените порт в vite.config.ts
export default defineConfig({
  server: {
    port: 3000, // новый порт
  },
});
```

---

## 🌐 Способ 2: Бесплатный хостинг

### A. Vercel (рекомендуется)

#### Подготовка:
1. Зарегистрируйтесь на https://vercel.com (через GitHub)
2. Установите Vercel CLI:
```bash
npm install -g vercel
```

#### Развертывание:
```bash
# В папке проекта
vercel login
vercel
```

Следуйте инструкциям в терминале:
1. Setup and deploy? **Y**
2. Which scope? Выберите ваш аккаунт
3. Link to existing project? **N**
4. What's your project's name? `overnight-exchange`
5. In which directory is your code located? `./`
6. Want to override settings? **N**

**Готово!** Vercel даст вам URL: `https://overnight-exchange.vercel.app`

#### Добавление переменных окружения:
```bash
vercel env add VITE_TELEGRAM_BOT_TOKEN
# Введите значение

vercel env add VITE_TELEGRAM_ADMIN_CHAT_ID
# Введите значение
```

Или через веб-интерфейс:
1. https://vercel.com/dashboard
2. Ваш проект → Settings → Environment Variables

#### Повторное развертывание:
```bash
# После изменений в коде
vercel --prod
```

---

### B. Netlify

#### Подготовка:
1. Зарегистрируйтесь на https://netlify.com
2. Установите Netlify CLI:
```bash
npm install -g netlify-cli
```

#### Развертывание:
```bash
# Сборка проекта
npm run build

# Вход в Netlify
netlify login

# Развертывание
netlify deploy --prod
```

Следуйте инструкциям:
1. Create & configure new site? **Y**
2. Team: Выберите ваш аккаунт
3. Site name: `overnight-exchange`
4. Publish directory: `./dist`

**Готово!** URL: `https://overnight-exchange.netlify.app`

---

### C. GitHub Pages (бесплатно, но требует настройки)

#### Настройка:
1. Создайте репозиторий на GitHub
2. Добавьте файл `.github/workflows/deploy.yml`:

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
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
      env:
        VITE_TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
        VITE_TELEGRAM_ADMIN_CHAT_ID: ${{ secrets.TELEGRAM_ADMIN_CHAT_ID }}
    
    - name: Deploy
      uses: JamesIves/github-pages-deploy-action@v4
      with:
        folder: dist
        branch: gh-pages
```

3. Settings → Pages → Source: `gh-pages` branch
4. Добавьте секреты в Settings → Secrets → Actions

**URL:** `https://ваш-username.github.io/overnight-exchange`

---

## ☁️ Способ 3: Oracle Cloud (VPS бесплатно навсегда)

### Преимущества:
- ✅ **Бесплатно навсегда** (Always Free Tier)
- ✅ 2 виртуальных машины
- ✅ 200 GB объема диска
- ✅ 10 TB трафика в месяц
- ✅ Публичный IP

### Регистрация:

1. Перейдите на https://oracle.com/cloud/free
2. Нажмите **Start for free**
3. Заполните форму:
   - Имя, email, страна
   - Номер телефона (для подтверждения)
   - Карта (не списывается, но нужна для проверки)
4. Подтвердите email
5. Дождитесь активации аккаунта (5-10 минут)

---

### Создание сервера:

#### Шаг 1: Создайте VM Instance
1. Войдите в Oracle Cloud Console
2. **Compute → Instances → Create Instance**
3. Настройки:
   - **Name:** `overnight-exchange`
   - **Image:** Ubuntu 22.04 (Always Free eligible)
   - **Shape:** VM.Standard.E2.1.Micro (Always Free)
   - **Add SSH keys:** Generate или загрузите свой
4. Скачайте приватный ключ (`.key` файл)
5. Нажмите **Create**

#### Шаг 2: Настройте Firewall
1. Instance Details → Subnet → Security List
2. **Ingress Rules → Add Ingress Rule:**
   - Source: `0.0.0.0/0`
   - Destination Port: `80,443`
   - Protocol: TCP
3. Сохраните

#### Шаг 3: Подключитесь к серверу

**На Windows используйте PuTTY:**

1. Скачайте **PuTTY** с https://putty.org
2. Скачайте **PuTTYgen** (для конвертации ключа)
3. Откройте PuTTYgen:
   - Load → выберите ваш `.key` файл
   - Save private key → сохраните как `.ppk`
4. Откройте PuTTY:
   - Host: `ubuntu@ВАШ_ПУБЛИЧНЫЙ_IP`
   - Port: `22`
   - Connection → SSH → Auth → Private key: выберите `.ppk`
   - Open

**Или через PowerShell (Windows 10/11):**
```bash
# Конвертируйте ключ в правильный формат
icacls "путь\к\ключу.key" /inheritance:r
icacls "путь\к\ключу.key" /grant:r "%USERNAME%:R"

# Подключитесь
ssh -i "путь\к\ключу.key" ubuntu@ВАШ_ПУБЛИЧНЫЙ_IP
```

---

### Установка на сервере:

#### Шаг 1: Обновите систему
```bash
sudo apt update && sudo apt upgrade -y
```

#### Шаг 2: Установите Node.js
```bash
# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка
node --version
npm --version
```

#### Шаг 3: Установите Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### Шаг 4: Клонируйте проект
```bash
cd /var/www
sudo git clone https://github.com/ваш-username/overnight-exchange.git
cd overnight-exchange
sudo chown -R ubuntu:ubuntu .
```

#### Шаг 5: Установите зависимости и соберите
```bash
npm install
npm run build
```

#### Шаг 6: Настройте Nginx
```bash
sudo nano /etc/nginx/sites-available/overnight-exchange
```

Вставьте:
```nginx
server {
    listen 80;
    server_name ВАШ_IP_ИЛИ_ДОМЕН;

    root /var/www/overnight-exchange/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://functions.poehali.dev;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Сохраните: `Ctrl+X` → `Y` → `Enter`

Активируйте конфиг:
```bash
sudo ln -s /etc/nginx/sites-available/overnight-exchange /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Готово!** Откройте браузер: `http://ВАШ_IP`

---

### Добавление SSL (HTTPS) - бесплатно

#### Установка Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### Получение сертификата:
```bash
# Если у вас есть домен:
sudo certbot --nginx -d ваш-домен.com

# Следуйте инструкциям:
# - Email для уведомлений
# - Согласие с Terms of Service
# - Автоматическая настройка Nginx
```

**Готово!** Теперь сайт работает на `https://ваш-домен.com`

---

## 🔄 Автоматическое обновление (CI/CD)

### Настройка GitHub Actions для Oracle Cloud:

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Oracle Cloud

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_IP }}
        username: ubuntu
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /var/www/overnight-exchange
          git pull origin main
          npm install
          npm run build
          sudo systemctl reload nginx
```

Добавьте секреты в GitHub:
- `SERVER_IP` — IP вашего сервера
- `SSH_PRIVATE_KEY` — содержимое `.key` файла

---

## 📊 Сравнение способов:

| Критерий | Локально | Vercel | Netlify | GitHub Pages | Oracle Cloud |
|----------|----------|--------|---------|--------------|--------------|
| **Стоимость** | 0₽ | 0₽ | 0₽ | 0₽ | 0₽ |
| **Сложность** | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Доступ 24/7** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **HTTPS** | ❌ | ✅ | ✅ | ✅ | ✅ (Certbot) |
| **Кастомный домен** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Backend** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **База данных** | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎯 Рекомендации:

### Для разработки:
- ✅ **Локальный запуск** — самый простой способ

### Для демо/портфолио:
- ✅ **Vercel** — самый быстрый деплой (30 секунд)
- ✅ **Netlify** — отличная альтернатива

### Для production:
- ✅ **Oracle Cloud** — полный контроль, бесплатно навсегда

---

## 🐛 Частые проблемы:

### Windows Defender блокирует npm
**Решение:**
1. Windows Security → Virus & threat protection
2. Manage settings → Exclusions
3. Add exclusion → Folder → `C:\Program Files\nodejs`

### Ошибка "Cannot find module"
**Решение:**
```bash
# Удалите node_modules и переустановите
rm -rf node_modules package-lock.json
npm install
```

### Медленная установка зависимостей
**Решение:**
```bash
# Используйте Bun (в 10 раз быстрее)
powershell -c "irm bun.sh/install.ps1 | iex"
bun install
```

---

## 📚 Дополнительные ресурсы:

- **Node.js документация:** https://nodejs.org/docs
- **Vercel документация:** https://vercel.com/docs
- **Netlify документация:** https://docs.netlify.com
- **Oracle Cloud Always Free:** https://oracle.com/cloud/free/faq.html
- **Наша документация:** `docs/SETUP.md`

---

**Готово! Ваш сайт работает 24/7 абсолютно бесплатно! 🚀**

Хотите помощь с настройкой? Пишите: support@overnight.exchange
