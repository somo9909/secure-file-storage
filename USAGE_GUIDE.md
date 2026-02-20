# Complete Usage Guide - Secure File Storage System

## 🎯 Quick Start (5 Minutes)

### First Time Setup

1. **Register Account**
   ```
   - Go to Register tab
   - Enter username, email, password
   - Click Register
   - Keys are automatically generated!
   ```

2. **Export Your Keys** ⚠️ CRITICAL STEP!
   ```
   - Go to "Key Management" tab
   - Click "Export Keys (Backup)"
   - Save the file securely (USB, cloud, password manager)
   - This is your ONLY way to recover files if browser data is cleared!
   ```

3. **Test the System**
   ```
   - Upload a small test file (like a text file)
   - Immediately download it
   - If download works → System is working correctly!
   ```

## 📖 Detailed Usage Instructions

### Uploading Files

**Step-by-Step:**
1. Make sure you're logged in
2. Go to Dashboard tab
3. Click "Choose File to Upload"
4. Select your file
5. Wait for encryption (happens automatically)
6. File appears in "Your Files" list

**What Happens:**
- File is encrypted with AES-256
- AES key is encrypted with your public key
- Encrypted file stored on server
- You can delete original file (encrypted version is safe)

### Downloading Files

**Step-by-Step:**
1. Go to Dashboard tab
2. Find file in "Your Files" list
3. Click "Download" button
4. File is decrypted automatically
5. File downloads to your computer

**What Happens:**
- Server sends encrypted file + encrypted AES key
- Browser decrypts AES key with your private key
- Browser decrypts file with AES key
- File integrity verified with hash
- Original file restored

### Key Management

#### Exporting Keys (Backup)

**When to Export:**
- Immediately after registration
- Before clearing browser data
- Before switching browsers/devices
- Periodically (monthly backup)

**How to Export:**
1. Go to "Key Management" tab
2. Click "Export Keys (Backup)"
3. File downloads automatically (JSON format)
4. Store securely:
   - Password-protected cloud storage
   - Encrypted USB drive
   - Password manager
   - Multiple locations (redundancy)

#### Importing Keys

**When to Import:**
- After clearing browser data
- On new browser/device
- After reinstalling browser
- If keys were lost

**How to Import:**
1. Go to "Key Management" tab
2. Click "Import Keys"
3. Select your key backup file (.json)
4. Keys are restored
5. Old files can now be decrypted

#### Generating New Keys

**⚠️ WARNING:** Only do this if:
- Your keys were compromised
- You want to start fresh
- You understand ALL old files become inaccessible

**How to Generate:**
1. Go to "Key Management" tab
2. Click "Generate New Keys"
3. Confirm the warning
4. New keys are created
5. Export new keys immediately!

## 🔄 Common Workflows

### Workflow 1: Daily Usage (Same Browser)

```
1. Login
2. Upload files
3. Download files when needed
4. Logout
```

**No special steps needed** - keys stay in browser.

### Workflow 2: Switching Browsers/Devices

```
1. Export keys from old browser
2. Login on new browser
3. Import keys on new browser
4. Now you can download files!
```

### Workflow 3: After Browser Data Cleared

```
1. Login (will show "no keys" warning)
2. Import keys from backup
3. Files are now accessible
```

### Workflow 4: Starting Fresh

```
1. Delete all old files (or accept they're inaccessible)
2. Generate new keys
3. Export new keys immediately
4. Start uploading files
```

## ✅ Best Practices

### Do's ✅

- **Export keys immediately** after registration
- **Test downloads** after uploading important files
- **Keep key backups** in multiple secure locations
- **Use same browser** for uploads and downloads
- **Keep original files** until you verify encrypted versions work
- **Export keys periodically** (monthly backups)
- **Test key import** on a test browser to verify backup works

### Don'ts ❌

- **Don't regenerate keys** unless absolutely necessary
- **Don't clear browser data** without exporting keys first
- **Don't delete original files** until you verify downloads work
- **Don't use different browsers** without importing keys
- **Don't lose key backups** - you'll lose access to files
- **Don't share private keys** - they're for you only
- **Don't store keys in plain text** - use password protection

## 🚨 Troubleshooting

### Can't Download Files

**Error: "Private key not found"**
- Solution: Import keys from backup
- If no backup: Files cannot be recovered

**Error: "Failed to decrypt AES key"**
- Cause: File encrypted with different keys
- Solution: Import correct keys, or re-upload file

**Error: "File integrity check failed"**
- Cause: File may be corrupted
- Solution: Try downloading again, or re-upload

### Keys Don't Match

**Symptom:** Can upload but can't download
- Cause: Keys regenerated after upload
- Solution: Import old keys, or re-upload files

### Lost Keys

**If you have backup:**
1. Import keys from backup
2. Files will decrypt successfully

**If you don't have backup:**
- Files encrypted with lost keys cannot be recovered
- This is by design for security
- Only option: Re-upload files if you have originals

## 📊 System Status Checklist

### Before Uploading Important Files

- [ ] Logged in successfully
- [ ] Keys exist (check Key Management)
- [ ] Can download test file
- [ ] Key backup exists and is accessible
- [ ] Using same browser as before

### Regular Maintenance

- [ ] Keys exported recently (monthly)
- [ ] Key backup stored securely
- [ ] Test download works
- [ ] No errors in browser console
- [ ] System working as expected

## 🎓 Understanding the System

### Why Keys Matter

**Keys are like a safe combination:**
- Public key = Lock (can be shared)
- Private key = Combination (must be secret)
- Lose combination = Can't open safe
- Same with keys = Lose private key = Can't decrypt files

### Why This Design?

**Security Benefits:**
- Server cannot read your files
- Administrators cannot access files
- True end-to-end encryption
- Your data is truly private

**Trade-offs:**
- You manage your own keys
- Lost keys = Lost files
- More responsibility on you

### The Encryption Process

```
Upload:
File → AES Encrypt → Encrypted File
AES Key → RSA Encrypt (Public Key) → Encrypted AES Key
Both stored on server

Download:
Encrypted AES Key → RSA Decrypt (Private Key) → AES Key
Encrypted File → AES Decrypt (AES Key) → Original File
```

## 📞 Getting Help

### If Something Doesn't Work

1. **Check error message** - it explains the issue
2. **Check Key Management** - verify keys exist
3. **Try importing keys** - if you have backup
4. **Check browser console** - for detailed errors
5. **Read documentation** - DOWNLOAD_ISSUE_FIX.md

### Common Questions

**Q: Can I recover files if I lose keys?**
A: No, this is by design. Without private key, files cannot be decrypted.

**Q: Can server decrypt my files?**
A: No, server never has your private key.

**Q: Can I share files with others?**
A: Not in current version. Files are encrypted with your keys only.

**Q: What if I regenerate keys?**
A: Files encrypted with old keys become inaccessible. Re-upload if you have originals.

## 🎯 Summary

**To use this system successfully:**

1. ✅ Register → Keys auto-generated
2. ✅ Export keys immediately (backup!)
3. ✅ Test upload/download
4. ✅ Use same browser/device
5. ✅ Keep key backups safe
6. ✅ Don't regenerate keys unnecessarily
7. ✅ Import keys when switching browsers

**Remember:** You are responsible for your keys. Protect them like you protect your password!

---

**Need more help?** See:
- `HOW_TO_USE.md` - Detailed usage guide
- `DOWNLOAD_ISSUE_FIX.md` - Download issues explained
- `TROUBLESHOOTING.md` - Common problems and solutions
