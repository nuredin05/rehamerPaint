#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up RehamerPaint Backend Environment...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=rehamerpaint_erp
DB_DIALECT=mysql
DB_TIMEZONE=+00:00

# JWT Configuration
JWT_SECRET=rehamerpaint_super_secret_jwt_key_2024_make_it_long_and_random
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# API Configuration
API_PREFIX=/api/v1
API_TIMEOUT=30000

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/app.log
LOG_MAX_SIZE=20m
LOG_MAX_FILES=14d

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx,xls,xlsx

# Email Configuration (Optional - Leave empty if not using)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password

# Redis Configuration (Optional - Leave empty if not using)
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=
# REDIS_DB=0

# Application Configuration
DEBUG=false
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('\n📝 IMPORTANT: Please update the following values in .env:');
  console.log('   - DB_PASSWORD: Your MySQL password');
  console.log('   - JWT_SECRET: Generate a new secure secret');
  console.log('   - Email settings (if using email features)');
  console.log('\n🚀 After updating, run: npm start');
} catch (error) {
  console.error('❌ Failed to create .env file:', error.message);
  process.exit(1);
}
