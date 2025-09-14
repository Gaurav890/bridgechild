const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const setupSecurity = (app) => {
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  // General rate limiter
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      code: 'TOO_MANY_REQUESTS'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests from this IP, please try again later.',
        code: 'TOO_MANY_REQUESTS',
        retryAfter: Math.round(req.rateLimit.resetTime / 1000)
      });
    }
  });

  // API rate limiter (more restrictive)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs for API routes
    message: {
      error: 'API rate limit exceeded, please try again later.',
      code: 'API_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'API rate limit exceeded, please try again later.',
        code: 'API_RATE_LIMIT_EXCEEDED',
        retryAfter: Math.round(req.rateLimit.resetTime / 1000)
      });
    }
  });

  // Apply general limiter to all requests
  app.use(generalLimiter);

  // Apply API limiter to API routes
  app.use('/api', apiLimiter);

  return {
    generalLimiter,
    apiLimiter
  };
};

// Specialized rate limiters for different endpoints
const createStrictLimiter = (max = 5, windowMs = 15 * 60 * 1000, message = 'Too many attempts') => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      code: 'TOO_MANY_REQUESTS'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        code: 'TOO_MANY_REQUESTS',
        retryAfter: Math.round(req.rateLimit.resetTime / 1000)
      });
    }
  });
};

// File upload rate limiter
const fileUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 file uploads per hour
  message: {
    error: 'File upload limit exceeded, please try again later.',
    code: 'FILE_UPLOAD_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration rate limiter
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registrations per hour
  message: {
    error: 'Too many registration attempts, please try again later.',
    code: 'REGISTRATION_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email rate limiter (for verification/reset emails)
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 email requests per hour
  message: {
    error: 'Email request limit exceeded, please try again later.',
    code: 'EMAIL_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const originalEnd = res.end;

  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };

    if (req.user) {
      logData.userId = req.user.id;
      logData.userRole = req.user.role;
    }

    // Log errors and slow requests
    if (res.statusCode >= 400 || duration > 1000) {
      console.log('Request Log:', JSON.stringify(logData, null, 2));
    }

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Log error details for debugging
  const errorLog = {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };

  if (req.user) {
    errorLog.userId = req.user.id;
  }

  console.error('Error Log:', JSON.stringify(errorLog, null, 2));

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    stack: err.stack
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND',
    method: req.method,
    url: req.originalUrl
  });
};

// Cleanup middleware for expired tokens
const cleanupExpiredTokens = async (req, res, next) => {
  try {
    // Run cleanup every hour (3600000 ms)
    if (!cleanupExpiredTokens.lastCleanup || Date.now() - cleanupExpiredTokens.lastCleanup > 3600000) {
      const RefreshToken = require('../models/RefreshToken');
      const deletedCount = await RefreshToken.deleteExpired();

      if (deletedCount > 0) {
        console.log(`Cleaned up ${deletedCount} expired refresh tokens`);
      }

      cleanupExpiredTokens.lastCleanup = Date.now();
    }
  } catch (error) {
    console.error('Token cleanup error:', error);
  }

  next();
};

module.exports = {
  setupSecurity,
  createStrictLimiter,
  fileUploadLimiter,
  registrationLimiter,
  emailLimiter,
  requestLogger,
  errorHandler,
  notFoundHandler,
  cleanupExpiredTokens
};