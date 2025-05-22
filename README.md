# FTPS Latest File Checker

This Node.js application connects to an FTPS server and retrieves the name of the latest file added to specified folders. It can also send email alerts if files haven't been updated within a specified threshold of days.

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

Create a `.env` file in the root directory based on the provided `env.example` file:

```
# FTP Configuration
FTP_HOST=your-ftp-server.com
FTP_USERNAME=your-username
FTP_PASSWORD=your-password
FTP_PORT=21
FTP_SECURE=true
FTP_EXPLICIT_TLS=true

# Email Configuration
SENDER_EMAIL=your-email@example.com
SENDER_PASSWORD=your-app-password
RECIPIENT_EMAIL_1=recipient1@example.com
RECIPIENT_EMAIL_2=recipient2@example.com

# Folder Configuration
FOLDER_1_PATH=/path/to/folder1
FOLDER_1_THRESHOLD=7


### Configuration Options:

- **FTP Configuration**: Set your FTP server connection details
- **Email Configuration**: 
  - `SENDER_EMAIL`: The email address to send alerts from
  - `SENDER_PASSWORD`: App password for the sender email
  - `RECIPIENT_EMAIL_1`, `RECIPIENT_EMAIL_2`: Email addresses to receive alerts
- **Folder Configuration**:
  - `FOLDER_X_PATH`: Path to the folder on the FTP server
  - `FOLDER_X_THRESHOLD`: Number of days threshold for alerts (if the latest file is older than this many days, an alert will be sent)

> **SECURITY NOTE**: Never commit sensitive credentials to GitHub. For GitHub Actions, use repository secrets.

## Usage

To run the application:

```
npm run latest
```

The application will connect to the FTPS server, check each configured folder, and:
1. Print the name of the latest file in each folder
2. Check if the latest file is older than the threshold
3. Send email alerts for any folders that exceed their threshold

Example output:
```
Connecting to FTP server...
Connected successfully!

Checking folder: /TTO/Processed
Latest file: invoice.pdf (2023-05-23 14:30:45)
Days since last update: 10
⚠️ Alert: Folder /TTO/Processed hasn't been updated in 10 days

Checking folder: /TEST/Processed
Latest file: report.xlsx (2023-05-30 09:15:22)
Days since last update: 3

===== LATEST FILES SUMMARY =====
Folder: /TTO/Processed
File: invoice.pdf
Date: 2023-05-23 14:30:45
Size: 1254789 bytes
Days since update: 10
----------------------------
Folder: /TEST/Processed
File: report.xlsx
Date: 2023-05-30 09:15:22
Size: 987654 bytes
Days since update: 3
----------------------------

Sending alerts for 1 folders...
Alert email sent successfully: <message-id>
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
        run: npm run latest
        env:
          FTP_HOST: ${{ secrets.FTP_HOST }}
          FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
          FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
          FTP_PORT: ${{ secrets.FTP_PORT }}
          FTP_SECURE: ${{ secrets.FTP_SECURE }}
          FTP_EXPLICIT_TLS: ${{ secrets.FTP_EXPLICIT_TLS }}
          SENDER_EMAIL: ${{ secrets.SENDER_EMAIL }}
          SENDER_PASSWORD: ${{ secrets.SENDER_PASSWORD }}
          RECIPIENT_EMAIL_1: ${{ secrets.RECIPIENT_EMAIL_1 }}
          RECIPIENT_EMAIL_2: ${{ secrets.RECIPIENT_EMAIL_2 }}
          FOLDER_1_PATH: ${{ secrets.FOLDER_1_PATH }}
          FOLDER_1_THRESHOLD: ${{ secrets.FOLDER_1_THRESHOLD }}
          FOLDER_2_PATH: ${{ secrets.FOLDER_2_PATH }}
          FOLDER_2_THRESHOLD: ${{ secrets.FOLDER_2_THRESHOLD }}
          FOLDER_3_PATH: ${{ secrets.FOLDER_3_PATH }}
          FOLDER_3_THRESHOLD: ${{ secrets.FOLDER_3_THRESHOLD }}
          FOLDER_4_PATH: ${{ secrets.FOLDER_4_PATH }}
          FOLDER_4_THRESHOLD: ${{ secrets.FOLDER_4_THRESHOLD }}
          FOLDER_5_PATH: ${{ secrets.FOLDER_5_PATH }}
          FOLDER_5_THRESHOLD: ${{ secrets.FOLDER_5_THRESHOLD }}
          FOLDER_6_PATH: ${{ secrets.FOLDER_6_PATH }}
          FOLDER_6_THRESHOLD: ${{ secrets.FOLDER_6_THRESHOLD }}
          FOLDER_7_PATH: ${{ secrets.FOLDER_7_PATH }}
          FOLDER_7_THRESHOLD: ${{ secrets.FOLDER_7_THRESHOLD }}
          FOLDER_8_PATH: ${{ secrets.FOLDER_8_PATH }}
          FOLDER_8_THRESHOLD: ${{ secrets.FOLDER_8_THRESHOLD }}
```

## License

ISC 