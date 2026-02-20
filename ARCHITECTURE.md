# System Architecture Documentation

## Overview

This document describes the complete architecture of the Secure File Storage System using Hybrid Cryptography.

## Design Principles

1. **Zero-Knowledge Architecture**: Server never sees plaintext files or private keys
2. **Defense in Depth**: Multiple layers of security
3. **Cryptographic Best Practices**: Only proven algorithms and implementations
4. **Separation of Concerns**: Clear boundaries between components

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │ Cryptographic│  │   Private    │      │
│  │   UI/UX      │◄─┤   Module     │◄─┤    Key       │      │
│  │              │  │              │  │ (localStorage)│     │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                 │                                 │
│         │ HTTPS/TLS       │                                 │
└─────────┼─────────────────┼─────────────────────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVER SIDE                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │  Database    │  │   File       │      │
│  │   API        │◄─┤  (SQLite)    │  │   Storage    │      │
│  │              │  │              │  │  (Encrypted) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                                 │                  │
│         └─────────────────────────────────┘                  │
│                    (Never Decrypts)                         │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend (Client-Side)

**Responsibilities:**
- User interface and interaction
- Client-side encryption/decryption
- Key pair generation and management
- Private key storage (localStorage)
- API communication

**Technologies:**
- React.js for UI
- Web Crypto API for cryptographic operations
- Axios for HTTP requests
- localStorage for key storage

**Key Components:**
- `Login.js`: User authentication
- `Register.js`: User registration
- `Dashboard.js`: File management interface
- `KeyManager.js`: RSA key pair management
- `crypto.js`: Cryptographic operations module

### 2. Backend (Server-Side)

**Responsibilities:**
- User authentication and authorization
- File metadata storage
- Encrypted file storage
- API endpoint management
- Input validation and sanitization

**Technologies:**
- Node.js with Express.js
- SQLite database
- bcrypt for password hashing
- Multer for file uploads
- JWT for session management

**Key Components:**
- `server.js`: Express server setup
- `routes/auth.js`: Authentication endpoints
- `routes/files.js`: File upload/download endpoints
- `middleware/auth.js`: JWT authentication middleware
- `models/user.js`: User data model
- `models/file.js`: File metadata model

### 3. Cryptographic Module

**Responsibilities:**
- AES-256 encryption/decryption
- RSA-2048 key encryption/decryption
- Key generation
- Hash computation for integrity

**Operations:**

#### AES Encryption (File Data)
- Algorithm: AES-GCM (Galois/Counter Mode)
- Key Size: 256 bits
- IV: Random 96-bit initialization vector
- Authentication: Built-in GCM authentication tag

#### RSA Encryption (AES Keys)
- Algorithm: RSA-OAEP (Optimal Asymmetric Encryption Padding)
- Key Size: 2048 bits
- Hash: SHA-256
- MGF: MGF1 with SHA-256

#### Integrity Verification
- Algorithm: SHA-256
- Purpose: Detect file tampering

## Data Flow

### Upload Flow

```
User → Select File
  ↓
Frontend: Generate AES-256 Key
  ↓
Frontend: Encrypt File (AES-GCM)
  ↓
Frontend: Encrypt AES Key (RSA-OAEP with Public Key)
  ↓
Frontend: Compute File Hash (SHA-256)
  ↓
Frontend: Send to Backend (HTTPS)
  ├─ Encrypted File Data
  ├─ Encrypted AES Key
  ├─ File Hash
  └─ File Metadata
  ↓
Backend: Validate Request
  ↓
Backend: Store in Database
  ├─ File Metadata
  ├─ Encrypted AES Key
  └─ File Hash
  ↓
Backend: Store Encrypted File on Disk
  ↓
Backend: Return Success Response
```

### Download Flow

```
User → Request File
  ↓
Frontend: Send Request to Backend (HTTPS)
  ↓
Backend: Validate Authentication
  ↓
Backend: Retrieve from Database
  ├─ File Metadata
  ├─ Encrypted AES Key
  └─ File Hash
  ↓
Backend: Read Encrypted File from Disk
  ↓
Backend: Send to Frontend
  ├─ Encrypted File Data
  ├─ Encrypted AES Key
  └─ File Hash
  ↓
Frontend: Decrypt AES Key (RSA-OAEP with Private Key)
  ↓
Frontend: Decrypt File (AES-GCM)
  ↓
Frontend: Verify Hash (SHA-256)
  ↓
Frontend: Display/Download File
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    public_key TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Files Table
```sql
CREATE TABLE files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT,
    encrypted_aes_key TEXT NOT NULL,
    file_hash TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Security Measures

### 1. Authentication
- Password hashing with bcrypt (10 rounds)
- JWT tokens for session management
- Token expiration (24 hours)
- Secure password requirements

### 2. Encryption
- AES-256-GCM for file encryption
- RSA-2048-OAEP for key encryption
- Random IV generation for each file
- Secure random number generation

### 3. Integrity
- SHA-256 hash verification
- GCM authentication tags
- File tampering detection

### 4. Network Security
- HTTPS/TLS (required in production)
- CORS configuration
- Input validation and sanitization
- Rate limiting (recommended for production)

### 5. Access Control
- User-based file access
- Authentication middleware
- File ownership verification

## Threat Model

### Protected Against:
1. **Server Compromise**: Files remain encrypted, server cannot decrypt
2. **Database Leak**: Encrypted data is useless without private keys
3. **Insider Access**: Server administrators cannot read files
4. **Man-in-the-Middle**: HTTPS/TLS prevents interception
5. **File Tampering**: Hash verification detects modifications

### Limitations:
1. **Browser Compromise**: If browser is compromised, private keys may be exposed
2. **Key Loss**: If private key is lost, files cannot be decrypted
3. **Local Storage**: Private keys stored in localStorage are vulnerable to XSS
4. **Client-Side Security**: Security depends on client-side implementation

## Best Practices Implemented

1. ✅ Use proven cryptographic algorithms only
2. ✅ Never store private keys on server
3. ✅ Use secure random number generation
4. ✅ Implement proper key management
5. ✅ Verify data integrity
6. ✅ Use authenticated encryption (AES-GCM)
7. ✅ Implement proper error handling
8. ✅ Validate all inputs
9. ✅ Use HTTPS in production
10. ✅ Follow principle of least privilege

## Future Enhancements

1. **Key Backup**: Secure key backup mechanism
2. **Key Rotation**: Periodic key rotation support
3. **Multi-Factor Authentication**: Additional security layer
4. **File Sharing**: Encrypted file sharing between users
5. **Version Control**: File versioning with encryption
6. **Compression**: Encrypt-then-compress for efficiency
7. **Cloud Storage**: Integration with cloud storage providers
8. **Mobile App**: Native mobile application support
