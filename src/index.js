import * as ftp from 'basic-ftp';
import { ftpConfig, folderPaths } from './config.js';

/**
 * Connect to FTP server and find the latest file in a directory
 * @param {string} folderPath - Path to check on the FTP server
 * @returns {Promise<string|null>} - Name of the latest file or null if no files found
 */
async function getLatestFileFromFolder(client, folderPath) {
  try {
    console.log(`Checking folder: ${folderPath}`);
    
    // List all files in the directory
    const fileList = await client.list(folderPath);
    
    // Filter out directories, keep only files
    const files = fileList.filter(item => item.type === 1);
    
    if (files.length === 0) {
      return null;
    }
    
    // Sort files by date, newest first
    files.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Return the name of the newest file
    return files[0].name;
  } catch (error) {
    console.error(`Error checking folder ${folderPath}:`, error);
    return null;
  }
}

/**
 * Main function to check all configured folders
 */
async function checkLatestFiles() {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Enable logging for troubleshooting
  
  // Configure longer timeout (30 seconds)
  client.ftp.timeout = 30000;
  
  try {
    // Connect to the FTP server
    console.log('Connecting to FTP server...');
    console.log(`Host: ${ftpConfig.host}`);
    console.log(`Port: ${ftpConfig.port || 21}`);
    console.log(`User: ${ftpConfig.user}`);
    console.log(`Secure mode: ${ftpConfig.secure ? 'Yes' : 'No'}`);
    console.log(`Explicit TLS: ${ftpConfig.explicitTls ? 'Yes' : 'No'}`);
    
    await client.access({
      host: ftpConfig.host,
      user: ftpConfig.user,
      password: ftpConfig.password,
      secure: ftpConfig.secure,
      port: ftpConfig.port || 21,
      secureOptions: { rejectUnauthorized: false }, // For self-signed certificates
      ...(ftpConfig.explicitTls ? { explicitTls: true } : {})
    });
    
    console.log('Connected successfully!');
    
    // Check each folder and get the latest file
    const results = {};
    
    for (const folderPath of folderPaths) {
      const latestFile = await getLatestFileFromFolder(client, folderPath);
      results[folderPath] = latestFile || 'No files found';
    }
    
    console.log('\nLATEST FILES:');
    console.log('--------------');
    Object.entries(results).forEach(([folder, file]) => {
      console.log(`${folder}: ${file}`);
    });
    
  } catch (error) {
    console.error('Error occurred:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify the server address is correct');
    console.log('2. Check that the username and password are correct');
    console.log('3. Ensure the server is accessible from your network');
    console.log('4. Verify if the server requires explicit FTPS (PORT 990) instead of implicit');
    console.log('5. Check if a firewall is blocking the connection');
  } finally {
    client.close(); // Always close the connection
    console.log('FTP connection closed');
  }
}

// Run the main function
checkLatestFiles().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
}); 