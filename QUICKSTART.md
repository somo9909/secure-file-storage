# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

```bash
node --version  # Need v18+
npm --version   # Need v9+
```

## Installation

### 1. Backend Setup (Terminal 1)

```bash
cd backend
npm install
copy .env.example .env  # Windows
# OR: cp .env.example .env  # Linux/Mac
npm run init-db
npm start
```

Backend runs on `http://localhost:3000`

### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm start
```

Frontend opens at `http://localhost:3001`

## First Use

1. **Register** → Creates account + generates keys automatically
2. **Upload File** → File encrypted before upload
3. **Download File** → File decrypted automatically

## Important Notes

- ⚠️ **Private keys** stored in browser localStorage only
- ⚠️ **Clear browser data** = lose access to encrypted files
- ⚠️ **Use HTTPS** in production (not HTTP)

## Troubleshooting

**Backend won't start:**
- Check if port 3000 is available
- Verify Node.js version (18+)
- Run `npm install` again

**Frontend won't start:**
- Check if port 3001 is available
- Verify all dependencies installed
- Check browser console for errors

**Can't upload files:**
- Make sure you've generated encryption keys
- Check file size (max 100MB default)
- Verify backend is running

**Can't download files:**
- Verify you have the correct private key
- Check browser console for errors
- Ensure file wasn't corrupted

## Next Steps

- Read `SETUP.md` for detailed setup
- Read `ARCHITECTURE.md` for system design
- Read `SECURITY.md` for security details
