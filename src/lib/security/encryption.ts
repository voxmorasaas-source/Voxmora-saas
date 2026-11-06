import 'server-only';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getMasterKey(): Buffer {
  const hexKey = process.env.ENCRYPTION_MASTER_KEY;
  if (!hexKey || hexKey.length !== 64) {
    // 32 bytes in hex = 64 characters
    throw new Error('ENCRYPTION_MASTER_KEY must be a 64-character hex string (32 bytes)');
  }
  return Buffer.from(hexKey, 'hex');
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getMasterKey(), iv);
  
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Combine IV + AuthTag + EncryptedData into a single base64 string
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decrypt(encryptedPayload: string): string {
  const buffer = Buffer.from(encryptedPayload, 'base64');
  
  const iv = buffer.subarray(0, IV_LENGTH);
  const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const data = buffer.subarray(IV_LENGTH + TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, getMasterKey(), iv);
  decipher.setAuthTag(tag);

  return decipher.update(data) + decipher.final('utf8');
}

