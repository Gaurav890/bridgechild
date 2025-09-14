const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const {
  generateTokens,
  refreshAccessToken,
  setTokenCookies,
  clearTokenCookies
} = require('../middleware/auth');
const emailService = require('../services/emailService');

const register = async (req, res) => {
  try {
    const { email, password, role, acceptTerms } = req.body;

    const user = await User.create({
      email,
      password,
      role
    });

    await emailService.sendVerificationEmail(user.email, user.emailVerificationToken);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        error: 'User with this email already exists',
        code: 'EMAIL_EXISTS'
      });
    }

    res.status(500).json({
      error: 'Registration failed. Please try again.',
      code: 'REGISTRATION_FAILED'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (user.isLocked()) {
      return res.status(423).json({
        error: 'Account temporarily locked due to too many failed login attempts. Please try again later.',
        code: 'ACCOUNT_LOCKED',
        lockedUntil: user.lockedUntil
      });
    }

    const isValidPassword = await user.verifyPassword(password);

    if (!isValidPassword) {
      await user.incrementFailedAttempts();

      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        error: 'Please verify your email address before logging in',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        error: 'Account is not active. Please contact support.',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    await user.updateLastLogin();

    const tokens = await generateTokens(user);
    setTokenCookies(res, tokens);

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      accessToken: tokens.accessToken,
      expiresIn: tokens.accessTokenExpiry
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      error: 'Login failed. Please try again.',
      code: 'LOGIN_FAILED'
    });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      await RefreshToken.deleteByToken(refreshToken);
    }

    clearTokenCookies(res);

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);

    clearTokenCookies(res);

    res.json({
      message: 'Logout successful'
    });
  }
};

const logoutAll = async (req, res) => {
  try {
    if (req.user) {
      await RefreshToken.deleteAllForUser(req.user.id);
    }

    clearTokenCookies(res);

    res.json({
      message: 'Logged out from all devices successfully'
    });

  } catch (error) {
    console.error('Logout all error:', error);

    clearTokenCookies(res);

    res.json({
      message: 'Logged out from all devices successfully'
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshTokenString = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshTokenString) {
      return res.status(401).json({
        error: 'Refresh token required',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    const tokens = await refreshAccessToken(refreshTokenString);
    setTokenCookies(res, tokens);

    res.json({
      message: 'Token refreshed successfully',
      accessToken: tokens.accessToken,
      expiresIn: tokens.accessTokenExpiry
    });

  } catch (error) {
    console.error('Token refresh error:', error);

    clearTokenCookies(res);

    if (error.message.includes('Invalid or expired')) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    res.status(500).json({
      error: 'Token refresh failed',
      code: 'TOKEN_REFRESH_FAILED'
    });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);

    if (user) {
      const resetToken = await user.generatePasswordResetToken();
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    }

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Password reset request error:', error);

    res.status(500).json({
      error: 'Failed to process password reset request. Please try again.',
      code: 'PASSWORD_RESET_REQUEST_FAILED'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findByResetToken(token);

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired password reset token',
        code: 'INVALID_RESET_TOKEN'
      });
    }

    await user.updatePassword(password);

    await RefreshToken.deleteAllForUser(user.id);

    res.json({
      message: 'Password reset successful. Please log in with your new password.'
    });

  } catch (error) {
    console.error('Password reset error:', error);

    res.status(500).json({
      error: 'Password reset failed. Please try again.',
      code: 'PASSWORD_RESET_FAILED'
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findByVerificationToken(token);

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired verification token',
        code: 'INVALID_VERIFICATION_TOKEN'
      });
    }

    await user.verifyEmail();

    res.json({
      message: 'Email verified successfully. Your account is now active.'
    });

  } catch (error) {
    console.error('Email verification error:', error);

    res.status(500).json({
      error: 'Email verification failed. Please try again.',
      code: 'EMAIL_VERIFICATION_FAILED'
    });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      return res.json({
        message: 'If an account with that email exists and is unverified, a new verification email has been sent.'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        error: 'Email is already verified',
        code: 'ALREADY_VERIFIED'
      });
    }

    await emailService.sendVerificationEmail(user.email, user.emailVerificationToken);

    res.json({
      message: 'If an account with that email exists and is unverified, a new verification email has been sent.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);

    res.status(500).json({
      error: 'Failed to resend verification email. Please try again.',
      code: 'RESEND_VERIFICATION_FAILED'
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    const isValidCurrentPassword = await user.verifyPassword(currentPassword);

    if (!isValidCurrentPassword) {
      return res.status(400).json({
        error: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    await user.updatePassword(newPassword);

    await RefreshToken.deleteAllForUser(user.id);

    res.json({
      message: 'Password changed successfully. Please log in again.'
    });

  } catch (error) {
    console.error('Change password error:', error);

    res.status(500).json({
      error: 'Failed to change password. Please try again.',
      code: 'PASSWORD_CHANGE_FAILED'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user.toJSON()
    });

  } catch (error) {
    console.error('Get profile error:', error);

    res.status(500).json({
      error: 'Failed to retrieve profile',
      code: 'PROFILE_RETRIEVAL_FAILED'
    });
  }
};

const checkAuth = async (req, res) => {
  try {
    res.json({
      authenticated: true,
      user: req.user.toJSON()
    });

  } catch (error) {
    console.error('Check auth error:', error);

    res.status(500).json({
      error: 'Failed to check authentication status',
      code: 'AUTH_CHECK_FAILED'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  logoutAll,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  changePassword,
  getProfile,
  checkAuth
};