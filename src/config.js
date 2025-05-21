// FTP Server Configuration
export const ftpConfig = {
  host: 'globalftp.globaloring.com',
  user: 'stockfiles',
  password: 'tBDNWuVyV1@4M5JJUdMUio{k',
  secure: false, // Try without security first to test basic connectivity
  port: 21,      // Standard FTP port
  explicitTls: false
};

// Folder paths to check
export const folderPaths = [
  '/TTO/Processed',
  '/TEST/Processed'
]; 