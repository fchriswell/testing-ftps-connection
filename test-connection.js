// Import the basic-ftp package
import * as ftp from 'basic-ftp';
import { ftpConfig, folderPaths } from './src/config.js';

// Create an FTP client
const client = new ftp.Client();
client.ftp.verbose = true; // Enable logging for troubleshooting

// Function to test connection with specific options
async function testConnection(options) {
  console.log(`\n\nTesting connection with options: ${JSON.stringify(options, null, 2)}`);
  
  try {
    // Set a longer timeout (30 seconds)
    client.ftp.timeout = 30000;
    
    // Try to connect
    console.log('Connecting...');
    await client.access(options);
    
    console.log('CONNECTION SUCCESSFUL!');
    console.log('Current directory:', await client.pwd());
    
    // Try to list files in the root directory
    console.log('Listing directory contents:');
    const list = await client.list();
    console.log(list);
    
    return true;
  } catch (err) {
    console.error('Connection failed:', err.message);
    return false;
  }
}

// Main function to try different connection methods
async function tryConnectionMethods() {
  // Base options from config but with port 21 explicitly set
  const baseOptions = {
    host: ftpConfig.host,
    user: ftpConfig.user,
    password: ftpConfig.password,
    port: 21
  };
  
  try {
    // Define all connection methods to try
    const connectionMethods = [
      // Method 1: Explicit FTPS with TLS (most promising from previous test)
      {
        ...baseOptions,
        secure: true,
        explicitTls: true,
        secureOptions: { rejectUnauthorized: false }
      },
      
      // Method 2: Regular FTP (no encryption)
      {
        ...baseOptions,
        secure: false
      },
      
      // Method 3: Try with escaped special character in password
      {
        ...baseOptions,
        password: 'tBDNWuVyV1@4M5JJUdMUio\\{k', // Escape the { character
        secure: true,
        explicitTls: true,
        secureOptions: { rejectUnauthorized: false }
      },
      
      // Method 4: Try with URL encoded special character in password
      {
        ...baseOptions,
        password: 'tBDNWuVyV1@4M5JJUdMUio%7Bk', // URL encode the { character
        secure: true,
        explicitTls: true,
        secureOptions: { rejectUnauthorized: false }
      },
      
      // Method 5: Try with domain-qualified username
      {
        ...baseOptions,
        user: 'stockfiles@globalftp.globaloring.com',
        secure: true,
        explicitTls: true,
        secureOptions: { rejectUnauthorized: false }
      }
    ];
    
    // Try each connection method
    console.log('Attempting to connect to FTP server with different methods...');
    let successfulMethod = null;
    
    for (let i = 0; i < connectionMethods.length; i++) {
      const method = connectionMethods[i];
      if (await testConnection(method)) {
        console.log(`Success with connection method ${i + 1}!`);
        successfulMethod = method;
        break;
      }
    }
    
    if (!successfulMethod) {
      console.log('All connection attempts failed.');
      console.log('\nTroubleshooting tips:');
      console.log('1. Verify the server address is correct');
      console.log('2. Check that the username and password are correct');
      console.log('3. Ensure the server is accessible from your network');
      console.log('4. Check if a firewall is blocking the connection');
      console.log('5. Contact the server administrator for the exact connection details');
    }
  } catch (err) {
    console.error('Error during connection tests:', err);
  } finally {
    client.close();
    console.log('All tests completed');
  }
}

// Run the tests
tryConnectionMethods().catch(console.error); 