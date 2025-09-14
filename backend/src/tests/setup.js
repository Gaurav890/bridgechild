const { pool, initializeDatabase } = require('../config/database');

module.exports = async () => {
  try {
    // Initialize test database
    await initializeDatabase();

    // Clean up existing test data
    await pool.query('DELETE FROM refresh_tokens');
    await pool.query('DELETE FROM users');

    console.log('Test database initialized');
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error;
  }
};

// Global teardown
global.afterAll(async () => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Test teardown failed:', error);
  }
});