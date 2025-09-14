require('dotenv').config();

const jwtConfig = {
  accessTokenSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
  accessTokenExpiry: process.env.JWT_EXPIRES_IN || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  issuer: 'helping-hands',
  audience: 'helping-hands-users'
};

module.exports = jwtConfig;