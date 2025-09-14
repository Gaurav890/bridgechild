const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Hash password for all test accounts
    const hashedPassword = await bcrypt.hash('Test123!', 12);
    const adminHashedPassword = await bcrypt.hash('Admin123!', 12);

    // Create test users
    const users = [
      {
        email: 'admin@helpinghands.org',
        password_hash: adminHashedPassword,
        role: 'admin',
        is_verified: true
      },
      {
        email: 'sponsor@test.com',
        password_hash: hashedPassword,
        role: 'sponsor',
        is_verified: true
      },
      {
        email: 'ngo@test.com',
        password_hash: hashedPassword,
        role: 'ngo',
        is_verified: true
      },
      {
        email: 'child@test.com',
        password_hash: hashedPassword,
        role: 'child',
        is_verified: true
      }
    ];

    // Insert users
    for (const user of users) {
      try {
        // Check if user already exists
        const existingUser = await pool.query(
          'SELECT id FROM users WHERE email = $1',
          [user.email]
        );

        if (existingUser.rows.length > 0) {
          console.log(`✅ User ${user.email} already exists, skipping...`);
          continue;
        }

        const result = await pool.query(`
          INSERT INTO users (email, password_hash, role, email_verified, status)
          VALUES ($1, $2, $3, $4, 'active')
        `, [
          user.email,
          user.password_hash,
          user.role,
          user.is_verified
        ]);

        console.log(`✅ Created ${user.role} user: ${user.email}`);

      } catch (userError) {
        console.error(`❌ Error creating user ${user.email}:`, userError.message);
      }
    }

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 TEST ACCOUNTS CREATED:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin:   admin@helpinghands.org / Admin123!');
    console.log('💰 Sponsor: sponsor@test.com / Test123!');
    console.log('🏢 NGO:     ngo@test.com / Test123!');
    console.log('👶 Child:   child@test.com / Test123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = { seedData };