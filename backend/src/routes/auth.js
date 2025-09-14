const express = require('express');
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  validatePasswordResetConfirm,
  validateEmailVerification,
  validateRefreshToken,
  validateChangePassword
} = require('../middleware/validation');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    code: 'TOO_MANY_REQUESTS'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many attempts, please try again later.',
    code: 'TOO_MANY_REQUESTS'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    error: 'Too many password reset attempts, please try again later.',
    code: 'TOO_MANY_REQUESTS'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/register', authLimiter, validateRegistration, authController.register);

router.post('/login', strictAuthLimiter, validateLogin, authController.login);

router.post('/refresh', authLimiter, validateRefreshToken, authController.refreshToken);

router.post('/request-password-reset', passwordResetLimiter, validatePasswordReset, authController.requestPasswordReset);

router.post('/reset-password', strictAuthLimiter, validatePasswordResetConfirm, authController.resetPassword);

router.post('/verify-email', authLimiter, validateEmailVerification, authController.verifyEmail);

router.post('/resend-verification', authLimiter, validatePasswordReset, authController.resendVerificationEmail);

// Protected routes
router.post('/logout', authenticate, authController.logout);

router.post('/logout-all', authenticate, authController.logoutAll);

router.post('/change-password', authenticate, strictAuthLimiter, validateChangePassword, authController.changePassword);

router.get('/profile', authenticate, authController.getProfile);

router.get('/check', authenticate, authController.checkAuth);

// Admin only routes
router.get('/users', authenticate, authorize(['admin']), (req, res) => {
  res.json({
    message: 'Admin users endpoint - to be implemented',
    user: req.user.toJSON()
  });
});

module.exports = router;