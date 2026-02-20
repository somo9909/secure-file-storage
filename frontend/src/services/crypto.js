/**
 * Cryptographic Operations Module
 * 
 * This module handles all client-side cryptographic operations:
 * - RSA key pair generation
 * - AES-256-GCM encryption/decryption
 * - RSA-OAEP encryption/decryption
 * - SHA-256 hashing
 */

/**
 * Generate RSA key pair (2048 bits)
 * @returns {Promise<{publicKey: CryptoKey, privateKey: CryptoKey}>}
 */
export async function generateRSAKeyPair() {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );

    return keyPair;
  } catch (error) {
    console.error('Error generating RSA key pair:', error);
    throw new Error('Failed to generate RSA key pair');
  }
}

/**
 * Export public key to PEM format
 * @param {CryptoKey} publicKey
 * @returns {Promise<string>}
 */
export async function exportPublicKey(publicKey) {
  try {
    const exported = await window.crypto.subtle.exportKey('spki', publicKey);
    const exportedAsBase64 = arrayBufferToBase64(exported);
    return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
  } catch (error) {
    console.error('Error exporting public key:', error);
    throw new Error('Failed to export public key');
  }
}

/**
 * Export private key to PEM format
 * @param {CryptoKey} privateKey
 * @returns {Promise<string>}
 */
export async function exportPrivateKey(privateKey) {
  try {
    const exported = await window.crypto.subtle.exportKey('pkcs8', privateKey);
    const exportedAsBase64 = arrayBufferToBase64(exported);
    return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
  } catch (error) {
    console.error('Error exporting private key:', error);
    throw new Error('Failed to export private key');
  }
}

/**
 * Import public key from PEM format
 * @param {string} pemKey
 * @returns {Promise<CryptoKey>}
 */
export async function importPublicKey(pemKey) {
  try {
    const pemHeader = '-----BEGIN PUBLIC KEY-----';
    const pemFooter = '-----END PUBLIC KEY-----';
    const pemContents = pemKey
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');
    
    const binaryDer = base64ToArrayBuffer(pemContents);
    
    const publicKey = await window.crypto.subtle.importKey(
      'spki',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    );

    return publicKey;
  } catch (error) {
    console.error('Error importing public key:', error);
    throw new Error('Failed to import public key');
  }
}

/**
 * Import private key from PEM format
 * @param {string} pemKey
 * @returns {Promise<CryptoKey>}
 */
export async function importPrivateKey(pemKey) {
  try {
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = pemKey
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');
    
    const binaryDer = base64ToArrayBuffer(pemContents);
    
    const privateKey = await window.crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    );

    return privateKey;
  } catch (error) {
    console.error('Error importing private key:', error);
    throw new Error('Failed to import private key');
  }
}

/**
 * Generate random AES-256 key
 * @returns {Promise<CryptoKey>}
 */
export async function generateAESKey() {
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );

    return key;
  } catch (error) {
    console.error('Error generating AES key:', error);
    throw new Error('Failed to generate AES key');
  }
}

/**
 * Encrypt file using AES-256-GCM
 * @param {File|ArrayBuffer} fileData
 * @param {CryptoKey} aesKey
 * @returns {Promise<{encryptedData: ArrayBuffer, iv: Uint8Array}>}
 */
export async function encryptFile(fileData, aesKey) {
  try {
    // Convert File to ArrayBuffer if needed
    let fileBuffer;
    if (fileData instanceof File) {
      fileBuffer = await fileData.arrayBuffer();
    } else {
      fileBuffer = fileData;
    }

    // Generate random IV (96 bits for GCM)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt file
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      aesKey,
      fileBuffer
    );

    return {
      encryptedData,
      iv,
    };
  } catch (error) {
    console.error('Error encrypting file:', error);
    throw new Error('Failed to encrypt file');
  }
}

/**
 * Decrypt file using AES-256-GCM
 * @param {ArrayBuffer} encryptedData
 * @param {CryptoKey} aesKey
 * @param {Uint8Array} iv
 * @returns {Promise<ArrayBuffer>}
 */
export async function decryptFile(encryptedData, aesKey, iv) {
  try {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      aesKey,
      encryptedData
    );

    return decryptedData;
  } catch (error) {
    console.error('Error decrypting file:', error);
    throw new Error('Failed to decrypt file');
  }
}

/**
 * Encrypt AES key using RSA-OAEP
 * @param {CryptoKey} aesKey
 * @param {CryptoKey} publicKey
 * @returns {Promise<string>} Base64 encoded encrypted key
 */
export async function encryptAESKey(aesKey, publicKey) {
  try {
    // Export AES key
    const exportedKey = await window.crypto.subtle.exportKey('raw', aesKey);
    
    // Encrypt with RSA
    const encryptedKey = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      exportedKey
    );

    // Convert to base64 string
    return arrayBufferToBase64(encryptedKey);
  } catch (error) {
    console.error('Error encrypting AES key:', error);
    throw new Error('Failed to encrypt AES key');
  }
}

/**
 * Decrypt AES key using RSA-OAEP
 * @param {string} encryptedKeyBase64
 * @param {CryptoKey} privateKey
 * @returns {Promise<CryptoKey>}
 */
export async function decryptAESKey(encryptedKeyBase64, privateKey) {
  try {
    // Convert base64 to ArrayBuffer
    const encryptedKey = base64ToArrayBuffer(encryptedKeyBase64);
    
    // Decrypt with RSA
    const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      encryptedKey
    );

    // Import as AES key
    const aesKey = await window.crypto.subtle.importKey(
      'raw',
      decryptedKeyBuffer,
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    return aesKey;
  } catch (error) {
    console.error('Error decrypting AES key:', error);
    throw new Error('Failed to decrypt AES key');
  }
}

/**
 * Compute SHA-256 hash of file
 * @param {File|ArrayBuffer} fileData
 * @returns {Promise<string>} Hex string of hash
 */
export async function computeFileHash(fileData) {
  try {
    // Convert File to ArrayBuffer if needed
    let fileBuffer;
    if (fileData instanceof File) {
      fileBuffer = await fileData.arrayBuffer();
    } else {
      fileBuffer = fileData;
    }

    const hashBuffer = await window.crypto.subtle.digest('SHA-256', fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('Error computing file hash:', error);
    throw new Error('Failed to compute file hash');
  }
}

/**
 * Combine IV and encrypted data for storage
 * @param {ArrayBuffer} encryptedData
 * @param {Uint8Array} iv
 * @returns {ArrayBuffer}
 */
export function combineIVAndData(encryptedData, iv) {
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedData), iv.length);
  return combined.buffer;
}

/**
 * Separate IV and encrypted data
 * @param {ArrayBuffer} combinedData
 * @returns {{iv: Uint8Array, encryptedData: ArrayBuffer}}
 */
export function separateIVAndData(combinedData) {
  const iv = new Uint8Array(combinedData, 0, 12);
  const encryptedData = combinedData.slice(12);
  return { iv, encryptedData };
}

// Helper functions
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
