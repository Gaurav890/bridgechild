const { pool } = require('../config/database');
const crypto = require('crypto');

class RefreshToken {
  constructor(tokenData) {
    this.id = tokenData.id;
    this.userId = tokenData.user_id;
    this.token = tokenData.token;
    this.expiresAt = tokenData.expires_at;
    this.createdAt = tokenData.created_at;
  }

  static async create(userId, expiresIn = '7d') {
    const token = crypto.randomBytes(64).toString('hex');

    const expirationTime = new Date();
    if (expiresIn.endsWith('d')) {
      expirationTime.setDate(expirationTime.getDate() + parseInt(expiresIn));
    } else if (expiresIn.endsWith('h')) {
      expirationTime.setHours(expirationTime.getHours() + parseInt(expiresIn));
    } else if (expiresIn.endsWith('m')) {
      expirationTime.setMinutes(expirationTime.getMinutes() + parseInt(expiresIn));
    }

    const result = await pool.query(`
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [userId, token, expirationTime]);

    return new RefreshToken(result.rows[0]);
  }

  static async findByToken(token) {
    const result = await pool.query(`
      SELECT rt.*, u.id as user_id, u.email, u.role, u.status, u.email_verified
      FROM refresh_tokens rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.token = $1 AND rt.expires_at > NOW()
    `, [token]);

    if (result.rows.length === 0) {
      return null;
    }

    const tokenData = result.rows[0];
    const refreshToken = new RefreshToken(tokenData);
    refreshToken.user = {
      id: tokenData.user_id,
      email: tokenData.email,
      role: tokenData.role,
      status: tokenData.status,
      emailVerified: tokenData.email_verified
    };

    return refreshToken;
  }

  static async deleteByToken(token) {
    await pool.query(`
      DELETE FROM refresh_tokens WHERE token = $1
    `, [token]);
  }

  static async deleteAllForUser(userId) {
    await pool.query(`
      DELETE FROM refresh_tokens WHERE user_id = $1
    `, [userId]);
  }

  static async deleteExpired() {
    const result = await pool.query(`
      DELETE FROM refresh_tokens WHERE expires_at <= NOW()
    `);

    return result.rowCount || 0;
  }

  isExpired() {
    return new Date() > new Date(this.expiresAt);
  }

  async delete() {
    await RefreshToken.deleteByToken(this.token);
  }
}

module.exports = RefreshToken;