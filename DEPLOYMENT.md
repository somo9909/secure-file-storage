# 🚀 Deployment Guide - Live Website

This guide will help you deploy your Secure File Storage System to make it accessible online.

## 🌐 Deployment Options

### Option 1: GitHub Pages (Frontend) + Render/Railway (Backend) - Recommended

**Frontend:** GitHub Pages (Free)  
**Backend:** Render or Railway (Free tier available)

### Option 2: Vercel (Full Stack) - Easiest

**Both:** Vercel (Free tier available)

### Option 3: Netlify (Frontend) + Render (Backend)

**Frontend:** Netlify (Free)  
**Backend:** Render (Free tier)

---

## 📋 Option 1: GitHub Pages + Render (Recommended)

### Step 1: Deploy Backend to Render

1. **Sign up** at [render.com](https://render.com) (free)

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `somo9909/secure-file-storage`
   - Select repository

3. **Configure Backend:**
   ```
   Name: secure-file-storage-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables:**
   ```
   PORT=10000
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this
   MAX_FILE_SIZE=104857600
   UPLOAD_DIR=./uploads
   DB_PATH=./database/storage.db
   FRONTEND_URL=https://somo9909.github.io/secure-file-storage
   ```

5. **Click "Create Web Service"**
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://secure-file-storage-backend.onrender.com`)

### Step 2: Deploy Frontend to GitHub Pages

1. **Update Frontend API URL:**

   Edit `frontend/src/services/api.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com/api';
   ```

2. **Enable GitHub Pages:**
   - Go to your repository: https://github.com/somo9909/secure-file-storage
   - Settings → Pages
   - Source: "GitHub Actions"
   - Save

3. **Update GitHub Actions Workflow:**

   Edit `.github/workflows/deploy.yml`:
   ```yaml
   REACT_APP_API_URL: https://your-backend-url.onrender.com/api
   ```

4. **Push Changes:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push
   ```

5. **Wait for GitHub Actions:**
   - Go to Actions tab in your repository
   - Wait for workflow to complete
   - Your site will be at: `https://somo9909.github.io/secure-file-storage`

---

## 📋 Option 2: Vercel (Full Stack) - Easiest

### Deploy Both Frontend and Backend

1. **Sign up** at [vercel.com](https://vercel.com) (free)

2. **Deploy Backend:**
   - Click "Add New Project"
   - Import GitHub repository: `somo9909/secure-file-storage`
   - Root Directory: `backend`
   - Framework Preset: "Other"
   - Build Command: `npm install`
   - Output Directory: (leave empty)
   - Install Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     ```
     PORT=3000
     NODE_ENV=production
     JWT_SECRET=your-secret-key
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```
   - Deploy

3. **Deploy Frontend:**
   - Click "Add New Project" again
   - Same repository: `somo9909/secure-file-storage`
   - Root Directory: `frontend`
   - Framework Preset: "Create React App"
   - Environment Variables:
     ```
     REACT_APP_API_URL=https://your-backend-url.vercel.app/api
     ```
   - Deploy

4. **Update Frontend API URL:**
   - After backend deploys, update frontend environment variable
   - Redeploy frontend

**Your sites will be:**
- Frontend: `https://secure-file-storage-frontend.vercel.app`
- Backend: `https://secure-file-storage-backend.vercel.app`

---

## 📋 Option 3: Netlify + Render

### Frontend on Netlify

1. **Sign up** at [netlify.com](https://netlify.com)

2. **Deploy:**
   - "Add new site" → "Import an existing project"
   - Connect GitHub → Select repository
   - Build settings:
     ```
     Base directory: frontend
     Build command: npm run build
     Publish directory: frontend/build
     ```
   - Environment Variables:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Deploy

### Backend on Render

Follow Step 1 from Option 1 above.

---

## 🔧 Quick Setup Script

### For GitHub Pages + Render

1. **Update API URL in frontend:**

   Create `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Update GitHub Actions:**

   The workflow file is already created at `.github/workflows/deploy.yml`

3. **Enable GitHub Pages:**
   - Repository → Settings → Pages
   - Source: GitHub Actions
   - Save

4. **Push and Deploy:**
   ```bash
   git add .
   git commit -m "Configure for deployment"
   git push
   ```

---

## 🌐 Live Links

After deployment, your links will be:

**GitHub Pages:**
- Frontend: `https://somo9909.github.io/secure-file-storage`

**Render:**
- Backend: `https://your-app-name.onrender.com`

**Vercel:**
- Frontend: `https://secure-file-storage-frontend.vercel.app`
- Backend: `https://secure-file-storage-backend.vercel.app`

---

## ⚙️ Configuration Checklist

### Backend Environment Variables:
- [ ] `PORT` (usually auto-set by hosting)
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` (strong random string)
- [ ] `FRONTEND_URL` (your frontend URL)
- [ ] `MAX_FILE_SIZE` (optional)
- [ ] `DB_PATH` (optional)

### Frontend Environment Variables:
- [ ] `REACT_APP_API_URL` (your backend URL + /api)

### CORS Configuration:
- Backend should allow your frontend URL
- Check `backend/src/server.js` CORS settings

---

## 🐛 Troubleshooting

### Frontend can't connect to backend:
- Check CORS settings in backend
- Verify `REACT_APP_API_URL` is correct
- Check backend is running

### Build fails:
- Check Node.js version (needs 18+)
- Verify all dependencies installed
- Check build logs

### Backend crashes:
- Check environment variables
- Verify database path
- Check logs for errors

---

## 📝 After Deployment

1. **Test the live site:**
   - Register an account
   - Upload a test file
   - Download it
   - Verify encryption works

2. **Update README.md:**
   Add live demo link:
   ```markdown
   ## 🌐 Live Demo
   
   [View Live Site](https://somo9909.github.io/secure-file-storage)
   ```

3. **Share your project:**
   - Add live link to GitHub repository description
   - Share with others!

---

## 🎯 Recommended: GitHub Pages + Render

**Why:**
- ✅ Free for both
- ✅ Easy setup
- ✅ GitHub integration
- ✅ Automatic deployments

**Steps:**
1. Deploy backend to Render (5 minutes)
2. Enable GitHub Pages (1 minute)
3. Update API URL (2 minutes)
4. Push changes (1 minute)
5. **Done!** 🎉

---

## 📞 Need Help?

- Check deployment logs
- Verify environment variables
- Test API endpoints
- Check CORS configuration

**Your project will be live in ~10 minutes!** 🚀
