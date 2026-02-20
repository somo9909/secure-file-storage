# Setup Guide

This guide will walk you through setting up and running the Secure File Storage System.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

You can verify your installations:

```bash
node --version  # Should be v18.x.x or higher
npm --version    # Should be 9.x.x or higher
```

## Step-by-Step Setup

### 1. Navigate to Project Directory

```bash
cd FHC
```

### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Linux/Mac

# Edit .env file and set your JWT_SECRET (use a strong random string)
# You can generate one using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Initialize database
npm run init-db
```

**Important:** Change the `JWT_SECRET` in `.env` to a strong random string for security!

### 3. Set Up Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 4. Start the Application

#### Terminal 1 - Backend Server

```bash
cd backend
npm start
```

You should see:
```
🚀 Secure File Storage Backend running on port 3000
📁 Upload directory: [path]
🔒 Environment: development
✅ Connected to SQLite database
```

#### Terminal 2 - Frontend Application

```bash
cd frontend
npm start
```

The frontend will automatically open in your browser at `http://localhost:3001`

## First-Time Usage

1. **Register a New Account**
   - Click on the "Register" tab
   - Fill in username, email, and password
   - The system will automatically generate your RSA key pair during registration
   - Your private key is stored only in your browser's localStorage

2. **Generate Encryption Keys** (if not done during registration)
   - After logging in, go to "Key Management"
   - Click "Generate Encryption Keys"
   - ⚠️ **Important:** Keep your browser data safe! If you clear localStorage, you'll lose access to your encrypted files.

3. **Upload Your First File**
   - Go to the Dashboard
   - Click "Choose File to Upload"
   - Select a file
   - The file will be automatically encrypted before upload

4. **Download Files**
   - Click "Download" on any file
   - The file will be decrypted automatically in your browser

## Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
# Change PORT in backend/.env file
PORT=3001
```

**Database errors:**
```bash
# Delete the database and reinitialize
cd backend
rm database/storage.db  # or delete the file manually
npm run init-db
```

**Module not found errors:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install
```

### Frontend Issues

**Port 3001 already in use:**
- React will automatically ask to use a different port
- Or change it in `frontend/package.json` scripts

**CORS errors:**
- Make sure backend is running on port 3000
- Check `backend/src/server.js` CORS configuration

**Encryption errors:**
- Make sure you've generated encryption keys
- Check browser console for detailed error messages
- Ensure you're using a modern browser (Chrome, Firefox, Edge)

### Common Issues

**"Private key not found" error:**
- Your private key may have been cleared from localStorage
- You'll need to generate new keys (old files won't be decryptable)
- Consider implementing a key backup mechanism for production

**Files not uploading:**
- Check file size (default limit is 100MB)
- Check browser console for errors
- Verify backend is running

**Download fails:**
- Check that you have the correct private key
- Verify file integrity (hash verification)
- Check browser console for detailed errors

## Development Mode

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

The React app runs in development mode with hot-reload by default:

```bash
cd frontend
npm start
```

## Production Deployment

### Backend Production Setup

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Set up HTTPS/TLS
4. Configure proper CORS origins
5. Use a production database (PostgreSQL recommended)
6. Set up proper file storage (cloud storage recommended)

### Frontend Production Build

```bash
cd frontend
npm run build
```

The `build` folder contains the production-ready static files.

### Security Checklist for Production

- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS/TLS
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Use environment variables for all secrets
- [ ] Implement proper logging and monitoring
- [ ] Set up database backups
- [ ] Consider implementing key backup/recovery
- [ ] Add multi-factor authentication
- [ ] Implement file size limits
- [ ] Set up proper error handling (don't expose stack traces)

## Testing the System

### Test Upload Flow

1. Register/login
2. Generate keys (if needed)
3. Upload a test file
4. Verify file appears in list
5. Download the file
6. Verify downloaded file matches original

### Test Security

1. Try accessing files without authentication (should fail)
2. Try accessing another user's files (should fail)
3. Check that server cannot decrypt files (verify encrypted storage)
4. Test file integrity (modify encrypted file, should fail hash check)

## Architecture Verification

To verify the system is working correctly:

1. **Check Database:** Files should have encrypted AES keys
2. **Check Storage:** Files on disk should be encrypted (not readable)
3. **Check Network:** Use browser DevTools to verify encrypted data transmission
4. **Check Keys:** Private keys should never leave the browser

## Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Check backend terminal for server errors
3. Review the ARCHITECTURE.md document
4. Verify all dependencies are installed correctly
5. Ensure Node.js version is 18+

## Next Steps

- Review ARCHITECTURE.md for system design details
- Read README.md for feature overview
- Explore the codebase to understand implementation
- Consider enhancements for production use
