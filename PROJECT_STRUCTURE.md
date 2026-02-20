# Project Structure

Complete file structure of the Secure File Storage System.

```
FHC/
│
├── README.md                    # Main project documentation
├── ARCHITECTURE.md              # System architecture documentation
├── SETUP.md                     # Detailed setup instructions
├── SECURITY.md                  # Security documentation
├── QUICKSTART.md               # Quick start guide
├── PROJECT_STRUCTURE.md        # This file
├── .gitignore                  # Git ignore rules
│
├── backend/                    # Backend server (Node.js/Express)
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment variables template
│   ├── .gitignore            # Backend-specific ignores
│   │
│   ├── src/                  # Source code
│   │   ├── server.js         # Express server entry point
│   │   │
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js      # Authentication routes
│   │   │   └── files.js     # File upload/download routes
│   │   │
│   │   ├── middleware/      # Express middleware
│   │   │   └── auth.js      # JWT authentication middleware
│   │   │
│   │   ├── models/         # Data models
│   │   │   ├── user.js     # User model
│   │   │   └── file.js     # File model
│   │   │
│   │   ├── database/       # Database setup
│   │   │   ├── db.js       # Database connection and queries
│   │   │   └── init.js     # Database initialization script
│   │   │
│   │   └── utils/          # Utility functions
│   │       └── validation.js # Input validation rules
│   │
│   ├── uploads/            # Encrypted file storage (created at runtime)
│   └── database/          # SQLite database (created at runtime)
│
└── frontend/              # Frontend application (React)
    ├── package.json      # Frontend dependencies
    ├── .gitignore       # Frontend-specific ignores
    │
    ├── public/          # Static files
    │   └── index.html  # HTML template
    │
    └── src/            # Source code
        ├── index.js    # React entry point
        ├── index.css   # Global styles
        ├── App.js      # Main app component
        │
        ├── components/ # React components
        │   ├── Login.js        # Login form
        │   ├── Register.js     # Registration form
        │   ├── Dashboard.js    # File management dashboard
        │   └── KeyManager.js   # Encryption key management
        │
        ├── services/   # API and crypto services
        │   ├── api.js  # API client (axios)
        │   └── crypto.js # Cryptographic operations
        │
        └── utils/      # Utility functions
            └── storage.js # localStorage utilities
```

## Key Files Explained

### Backend

- **server.js**: Main Express server, sets up middleware and routes
- **routes/auth.js**: User registration, login, and key management endpoints
- **routes/files.js**: File upload, download, list, and delete endpoints
- **middleware/auth.js**: JWT token verification middleware
- **models/user.js**: User database operations
- **models/file.js**: File metadata database operations
- **database/db.js**: SQLite database connection and query helpers
- **utils/validation.js**: Input validation using express-validator

### Frontend

- **App.js**: Main application component, handles routing and authentication state
- **components/Login.js**: User login form
- **components/Register.js**: User registration form with key generation
- **components/Dashboard.js**: File upload/download interface
- **components/KeyManager.js**: RSA key pair generation and management
- **services/api.js**: Axios-based API client with token management
- **services/crypto.js**: All cryptographic operations using Web Crypto API
- **utils/storage.js**: localStorage helpers for keys and user data

## Data Flow

### Upload Flow
```
Dashboard.js → crypto.js (encrypt) → api.js → backend/routes/files.js → database
```

### Download Flow
```
Dashboard.js → api.js → backend/routes/files.js → Dashboard.js → crypto.js (decrypt)
```

## Database Schema

### users table
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- password_hash (TEXT)
- public_key (TEXT)
- created_at (DATETIME)

### files table
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER FOREIGN KEY)
- filename (TEXT)
- original_filename (TEXT)
- file_size (INTEGER)
- mime_type (TEXT)
- encrypted_aes_key (TEXT)
- file_hash (TEXT)
- storage_path (TEXT)
- uploaded_at (DATETIME)

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret for JWT tokens
- `MAX_FILE_SIZE`: Max upload size in bytes
- `UPLOAD_DIR`: Directory for file storage
- `DB_PATH`: Path to SQLite database

## Dependencies

### Backend
- express: Web framework
- sqlite3: Database
- bcrypt: Password hashing
- jsonwebtoken: JWT tokens
- multer: File uploads
- express-validator: Input validation
- cors: CORS middleware
- dotenv: Environment variables

### Frontend
- react: UI framework
- react-dom: React DOM rendering
- axios: HTTP client
- react-router-dom: Routing (if needed)

## Generated Files (Not in Git)

- `backend/uploads/`: Encrypted files
- `backend/database/storage.db`: SQLite database
- `backend/.env`: Environment variables
- `frontend/build/`: Production build
- `node_modules/`: Dependencies
