# Implementation Guide for Beginners

This guide explains how the Secure File Storage System works, step-by-step, for developers who are new to cryptography and secure systems.

## Understanding Hybrid Cryptography

### Why Hybrid Cryptography?

**Problem:** 
- Symmetric encryption (AES) is fast but requires sharing keys securely
- Asymmetric encryption (RSA) is secure but slow for large files

**Solution:**
- Use AES to encrypt files (fast)
- Use RSA to encrypt the AES key (secure)
- Best of both worlds!

### The Flow

```
File → AES Encrypt → Encrypted File
AES Key → RSA Encrypt (with Public Key) → Encrypted AES Key
```

## Step-by-Step: Upload Process

### 1. User Selects File
```javascript
// User clicks "Choose File" button
// File object is available in browser
```

### 2. Generate AES Key
```javascript
// crypto.js: generateAESKey()
const aesKey = await window.crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
);
```
**Why:** Each file gets a unique encryption key for security.

### 3. Encrypt File with AES
```javascript
// crypto.js: encryptFile()
const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV
const encryptedData = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: iv },
  aesKey,
  fileBuffer
);
```
**Why GCM:** Provides authentication - detects if file was tampered with.

### 4. Encrypt AES Key with RSA
```javascript
// crypto.js: encryptAESKey()
const exportedAESKey = await crypto.subtle.exportKey('raw', aesKey);
const encryptedAESKey = await crypto.subtle.encrypt(
  { name: 'RSA-OAEP' },
  publicKey,  // User's public key
  exportedAESKey
);
```
**Why:** Only the user (with private key) can decrypt the AES key.

### 5. Compute File Hash
```javascript
// crypto.js: computeFileHash()
const hash = await crypto.subtle.digest('SHA-256', fileBuffer);
```
**Why:** Verify file integrity after download.

### 6. Send to Server
```javascript
// api.js: fileAPI.upload()
// Sends: encrypted file, encrypted AES key, file hash
```
**Important:** Server never sees plaintext file or AES key!

### 7. Server Stores Data
```javascript
// backend/routes/files.js
// Stores encrypted file on disk
// Stores encrypted AES key in database
// Never decrypts anything!
```

## Step-by-Step: Download Process

### 1. User Requests File
```javascript
// Dashboard.js: handleFileDownload()
const response = await fileAPI.download(fileId);
```

### 2. Server Retrieves Encrypted Data
```javascript
// backend/routes/files.js
// Reads encrypted file from disk
// Gets encrypted AES key from database
// Returns both to client
```

### 3. Decrypt AES Key
```javascript
// crypto.js: decryptAESKey()
const decryptedKeyBuffer = await crypto.subtle.decrypt(
  { name: 'RSA-OAEP' },
  privateKey,  // User's private key (from localStorage)
  encryptedAESKey
);
```
**Why:** Only user's private key can decrypt the AES key.

### 4. Decrypt File
```javascript
// crypto.js: decryptFile()
const decryptedData = await crypto.subtle.decrypt(
  { name: 'AES-GCM', iv: iv },
  aesKey,
  encryptedData
);
```

### 5. Verify Hash
```javascript
const computedHash = await computeFileHash(decryptedData);
if (computedHash !== storedHash) {
  throw new Error('File tampered!');
}
```

### 6. Download File
```javascript
// Create blob and download link
const blob = new Blob([decryptedData]);
// User gets original file
```

## Key Concepts Explained

### Public/Private Key Pairs

**RSA Key Pair:**
- **Public Key:** Can encrypt, cannot decrypt
- **Private Key:** Can decrypt what public key encrypted
- **Analogy:** Public key = lock, Private key = key

**Why Separate:**
- Public key can be shared (stored on server)
- Private key stays secret (only in browser)
- Server can encrypt but never decrypt

### AES Encryption

**Symmetric Encryption:**
- Same key encrypts and decrypts
- Fast for large data
- Problem: How to share key securely?

**Solution:** Encrypt AES key with RSA!

### Initialization Vector (IV)

**What:** Random data used with encryption key
**Why:** Same file encrypted twice produces different ciphertext
**Security:** Prevents pattern analysis attacks

### Hash Verification

