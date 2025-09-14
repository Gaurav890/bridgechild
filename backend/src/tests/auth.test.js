const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('../routes/auth');
const { initializeDatabase, pool } = require('../config/database');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());
  app.use('/auth', authRoutes);
  return app;
};

describe('Authentication System', () => {
  let app;

  beforeAll(async () => {
    app = createTestApp();
    await initializeDatabase();

    // Clear test data
    await pool.query('DELETE FROM refresh_tokens');
    await pool.query('DELETE FROM users');
  });

  beforeEach(async () => {
    // Clean up between tests
    await pool.query('DELETE FROM refresh_tokens');
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /auth/register', () => {
    const validRegistrationData = {
      email: 'test@example.com',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
      role: 'sponsor',
      acceptTerms: true
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(validRegistrationData);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Registration successful');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(validRegistrationData.email);
      expect(response.body.user.role).toBe(validRegistrationData.role);
      expect(response.body.user.emailVerified).toBe(false);
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...validRegistrationData,
          email: 'invalid-email'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should fail with weak password', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...validRegistrationData,
          password: 'weak',
          confirmPassword: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should fail with mismatched passwords', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...validRegistrationData,
          confirmPassword: 'DifferentPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should fail with invalid role', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...validRegistrationData,
          role: 'invalid-role'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should fail when terms not accepted', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...validRegistrationData,
          acceptTerms: false
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should fail when email already exists', async () => {
      // First registration
      await request(app)
        .post('/auth/register')
        .send(validRegistrationData);

      // Second registration with same email
      const response = await request(app)
        .post('/auth/register')
        .send(validRegistrationData);

      expect(response.status).toBe(409);
      expect(response.body.code).toBe('EMAIL_EXISTS');
    });
  });

  describe('POST /auth/verify-email', () => {
    let user;
    let verificationToken;

    beforeEach(async () => {
      const userData = {
        email: 'verify@example.com',
        password: 'SecurePassword123!',
        role: 'sponsor'
      };

      user = await User.create(userData);
      verificationToken = user.emailVerificationToken;
    });

    it('should verify email successfully', async () => {
      const response = await request(app)
        .post('/auth/verify-email')
        .send({ token: verificationToken });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('verified successfully');

      // Check user is updated
      const updatedUser = await User.findById(user.id);
      expect(updatedUser.emailVerified).toBe(true);
      expect(updatedUser.status).toBe('active');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .post('/auth/verify-email')
        .send({ token: 'invalid-token' });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_VERIFICATION_TOKEN');
    });
  });

  describe('POST /auth/login', () => {
    let user;
    const userData = {
      email: 'login@example.com',
      password: 'SecurePassword123!',
      role: 'sponsor'
    };

    beforeEach(async () => {
      user = await User.create(userData);
      await user.verifyEmail(); // Verify email for login tests
    });

    it('should login successfully with verified user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.accessToken).toBeDefined();
      expect(response.header['set-cookie']).toBeDefined();
    });

    it('should fail login with unverified email', async () => {
      // Create unverified user
      const unverifiedUser = await User.create({
        email: 'unverified@example.com',
        password: 'SecurePassword123!',
        role: 'sponsor'
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'unverified@example.com',
          password: 'SecurePassword123!'
        });

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('EMAIL_NOT_VERIFIED');
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: userData.email,
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should fail with non-existent user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SecurePassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should lock account after multiple failed attempts', async () => {
      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/auth/login')
          .send({
            email: userData.email,
            password: 'WrongPassword123!'
          });
      }

      // 6th attempt should be locked
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: userData.email,
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(423);
      expect(response.body.code).toBe('ACCOUNT_LOCKED');
    });
  });

  describe('POST /auth/refresh', () => {
    let user;
    let refreshToken;

    beforeEach(async () => {
      user = await User.create({
        email: 'refresh@example.com',
        password: 'SecurePassword123!',
        role: 'sponsor'
      });
      await user.verifyEmail();

      const tokenRecord = await RefreshToken.create(user.id);
      refreshToken = tokenRecord.token;
    });

    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('refreshed successfully');
      expect(response.body.accessToken).toBeDefined();
    });

    it('should fail with invalid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_REFRESH_TOKEN');
    });
  });

  describe('POST /auth/request-password-reset', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        email: 'reset@example.com',
        password: 'SecurePassword123!',
        role: 'sponsor'
      });
    });

    it('should request password reset successfully', async () => {
      const response = await request(app)
        .post('/auth/request-password-reset')
        .send({ email: user.email });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('password reset link');
    });

    it('should not reveal if email exists or not', async () => {
      const response = await request(app)
        .post('/auth/request-password-reset')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('password reset link');
    });
  });

  describe('POST /auth/reset-password', () => {
    let user;
    let resetToken;

    beforeEach(async () => {
      user = await User.create({
        email: 'resetpassword@example.com',
        password: 'SecurePassword123!',
        role: 'sponsor'
      });

      resetToken = await user.generatePasswordResetToken();
    });

    it('should reset password successfully', async () => {
      const newPassword = 'NewSecurePassword123!';

      const response = await request(app)
        .post('/auth/reset-password')
        .send({
          token: resetToken,
          password: newPassword,
          confirmPassword: newPassword
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Password reset successful');

      // Verify old password doesn't work
      const updatedUser = await User.findById(user.id);
      const oldPasswordWorks = await updatedUser.verifyPassword('SecurePassword123!');
      expect(oldPasswordWorks).toBe(false);

      // Verify new password works
      const newPasswordWorks = await updatedUser.verifyPassword(newPassword);
      expect(newPasswordWorks).toBe(true);
    });

    it('should fail with invalid reset token', async () => {
      const response = await request(app)
        .post('/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'NewSecurePassword123!',
          confirmPassword: 'NewSecurePassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_RESET_TOKEN');
    });
  });

  describe('Protected Routes', () => {
    let user;
    let accessToken;

    beforeEach(async () => {
      user = await User.create({
        email: 'protected@example.com',
        password: 'SecurePassword123!',
        role: 'sponsor'
      });
      await user.verifyEmail();

      // Login to get access token
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'SecurePassword123!'
        });

      accessToken = loginResponse.body.accessToken;
    });

    describe('GET /auth/profile', () => {
      it('should get profile with valid token', async () => {
        const response = await request(app)
          .get('/auth/profile')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.email).toBe(user.email);
      });

      it('should fail without token', async () => {
        const response = await request(app)
          .get('/auth/profile');

        expect(response.status).toBe(401);
        expect(response.body.code).toBe('NO_TOKEN');
      });

      it('should fail with invalid token', async () => {
        const response = await request(app)
          .get('/auth/profile')
          .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(401);
        expect(response.body.code).toBe('INVALID_TOKEN');
      });
    });

    describe('POST /auth/logout', () => {
      it('should logout successfully', async () => {
        const response = await request(app)
          .post('/auth/logout')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logout successful');
      });
    });

    describe('POST /auth/change-password', () => {
      it('should change password successfully', async () => {
        const response = await request(app)
          .post('/auth/change-password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            currentPassword: 'SecurePassword123!',
            newPassword: 'NewSecurePassword123!',
            confirmPassword: 'NewSecurePassword123!'
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toContain('Password changed successfully');
      });

      it('should fail with wrong current password', async () => {
        const response = await request(app)
          .post('/auth/change-password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            currentPassword: 'WrongPassword123!',
            newPassword: 'NewSecurePassword123!',
            confirmPassword: 'NewSecurePassword123!'
          });

        expect(response.status).toBe(400);
        expect(response.body.code).toBe('INVALID_CURRENT_PASSWORD');
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should rate limit registration attempts', async () => {
      const validData = {
        email: 'ratelimit@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        role: 'sponsor',
        acceptTerms: true
      };

      // Make multiple registration attempts
      const promises = Array(15).fill().map((_, i) =>
        request(app)
          .post('/auth/register')
          .send({ ...validData, email: `ratelimit${i}@example.com` })
      );

      const responses = await Promise.all(promises);

      // Some should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});