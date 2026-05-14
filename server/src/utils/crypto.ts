import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const BACKEND_SECRET = process.env.BACKEND_SECRET || 'backend_secret_key';

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, BACKEND_SECRET).toString();
};

export const decrypt = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, BACKEND_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};
