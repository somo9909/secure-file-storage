import React, { useState, useEffect } from 'react';
import { fileAPI } from '../services/api';
import {
  generateAESKey,
  encryptFile,
  encryptAESKey,
  decryptAESKey,
  decryptFile,
  computeFileHash,
  combineIVAndData,
  separateIVAndData,
  importPrivateKey,
  importPublicKey,
} from '../services/crypto';
import { storage } from '../utils/storage';

const Dashboard = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadFiles();
    checkKeyStatus();
  }, []);

  const checkKeyStatus = () => {
    const privateKey = storage.getPrivateKey();
    const publicKey = storage.getPublicKey();
    
    if (!privateKey || !publicKey) {
      setError('⚠️ Encryption keys not found. Please go to "Key Management" to generate keys. Note: Files encrypted with previous keys may not be accessible.');
    }
  };

  const loadFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fileAPI.list();
      setFiles(response.files || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      // Check if user has encryption keys
      const privateKey = storage.getPrivateKey();
      const publicKey = storage.getPublicKey();
      
      if (!privateKey || !publicKey) {
        setError('Please generate encryption keys first!');
        setUploading(false);
        return;
      }

      // Import public key for encryption
      const publicKeyCrypto = await importPublicKey(publicKey);

      // Generate AES key for this file
      const aesKey = await generateAESKey();

      // Encrypt file with AES
      const { encryptedData, iv } = await encryptFile(file, aesKey);

      // Encrypt AES key with RSA public key
      const encryptedAesKey = await encryptAESKey(aesKey, publicKeyCrypto);

      // Compute file hash
      const fileHash = await computeFileHash(file);

      // Combine IV and encrypted data
      const combinedData = combineIVAndData(encryptedData, iv);

      // Create blob from combined data
      const encryptedBlob = new Blob([combinedData]);
      const encryptedFile = new File([encryptedBlob], file.name, { type: file.type });

      // Upload encrypted file
      await fileAPI.upload(
        encryptedFile,
        encryptedAesKey,
        fileHash,
        file.name
      );

      setSuccess(`File "${file.name}" uploaded and encrypted successfully!`);
      loadFiles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleFileDownload = async (fileId, originalFilename) => {
    setError('');
    setDownloading({ ...downloading, [fileId]: true });

    try {
      // Get private key
      const privateKeyPEM = storage.getPrivateKey();
      if (!privateKeyPEM) {
        setError('Private key not found. Cannot decrypt file. If you regenerated keys, files encrypted with old keys cannot be decrypted.');
        setDownloading({ ...downloading, [fileId]: false });
        return;
      }

      // Import private key
      let privateKey;
      try {
        privateKey = await importPrivateKey(privateKeyPEM);
      } catch (err) {
        setError('Invalid private key format. Please regenerate keys in Key Management.');
        setDownloading({ ...downloading, [fileId]: false });
        return;
      }

      // Download encrypted file data
      const response = await fileAPI.download(fileId);
      const { encryptedFileData, encryptedAesKey, file } = response;

      // Decrypt AES key
      let aesKey;
      try {
        aesKey = await decryptAESKey(encryptedAesKey, privateKey);
      } catch (err) {
        setError('Failed to decrypt AES key. This usually means the file was encrypted with a different key pair. If you regenerated keys, files encrypted with old keys cannot be decrypted.');
        setDownloading({ ...downloading, [fileId]: false });
        return;
      }

      // Convert base64 to ArrayBuffer
      const encryptedBuffer = base64ToArrayBuffer(encryptedFileData);

      // Separate IV and encrypted data
      const { iv, encryptedData } = separateIVAndData(encryptedBuffer);

      // Decrypt file
      const decryptedData = await decryptFile(encryptedData, aesKey, iv);

      // Verify hash
      const computedHash = await computeFileHash(decryptedData);
      if (computedHash !== file.fileHash) {
        setError('File integrity check failed! File may have been tampered with.');
        return;
      }

      // Create download link
      const blob = new Blob([decryptedData], { type: file.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(`File "${file.originalFilename}" downloaded and decrypted successfully!`);
    } catch (err) {
      console.error('Download error:', err);
      if (err.message && err.message.includes('decrypt')) {
        setError('Decryption failed. The file may have been encrypted with a different key pair. If you regenerated keys after uploading this file, it cannot be decrypted with the new keys.');
      } else {
        setError(err.response?.data?.error || 'Failed to download file: ' + err.message);
      }
    } finally {
      setDownloading({ ...downloading, [fileId]: false });
    }
  };

  const handleFileDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    setError('');
    try {
      await fileAPI.delete(fileId);
      setSuccess('File deleted successfully!');
      loadFiles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Helper function
  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  return (
    <div>
      <div className="card">
        <h2>File Storage Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Welcome, <strong style={{ color: 'var(--neon-cyan)' }}>{user.username}</strong>! Upload files to encrypt and store them securely.
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="file-upload" className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
            {uploading ? 'Uploading...' : 'Choose File to Upload'}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="card">
        <h2>Your Files</h2>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            No files uploaded yet. Upload your first file to get started!
          </p>
        ) : (
          <ul className="file-list">
            {files.map((file) => (
              <li key={file.id} className="file-item">
                <div className="file-info">
                  <div className="file-name">{file.original_filename}</div>
                  <div className="file-meta">
                    {formatFileSize(file.file_size)} • {file.mime_type || 'Unknown type'} • {formatDate(file.uploaded_at)}
                  </div>
                </div>
                <div className="file-actions">
                  <button
                    onClick={() => handleFileDownload(file.id, file.original_filename)}
                    className="btn btn-primary"
                    disabled={downloading[file.id]}
                  >
                    {downloading[file.id] ? 'Decrypting...' : 'Download'}
                  </button>
                  <button
                    onClick={() => handleFileDelete(file.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
