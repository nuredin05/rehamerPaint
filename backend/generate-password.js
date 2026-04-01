const bcrypt = require('bcryptjs');

// Generate a fresh hash for 'admin123' with proper salt rounds
const password = 'admin123';
const hash = bcrypt.hashSync(password, 12);

console.log('\n========================================');
console.log('Password:', password);
console.log('Generated Hash:', hash);
console.log('========================================\n');

// Verify the hash works
const isValid = bcrypt.compareSync(password, hash);
console.log('Verification test:', isValid ? '✅ PASS' : '❌ FAIL');

// Test the original hash from database
const originalHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm';
const originalValid = bcrypt.compareSync(password, originalHash);
console.log('Original hash test:', originalValid ? '✅ PASS' : '❌ FAIL');

console.log('\nUse this SQL to reset the account:');
console.log(`
USE rehamerpaint_erp;
UPDATE users 
SET login_attempts = 0, 
    locked_until = NULL,
    password_hash = '${hash}'
WHERE id = 1;
`);
