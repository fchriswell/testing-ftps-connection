# FTPS Latest File Checker

This Node.js application connects to an FTPS server and retrieves the name of the latest file added to specified folders.

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone this repository to your local machine:
   ```
   git clone <your-repository-url>
   cd ftps-latest-file-checker
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Configuration

The connection details for the FTPS server are stored in `src/config.js`. You may need to modify these settings to match your FTPS server configuration:

```javascript
export const ftpConfig = {
  host: 'your-ftp-server.com',
  user: 'your-username',
  password: 'your-password',
  secure: true // For FTPS
};

export const folderPaths = [
  '/path/to/folder1',
  '/path/to/folder2'
];
```

> **SECURITY NOTE**: Never commit sensitive credentials to GitHub. Consider using environment variables for production deployments.

## Usage

To run the application:

```
npm start
```

The application will connect to the FTPS server, check each configured folder, and print the name of the latest file in each folder to the console.

Example output:
```
Connecting to FTP server...
Connected successfully!
Checking folder: /TTO/Processed
Checking folder: /TEST/Processed

LATEST FILES:
--------------
/TTO/Processed: latest_file_1.txt
/TEST/Processed: latest_file_2.txt
FTP connection closed
```

## GitHub Actions Integration

To run this application automatically using GitHub Actions, you can create a workflow file in your repository. Here's a simple example:

1. Create a file `.github/workflows/check-latest-files.yml` with the following content:

```yaml
name: Check Latest Files

on:
  schedule:
    - cron: '0 */6 * * *'  # Run every 6 hours
  workflow_dispatch:  # Allow manual runs

jobs:
  check-files:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Run file checker
        run: npm start
```

## License

ISC 