# 🚀 Enable GitHub Pages - Quick Setup

## Step 1: Enable GitHub Pages (2 minutes)

1. Go to your repository: **https://github.com/somo9909/secure-file-storage**
2. Click **"Settings"** tab (top menu)
3. Scroll down to **"Pages"** (left sidebar)
4. Under **"Source"**, select: **"GitHub Actions"**
5. Click **"Save"**

That's it! GitHub will automatically deploy your frontend when you push changes.

## Step 2: Deploy Backend (Required for Full Functionality)

Your frontend needs a backend to work. Choose one:

### Option A: Render (Free, Recommended)

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select `somo9909/secure-file-storage`
4. Configure:
   ```
   Name: secure-file-storage-backend
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```
5. Add Environment Variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-key-change-this
   FRONTEND_URL=https://somo9909.github.io/secure-file-storage
   ```
6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. Copy your backend URL (e.g., `https://secure-file-storage-backend.onrender.com`)

### Option B: Railway (Free)

1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add service → Select `backend` folder
5. Add environment variables (same as above)
6. Deploy

### Option C: Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New Project"**
3. Import `somo9909/secure-file-storage`
4. Root Directory: `backend`
5. Framework: Other
6. Build: `npm install`
7. Start: `npm start`
8. Add environment variables
9. Deploy

## Step 3: Update Frontend API URL

After backend is deployed:

1. Edit `.github/workflows/deploy.yml`
2. Update this line:
   ```yaml
   REACT_APP_API_URL: https://your-backend-url.onrender.com/api
   ```
   Replace with your actual backend URL

3. Push changes:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Update backend API URL"
   git push
   ```

## Step 4: Wait for Deployment

1. Go to **"Actions"** tab in your repository
2. Watch the workflow run
3. When complete, your site will be live!

## 🌐 Your Live Links

**Frontend (GitHub Pages):**
- **https://somo9909.github.io/secure-file-storage**

**Backend (after deployment):**
- Your backend URL (e.g., `https://secure-file-storage-backend.onrender.com`)

## ✅ Checklist

- [ ] GitHub Pages enabled (Settings → Pages → GitHub Actions)
- [ ] Backend deployed to Render/Railway/Vercel
- [ ] Backend URL updated in workflow file
- [ ] Changes pushed to GitHub
- [ ] GitHub Actions workflow completed
- [ ] Site is live and working!

## 🎉 Done!

Your project will be live at:
**https://somo9909.github.io/secure-file-storage**

---

**Note:** The frontend will deploy automatically via GitHub Actions. The backend needs to be deployed separately on a platform like Render, Railway, or Vercel.
