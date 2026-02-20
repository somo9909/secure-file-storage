# Secure File Storage System Using Hybrid Cryptography

A secure file storage system where users can upload and download files, but the server cannot read the file contents. Even if the server or database is compromised, stored files remain confidential.

## Architecture Overview

This system uses **Hybrid Cryptography**, combining:
- **Symmetric Encryption (AES-256)**: Encrypts file data efficiently
- **Asymmetric Encryption (RSA-2048)**: Securely encrypts and protects the AES key

## Key Security Features

- ✅ End-to-end encryption: Server cannot decrypt files
- ✅ Private keys never stored on server
- ✅ AES-256 for file encryption
- ✅ RSA-2048 for key encryption
- ✅ SHA-256 for integrity verification
- ✅ HTTPS/TLS for data transmission
- ✅ Secure authentication with bcrypt

## System Components

1. **Backend Server** (`/backend`): Node.js/Express API
   - User authentication
   - File storage endpoints
   - Database management
   - Never decrypts files

2. **Frontend Application** (`/frontend`): Web interface
   - File upload/download UI
   - Client-side encryption/decryption
   - Key pair management
   - Never exposes private keys

3. **Cryptographic Module**: Handles all encryption operations
   - AES-256 file encryption
   - RSA-2048 key encryption
   - Key generation
   - Integrity verification

## How It Works

### Upload Process
1. User selects a file
2. System generates random AES-256 key
3. File encrypted using AES
4. AES key encrypted using user's public key (RSA)
5. Encrypted file + encrypted AES key sent to backend
6. Backend stores without modification

### Download Process
1. User requests a file
2. Backend sends encrypted file + encrypted AES key
3. Client decrypts AES key using private key
4. Client decrypts file using AES key
5. Original file restored

## Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup Steps

1. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Initialize database:**
   ```bash
   cd backend
   npm run init-db
   ```

4. **Start backend server:**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:3000`

5. **Start frontend (in new terminal):**
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on `http://localhost:3001`

## Usage

1. **Register**: Create a new account
2. **Login**: Authenticate with your credentials
3. **Generate Keys**: Create your RSA key pair (private key stays in browser)
4. **Upload Files**: Select files to upload (automatically encrypted)
5. **Download Files**: Download and decrypt your files

## Security Considerations

- ⚠️ **Private Keys**: Your private key is stored only in browser localStorage. If you clear browser data, you'll need to regenerate keys and re-encrypt files.
- ⚠️ **HTTPS**: For production, always use HTTPS. This demo uses HTTP for local development.
- ⚠️ **Key Backup**: Consider implementing a secure key backup mechanism for production use.

## Project Structure

```
FHC/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express server
│   │   ├── routes/
│   │   │   ├── auth.js        # Authentication routes
│   │   │   └── files.js       # File upload/download routes
│   │   ├── middleware/
│   │   │   └── auth.js        # Authentication middleware
│   │   ├── models/
│   │   │   ├── user.js        # User model
│   │   │   └── file.js        # File model
│   │   ├── database/
│   │   │   └── db.js          # Database setup
│   │   └── utils/
│   │       └── validation.js # Input validation
│   ├── uploads/               # Encrypted file storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main app component
│   │   ├── components/
│   │   │   ├── Login.js       # Login component
│   │   │   ├── Register.js    # Registration component
│   │   │   ├── Dashboard.js   # File management dashboard
│   │   │   └── KeyManager.js  # Key pair management
│   │   ├── services/
│   │   │   ├── api.js         # API client
│   │   │   └── crypto.js      # Cryptographic operations
│   │   └── utils/
│   │       └── storage.js     # localStorage utilities
│   └── package.json
└── README.md

```

## Threat Model

This system protects against:
- ✅ Server compromise: Files remain encrypted
- ✅ Database leaks: Encrypted data is useless without private keys
- ✅ Insider access: Server cannot decrypt files
- ✅ File tampering: SHA-256 hash verification detects modifications

## License

MIT License - Educational and demonstration purposes
