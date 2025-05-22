import nodemailer from 'nodemailer';
import { emailConfig } from './config.js';

/**
 * Creates a configured email transporter
 * @returns {Object} Nodemailer transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.sender,
      pass: emailConfig.password
    }
  });
}

/**
 * Send an alert email about files older than threshold
 * @param {Array} folders - Array of folder information objects
 * @returns {Promise<void>}
 */
export async function sendAgeAlert(folders) {
  if (!folders || folders.length === 0) {
    console.log('No folders to alert about');
    return;
  }

  const transporter = createTransporter();
  
  // Create email subject
  const subject = `Alert: Files Not Updated in ${folders.length} Folder${folders.length > 1 ? 's' : ''}`;
  
  // Create email body
  let html = `
    <h2>File Age Alert</h2>
    <p>The following folders have not received new files within the expected timeframe:</p>
    <table border="1" cellpadding="5" style="border-collapse: collapse;">
      <tr>
        <th>Folder Path</th>
        <th>Last File</th>
        <th>Last Updated</th>
        <th>Days Since Update</th>
        <th>Threshold (Days)</th>
      </tr>
  `;
  
  folders.forEach(folder => {
    html += `
      <tr>
        <td>${folder.path}</td>
        <td>${folder.fileName || 'N/A'}</td>
        <td>${folder.lastUpdated ? new Date(folder.lastUpdated).toLocaleString() : 'N/A'}</td>
        <td>${folder.daysSinceUpdate}</td>
        <td>${folder.threshold}</td>
      </tr>
    `;
  });
  
  html += `
    </table>
    <p>Please check these folders to ensure all files are being processed correctly.</p>
  `;
  
  // Configure email options
  const mailOptions = {
    from: emailConfig.sender,
    to: emailConfig.recipients.join(', '),
    subject: subject,
    html: html
  };
  
  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Alert email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending alert email:', error.message);
  }
} 