/**
 * Fix login for an existing admin user if the password was stored incorrectly
 * (e.g. pre-hashed in a seed script while the model also hashes on save).
 * Usage: node reset-admin-password.js [username]
 */
const { sequelize } = require('./src/config/database');
const { User } = require('./src/models');

const username = process.argv[2] || 'admin';
const newPassword = process.argv[3] || 'admin123';

async function resetPassword() {
  try {
    await sequelize.authenticate();
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.error(`No user found with username: ${username}`);
      process.exit(1);
    }
    await user.update({ passwordHash: newPassword });
    console.log(`Password updated for "${username}". New password: ${newPassword}`);
  } catch (err) {
    console.error('❌ Reset failed:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

resetPassword();
