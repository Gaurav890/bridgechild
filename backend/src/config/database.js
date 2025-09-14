const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection with Docker support
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres', // Docker service name
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'helping_hands_dev',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Increased for Docker startup
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ PostgreSQL database connected successfully:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    return false;
  }
};

// Run migrations
const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...');

    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get list of executed migrations
    const executedMigrations = await pool.query('SELECT name FROM migrations ORDER BY id');
    const executedNames = executedMigrations.rows.map(row => row.name);

    // List of migrations to run
    const migrations = [
      '001_create_users_table',
      '002_create_refresh_tokens_table',
      '003_create_indexes',
      '004_create_sponsor_profiles_table',
      '005_create_ngo_profiles_table',
      '006_create_child_profiles_table',
      '007_create_child_needs_table',
      '008_create_documents_table',
      '009_create_profile_indexes'
    ];

    // Run pending migrations
    for (const migrationName of migrations) {
      if (!executedNames.includes(migrationName)) {
        console.log(`🔄 Running migration: ${migrationName}`);

        try {
          // Run the migration
          await runMigration(migrationName);

          // Record that migration was executed
          await pool.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [migrationName]
          );

          console.log(`✅ Migration completed: ${migrationName}`);
        } catch (migrationError) {
          console.error(`❌ Migration failed: ${migrationName}`, migrationError);
          throw migrationError;
        }
      } else {
        console.log(`⏭️  Migration already executed: ${migrationName}`);
      }
    }

    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration system failed:', error);
    throw error;
  }
};

