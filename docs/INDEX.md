# 📚 Документация Overnight Exchange

## 🌍 Languages / Языки

- **🇷🇺 Русский** - Вы здесь / You are here
- **🇬🇧 [English](en/INDEX.md)** - English documentation

---

## 🎯 Навигация по документам

---

## ⚡ Быстрый старт

### **[QUICK-START.md](../QUICK-START.md)** — Начните отсюда!
Главная инструкция для быстрого запуска проекта за 30 секунд.

**Что внутри:**
- ✅ Вход в админ-панель
- ✅ Настройка Telegram за 2 минуты
- ✅ Основные команды
- ✅ Быстрые ответы на вопросы

---

## 🚀 Развертывание

### **[QUICK-DEPLOY.md](QUICK-DEPLOY.md)** — Развертывание на poehali.dev
Инструкция для работы с уже развернутым проектом.

**Что внутри:**
- Вход в админку
- Настройка Telegram
- Подключение домена
- Публикация на Vercel
- Безопасность

### **[WINDOWS-DEPLOYMENT.md](WINDOWS-DEPLOYMENT.md)** — Запуск на Windows
Полное руководство по запуску проекта на Windows локально и на бесплатных хостингах.

**Что внутри:**
- 💻 Локальный запуск (для разработки)
- 🌐 Бесплатные хостинги (Vercel, Netlify, GitHub Pages)
- ☁️ Oracle Cloud VPS (бесплатно навсегда)
- 🔧 Установка Node.js, Git, зависимостей
- 🐛 Troubleshooting

### **[SETUP.md](SETUP.md)** — Полная настройка проекта
Детальное руководство по настройке всех компонентов.

**Что внутри:**
- Первый запуск
- Вход в админ-панель (3 способа)
- Настройка Telegram (5 минут)
- Основные функции админки
- Безопасность
- Частые проблемы

---

## 🔧 Специализированные темы

### **[COMPONENTS-STRUCTURE.md](COMPONENTS-STRUCTURE.md)** — Структура компонентов ⭐ НОВОЕ
Полное описание архитектуры проекта и декомпозиции компонентов.

**Что внутри:**
- Структура 8 компонентов
- React.memo оптимизации
- Custom hooks (3 хука)
- Статистика и метрики
- Props компонентов
- Чеклист разработки

### **[OPTIMIZATION-SUMMARY.md](OPTIMIZATION-SUMMARY.md)** — Оптимизации проекта ⭐ НОВОЕ
Итоговый отчет по оптимизации кода и производительности.

**Что внутри:**
- Результаты оптимизации (-84% кода)
- React.memo компоненты
- Custom hooks описание
- Сравнение до/после
- Преимущества изменений

### **[LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md)** — Локальная разработка ⭐ НОВОЕ
Подробное руководство по запуску на Windows и бесплатному хостингу.

**Что внутри:**
- Запуск через poehali.dev
- Запуск через GitHub
- Бесплатный хостинг (Vercel, Netlify, GitHub Pages, Cloudflare)
- Настройка своего домена
- Troubleshooting
- Сравнение хостингов

### **[README.md](README.md)** — Общая информация проекта ⭐ НОВОЕ
Главная страница документации проекта.

**Что внутри:**
- Технологии проекта
- Структура файлов
- Функциональность
- Доступные команды
- Статистика проекта

### **[telegram-setup.md](telegram-setup.md)** — Telegram уведомления
Пошаговая инструкция по настройке Telegram бота для уведомлений.

**Что внутри:**
- Создание бота через @BotFather
- Получение Chat ID
- Настройка для группы
- Типы уведомлений
- Форматирование сообщений
- Troubleshooting

### **[admin-guide.md](admin-guide.md)** — Руководство администратора
Полное руководство по работе с админ-панелью (240+ страниц).

**Что внутри:**
- Обзор всех разделов
- Управление транзакциями
- Управление пользователями
- KYC/AML проверки
- Блокчейн интеграция
- Аналитика и отчеты
- Безопасность
- Типичные проблемы

### **[payment-integration.md](payment-integration.md)** — Платежные провайдеры
Интеграция с криптовалютными платежными шлюзами.

