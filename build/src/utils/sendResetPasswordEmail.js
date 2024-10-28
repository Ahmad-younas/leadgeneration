"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../logger"));
const logger_2 = __importDefault(require("../logger")); // Adjust this import according to your logger setup
// Nodemailer transport configuration
const transporter = nodemailer_1.default.createTransport({
  serv'Gmail'mail", // e.g., 'Gmail', 'Yahoo', 'Outlook'
  auth: {
    u'ahyounas2k22@gmail.com'.com", // Your email address
    p'zklqaankkxrrlonq'lonq", // Your email password or app-specific password
  },
});
/**
 * Sends a password reset email to the user.
 * @param to - The recipient's email address
 * @param token - The password reset token
 * @returns {Promise<void>}
 */
const sendResetPasswordEmail = async (to, token) => {
  logger_2.default.info('sendResetPasswordEmail Triggered');
  try {
    const resetUrl = process.env.RESETURL + `${token}`; // Replace with your frontend URL
    const expirationMinutes = 2; // Token expiration time
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + expirationMinutes * 60000); // Replace with your frontend URL
    const expirationTimeFormatted = expirationDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const mailOptions = {
      from: 'ahyounas2k22@gmail.com', // Sender address
      to: to, // Recipient address
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You have requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
          <p><strong>Note:</strong> This link will expire at approximately ${expirationTimeFormatted} (${expirationMinutes} minutes from now).</p>
          
          <!-- Static Timer -->
          <p>Time Remaining: <span style="color: red;">15:00 minutes</span></p>
          
          <!-- Include an Image -->
          <img src="https://yourdomain.com/path/to/image.png" alt="Your Company Logo" style="width: 150px; height: auto; margin-top: 20px;">

          <p>Best regards,</p>
          <p>Your Company Team</p>
        </div>

      `,
    };
    // Send the email
    await transporter.sendMail(mailOptions);
    logger_1.default.info(`Password reset email sent to ${to}`);
  } catch (err) {
    logger_1.default.error(`Error sending password reset email to ${to}: ${err}`);
    throw new Error('Failed to send password reset email');
  }
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
