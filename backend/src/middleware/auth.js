const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies.accessToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'NO_TOKEN'
      });
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.accessTokenSecret);

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid token - user not found',
          code: 'USER_NOT_FOUND'
        });
      }

      if (user.status !== 'active') {
        return res.status(403).json({
          error: 'Account is not active',
          code: 'ACCOUNT_INACTIVE'
        });
      }

      if (!user.emailVerified) {
        return res.status(403).json({
          error: 'Email not verified',
          code: 'EMAIL_NOT_VERIFIED'
        });
      }

      req.user = user;
      next();

    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      if (tokenError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      }

      throw tokenError;
    }

  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'NO_USER'
      });
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies.accessToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.accessTokenSecret);
      const user = await User.findById(decoded.userId);

      if (user && user.status === 'active' && user.emailVerified) {
        req.user = user;
      } else {
        req.user = null;
      }
    } catch (tokenError) {
      req.user = null;
    }

    next();

  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      code: 'NO_USER'
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      error: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

const generateTokens = async (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(
    payload,
    jwtConfig.accessTokenSecret,
    {
      expiresIn: jwtConfig.accessTokenExpiry,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    }
  );

  const refreshToken = await RefreshToken.create(
    user.id,
    jwtConfig.refreshTokenExpiry
  );

  return {
    accessToken,
    refreshToken: refreshToken.token,
    accessTokenExpiry: jwtConfig.accessTokenExpiry,
    refreshTokenExpiry: jwtConfig.refreshTokenExpiry
  };
};

const refreshAccessToken = async (refreshTokenString) => {
  const refreshToken = await RefreshToken.findByToken(refreshTokenString);

  if (!refreshToken || refreshToken.isExpired()) {
    throw new Error('Invalid or expired refresh token');
  }

  const user = await User.findById(refreshToken.userId);

  if (!user || user.status !== 'active') {
    throw new Error('User not found or inactive');
  }

  await refreshToken.delete();

  return await generateTokens(user);
};

const setTokenCookies = (res, tokens) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };

  res.cookie('accessToken', tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const clearTokenCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  requireEmailVerification,
  generateTokens,
  refreshAccessToken,
  setTokenCookies,
  clearTokenCookies
};