// Execute individual migrations
const runMigration = async (migrationName) => {
  switch (migrationName) {
    case '001_create_users_table':
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('sponsor', 'child', 'ngo', 'admin')),
          status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'deactivated')),
          email_verified BOOLEAN DEFAULT FALSE,
          email_verification_token VARCHAR(255),
          email_verification_expires TIMESTAMP,
          password_reset_token VARCHAR(255),
          password_reset_expires TIMESTAMP,
          last_login TIMESTAMP,
          failed_login_attempts INTEGER DEFAULT 0,
          locked_until TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Add trigger for updated_at
      await pool.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);

      await pool.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
            CREATE TRIGGER update_users_updated_at
              BEFORE UPDATE ON users
              FOR EACH ROW
              EXECUTE FUNCTION update_updated_at_column();
          END IF;
        END $$;
      `);
      break;

    case '002_create_refresh_tokens_table':
      await pool.query(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(255) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      break;

    case '003_create_indexes':
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
        CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
        CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);
        CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
        CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
        CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
      `);
      break;

    case '004_create_sponsor_profiles_table':
      await pool.query(`
        CREATE TABLE IF NOT EXISTS sponsor_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          phone VARCHAR(20),
          country VARCHAR(100) NOT NULL,
          city VARCHAR(100),
          occupation VARCHAR(100),
          bio TEXT,
          sponsorship_budget DECIMAL(10,2),
          preferred_child_age_min INTEGER,
          preferred_child_age_max INTEGER,
          preferred_child_gender VARCHAR(10) CHECK (preferred_child_gender IN ('male', 'female', 'any')),
          preferred_countries TEXT[], -- Array of country preferences
          interests TEXT[], -- Array of interest categories
          communication_preference VARCHAR(20) DEFAULT 'monthly' CHECK (communication_preference IN ('weekly', 'monthly', 'quarterly')),
          profile_complete BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
        );
      `);

      await pool.query(`
        CREATE TRIGGER update_sponsor_profiles_updated_at
          BEFORE UPDATE ON sponsor_profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
      break;

    case '005_create_ngo_profiles_table':
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ngo_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          organization_name VARCHAR(200) NOT NULL,
          registration_number VARCHAR(100),
          country VARCHAR(100) NOT NULL,
          city VARCHAR(100) NOT NULL,
          address TEXT NOT NULL,
          phone VARCHAR(20) NOT NULL,
          website VARCHAR(200),
          description TEXT NOT NULL,
          focus_areas TEXT[] NOT NULL, -- Array of focus areas (education, health, etc.)
          year_established INTEGER,
          staff_count INTEGER,
          children_served INTEGER,
          verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in_review', 'verified', 'rejected')),
          verification_notes TEXT,
          verified_at TIMESTAMP,
          verified_by UUID REFERENCES users(id),
          bank_account_name VARCHAR(200),
          bank_account_number VARCHAR(100),
          bank_name VARCHAR(200),
          bank_swift_code VARCHAR(20),
          profile_complete BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
        );
      `);

      await pool.query(`
        CREATE TRIGGER update_ngo_profiles_updated_at
          BEFORE UPDATE ON ngo_profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
      break;

    case '006_create_child_profiles_table':
      await pool.query(`
        CREATE TABLE IF NOT EXISTS child_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable for NGO-assisted profiles
          ngo_id UUID NOT NULL REFERENCES ngo_profiles(id) ON DELETE CASCADE,
          child_code VARCHAR(20) NOT NULL, -- Unique identifier for the child
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100),
          date_of_birth DATE NOT NULL,
          gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
          country VARCHAR(100) NOT NULL,
          city VARCHAR(100) NOT NULL,
          school_name VARCHAR(200),
          grade_level VARCHAR(20),
          guardian_name VARCHAR(200),
          guardian_relationship VARCHAR(50),
          guardian_phone VARCHAR(20),
          emergency_contact_name VARCHAR(200),
          emergency_contact_phone VARCHAR(20),
          medical_conditions TEXT,
          allergies TEXT,
          bio TEXT,
          dreams_aspirations TEXT,
          favorite_subjects TEXT[],
          hobbies TEXT[],
          languages_spoken TEXT[],
          registration_type VARCHAR(20) NOT NULL DEFAULT 'ngo_assisted' CHECK (registration_type IN ('self_registered', 'ngo_assisted')),
          has_device_access BOOLEAN DEFAULT FALSE,
          has_id_document BOOLEAN DEFAULT FALSE,
          profile_photo_url VARCHAR(500),
          sponsorship_status VARCHAR(20) DEFAULT 'available' CHECK (sponsorship_status IN ('available', 'sponsored', 'graduated', 'inactive')),
          privacy_settings JSONB DEFAULT '{"show_photo": false, "show_full_name": false, "show_location": true}',
          profile_complete BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(child_code),
          UNIQUE(user_id)
        );
      `);

      await pool.query(`
        CREATE TRIGGER update_child_profiles_updated_at
          BEFORE UPDATE ON child_profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
      break;

    case '007_create_child_needs_table':
      await pool.query(`
        CREATE TABLE IF NOT EXISTS child_needs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
          category VARCHAR(50) NOT NULL CHECK (category IN ('education', 'health', 'nutrition', 'clothing', 'shelter', 'skills', 'other')),
          title VARCHAR(200) NOT NULL,
          description TEXT NOT NULL,
          priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
          estimated_cost DECIMAL(10,2),
          status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
          created_by UUID NOT NULL REFERENCES users(id),
          fulfilled_by UUID REFERENCES users(id),
          fulfilled_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE TRIGGER update_child_needs_updated_at
          BEFORE UPDATE ON child_needs
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
      break;

    case '008_create_documents_table':
      await pool.query(`
        CREATE TABLE IF NOT EXISTS documents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_id UUID NOT NULL, -- Can reference users, child_profiles, or ngo_profiles
          owner_type VARCHAR(20) NOT NULL CHECK (owner_type IN ('user', 'child', 'ngo')),
          document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('id_card', 'birth_certificate', 'school_certificate', 'medical_record', 'ngo_registration', 'tax_certificate', 'bank_statement', 'other')),
          file_name VARCHAR(300) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size BIGINT NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
          verification_notes TEXT,
          verified_by UUID REFERENCES users(id),
          verified_at TIMESTAMP,
          uploaded_by UUID NOT NULL REFERENCES users(id),
          is_sensitive BOOLEAN DEFAULT TRUE,
          expiry_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE TRIGGER update_documents_updated_at
          BEFORE UPDATE ON documents
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
      break;

    case '009_create_profile_indexes':
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_sponsor_profiles_user_id ON sponsor_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_sponsor_profiles_country ON sponsor_profiles(country);
        CREATE INDEX IF NOT EXISTS idx_sponsor_profiles_budget ON sponsor_profiles(sponsorship_budget);
        CREATE INDEX IF NOT EXISTS idx_ngo_profiles_user_id ON ngo_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_ngo_profiles_country ON ngo_profiles(country);
        CREATE INDEX IF NOT EXISTS idx_ngo_profiles_verification_status ON ngo_profiles(verification_status);
        CREATE INDEX IF NOT EXISTS idx_child_profiles_user_id ON child_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_child_profiles_ngo_id ON child_profiles(ngo_id);
        CREATE INDEX IF NOT EXISTS idx_child_profiles_child_code ON child_profiles(child_code);
        CREATE INDEX IF NOT EXISTS idx_child_profiles_country ON child_profiles(country);
        CREATE INDEX IF NOT EXISTS idx_child_profiles_age ON child_profiles(date_of_birth);
        CREATE INDEX IF NOT EXISTS idx_child_profiles_sponsorship_status ON child_profiles(sponsorship_status);
        CREATE INDEX IF NOT EXISTS idx_child_needs_child_id ON child_needs(child_id);
        CREATE INDEX IF NOT EXISTS idx_child_needs_category ON child_needs(category);
        CREATE INDEX IF NOT EXISTS idx_child_needs_status ON child_needs(status);
        CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_id, owner_type);
        CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
        CREATE INDEX IF NOT EXISTS idx_documents_verification ON documents(verification_status);
      `);
      break;

    default:
      throw new Error(`Unknown migration: ${migrationName}`);
  }
};

// Initialize database with migrations
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing PostgreSQL database...');
    await runMigrations();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

module.exports = {
  pool,
  initializeDatabase,
  testConnection
};