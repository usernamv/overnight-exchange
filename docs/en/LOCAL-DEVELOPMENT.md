# 🚀 How to Run the Site Locally on Windows

## 📋 What You'll Need

### 1. **Node.js** (required)
- Download: https://nodejs.org/
- Choose **LTS version** (recommended)
- Install with default settings
- Restart your computer after installation

### 2. **Git** (optional, for cloning)
- Download: https://git-scm.com/download/win
- Install with default settings

### 3. **Code Editor** (optional, for editing)
- **VS Code** (recommended): https://code.visualstudio.com/
- Or any other text editor

---

## 🎯 Method 1: Run via poehali.dev (EASIEST)

### Step 1: Download the Project
1. Open poehali.dev editor
2. Click **Download → Download Code**
3. Unzip the archive to any folder

### Step 2: Install Dependencies
1. Open the project folder
2. Press **Shift + Right Click** → **Open PowerShell window here**
3. Run the command:
```powershell
npm install
```

### Step 3: Start the Project
```powershell
npm run dev
```

### Step 4: Open in Browser
- Open: **http://localhost:5173**
- The site will automatically reload when files change

---

## 🌐 Method 2: Run via GitHub (if connected)

### Step 1: Clone the Repository
1. Open PowerShell or Command Prompt
2. Navigate to the folder where you want to place the project:
```powershell
cd C:\Users\YourName\Documents
```

3. Clone the repository:
```powershell
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Start the Project
```powershell
npm run dev
```

### Step 4: Open in Browser
- Open: **http://localhost:5173**

---

## 🆓 Method 3: Free Hosting (RECOMMENDED)

### ✅ Vercel (BEST for React)

**Advantages:**
- ✅ Completely free
- ✅ Automatic deployment from GitHub
- ✅ HTTPS certificate
- ✅ Unlimited bandwidth
- ✅ Custom domain supported

**Instructions:**

1. **Connect GitHub** in poehali.dev (see documentation)

2. **Sign up for Vercel:**
   - Go to: https://vercel.com
   - Click **Sign Up**
   - Sign in with GitHub

3. **Import project:**
   - Click **New Project**
   - Select your repository
   - Click **Import**

4. **Configure project:**
   - Framework Preset: **Vite**
   - Root Directory: `.` (default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**

5. **Done!**
   - Your site will be available at: `https://your-project.vercel.app`
   - Automatic updates with each GitHub commit

**Adding your own domain:**
   - Settings → Domains → Add Domain
   - Follow Vercel instructions

---

### ✅ Netlify (Alternative)

**Advantages:**
- ✅ Completely free
- ✅ 100 GB bandwidth per month
- ✅ HTTPS certificate
- ✅ Custom domain supported

**Instructions:**

1. **Connect GitHub** in poehali.dev

2. **Sign up for Netlify:**
   - Go to: https://netlify.com
   - Click **Sign Up**
   - Sign in with GitHub

3. **Import project:**
   - Click **Add new site → Import an existing project**
   - Select **GitHub**
   - Select your repository

4. **Configure project:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click **Deploy**

5. **Done!**
   - Your site will be available at: `https://your-project.netlify.app`

**Adding your own domain:**
   - Site settings → Domain management → Add custom domain

---

### ✅ GitHub Pages (Free)

**Advantages:**
- ✅ Completely free
- ✅ Unlimited bandwidth
- ✅ HTTPS certificate
- ✅ GitHub integration

**Limitations:**
- ⚠️ Static sites only
- ⚠️ No server functions support

**Instructions:**

1. **Connect GitHub** in poehali.dev

2. **Install gh-pages:**
```powershell
npm install --save-dev gh-pages
```

3. **Add to package.json:**
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPOSITORY",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. **Update vite.config.ts:**
```typescript
export default defineConfig({
  base: '/YOUR_REPOSITORY/',
  // rest of config
});
```

5. **Deploy the project:**
```powershell
npm run deploy
```

6. **Configure GitHub Pages:**
   - Open repository on GitHub
   - Settings → Pages
   - Source: **gh-pages branch**
   - Click **Save**

7. **Done!**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY`

---

### ✅ Cloudflare Pages (Alternative)

**Advantages:**
- ✅ Completely free
- ✅ Unlimited bandwidth
- ✅ HTTPS certificate
- ✅ Worldwide CDN
- ✅ Custom domain supported

**Instructions:**

1. **Connect GitHub** in poehali.dev

2. **Sign up for Cloudflare:**
   - Go to: https://pages.cloudflare.com
   - Click **Sign Up**
   - Create an account

3. **Create project:**
   - Click **Create a project**
   - Connect GitHub
   - Select your repository

4. **Configure project:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Click **Save and Deploy**

5. **Done!**
   - Your site will be available at: `https://your-project.pages.dev`

---

## 🔧 Useful Commands

### Development
```powershell
npm run dev          # Start dev server
```

### Build
```powershell
npm run build        # Build project for production
```

### Preview
```powershell
npm run preview      # Preview production build
```

### Code Check
```powershell
npm run lint         # Check code for errors
```

---

## 🆘 Common Problems

### 1. **"npm is not recognized as an internal command"**

**Solution:**
- Install Node.js: https://nodejs.org/
- Restart your computer
- Open a new PowerShell window

### 2. **"Port 5173 is already in use"**

**Solution:**
- Close other processes on port 5173
- Or change port in `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000, // Change to any free port
  },
});
```

### 3. **"Module not found"**

**Solution:**
```powershell
npm install          # Reinstall dependencies
```

### 4. **"Permission denied"**

**Solution:**
- Run PowerShell as administrator
- Right click → **Run as administrator**

### 5. **Errors during npm install**

**Solution:**
```powershell
# Clear cache and reinstall
npm cache clean --force
rm -r node_modules
rm package-lock.json
npm install
```

---

## 📊 Hosting Comparison

| Platform | Free | Auto-deploy | Domain | Limits | Recommendation |
|----------|------|-------------|--------|--------|----------------|
| **Vercel** | ✅ | ✅ | ✅ | No limits | ⭐⭐⭐⭐⭐ |
| **Netlify** | ✅ | ✅ | ✅ | 100 GB/month | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | ✅ | ⚠️ | ✅ | Static only | ⭐⭐⭐⭐ |
| **Cloudflare Pages** | ✅ | ✅ | ✅ | No limits | ⭐⭐⭐⭐⭐ |
| **poehali.dev** | ✅ | ✅ | ✅ | - | ⭐⭐⭐⭐⭐ |

---

## 🎯 Recommendations

### For Beginners:
1. **Vercel** - simplest and fastest option
2. **Netlify** - great alternative

### For Experienced:
1. **Cloudflare Pages** - best performance
2. **GitHub Pages** - for static sites only

### For Development:
1. **poehali.dev** - editing and publishing in one place
2. **Local run** - full control over the project

---

## 📝 Additional Resources

### Documentation:
- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com/

### Support:
- **Telegram community**: https://t.me/+QgiLIa1gFRY4Y2Iy
- **poehali.dev docs**: https://docs.poehali.dev/

---

## ✅ Pre-launch Checklist

- [ ] Node.js installed (check: `node -v`)
- [ ] Project downloaded or cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server started (`npm run dev`)
- [ ] Site opens in browser (`http://localhost:5173`)

---

**Ready! Your site is running locally! 🎉**

Want to publish online? Use **Vercel** or **Netlify** - it's free and takes 5 minutes!