**Что внутри:**
- Настройка 4 провайдеров
- Coinbase Commerce
- NOWPayments
- CoinPayments
- Binance Pay
- API документация
- Webhook обработка
- Troubleshooting

---

## 📦 Экспорт и Git

### **[GITHUB-EXPORT.md](GITHUB-EXPORT.md)** — Работа с кодом
Как получить код проекта и работать с GitHub.

**Что внутри:**
- Скачивание из poehali.dev
- Подключение GitHub
- Клонирование репозитория
- Развертывание с GitHub
- Экспорт статического билда
- FTP загрузка

---

## 🎨 Структура документации

```
docs/
├── INDEX.md                      # 📚 Этот файл (навигация)
├── README.md                    # 📄 Общая информация проекта ⭐ НОВОЕ
├── QUICK-DEPLOY.md              # ⚡ Быстрое развертывание
├── SETUP.md                     # 📖 Полная настройка
├── LOCAL-DEVELOPMENT.md         # 💻 Локальная разработка ⭐ НОВОЕ
├── WINDOWS-DEPLOYMENT.md        # 💻 Windows запуск
├── COMPONENTS-STRUCTURE.md      # 🏗️ Структура компонентов ⭐ НОВОЕ
├── OPTIMIZATION-SUMMARY.md      # ⚡ Оптимизации проекта ⭐ НОВОЕ
├── telegram-setup.md            # 📱 Telegram уведомления
├── admin-guide.md               # 👨‍💼 Руководство администратора
├── payment-integration.md       # 💳 Платежные провайдеры
└── GITHUB-EXPORT.md            # 📦 Экспорт и Git

../
├── QUICK-START.md               # 🚀 Главная инструкция
└── .env.example                 # ⚙️ Пример конфигурации
```

---

## 🎯 Что читать в зависимости от задачи:

### Я только начинаю:
1. **[QUICK-START.md](../QUICK-START.md)** — прочитайте обязательно!
2. **[QUICK-DEPLOY.md](QUICK-DEPLOY.md)** — быстрый старт
3. **[telegram-setup.md](telegram-setup.md)** — настройка уведомлений

### Я хочу развернуть локально на Windows:
1. **[WINDOWS-DEPLOYMENT.md](WINDOWS-DEPLOYMENT.md)** — полная инструкция
2. **[SETUP.md](SETUP.md)** — детали настройки

### Я хочу получить код:
1. **[GITHUB-EXPORT.md](GITHUB-EXPORT.md)** — все способы экспорта

### Я разработчик:
1. **[COMPONENTS-STRUCTURE.md](COMPONENTS-STRUCTURE.md)** — архитектура проекта
2. **[OPTIMIZATION-SUMMARY.md](OPTIMIZATION-SUMMARY.md)** — оптимизации
3. **[LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md)** — локальный запуск
4. **[README.md](README.md)** — общая информация

### Я администратор платформы:
1. **[admin-guide.md](admin-guide.md)** — полное руководство
2. **[SETUP.md](SETUP.md)** — основные функции

### Я хочу подключить платежи:
1. **[payment-integration.md](payment-integration.md)** — интеграция провайдеров

### Я хочу настроить Telegram:
1. **[telegram-setup.md](telegram-setup.md)** — пошаговая инструкция

---

## 📊 Сравнение документов:

| Документ | Сложность | Время чтения | Для кого |
|----------|-----------|--------------|----------|
| QUICK-START | ⭐ | 2 мин | Все |
| README | ⭐⭐ | 5 мин | Все |
| QUICK-DEPLOY | ⭐⭐ | 5 мин | Начинающие |
| SETUP | ⭐⭐⭐ | 15 мин | Разработчики |
| LOCAL-DEVELOPMENT | ⭐⭐⭐ | 15 мин | Разработчики |
| WINDOWS-DEPLOYMENT | ⭐⭐⭐ | 20 мин | Windows пользователи |
| COMPONENTS-STRUCTURE | ⭐⭐⭐⭐ | 20 мин | Разработчики |
| OPTIMIZATION-SUMMARY | ⭐⭐⭐ | 10 мин | Разработчики |
| telegram-setup | ⭐⭐ | 10 мин | Все |
| admin-guide | ⭐⭐⭐⭐ | 60 мин | Администраторы |
| payment-integration | ⭐⭐⭐⭐ | 30 мин | Разработчики |
| GITHUB-EXPORT | ⭐⭐ | 10 мин | Разработчики |

