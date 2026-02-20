# GitHub Setup Guide

Follow these steps to upload your project to GitHub.

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name:** `secure-file-storage` (or your preferred name)
   - **Description:** "Secure File Storage System Using Hybrid Cryptography - End-to-end encrypted file storage"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 2: Initialize Git (Already Done)

Git has been initialized in your project. If you need to do it manually:

```bash
git init
```

## Step 3: Add All Files

```bash
git add .
```

## Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Secure File Storage System with Hybrid Cryptography"
```

## Step 5: Connect to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

For example:
```bash
git remote add origin https://github.com/johndoe/secure-file-storage.git
```

## Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If prompted for credentials:
- Use a **Personal Access Token** (not your password)
- Create one at: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Give it `repo` scope

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh repo create secure-file-storage --public --source=. --remote=origin --push
```

## What's Included

✅ Complete source code (backend + frontend)  
✅ Comprehensive documentation  
✅ .gitignore (excludes node_modules, .env, etc.)  
✅ README.md with setup instructions  
✅ Architecture and security documentation  

## What's Excluded (.gitignore)

❌ node_modules/  
❌ .env files (sensitive data)  
❌ Database files  
❌ Uploaded files  
❌ Build outputs  
❌ Log files  

## After Uploading

1. **Add topics/tags** on GitHub:
   - `encryption`
   - `file-storage`
   - `security`
   - `cryptography`
   - `nodejs`
   - `react`
   - `end-to-end-encryption`

2. **Add a description** in repository settings

3. **Consider adding:**
   - License file (MIT recommended)
   - Contributing guidelines
   - Issue templates

## Troubleshooting

### "Repository not found"
- Check repository name and username
- Verify you have access to the repository

### "Authentication failed"
- Use Personal Access Token instead of password
- Check token has `repo` scope

### "Large file" errors
- Make sure .gitignore is working
- Check no large files are committed

### "Branch protection"
- If main branch is protected, create a different branch first

## Next Steps

After uploading:
1. Share the repository link
2. Add collaborators if needed
3. Set up GitHub Actions for CI/CD (optional)
4. Add badges to README (optional)

## Repository Structure

```
secure-file-storage/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
├── README.md         # Main documentation
├── ARCHITECTURE.md   # System design
├── SETUP.md          # Setup guide
├── SECURITY.md       # Security documentation
└── .gitignore        # Git ignore rules
```
