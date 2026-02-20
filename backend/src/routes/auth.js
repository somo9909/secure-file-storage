const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken } = require('../middleware/auth');
const { registerValidation, loginValidation, validate } = require('../utils/validation');
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

// Register new user
router.post('/register', ensureDbInitialized, registerValidation, validate, async (req, res) => {
  try {
    const { username, email, password, publicKey } = req.body;

    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user
    const userId = await User.create(username, email, password, publicKey);

    // Generate JWT token
    const token = generateToken(userId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        username,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', ensureDbInitialized, loginValidation, validate, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        publicKey: user.public_key
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user info
router.get('/me', ensureDbInitialized, require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        publicKey: user.public_key,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// Update public key
router.put('/public-key', ensureDbInitialized, require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey || publicKey.length < 100) {
      return res.status(400).json({ error: 'Invalid public key' });
    }

    await User.updatePublicKey(req.user.id, publicKey);

    res.json({
      message: 'Public key updated successfully'
    });
  } catch (error) {
    console.error('Update public key error:', error);
    res.status(500).json({ error: 'Failed to update public key' });
  }
});

module.exports = router;