---

## 🔍 Быстрый поиск по темам:

### Вход и авторизация:
- **[QUICK-START](../QUICK-START.md)** → Раздел "30 секунд до запуска"
- **[SETUP](SETUP.md)** → Раздел "Вход в админ-панель"
- **[QUICK-DEPLOY](QUICK-DEPLOY.md)** → Раздел "Быстрый старт"

### Telegram:
- **[telegram-setup](telegram-setup.md)** — полная инструкция
- **[QUICK-START](../QUICK-START.md)** → Раздел "Настройка Telegram за 2 минуты"
- **[SETUP](SETUP.md)** → Раздел "Настройка Telegram"

### Развертывание:
- **[QUICK-DEPLOY](QUICK-DEPLOY.md)** — на poehali.dev
- **[WINDOWS-DEPLOYMENT](WINDOWS-DEPLOYMENT.md)** — на Windows
- **[GITHUB-EXPORT](GITHUB-EXPORT.md)** → Раздел "Развертывание с GitHub"

### Админ-панель:
- **[admin-guide](admin-guide.md)** — полное руководство
- **[SETUP](SETUP.md)** → Раздел "Основные функции"
- **[QUICK-DEPLOY](QUICK-DEPLOY.md)** → Раздел "Настройка сайта"

### Безопасность:
- **[SETUP](SETUP.md)** → Раздел "Безопасность"
- **[QUICK-DEPLOY](QUICK-DEPLOY.md)** → Раздел "Важно: Безопасность"
- **[admin-guide](admin-guide.md)** → Раздел "Безопасность и backup"

### Платежи:
- **[payment-integration](payment-integration.md)** — полная интеграция
- **[admin-guide](admin-guide.md)** → Раздел "Платежные провайдеры"

### Получение кода:
- **[GITHUB-EXPORT](GITHUB-EXPORT.md)** — все способы
- **[QUICK-DEPLOY](QUICK-DEPLOY.md)** → Раздел "Публикация на Vercel"

### Troubleshooting:
- **[SETUP](SETUP.md)** → Раздел "Частые проблемы"
- **[WINDOWS-DEPLOYMENT](WINDOWS-DEPLOYMENT.md)** → Раздел "Частые проблемы"
- **[telegram-setup](telegram-setup.md)** → Раздел "Troubleshooting"
- **[admin-guide](admin-guide.md)** → Раздел "Типичные проблемы"

---

## 📖 Дополнительные файлы:

### `.env.example` — Пример конфигурации
Шаблон для переменных окружения.

**Содержит:**
- Telegram Bot Token
- Telegram Admin Chat ID
- API URLs

---

## 🆘 Нужна помощь?

### Не нашли ответ в документации?

**Свяжитесь с нами:**
- 📧 Email: support@overnight.exchange
- 💬 Telegram: [@poehalidev](https://t.me/poehalidev)
- 👥 Сообщество: https://t.me/+QgiLIa1gFRY4Y2Iy

### Перед обращением:
1. ✅ Проверьте раздел Troubleshooting в нужном документе
2. ✅ Попробуйте поискать по CTRL+F в документации
3. ✅ Опишите проблему максимально подробно
4. ✅ Приложите скриншоты (если возможно)

---

## ✅ Чеклист перед стартом:

- [ ] Прочитал **[QUICK-START.md](../QUICK-START.md)**
- [ ] Вошел в админ-панель
- [ ] Настроил Telegram (опционально)
- [ ] Изменил контакты на сайте
- [ ] Сменил пароль администратора
- [ ] Протестировал создание обмена
- [ ] Прочитал нужные разделы документации

---

**Успехов в работе с Overnight Exchange! 🚀**

**Платформа:** https://poehali.dev  
**Разработано с ❤️ на poehali.dev**