const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/file');
const { authenticateToken } = require('../middleware/auth');
const { uploadFileValidation, validate } = require('../utils/validation');
const { initDatabase } = require('../database/db');

// Initialize database on first request
let dbInitialized = false;
const ensureDbInitialized = async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (error) {
      return res.status(500).json({ error: 'Database initialization failed' });
    }
  }
  next();
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024 // 100MB default
  }
});

// Upload file
router.post('/upload', 
  ensureDbInitialized,
  authenticateToken,
  upload.single('file'),
  uploadFileValidation,
  validate,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { encryptedAesKey, fileHash, originalFilename } = req.body;

      if (!encryptedAesKey || !fileHash) {
        // Clean up uploaded file if validation fails
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Encrypted AES key and file hash are required' });
      }

      // Store file metadata in database
      const fileId = await File.create(
        req.user.id,
        req.file.filename,
        originalFilename || req.file.originalname,
        req.file.size,
        req.file.mimetype,
        encryptedAesKey,
        fileHash,
        req.file.path
      );

      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          id: fileId,
          filename: req.file.filename,
          originalFilename: originalFilename || req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          uploadedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      
      // Clean up uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ error: 'File upload failed' });
    }
  }
);

// Get all files for user
router.get('/list', ensureDbInitialized, authenticateToken, async (req, res) => {
  try {
    const files = await File.findByUserId(req.user.id);
    res.json({ files });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Download file
router.get('/download/:fileId', ensureDbInitialized, authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;

    // Get file metadata
    const fileData = await File.getFileData(parseInt(fileId), req.user.id);
    
    if (!fileData) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(fileData.storage_path)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    // Read encrypted file
    const encryptedFileBuffer = fs.readFileSync(fileData.storage_path);

    // Send encrypted file data along with encrypted AES key
    res.json({
      file: {
        id: fileData.id,
        originalFilename: fileData.original_filename,
        mimeType: fileData.mime_type,
        fileSize: fileData.file_size,
        fileHash: fileData.file_hash
      },
      encryptedFileData: encryptedFileBuffer.toString('base64'),
      encryptedAesKey: fileData.encrypted_aes_key
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Delete file
router.delete('/delete/:fileId', ensureDbInitialized, authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;

    // Get file data to find storage path
    const fileData = await File.getFileData(parseInt(fileId), req.user.id);
    
    if (!fileData) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete from database
    const deleted = await File.delete(parseInt(fileId), req.user.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file from disk
    if (fs.existsSync(fileData.storage_path)) {
      fs.unlinkSync(fileData.storage_path);
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
