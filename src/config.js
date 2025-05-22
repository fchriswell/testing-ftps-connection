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

// Folder paths and thresholds
export const folderConfigs = [
  {
    path: process.env.FOLDER_1_PATH,
    threshold: parseInt(process.env.FOLDER_1_THRESHOLD || '7')
  },
  {
    path: process.env.FOLDER_2_PATH,
    threshold: parseInt(process.env.FOLDER_2_THRESHOLD || '7')
  }
];

// Email configuration
export const emailConfig = {
  sender: process.env.SENDER_EMAIL,
  password: process.env.SENDER_PASSWORD,
  recipients: [
    process.env.RECIPIENT_EMAIL_1,
    process.env.RECIPIENT_EMAIL_2
  ].filter(Boolean) // Filter out undefined or empty values
};

// Files to exclude
export const excludedFiles = ['desktop.ini']; 