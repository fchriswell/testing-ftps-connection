// Import the basic-ftp package
import * as ftp from 'basic-ftp';
import { ftpConfig, folderConfigs, excludedFiles } from './src/config.js';
import { sendAgeAlert } from './src/emailService.js';

// Files to exclude
const EXCLUDED_FILES = excludedFiles;

/**
 * Calculate days between two dates
 * @param {Date} date - The date to compare
 * @returns {number} Number of days
 */
function getDaysSince(date) {
  const now = new Date();
  const diffTime = Math.abs(now - date);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

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
    const daysSince = getDaysSince(latestFile.modifiedAt);
    
    console.log(`Latest file: ${latestFile.name} (${latestFile.modifiedAt.toLocaleString()})`);
    console.log(`Days since last update: ${daysSince}`);
    
    return {
      name: latestFile.name,
      date: latestFile.modifiedAt,
      size: latestFile.size,
      path: folderPath,
      daysSince: daysSince
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
    console.log(`Host: ${ftpConfig.host}`);
    console.log(`Port: ${ftpConfig.port}`);
    console.log(`Secure: ${ftpConfig.secure}`);
    console.log(`Explicit TLS: ${ftpConfig.explicitTls}`);
    
    await client.access(ftpConfig);
    console.log('Connected successfully!');
    
    const results = [];
    const alertFolders = [];
    
    // Check each folder
    for (const folderConfig of folderConfigs) {
      if (!folderConfig.path) continue;
      
      const latestFile = await getLatestFileFromFolder(client, folderConfig.path);
      
      if (latestFile) {
        results.push(latestFile);
        
        // Check if the file is older than the threshold
        if (latestFile.daysSince > folderConfig.threshold) {
          console.log(`⚠️ Alert: Folder ${folderConfig.path} hasn't been updated in ${latestFile.daysSince} days`);
          
          alertFolders.push({
            path: folderConfig.path,
            fileName: latestFile.name,
            lastUpdated: latestFile.date,
            daysSinceUpdate: latestFile.daysSince,
            threshold: folderConfig.threshold
          });
        }
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
        console.log(`Days since update: ${file.daysSince}`);
        console.log('----------------------------');
      });
    }
    
    // Send alerts if any folders exceeded their threshold
    if (alertFolders.length > 0) {
      console.log(`\nSending alerts for ${alertFolders.length} folders...`);
      await sendAgeAlert(alertFolders);
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