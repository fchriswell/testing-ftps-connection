import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// FTP Configuration
export const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  port: parseInt(process.env.FTP_PORT || '21'),
  secure: process.env.FTP_SECURE === 'false' ? false : true,
  explicitTls: process.env.FTP_EXPLICIT_TLS === 'false' ? false : true,
  secureOptions: { rejectUnauthorized: false }
};

// Folder paths to check
export const folderPaths = [
  process.env.FOLDER_1_PATH,
  process.env.FOLDER_2_PATH
];

// Files to exclude
export const excludedFiles = ['desktop.ini']; 