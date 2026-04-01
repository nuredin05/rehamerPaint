-- Migration: Add missing columns to users table for authentication features
-- Run this in MySQL to add the columns the User model expects

USE rehamerpaint_erp;

-- Add email verification fields
ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER last_login,
ADD COLUMN email_verification_token VARCHAR(255) NULL AFTER email_verified;

-- Add password reset fields
ALTER TABLE users 
ADD COLUMN password_reset_token VARCHAR(255) NULL AFTER email_verification_token,
ADD COLUMN password_reset_expires TIMESTAMP NULL AFTER password_reset_token;

-- Add login security fields
ALTER TABLE users 
ADD COLUMN login_attempts INT DEFAULT 0 AFTER password_reset_expires,
ADD COLUMN locked_until TIMESTAMP NULL AFTER login_attempts;

SELECT 'Users table migration completed successfully!' as message;
