import nodemailer from "nodemailer";
import logger from "../logger";
import Logger from "../logger"; // Adjust this import according to your logger setup

// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // e.g., 'Gmail', 'Yahoo', 'Outlook'
  auth: {
    user: "ahyounas2k22@gmail.com", // Your email address
    pass: "zklqaankkxrrlonq", // Your email password or app-specific password
  },
});

/**
 * Sends a password reset email to the user.
 * @param to - The recipient's email address
 * @param token - The password reset token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (
  to: string,
  token: string,
): Promise<void> => {
  Logger.info("sendResetPasswordEmail Triggered");
  try {
    const resetUrl = process.env.RESETURL + `${token}`; // Replace with your frontend URL
    const expirationMinutes = 2; // Token expiration time
    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getTime() + expirationMinutes * 60000,
    ); // Replace with your frontend URL
    const expirationTimeFormatted = expirationDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const mailOptions = {
      from: "ahyounas2k22@gmail.com", // Sender address
      to: to, // Recipient address
      subject: "Password Reset Request",
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
    logger.info(`Password reset email sent to ${to}`);
  } catch (err) {
    logger.error(`Error sending password reset email to ${to}: ${err}`);
    throw new Error("Failed to send password reset email");
  }
};
