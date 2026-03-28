# RehamerPaint ERP Backend

Backend API server for the RehamerPaint ERP system, built with Node.js, Express, and MySQL.

## Features

- **RESTful API** with comprehensive endpoints
- **JWT Authentication** with refresh tokens
- **Role-based Authorization** (admin, manager, operator, viewer)
- **Multi-tenant Support** with company-based data isolation
- **Audit Logging** for compliance and security
- **Rate Limiting** and security middleware
- **Comprehensive Error Handling**
- **API Documentation** with Swagger/OpenAPI
- **File Upload** support
- **Email Notifications**
- **PDF and Excel Export** capabilities

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for MySQL
- **JWT** - Authentication tokens
- **Joi** - Input validation
- **Winston** - Logging
- **Multer** - File uploads
- **PDFKit** - PDF generation
- **ExcelJS** - Excel generation
- **Nodemailer** - Email sending

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Redis (optional, for caching)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Setup database**
```bash
# Create database in MySQL
mysql -u root -p
CREATE DATABASE rehamerpaint_erp;

# Import schema (from project root)
mysql -u root -p rehamerpaint_erp < ../database-schema.sql
```

4. **Start development server**
```bash
npm run dev
```

The API server will start on `http://localhost:3000`

### Environment Variables

Key environment variables to configure:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rehamerpaint_erp
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` for interactive API documentation.

### Authentication

Most endpoints require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Base URL

All API endpoints are prefixed with `/api/v1`:

```
http://localhost:3000/api/v1/auth/login
http://localhost:3000/api/v1/inventory/products
http://localhost:3000/api/v1/manufacturing/production-orders
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   ├── services/          # Business logic
│   ├── models/            # Database models
│   ├── middleware/        # Express middleware
│   ├── routes/            # API route definitions
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   └── validators/         # Input validation schemas
├── tests/                 # Test files
├── scripts/               # Utility scripts
├── uploads/               # File upload directory
├── logs/                  # Application logs
└── docs/                  # Documentation
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Production
npm start                # Start production server

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues

# Database
npm run migrate          # Run database migrations
npm run seed             # Seed database with sample data

# Documentation
npm run docs             # Generate API documentation
```

## API Modules

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `POST /auth/change-password` - Change password

### HR & Payroll
- `GET /hr/employees` - List employees
- `POST /hr/employees` - Create employee
- `GET /hr/attendance` - Attendance records
- `POST /hr/payroll` - Process payroll

### Inventory
- `GET /inventory/products` - List products
- `POST /inventory/products` - Create product
- `GET /inventory/stocks` - Stock status
- `GET /inventory/transactions` - Transaction history

### Manufacturing
- `GET /manufacturing/bom` - Bill of materials
- `POST /manufacturing/production-orders` - Create production order
- `GET /manufacturing/batches` - Production batches
- `POST /manufacturing/quality-tests` - Quality tests

### Sales
- `GET /sales/customers` - List customers
- `POST /sales/sales-orders` - Create sales order
- `GET /sales/invoices` - List invoices

### Procurement
- `GET /procurement/suppliers` - List suppliers
- `POST /procurement/purchase-orders` - Create purchase order

### Finance
- `GET /finance/transactions` - List transactions
- `GET /finance/chart-of-accounts` - Chart of accounts
- `GET /finance/reports` - Financial reports

### Logistics
- `GET /logistics/vehicles` - List vehicles
- `POST /logistics/delivery-orders` - Create delivery order
- `GET /logistics/tracking` - Delivery tracking

### Admin
- `GET /admin/users` - List users (admin only)
- `POST /admin/companies` - Create company (admin only)
- `GET /admin/settings` - System settings

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": []
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Common error codes:
- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict
- `INTERNAL_ERROR` - Server error

## Security Features

- **JWT Authentication** with access and refresh tokens
- **Role-based Access Control** (RBAC)
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **SQL Injection Protection** via Sequelize ORM
- **XSS Protection** with Helmet middleware
- **Audit Logging** for all operations
- **Password Hashing** with bcrypt
- **Account Locking** after failed attempts

## Logging

The application uses Winston for structured logging:

- **Info Level**: General operations and successful requests
- **Warning Level**: Non-critical issues
- **Error Level**: Application errors and exceptions
- **Audit Logs**: User actions and data changes

Log files are stored in the `logs/` directory:
- `app.log` - General application logs
- `error.log` - Error-specific logs
- `exceptions.log` - Uncaught exceptions

## Testing

The backend includes comprehensive test coverage:

- **Unit Tests**: Individual functions and utilities
- **Integration Tests**: API endpoints and database operations
- **Authentication Tests**: Login, token validation, permissions

Run tests with coverage:
```bash
npm run test:coverage
```

## Development Tips

1. **Use environment variables** for all configuration
2. **Follow the established patterns** for controllers and services
3. **Add validation schemas** for all input
4. **Write tests** for new features
5. **Update API documentation** for new endpoints
6. **Use proper error handling** and logging
7. **Follow naming conventions** for consistency

## Deployment

### Production Setup

1. **Set environment variables** for production
2. **Configure database** with production credentials
3. **Build and deploy** the application
4. **Set up reverse proxy** (nginx/Apache)
5. **Configure SSL** certificates
6. **Set up monitoring** and logging
7. **Configure backups** for database

### Docker Support

```bash
# Build Docker image
docker build -t rehamerpaint-backend .

# Run with Docker Compose
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Support

For technical support:
- Check the API documentation at `/api-docs`
- Review the application logs
- Check the troubleshooting guide
- Contact the development team

## License

This project is licensed under the MIT License.
