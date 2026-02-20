# Security Documentation

This document outlines the security measures, threat model, and best practices for the Secure File Storage System.

## Security Architecture

### Zero-Knowledge Design

The system implements a **zero-knowledge architecture** where:
- The server **never** sees plaintext files
- The server **never** stores or has access to private keys
- All encryption/decryption happens **client-side**
- The server acts as a **dumb storage** for encrypted data

### Cryptographic Algorithms

#### File Encryption: AES-256-GCM
- **Algorithm:** Advanced Encryption Standard (AES)
- **Key Size:** 256 bits
- **Mode:** Galois/Counter Mode (GCM)
- **IV Size:** 96 bits (random per file)
- **Why GCM:** Provides authenticated encryption (confidentiality + integrity)

#### Key Encryption: RSA-2048-OAEP
- **Algorithm:** RSA (Rivest-Shamir-Adleman)
- **Key Size:** 2048 bits
- **Padding:** OAEP (Optimal Asymmetric Encryption Padding)
- **Hash:** SHA-256
- **MGF:** MGF1 with SHA-256
- **Why OAEP:** Secure padding scheme resistant to chosen ciphertext attacks

#### Integrity Verification: SHA-256
- **Algorithm:** Secure Hash Algorithm 256
- **Purpose:** Detect file tampering
- **Usage:** Hash computed before encryption, verified after decryption

## Threat Model

### Protected Against

#### 1. Server Compromise
- **Threat:** Attacker gains access to server or database
- **Protection:** Files are encrypted with AES-256. Even with database access, files remain encrypted.
- **Limitation:** Attacker could delete files or metadata

#### 2. Database Leak
- **Threat:** Database backup or dump is leaked
- **Protection:** All sensitive data is encrypted. AES keys are encrypted with RSA.
- **Limitation:** Attacker could see file metadata (names, sizes, dates)

#### 3. Insider Access
- **Threat:** Server administrator tries to read user files
- **Protection:** Server cannot decrypt files without private keys (stored only client-side)
- **Limitation:** Administrator could delete files or modify metadata

#### 4. Man-in-the-Middle Attack
- **Threat:** Attacker intercepts network traffic
- **Protection:** HTTPS/TLS encrypts all network communication
- **Requirement:** Must use HTTPS in production

#### 5. File Tampering
- **Threat:** Attacker modifies encrypted files
- **Protection:** SHA-256 hash verification detects modifications
- **Detection:** Download fails if hash doesn't match

### Not Protected Against

#### 1. Browser Compromise
- **Risk:** If browser is compromised (malware, XSS), private keys may be exposed
- **Mitigation:** Use browser extensions for key storage, implement CSP headers

#### 2. Key Loss
- **Risk:** If private key is lost (cleared localStorage), files cannot be decrypted
- **Mitigation:** Implement secure key backup mechanism

#### 3. Client-Side Attacks
- **Risk:** XSS attacks could steal private keys from localStorage
- **Mitigation:** Implement Content Security Policy, sanitize inputs, use HttpOnly cookies

#### 4. Physical Access
- **Risk:** If device is stolen and browser is unlocked, keys are accessible
- **Mitigation:** Implement device encryption, session timeouts, require re-authentication

## Security Measures Implemented

### 1. Authentication

- **Password Hashing:** bcrypt with 10 rounds
- **Session Management:** JWT tokens with 24-hour expiration
- **Password Requirements:** Minimum 8 characters, uppercase, lowercase, number
- **Token Storage:** localStorage (consider HttpOnly cookies for production)

### 2. Authorization

- **Access Control:** Users can only access their own files
- **File Ownership:** Verified on every request
- **Middleware:** Authentication required for all file operations

### 3. Input Validation

- **Server-Side:** All inputs validated using express-validator
- **File Size Limits:** Configurable (default 100MB)
- **File Type Validation:** MIME type checking
- **SQL Injection Protection:** Parameterized queries

### 4. Data Protection

- **Encryption at Rest:** Files stored encrypted on disk
- **Encryption in Transit:** HTTPS/TLS (required in production)
- **Key Management:** Private keys never leave client
- **Secure Random:** Uses crypto.getRandomValues() for IVs and keys

### 5. Integrity Verification

- **File Hashing:** SHA-256 computed before encryption
- **Hash Storage:** Stored in database
- **Hash Verification:** Verified after decryption
- **Tamper Detection:** Download fails if hash mismatch

## Security Best Practices

### For Developers

1. **Never log sensitive data**
   - Don't log passwords, keys, or file contents
   - Use environment variables for secrets

2. **Validate all inputs**
   - Server-side validation is mandatory
   - Client-side validation is for UX only

3. **Use HTTPS in production**
   - Never use HTTP for production
   - Use proper SSL/TLS certificates

4. **Keep dependencies updated**
   - Regularly update npm packages
   - Check for security vulnerabilities

5. **Implement rate limiting**
   - Prevent brute force attacks
   - Limit API requests per IP

6. **Proper error handling**
   - Don't expose stack traces in production
   - Use generic error messages

### For Users

1. **Protect your browser**
   - Use strong browser security settings
   - Be cautious of browser extensions
   - Keep browser updated

2. **Backup your keys**
   - Consider exporting private key securely
   - Store backup in secure location
   - Don't share private keys

3. **Use strong passwords**
   - Follow password requirements
   - Use unique passwords
   - Consider password manager

4. **Secure your device**
   - Use device encryption
   - Lock your device when not in use
   - Keep OS updated

## Security Checklist

### Development
- [x] Use proven cryptographic algorithms only
- [x] Never store private keys on server
- [x] Implement input validation
- [x] Use parameterized queries
- [x] Hash passwords with bcrypt
- [x] Use JWT for sessions
- [x] Verify file ownership
- [x] Implement integrity checks

### Production
- [ ] Enable HTTPS/TLS
- [ ] Use strong JWT_SECRET
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Use production database
- [ ] Implement key backup mechanism
- [ ] Add multi-factor authentication
- [ ] Set up regular backups
- [ ] Implement Content Security Policy
- [ ] Use HttpOnly cookies for tokens
- [ ] Set up intrusion detection
- [ ] Regular security audits

## Known Limitations

1. **localStorage Security:** Private keys stored in localStorage are vulnerable to XSS
2. **No Key Recovery:** Lost private keys mean lost files
3. **No File Sharing:** Files cannot be shared between users
4. **No Version Control:** No file versioning system
5. **Single Device:** Keys tied to browser/device

## Future Security Enhancements

1. **Hardware Security Module (HSM):** Store keys in hardware
2. **Key Escrow:** Secure key backup mechanism
3. **Multi-Factor Authentication:** Additional security layer
4. **File Sharing:** Encrypted file sharing between users
5. **Audit Logging:** Track all file operations
6. **Encryption Key Rotation:** Periodic key rotation support
7. **Zero-Knowledge Proofs:** Verify file integrity without decryption
8. **Secure Enclaves:** Use browser secure enclaves for key storage

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** create a public issue
2. Email security concerns privately
3. Provide detailed description
4. Include steps to reproduce
5. Allow time for fix before disclosure

## Compliance Considerations

This system may be suitable for:
- **GDPR:** Data encryption helps with data protection
- **HIPAA:** Encryption at rest and in transit
- **SOC 2:** Security controls implemented

However, additional measures may be required for full compliance:
- Audit logging
- Access controls
- Data retention policies
- Incident response procedures

## References

- [NIST Cryptographic Standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [RSA-OAEP Specification](https://tools.ietf.org/html/rfc3447)
- [AES-GCM Specification](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf)
