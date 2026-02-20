# 🔧 Render Deployment Fix

## Issue

The backend deployment on Render is failing with:
```
Error: Cannot find module '../database/db'
```

## Solution Applied

I've fixed the path issues for production deployment:

1. **Database Path:** Now uses `process.cwd()` for production
2. **Uploads Path:** Now uses `process.cwd()` for production
3. **Created render.yaml:** Configuration file for Render

## Updated Render Configuration

### Option 1: Use render.yaml (Easiest)

1. Go to your Render dashboard
2. Delete the current service
3. Create new service → "New Blueprint"
4. Connect GitHub repository
5. Render will automatically detect `render.yaml`
6. Deploy!

### Option 2: Manual Configuration

Update your Render service settings:

**Root Directory:** `backend` (not root!)

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://somo9909.github.io/secure-file-storage
DB_PATH=/opt/render/project/src/database/storage.db
UPLOAD_DIR=/opt/render/project/src/uploads
```

**Build Command:** `npm install`

**Start Command:** `npm start`

## Important: Root Directory

Make sure Render is set to use `backend` as the root directory, not the repository root!

## After Fix

1. Push the changes to GitHub
2. Render will automatically redeploy
3. Check logs to verify it's working
4. Test the API endpoint

## Verification

After deployment, test:
```
https://your-backend-url.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Secure File Storage API is running"
}
```
