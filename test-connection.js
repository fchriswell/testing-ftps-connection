// Import the basic-ftp package
import * as ftp from 'basic-ftp';

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
  const host = 'globalftp.globaloring.com';
  const user = 'stockfiles';
  const password = 'tBDNWuVyV1@4M5JJUdMUio{k';
  
  try {
    // Method 1: Regular FTP (no encryption)
    const regularFtp = {
      host,
      user,
      password,
      secure: false
    };
    
    // Method 2: Implicit FTPS (encrypted from the start, usually on port 990)
    const implicitFtps = {
      host,
      user,
      password,
      secure: true,
      port: 990
    };
    
    // Method 3: Explicit FTPS (starts unencrypted, then upgrades to TLS)
    const explicitFtps = {
      host,
      user,
      password,
      secure: true,
      explicitTls: true
    };
    
    // Method 4: Explicit FTPS on port 990
    const explicitFtps990 = {
      host,
      user,
      password,
      secure: true,
      explicitTls: true,
      port: 990
    };
    
    // Try each method until one works
    console.log('Attempting to connect to FTP server with different methods...');
    
    if (await testConnection(regularFtp)) {
      console.log('Success with regular FTP!');
    } else if (await testConnection(implicitFtps)) {
      console.log('Success with implicit FTPS!');
    } else if (await testConnection(explicitFtps)) {
      console.log('Success with explicit FTPS!');
    } else if (await testConnection(explicitFtps990)) {
      console.log('Success with explicit FTPS on port 990!');
    } else {
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