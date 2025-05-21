// Import the basic-ftp package
import * as ftp from 'basic-ftp';

// FTP Configuration
const ftpConfig = {
  host: 'globalftp.globaloring.com',
  user: 'stockfiles',
  password: 'tBDNWuVyV1@4M5JJUdMUio%7Bk', // URL-encoded password
  port: 21,
  secure: true,
  explicitTls: true,
  secureOptions: { rejectUnauthorized: false } // Accept self-signed certificates
};

// Folder paths to check
const folderPaths = [
  '/TTO/Processed',
  '/TEST/Processed'
];

// Files to exclude
const EXCLUDED_FILES = ['desktop.ini'];

/**
 * Get the latest file from a directory
 * @param {ftp.Client} client - FTP client
 * @param {string} folderPath - Folder path to check
 * @returns {Promise<Object|null>} Latest file info or null if none found
 */
async function getLatestFileFromFolder(client, folderPath) {
  try {
    console.log(`\nChecking folder: ${folderPath}`);
    
    // List all files in the directory
    const fileList = await client.list(folderPath);
    
    // Filter out directories and excluded files
    const files = fileList.filter(item => 
      item.type === 1 && !EXCLUDED_FILES.includes(item.name.toLowerCase())
    );
    
    if (files.length === 0) {
      console.log(`No files found in ${folderPath}`);
      return null;
    }
    
    // Sort files by date, newest first
    files.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
    
    // Get the latest file
    const latestFile = files[0];
    console.log(`Latest file: ${latestFile.name} (${latestFile.modifiedAt.toLocaleString()})`);
    
    return {
      name: latestFile.name,
      date: latestFile.modifiedAt,
      size: latestFile.size,
      path: folderPath
    };
  } catch (error) {
    console.error(`Error checking folder ${folderPath}:`, error.message);
    return null;
  }
}

/**
 * Main function to check the latest files in specified folders
 */
async function checkLatestFiles() {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Enable logging
  
  try {
    console.log('Connecting to FTP server...');
    await client.access(ftpConfig);
    console.log('Connected successfully!');
    
    const results = [];
    
    // Check each folder
    for (const folderPath of folderPaths) {
      const latestFile = await getLatestFileFromFolder(client, folderPath);
      if (latestFile) {
        results.push(latestFile);
      }
    }
    
    // Display results
    console.log('\n===== LATEST FILES SUMMARY =====');
    if (results.length === 0) {
      console.log('No files found in any of the specified folders.');
    } else {
      results.forEach(file => {
        console.log(`Folder: ${file.path}`);
        console.log(`File: ${file.name}`);
        console.log(`Date: ${file.date.toLocaleString()}`);
        console.log(`Size: ${file.size} bytes`);
        console.log('----------------------------');
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.close();
    console.log('FTP connection closed');
  }
}

// Run the main function
checkLatestFiles().catch(console.error); 