const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
    this.from = process.env.EMAIL_FROM || 'noreply@helping-hands.com';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  createTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      // Use test account for development
      return nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
      });
    }
  }

  async sendVerificationEmail(email, token) {
    try {
      const verificationUrl = `${this.frontendUrl}/verify-email?token=${token}`;

      const mailOptions = {
        from: this.from,
        to: email,
        subject: 'Verify Your Email - Helping Hands',
        html: this.getVerificationEmailTemplate(verificationUrl)
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('=== EMAIL VERIFICATION LINK ===');
        console.log(`Email: ${email}`);
        console.log(`Verification URL: ${verificationUrl}`);
        console.log('===============================');
        return { messageId: 'dev-mode' };
      }

      const info = await this.transporter.sendMail(mailOptions);

      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Verification email (development mode):');
        console.log('To:', email);
        console.log('Subject:', mailOptions.subject);
        console.log('Verification URL:', verificationUrl);
        console.log('---');
      } else {
        console.log('Verification email sent:', info.messageId);
      }

      return info;

    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email, token) {
    try {
      const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

      const mailOptions = {
        from: this.from,
        to: email,
        subject: 'Password Reset Request - Helping Hands',
        html: this.getPasswordResetEmailTemplate(resetUrl)
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('=== PASSWORD RESET LINK ===');
        console.log(`Email: ${email}`);
        console.log(`Reset URL: ${resetUrl}`);
        console.log('===========================');
        return { messageId: 'dev-mode' };
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      return info;

    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email, firstName) {
    try {
      const mailOptions = {
        from: this.from,
        to: email,
        subject: 'Welcome to Helping Hands!',
        html: this.getWelcomeEmailTemplate(firstName)
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('=== WELCOME EMAIL ===');
        console.log(`Email: ${email}`);
        console.log('======================');
        return { messageId: 'dev-mode' };
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', info.messageId);
      return info;

    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw error for welcome email - it's not critical
    }
  }

  getVerificationEmailTemplate(verificationUrl) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #333; margin: 0;">Helping Hands</h1>
          <p style="color: #666; margin: 5px 0;">Connecting Sponsors with Children</p>
        </div>

        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>

          <p style="color: #555; line-height: 1.6;">
            Thank you for registering with Helping Hands. To complete your registration and activate your account, please click the button below to verify your email address.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}"
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, you can copy and paste this link into your browser:
            <br>
            <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">${verificationUrl}</a>
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This verification link will expire in 24 hours. If you didn't create an account with Helping Hands, please ignore this email.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
          <p>© ${new Date().getFullYear()} Helping Hands. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  getPasswordResetEmailTemplate(resetUrl) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #333; margin: 0;">Helping Hands</h1>
          <p style="color: #666; margin: 5px 0;">Connecting Sponsors with Children</p>
        </div>

        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>

          <p style="color: #555; line-height: 1.6;">
            We received a request to reset your password for your Helping Hands account. If you made this request, click the button below to set a new password.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, you can copy and paste this link into your browser:
            <br>
            <a href="${resetUrl}" style="color: #dc3545; word-break: break-all;">${resetUrl}</a>
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
          <p>© ${new Date().getFullYear()} Helping Hands. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  getWelcomeEmailTemplate(firstName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Helping Hands</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #333; margin: 0;">Helping Hands</h1>
          <p style="color: #666; margin: 5px 0;">Connecting Sponsors with Children</p>
        </div>

        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Welcome${firstName ? `, ${firstName}` : ''}!</h2>

          <p style="color: #555; line-height: 1.6;">
            Thank you for joining Helping Hands! Your account has been successfully verified and you're now part of our community dedicated to making a positive impact in children's lives.
          </p>

          <p style="color: #555; line-height: 1.6;">
            Here's what you can do next:
          </p>

          <ul style="color: #555; line-height: 1.8; padding-left: 20px;">
            <li>Complete your profile to help us serve you better</li>
            <li>Explore available sponsorship opportunities</li>
            <li>Connect with our verified NGO partners</li>
            <li>Start making a difference in a child's life</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.frontendUrl}/dashboard"
               style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
          <p>© ${new Date().getFullYear()} Helping Hands. All rights reserved.</p>
          <p>
            Questions? Contact us at
            <a href="mailto:support@helping-hands.com" style="color: #007bff;">support@helping-hands.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();