# Troubleshooting Guide

## Common Issues and Solutions

### Frontend Warnings (npm install)

**Issue:** You see many deprecation warnings during `npm install` in the frontend.

**Solution:** These are **normal and safe to ignore**. They come from `react-scripts` dependencies and don't affect functionality. The app will work fine.

**If you want to reduce warnings:**
```bash
cd frontend
npm audit fix  # Fixes non-breaking issues
```

**Note:** Don't run `npm audit fix --force` as it may break compatibility.

### Security Vulnerabilities

**Issue:** npm audit shows vulnerabilities.

**Solution:** 
- **Frontend vulnerabilities:** Mostly in dev dependencies (build tools). Safe for development.
- **Backend vulnerabilities:** In `sqlite3` build tools. Won't affect runtime.

**For production:** Use a production-ready database like PostgreSQL instead of SQLite.

### Backend Won't Start

**Issue:** Backend server fails to start.

**Solutions:**

1. **Port already in use:**
   ```bash
   # Change PORT in backend/.env
   PORT=3001
   ```

2. **Database not initialized:**
   ```bash
   cd backend
   npm run init-db
   ```

3. **Missing dependencies:**
   ```bash
   cd backend
   rm -rf node_modules
   npm install
   ```

4. **Check if .env exists:**
   ```bash
   # Copy from example if missing
   cd backend
   copy .env.example .env  # Windows
   # OR
   cp .env.example .env    # Linux/Mac
   ```

### Frontend Won't Start

**Issue:** React app won't start.

**Solutions:**

1. **Port already in use:**
   - React will ask to use a different port (usually 3002)
   - Or change PORT in package.json scripts

2. **Missing dependencies:**
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   ```

3. **Clear cache:**
   ```bash
   cd frontend
   npm start -- --reset-cache
   ```

4. **Check Node.js version:**
   ```bash
   node --version  # Should be v18+
   ```

### CORS Errors

**Issue:** Browser shows CORS errors.

**Solutions:**

1. **Backend not running:**
   - Make sure backend is running on port 3000
   - Check `backend/src/server.js` CORS configuration

2. **Wrong API URL:**
   - Check `frontend/src/services/api.js`
   - Default is `http://localhost:3000/api`

3. **Check proxy in package.json:**
   ```json
   "proxy": "http://localhost:3000"
   ```

### Can't Upload Files

**Issue:** File upload fails.

**Solutions:**

1. **No encryption keys:**
   - Go to "Key Management" tab
   - Click "Generate Encryption Keys"

2. **File too large:**
   - Default limit is 100MB
   - Check `backend/.env` MAX_FILE_SIZE

3. **Backend not running:**
   - Verify backend is running
   - Check backend terminal for errors

4. **Check browser console:**
   - Look for error messages
   - Verify API calls are successful

### Can't Download Files

**Issue:** File download fails.

**Solutions:**

1. **Private key missing:**
   - Check browser localStorage
   - You may need to regenerate keys
   - ⚠️ Old files won't be decryptable with new keys

2. **File integrity check fails:**
   - File may have been corrupted
   - Check error message in console

3. **Wrong file ID:**
   - Verify file exists in list
   - Check network tab for API response

### "Private key not found" Error

**Issue:** System says private key not found.

**Solutions:**

1. **Keys cleared from localStorage:**
   - Go to "Key Management"
   - Generate new keys
   - ⚠️ **Warning:** Files encrypted with old keys won't be accessible

2. **Different browser/device:**
   - Keys are stored per browser
   - Generate keys on new device
   - Old files won't be accessible

3. **Browser data cleared:**
   - If you cleared browser data, keys are lost
   - Need to regenerate keys

### Database Errors

**Issue:** Database-related errors.

**Solutions:**

1. **Database not initialized:**
   ```bash
   cd backend
   npm run init-db
   ```

2. **Database locked:**
   - Close any database viewers
   - Restart backend server

3. **Database corrupted:**
   ```bash
   cd backend
   # Backup first!
   rm database/storage.db
   npm run init-db
   ```

### Authentication Errors

**Issue:** Can't login or register.

**Solutions:**

1. **Backend not running:**
   - Start backend server first

2. **Invalid credentials:**
   - Check username/password
   - Try registering new account

3. **Token expired:**
   - Logout and login again
   - Tokens expire after 24 hours

4. **JWT_SECRET mismatch:**
   - Check `backend/.env` JWT_SECRET
   - Should be same across restarts

### File Encryption/Decryption Errors

**Issue:** Encryption or decryption fails.

**Solutions:**

1. **Browser compatibility:**
   - Use modern browser (Chrome, Firefox, Edge)
   - Web Crypto API required

2. **Key format issues:**
   - Regenerate keys if corrupted
   - Check key storage in localStorage

3. **File corruption:**
   - Try uploading file again
   - Check file isn't corrupted

### Performance Issues

**Issue:** App is slow.

**Solutions:**

1. **Large files:**
   - Encryption takes time for large files
   - Consider file size limits

2. **Many files:**
   - Database queries may be slow
   - Consider pagination for production

3. **Browser resources:**
   - Close other tabs
   - Check browser console for errors

## Getting More Help

### Check Logs

**Backend logs:**
- Check terminal where backend is running
- Look for error messages

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Verify Setup

1. **Backend running:**
   ```bash
   # Should see:
   🚀 Secure File Storage Backend running on port 3000
   ✅ Connected to SQLite database
   ```

2. **Frontend running:**
   - Should open at http://localhost:3001
   - No errors in browser console

3. **Database exists:**
   ```bash
   # Check if file exists
   ls backend/database/storage.db  # Linux/Mac
   dir backend\database\storage.db  # Windows
   ```

### Common Error Messages

**"Cannot find module"**
- Run `npm install` in that directory

**"Port already in use"**
- Change PORT in .env or use different port

**"Database locked"**
- Close database viewers, restart server

**"Invalid token"**
- Logout and login again

**"Private key not found"**
- Generate new keys in Key Management

**"File integrity check failed"**
- File may be corrupted, try uploading again

## Still Having Issues?

1. **Check documentation:**
   - README.md
   - SETUP.md
   - ARCHITECTURE.md

2. **Verify versions:**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 9+
   ```

3. **Clean install:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules
   npm install
   
   # Frontend
   cd frontend
   rm -rf node_modules
   npm install
   ```

4. **Check system requirements:**
   - Node.js 18+
   - Modern browser
   - Sufficient disk space
