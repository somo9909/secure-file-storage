# How to Use the Secure File Storage System Properly

## 🎯 The Right Way to Use This System

### Step 1: First Time Setup (CRITICAL!)

1. **Register** a new account
   - Username, email, password
   - Keys are **automatically generated** during registration
   - **IMPORTANT:** Keys are stored in your browser's localStorage

2. **Export Your Keys Immediately** (NEW FEATURE!)
   - Go to "Key Management" tab
   - Click "Export Keys" button
   - Save the file securely (password-protected file, USB drive, etc.)
   - **This is your backup!** Without it, you lose access to files if browser data is cleared

3. **Test the System**
   - Upload a small test file
   - Download it immediately to verify it works
   - If download works, you're all set!

### Step 2: Daily Usage

1. **Login** to your account
   - System checks if your keys match
   - If keys don't match, you'll see a warning

2. **Upload Files**
   - Click "Choose File to Upload"
   - File is encrypted automatically
   - Only upload files you can decrypt (with current keys)

3. **Download Files**
   - Click "Download" on any file
   - File is decrypted automatically
   - If decryption fails, see troubleshooting below

### Step 3: Key Management

**✅ DO:**
- Export keys after registration
- Keep key backup in secure location
- Use same browser/device for uploads and downloads
- Test downloads after uploading

**❌ DON'T:**
- Regenerate keys unless absolutely necessary
- Clear browser data without backing up keys first
- Use different browsers/devices without importing keys
- Delete key backups

## 🔧 Current Situation: Your File Issue

### What Happened

Your file `nptel_payment.pdf` was encrypted with **old keys** that you no longer have. This happened because:
- Keys were regenerated after upload, OR
- Browser data was cleared, OR  
- You're on a different browser/device

### Solutions

#### Option 1: If You Have the Original File (EASIEST)

1. Delete the encrypted file from the system
2. Upload the original file again
3. It will be encrypted with your current keys
4. You can now download it successfully

#### Option 2: Import Old Keys (If You Have Backup)

1. Go to "Key Management"
2. Click "Import Keys"
3. Select your key backup file
4. Enter password (if encrypted)
5. Old files will now decrypt

#### Option 3: Accept Data Loss

If you:
- Don't have original file
- Don't have key backup
- Regenerated keys after upload

Unfortunately, the file cannot be recovered. This is by design for security.

## 📋 Proper Usage Checklist

### ✅ Before First Upload

- [ ] Registered account
- [ ] Keys generated automatically
- [ ] Exported keys to secure backup
- [ ] Tested upload/download with small file

### ✅ Regular Usage

- [ ] Using same browser/device
- [ ] Keys still in browser (check Key Management)
- [ ] Can download previously uploaded files
- [ ] Key backup is safe and accessible

### ✅ Before Clearing Browser Data

- [ ] Exported keys to backup
- [ ] Verified backup file is accessible
- [ ] Understand that clearing data = losing keys
- [ ] Know how to import keys back

### ✅ Before Regenerating Keys

- [ ] Understand ALL old files become inaccessible
- [ ] Have backups of files you need
- [ ] Really need to regenerate (security issue?)
- [ ] Confirmed you want to proceed

## 🚨 Common Mistakes to Avoid

### Mistake 1: Regenerating Keys Without Backup
**Problem:** All files encrypted with old keys become inaccessible  
**Solution:** Only regenerate if absolutely necessary, and backup files first

### Mistake 2: Clearing Browser Data
**Problem:** Private keys stored in localStorage are lost  
**Solution:** Export keys before clearing browser data

### Mistake 3: Using Different Browser/Device
**Problem:** Keys are browser-specific, files won't decrypt  
**Solution:** Import keys on new browser/device before downloading

### Mistake 4: Not Testing After Setup
**Problem:** Discover issues only when you need files  
**Solution:** Test upload/download immediately after registration

## 💡 Pro Tips

1. **Keep Original Files:** Don't delete originals until you verify encrypted versions work
2. **Regular Backups:** Export keys periodically
3. **Test Downloads:** After uploading important files, download them to verify
4. **Same Browser:** Stick to one browser for this system
5. **Key Backup Location:** Store key backup in multiple secure locations

## 🔐 Security vs Usability Trade-off

**Why This System Works This Way:**

✅ **Security Benefits:**
- Server cannot read your files (even if compromised)
- Administrators cannot access your files
- True end-to-end encryption
- Your data is truly private

⚠️ **Usability Trade-offs:**
- You must manage your own keys
- Lost keys = lost files
- Keys tied to browser/device
- More responsibility on user

**This is the price of true security!** You trade convenience for privacy.

## 🆘 Getting Help

### If Download Fails:

1. **Check Key Status**
   - Go to "Key Management"
   - Verify keys exist
   - Check if keys match server

2. **Check Error Message**
   - "Private key not found" → Generate/import keys
   - "Failed to decrypt AES key" → Keys don't match, file encrypted with different keys
   - "File integrity check failed" → File may be corrupted

3. **Try Solutions**
   - Import keys if you have backup
   - Re-upload file if you have original
   - Contact support if neither works

## 📚 Next Steps

1. **Read:** `DOWNLOAD_ISSUE_FIX.md` for detailed explanation
2. **Read:** `SECURITY.md` for security details
3. **Read:** `ARCHITECTURE.md` for how it works
4. **Practice:** Upload small test files to learn the system

## ✅ Summary

**To use this system properly:**

1. ✅ Register → Keys auto-generated
2. ✅ Export keys immediately (backup!)
3. ✅ Test upload/download
4. ✅ Use same browser/device
5. ✅ Don't regenerate keys unnecessarily
6. ✅ Keep key backups safe
7. ✅ Keep original files until verified

**Remember:** With great security comes great responsibility. You are in control of your keys and your data!
