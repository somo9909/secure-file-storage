const { body, validationResult } = require('express-validator');

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('publicKey')
    .notEmpty()
    .withMessage('Public key is required')
    .isLength({ min: 100 })
    .withMessage('Invalid public key format')
];

const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const uploadFileValidation = [
  body('encryptedAesKey')
    .notEmpty()
    .withMessage('Encrypted AES key is required'),
  
  body('fileHash')
    .notEmpty()
    .withMessage('File hash is required')
    .matches(/^[a-f0-9]{64}$/i)
    .withMessage('Invalid file hash format (must be SHA-256)')
];

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  uploadFileValidation,
  validate
};
