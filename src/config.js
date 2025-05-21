import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// FTP Configuration
export const ftpConfig = {
  host: process.env.FTP_HOST || 'globalftp.globaloring.com',
  user: process.env.FTP_USERNAME || 'stockfiles',
  password: process.env.FTP_PASSWORD || 'tBDNWuVyV1@4M5JJUdMUio%7Bk',
  port: parseInt(process.env.FTP_PORT || '21'),
  secure: process.env.FTP_SECURE === 'false' ? false : true,
  explicitTls: process.env.FTP_EXPLICIT_TLS === 'false' ? false : true,
  secureOptions: { rejectUnauthorized: false }
};

// Folder paths to check
export const folderPaths = [
  process.env.FOLDER_1_PATH || '/TTO/Processed',
  process.env.FOLDER_2_PATH || '/TEST/Processed'
];

// Files to exclude
export const excludedFiles = ['desktop.ini']; 