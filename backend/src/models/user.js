const { dbGet, dbRun, dbAll } = require('../database/db');
const bcrypt = require('bcrypt');

class User {
  static async create(username, email, password, publicKey) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await dbRun(
      'INSERT INTO users (username, email, password_hash, public_key) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, publicKey]
    );
    
    return result.lastID;
  }

  static async findByUsername(username) {
    return await dbGet('SELECT * FROM users WHERE username = ?', [username]);
  }

  static async findByEmail(email) {
    return await dbGet('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async findById(id) {
    return await dbGet('SELECT id, username, email, public_key, created_at FROM users WHERE id = ?', [id]);
  }

  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }

  static async updatePublicKey(userId, publicKey) {
    await dbRun('UPDATE users SET public_key = ? WHERE id = ?', [publicKey, userId]);
  }

  static async getAll() {
    return await dbAll('SELECT id, username, email, created_at FROM users');
  }
}

module.exports = User;
