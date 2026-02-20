import React, { useState, useEffect } from 'react';
import { generateRSAKeyPair, exportPublicKey, exportPrivateKey, importPublicKey, importPrivateKey } from '../services/crypto';
import { authAPI } from '../services/api';
import { storage } from '../utils/storage';

const KeyManager = ({ onKeyUpdate }) => {
  const [hasKeys, setHasKeys] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    checkKeys();
  }, []);

  const checkKeys = () => {
    const privateKey = storage.getPrivateKey();
    const publicKey = storage.getPublicKey();
    setHasKeys(!!(privateKey && publicKey));
  };

  const handleGenerateKeys = async () => {
    // Warn user if they already have keys
    const existingPrivateKey = storage.getPrivateKey();
    if (existingPrivateKey) {
      const confirmMessage = '⚠️ WARNING: You already have encryption keys!\n\n' +
        'Generating new keys will:\n' +
        '• Make ALL files encrypted with old keys INACCESSIBLE\n' +
        '• You will NOT be able to decrypt previously uploaded files\n' +
        '• This action CANNOT be undone\n\n' +
        'Are you absolutely sure you want to generate new keys?';
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    setGenerating(true);
    setError('');
    setMessage('');

    try {
      // Generate new RSA key pair
      const keyPair = await generateRSAKeyPair();
      const publicKeyPEM = await exportPublicKey(keyPair.publicKey);
      const privateKeyPEM = await exportPrivateKey(keyPair.privateKey);

      // Update public key on server
      await authAPI.updatePublicKey(publicKeyPEM);

      // Store keys locally
      storage.setPublicKey(publicKeyPEM);
      storage.setPrivateKey(privateKeyPEM);

      setHasKeys(true);
      if (existingPrivateKey) {
        setMessage('⚠️ New encryption keys generated! Files encrypted with old keys are now inaccessible.');
      } else {
        setMessage('✅ New encryption keys generated successfully!');
      }
      
      if (onKeyUpdate) {
        onKeyUpdate();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate keys');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportKeys = () => {
    const privateKey = storage.getPrivateKey();
    const publicKey = storage.getPublicKey();
    
    if (!privateKey || !publicKey) {
      setError('No keys to export. Please generate keys first.');
      return;
    }

    try {
      // Create JSON object with keys
      const keyData = {
        privateKey: privateKey,
        publicKey: publicKey,
        exportedAt: new Date().toISOString(),
        username: storage.getUser()?.username || 'unknown'
      };

      // Create blob and download
      const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `encryption-keys-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage('✅ Keys exported successfully! Save this file securely - you will need it to decrypt your files.');
    } catch (err) {
      setError('Failed to export keys: ' + err.message);
    }
  };

  const handleImportKeys = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setError('');
    setMessage('');

    try {
      const fileText = await file.text();
      const keyData = JSON.parse(fileText);

      if (!keyData.privateKey || !keyData.publicKey) {
        setError('Invalid key file format. Expected privateKey and publicKey fields.');
        setImporting(false);
        return;
      }

      // Verify keys are valid by trying to import them
      try {
        await importPrivateKey(keyData.privateKey);
        await importPublicKey(keyData.publicKey);
      } catch (err) {
        setError('Invalid key format: ' + err.message);
        setImporting(false);
        return;
      }

      // Check if user wants to proceed (may overwrite existing keys)
      const existingKeys = storage.getPrivateKey();
      if (existingKeys) {
        const confirmMessage = 'You already have keys stored.\n\n' +
          'Importing will replace your current keys.\n' +
          'Files encrypted with current keys may become inaccessible.\n\n' +
          'Continue?';
        
        if (!window.confirm(confirmMessage)) {
          setImporting(false);
          return;
        }
      }

      // Store imported keys
      storage.setPrivateKey(keyData.privateKey);
      storage.setPublicKey(keyData.publicKey);

      // Update public key on server
      await authAPI.updatePublicKey(keyData.publicKey);

      setHasKeys(true);
      setMessage('✅ Keys imported successfully! You can now decrypt files encrypted with these keys.');
      setShowImport(false);
      
      if (onKeyUpdate) {
        onKeyUpdate();
      }
    } catch (err) {
      setError('Failed to import keys: ' + err.message);
    } finally {
      setImporting(false);
      e.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="card">
      <h2>Encryption Key Management</h2>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {hasKeys ? (
        <div>
          <div className="alert alert-success">
            ✅ You have encryption keys set up. Your files are protected.
          </div>
          <p style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--neon-cyan)' }}>Important:</strong> Your private key is stored only in your browser. 
            If you clear browser data or use a different device, you'll need to import your key backup.
            Files encrypted with old keys cannot be decrypted with new keys.
          </p>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
            <button 
              onClick={handleExportKeys} 
              className="btn btn-success"
            >
              📥 Export Keys (Backup)
            </button>
            <button 
              onClick={() => setShowImport(!showImport)} 
              className="btn btn-secondary"
            >
              📤 Import Keys
            </button>
            <button 
              onClick={handleGenerateKeys} 
              className="btn btn-secondary"
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate New Keys'}
            </button>
          </div>

          {showImport && (
            <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(0, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(0, 255, 255, 0.2)' }}>
              <label htmlFor="key-import" className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: '10px' }}>
                {importing ? 'Importing...' : 'Choose Key Backup File'}
              </label>
              <input
                id="key-import"
                type="file"
                accept=".json"
                onChange={handleImportKeys}
                disabled={importing}
                style={{ display: 'none' }}
              />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '10px' }}>
                Select the key backup file you exported earlier (.json format)
              </p>
            </div>
          )}

          <p style={{ marginTop: '15px', fontSize: '14px', color: '#ff6b9d' }}>
            ⚠️ Warning: Generating new keys will make files encrypted with old keys inaccessible!
          </p>
        </div>
      ) : (
        <div>
          <div className="alert alert-info">
            ⚠️ You don't have encryption keys set up. Generate keys to start uploading encrypted files.
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
            <button 
              onClick={handleGenerateKeys} 
              className="btn btn-primary"
              disabled={generating}
            >
              {generating ? 'Generating Keys...' : 'Generate Encryption Keys'}
            </button>
            <button 
              onClick={() => setShowImport(!showImport)} 
              className="btn btn-secondary"
            >
              📤 Import Existing Keys
            </button>
          </div>

          {showImport && (
            <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(0, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(0, 255, 255, 0.2)' }}>
              <label htmlFor="key-import-new" className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: '10px' }}>
                {importing ? 'Importing...' : 'Choose Key Backup File'}
              </label>
              <input
                id="key-import-new"
                type="file"
                accept=".json"
                onChange={handleImportKeys}
                disabled={importing}
                style={{ display: 'none' }}
              />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '10px' }}>
                If you have a key backup file from a previous session, import it here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KeyManager;
