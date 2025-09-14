#!/usr/bin/env node

const { seedData } = require('../utils/seedData');

const runSeed = async () => {
  try {
    await seedData();
    console.log('✅ Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

runSeed();