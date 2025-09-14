const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.passwordHash = userData.password_hash;
    this.role = userData.role;
    this.status = userData.status;
    this.emailVerified = userData.email_verified;
    this.emailVerificationToken = userData.email_verification_token;
    this.emailVerificationExpires = userData.email_verification_expires;
    this.passwordResetToken = userData.password_reset_token;
    this.passwordResetExpires = userData.password_reset_expires;
    this.lastLogin = userData.last_login;
    this.failedLoginAttempts = userData.failed_login_attempts;
    this.lockedUntil = userData.locked_until;
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
  }

  static async create({ email, password, role }) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email.toLowerCase()]
      );

      if (existingUser.rows.length > 0) {
        await client.query('ROLLBACK');
        throw new Error('User with this email already exists');
      }

      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const result = await client.query(`
        INSERT INTO users (
          email, password_hash, role, email_verification_token, email_verification_expires
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        email.toLowerCase(),
        passwordHash,
        role,
        emailVerificationToken,
        emailVerificationExpires
      ]);

      await client.query('COMMIT');
      return new User(result.rows[0]);
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  static async findByVerificationToken(token) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email_verification_token = $1 AND email_verification_expires > NOW()',
      [token]
    );

    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  static async findByResetToken(token) {
    const result = await pool.query(
      'SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [token]
    );

    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  async verifyPassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }

  async updatePassword(newPassword) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await pool.query(`
      UPDATE users
      SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [passwordHash, this.id]);

    this.passwordHash = passwordHash;
    this.passwordResetToken = null;
    this.passwordResetExpires = null;
  }

  async verifyEmail() {
    await pool.query(`
      UPDATE users
      SET email_verified = TRUE, email_verification_token = NULL, email_verification_expires = NULL, status = 'active', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [this.id]);

    this.emailVerified = true;
    this.status = 'active';
    this.emailVerificationToken = null;
    this.emailVerificationExpires = null;
  }

  async generatePasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(`
      UPDATE users
      SET password_reset_token = $1, password_reset_expires = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [resetToken, resetExpires, this.id]);

    this.passwordResetToken = resetToken;
    this.passwordResetExpires = resetExpires;

    return resetToken;
  }

  async updateLastLogin() {
    const now = new Date();
    await pool.query(`
      UPDATE users
      SET last_login = $1, failed_login_attempts = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [now, this.id]);

    this.lastLogin = now;
    this.failedLoginAttempts = 0;
  }

  async incrementFailedAttempts() {
    const maxAttempts = 5;
    const lockTime = 15 * 60 * 1000; // 15 minutes

    const newFailedAttempts = this.failedLoginAttempts + 1;
    let lockedUntil = null;

    if (newFailedAttempts >= maxAttempts) {
      lockedUntil = new Date(Date.now() + lockTime);
    }

    await pool.query(`
      UPDATE users
      SET failed_login_attempts = $1, locked_until = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [newFailedAttempts, lockedUntil, this.id]);

    this.failedLoginAttempts = newFailedAttempts;
    this.lockedUntil = lockedUntil;
  }

  isLocked() {
    return this.lockedUntil && this.lockedUntil > new Date();
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      status: this.status,
      emailVerified: this.emailVerified,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static validateRole(role) {
    const validRoles = ['sponsor', 'child', 'ngo', 'admin'];
    return validRoles.includes(role);
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }

    return { valid: true };
  }
}

module.exports = User;