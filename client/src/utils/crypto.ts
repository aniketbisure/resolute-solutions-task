import CryptoJS from 'crypto-js';

const FRONTEND_SECRET = 'xcvbhjiop';

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, FRONTEND_SECRET).toString();
};

export const decrypt = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, FRONTEND_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};
