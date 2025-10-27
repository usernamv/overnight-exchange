# 🌙 Overnight Exchange - Cryptocurrency Exchange Platform

Fast and secure 24/7 cryptocurrency exchange at the best rates.

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)](https://netlify.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
http://localhost:5173
```

### Deploy (free)

#### Vercel (recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy project
vercel
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy project
netlify deploy --prod
```

---

## 📋 Technologies

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Lucide React** - Icons

### Backend (Cloud Functions)
- **PostgreSQL** - Database
- **Cloud Functions** - Serverless API

### Tools
- **ESLint** - Linter
- **React Router** - Routing
- **React Hook Form** - Forms
- **Zod** - Validation

---

## 📂 Project Structure

```
overnight-exchange-design/
├── src/
│   ├── components/
│   │   ├── home/              # Home page components
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ExchangeCalculator.tsx
│   │   │   ├── CryptoRatesSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AdminLoginModal.tsx
│   │   └── ui/                # UI components (shadcn/ui)
│   ├── hooks/                 # Custom hooks
│   │   ├── useExchangeCalculator.ts
│   │   ├── useExchangeSubmit.ts
│   │   └── useAdminLogin.ts
│   ├── pages/                 # Pages
│   │   └── Index.tsx
│   ├── contexts/              # React contexts
│   ├── data/                  # Static data
│   ├── utils/                 # Utilities
│   └── App.tsx                # Main component
├── backend/                   # Cloud Functions
├── docs/                      # Documentation
│   ├── en/                    # English docs
│   │   ├── COMPONENTS-STRUCTURE.md
│   │   ├── LOCAL-DEVELOPMENT.md
│   │   ├── OPTIMIZATION-SUMMARY.md
│   │   └── README.md
│   └── ...                    # Russian docs
└── public/                    # Static files
```

---

## 🎯 Features

### ✅ Implemented

- [x] Home page with exchange calculator
- [x] Display current cryptocurrency rates
- [x] Authentication system (users and admins)
- [x] Admin panel for exchange management
- [x] Telegram integration for notifications
- [x] Responsive design (mobile-first)
- [x] Dark theme
- [x] FAQ section
- [x] Footer with contacts

### 🔄 In Development

- [ ] User exchange history
- [ ] KYC/AML verification
- [ ] Support for more cryptocurrencies
- [ ] Internationalization (i18n)

---

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:5173

# Build
npm run build            # Build project for production

# Preview
npm run preview          # Preview production build

# Code Check
npm run lint             # Check code for errors
```

---

## 📖 Documentation

### For Users:
- [Local Development and Deploy](LOCAL-DEVELOPMENT.md)
- [Components Structure](COMPONENTS-STRUCTURE.md)

### For Developers:
- **Components**: All components in `src/components/`
- **Hooks**: Custom hooks in `src/hooks/`
- **Styles**: Tailwind CSS with custom theme in `tailwind.config.ts`
- **API**: Cloud Functions in `backend/`

---

## 🌐 Deploy

### Automatic Deploy (recommended)

1. **Connect GitHub** in poehali.dev
2. **Choose platform:**
   - [Vercel](https://vercel.com) - best for React
   - [Netlify](https://netlify.com) - alternative
   - [Cloudflare Pages](https://pages.cloudflare.com) - CDN
3. **Import repository**
4. **Done!** Automatic updates on each commit

### Manual Deploy

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

More details: [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md)

---

## 🛠️ Optimizations

### React.memo
Static components wrapped in `React.memo` for rendering optimization:
- `HeroSection`
- `FeaturesSection`
- `FAQSection`
- `Footer`

### Custom Hooks
Business logic extracted to custom hooks:
- `useExchangeCalculator` - exchange calculation
- `useExchangeSubmit` - exchange submission
- `useAdminLogin` - admin login logic

### Code Splitting
Automatic code splitting with Vite.

---

## 🤝 Contributing

We welcome contributions to the project!

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is distributed under the MIT License.

---

## 📞 Support

### Community
- **Telegram**: https://t.me/+QgiLIa1gFRY4Y2Iy

### Documentation
- **poehali.dev docs**: https://docs.poehali.dev/

### Contacts
- **Email**: support@overnight.exchange
- **Telegram**: [@poehalidev](https://t.me/poehalidev)

---

## 🌟 Features

### 🎨 Design
- **Dark theme** with gradients
- **Responsive design** for all devices
- **Smooth animations** and glow effects
- **Modern UI** with shadcn/ui

### 🔒 Security
- **AML/KYC** checks
- **Data encryption**
- **Fraud protection**

### ⚡ Performance
- **React.memo** for optimization
- **Code splitting** for fast loading
- **Lazy loading** images
- **CDN** for static files

### 🚀 Development
- **TypeScript** for type safety
- **ESLint** for code quality
- **Hot Reload** for fast development
- **Modular architecture**

---

## 📊 Project Statistics

- **Components**: 8 main + UI library
- **Custom Hooks**: 3
- **Pages**: 4 (Index, Admin, Help, Cabinet)
- **Lines of Code**: ~2000
- **Bundle Size**: ~150 KB (gzip)

---

**Created with [poehali.dev](https://poehali.dev) 🚀**
