const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('express-async-errors');

const { testConnection, initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const {
  setupSecurity,
  requestLogger,
  errorHandler,
  notFoundHandler,
  cleanupExpiredTokens
} = require('./middleware/security');
const { optionalAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const initServer = async () => {
  try {
    console.log('🔄 Initializing server...');

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    // Initialize database tables
    await initializeDatabase();
    console.log('✅ Database initialized successfully');

    // Setup security middleware
    setupSecurity(app);
    console.log('✅ Security middleware configured');

    // Basic middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    // CORS configuration
    app.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:3002'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Request logging
    app.use(requestLogger);

    // Cleanup middleware (runs periodically)
    app.use(cleanupExpiredTokens);

    // Health check endpoints
    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'connected'
      });
    });

    // Public API info
    app.get('/', optionalAuth, (req, res) => {
      res.json({
        message: 'Helping Hands API',
        version: '1.0.0',
        status: 'running',
        authenticated: !!req.user,
        user: req.user ? {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role
        } : null,
        endpoints: {
          auth: '/api/auth',
          health: '/health'
        },
        timestamp: new Date().toISOString()
      });
    });

    // API routes
    const profileRoutes = require('./routes/profiles-simple');
    app.use('/api/auth', authRoutes);
    app.use('/api/profiles', profileRoutes);

    // API info endpoint
    app.get('/api', (req, res) => {
      res.json({
        name: 'Helping Hands API',
        version: '1.0.0',
        endpoints: {
          '/api/auth': {
            description: 'Authentication endpoints',
            methods: ['POST'],
            routes: [
              'POST /api/auth/register',
              'POST /api/auth/login',
              'POST /api/auth/logout',
              'POST /api/auth/refresh',
              'POST /api/auth/verify-email',
              'POST /api/auth/request-password-reset',
              'POST /api/auth/reset-password',
              'GET /api/auth/profile',
              'POST /api/auth/change-password'
            ]
          },
          '/api/profiles': {
            description: 'User profile management endpoints',
            methods: ['GET', 'POST', 'PUT'],
            routes: [
              'POST /api/profiles/sponsor - Create sponsor profile',
              'GET /api/profiles/sponsor - Get sponsor profile',
              'PUT /api/profiles/sponsor - Update sponsor profile',
              'POST /api/profiles/ngo - Create NGO profile',
              'GET /api/profiles/ngo - Get NGO profile',
              'PUT /api/profiles/ngo - Update NGO profile',
              'POST /api/profiles/ngo/:id/verify - Verify NGO (Admin)',
              'GET /api/profiles/ngo/pending-verifications - Get pending verifications (Admin)',
              'POST /api/profiles/child - Create child profile',
              'GET /api/profiles/child/:id - Get child profile',
              'PUT /api/profiles/child/:id - Update child profile',
              'GET /api/profiles/children/search - Search available children (Sponsors)',
              'GET /api/profiles/children/my-children - Get NGO managed children (NGOs)'
            ]
          }
        }
      });
    });

    // 404 handler
    app.use(notFoundHandler);

    // Error handler (must be last)
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📖 API documentation available at http://localhost:${PORT}/api`);
      console.log(`🔐 Authentication endpoints at http://localhost:${PORT}/api/auth`);
      console.log(`❤️  Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);

      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode - Email links will be logged to console');
      }
    });

  } catch (error) {
    console.error('❌ Server initialization failed:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Initialize server
initServer();