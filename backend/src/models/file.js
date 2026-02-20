const { dbGet, dbAll, dbRun } = require('../database/db');

class File {
  static async create(userId, filename, originalFilename, fileSize, mimeType, encryptedAesKey, fileHash, storagePath) {
    const result = await dbRun(
      `INSERT INTO files 
       (user_id, filename, original_filename, file_size, mime_type, encrypted_aes_key, file_hash, storage_path) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, filename, originalFilename, fileSize, mimeType, encryptedAesKey, fileHash, storagePath]
    );
    
    return result.lastID;
  }

  static async findById(id) {
    return await dbGet('SELECT * FROM files WHERE id = ?', [id]);
  }

  static async findByUserId(userId) {
    return await dbAll(
      'SELECT id, filename, original_filename, file_size, mime_type, uploaded_at FROM files WHERE user_id = ? ORDER BY uploaded_at DESC',
      [userId]
    );
  }

  static async findByUserIdAndFileId(userId, fileId) {
    return await dbGet(
      'SELECT * FROM files WHERE id = ? AND user_id = ?',
      [fileId, userId]
    );
  }

  static async delete(id, userId) {
    const result = await dbRun('DELETE FROM files WHERE id = ? AND user_id = ?', [id, userId]);
    return result.changes > 0;
  }

  static async getFileData(id, userId) {
    return await dbGet(
      'SELECT * FROM files WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  }
}

module.exports = File;
