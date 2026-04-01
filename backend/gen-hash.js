const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';
const saltRounds = 12;

console.log('\n========================================');
console.log('Password:', password);
console.log('========================================\n');

// Generate hash
const hash = bcrypt.hashSync(password, saltRounds);
console.log('Generated Hash:');
console.log(hash);
console.log('\n');

// Verify it works
const isValid = bcrypt.compareSync(password, hash);
console.log('Verification:', isValid ? '✅ PASS' : '❌ FAIL');

console.log('\n--- SQL to update database ---');
console.log(`USE rehamerpaint_erp;`);
console.log(`UPDATE users SET password_hash = '${hash}', login_attempts = 0, locked_until = NULL WHERE id = 1;`);
console.log('');
