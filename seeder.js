const bcrypt = require('bcrypt');
const { User } = require('../models');
const sequelize = require('../config/database');

// Function to seed initial admin user
const seedAdmin = async () => {
  try {
    // Check if we have any users first
    const userCount = await User.count();
    
    // Only seed if no users exist
    if (userCount === 0) {
      console.log('No users found. Creating super admin account...');
      
      // Create super admin
      await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: 'admin123', // Will be hashed by model hooks
        gender: 'Others',
        role: 'Super-admin',
        createdBy: 'System'
      });
      
      console.log('Super admin account created successfully.');
    } else {
      console.log('Users already exist. Skipping admin seed.');
    }
  } catch (error) {
    console.error('Error seeding admin account:', error);
  }
};

// Function to run all seeds
const runSeeds = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: false });
    
    // Run all seed functions
    await seedAdmin();
    
    console.log('All seeds completed successfully.');
  } catch (error) {
    console.error('Error running seeds:', error);
  }
};

// If this script is run directly, execute the seeder
if (require.main === module) {
  runSeeds()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedAdmin, runSeeds };