**SHA-256 Hash:**
- Unique fingerprint of file
- Detects any changes (even 1 bit)
- One-way function (cannot reverse)

**Usage:**
- Compute hash before encryption
- Store hash in database
- Verify hash after decryption
- If hash doesn't match → file was tampered!

## Code Walkthrough

### Frontend: Encryption Module

**File:** `frontend/src/services/crypto.js`

**Key Functions:**
1. `generateRSAKeyPair()` - Creates RSA keys
2. `generateAESKey()` - Creates AES key
3. `encryptFile()` - Encrypts file with AES
4. `encryptAESKey()` - Encrypts AES key with RSA
5. `decryptAESKey()` - Decrypts AES key with RSA
6. `decryptFile()` - Decrypts file with AES
7. `computeFileHash()` - Creates file hash

**All use Web Crypto API** - Built into modern browsers!

### Backend: File Storage

**File:** `backend/src/routes/files.js`

**Key Endpoints:**
1. `POST /api/files/upload` - Receives encrypted file
2. `GET /api/files/list` - Lists user's files
3. `GET /api/files/download/:id` - Returns encrypted file
4. `DELETE /api/files/delete/:id` - Deletes file

**Important:** Backend never decrypts anything!

### Database: Metadata Storage

**File:** `backend/src/models/file.js`

**Stores:**
- File metadata (name, size, type)
- Encrypted AES key (cannot decrypt)
- File hash (for verification)
- Storage path (where encrypted file is)

**Never Stores:**
- Plaintext file data
- Decrypted AES keys
- Private keys

## Security Guarantees

### What Server Cannot Do

1. ❌ Read file contents (encrypted)
2. ❌ Decrypt files (no private key)
3. ❌ Access user's private key (never stored)
4. ❌ Modify files undetected (hash verification)

### What Server Can Do

1. ✅ Store encrypted files
2. ✅ Manage file metadata
3. ✅ Authenticate users
4. ✅ Enforce access control

### What User Can Do

1. ✅ Encrypt and upload files
2. ✅ Download and decrypt files
3. ✅ Manage their own files
4. ✅ Verify file integrity

## Common Questions

### Q: Why not encrypt everything with RSA?
**A:** RSA is slow for large files. AES is much faster.

### Q: What if I lose my private key?
**A:** Files cannot be decrypted. Implement key backup!

### Q: Can server decrypt my files?
**A:** No! Server doesn't have private key.

### Q: What if someone steals encrypted files?
**A:** Without private key, files are useless.

### Q: Can files be shared between users?
**A:** Not in current implementation. Would need to encrypt AES key with multiple public keys.

### Q: Is this production-ready?
**A:** Core cryptography is solid. Add HTTPS, rate limiting, monitoring for production.

## Learning Resources

1. **Web Crypto API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
2. **AES-GCM:** https://en.wikipedia.org/wiki/Galois/Counter_Mode
3. **RSA-OAEP:** https://tools.ietf.org/html/rfc3447
4. **SHA-256:** https://en.wikipedia.org/wiki/SHA-2

## Next Steps

1. **Understand the code:** Read through each file
2. **Test the system:** Upload and download files
3. **Experiment:** Try modifying code to see what breaks
4. **Enhance:** Add features like file sharing
5. **Deploy:** Set up for production use

## Debugging Tips

### Check Browser Console
- Look for crypto errors
- Verify keys are loaded
- Check API responses

### Check Network Tab
- Verify encrypted data is sent
- Check API endpoints
- Verify authentication tokens

### Check Server Logs
- Look for errors
- Verify file storage
- Check database queries

### Common Issues

**"Private key not found"**
- Keys cleared from localStorage
- Need to regenerate keys

**"Decryption failed"**
- Wrong private key
- File corrupted
- Check error message

**"Hash mismatch"**
- File was tampered with
- Encryption/decryption error
- Check hash computation

## Summary

This system provides **end-to-end encryption** where:
- Files are encrypted **before** upload
- Server **never** sees plaintext
- Only user can decrypt with **private key**
- File integrity is **verified** with hashes

The combination of **AES (symmetric)** and **RSA (asymmetric)** encryption provides both **speed** and **security**!
