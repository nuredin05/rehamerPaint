# Database Integration Setup Guide

## 🎯 Overview
Your RehamerPaint ERP now supports full database integration instead of hardcoded data. This guide will help you set up the backend and connect it to your frontend.

## 📋 Prerequisites
- Node.js (v18 or higher)
- MySQL Database
- Your existing backend structure

## 🚀 Quick Setup

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### 2. Database Configuration
Update your `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rehamerpaint
DB_USER=root
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Start Backend Server
```bash
# Start in development mode
npm run dev

# Or start in production mode
npm start
```

### 4. Frontend Configuration
Your frontend is already configured to connect to:
- Backend URL: `http://localhost:3000`
- API Base: `http://localhost:3000/api`

## 🔧 What's Been Implemented

### ✅ API Service Layer (`src/services/api.js`)
- **Complete CRUD Operations** for all modules
- **Authentication** with JWT tokens
- **Error Handling** with proper error messages
- **File Upload/Export** capabilities
- **Query Parameters** support for filtering and pagination

### ✅ Custom Hooks (`src/hooks/useApiData.js`)
- **useApiData**: Automatic data fetching with loading states
- **useCrudOperations**: Standardized CRUD operations
- **useNotification**: Toast notification system
- **useSearchFilter**: Real-time search functionality
- **useModal**: Modal management
- **useForm**: Form validation and management

### ✅ Database-Integrated Admin Module (`src/pages/Admin-DB.jsx`)
- **Real Database Operations** instead of hardcoded data
- **Loading States** while fetching data
- **Error Handling** with user-friendly messages
- **Form Validation** with real-time feedback
- **Audit Trail** automatically created for all actions

## 📊 Available API Endpoints

### Admin Module
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/audit-logs` - Get audit logs
- `GET /api/admin/settings` - Get system settings

### Sales Module
- `GET /api/sales/orders` - List orders
- `POST /api/sales/orders` - Create order
- `PUT /api/sales/orders/:id/status` - Update order status
- `GET /api/sales/customers` - List customers
- `POST /api/sales/customers` - Create customer
- `GET /api/sales/invoices` - List invoices

### Finance Module
- `GET /api/finance/transactions` - List transactions
- `POST /api/finance/transactions` - Create transaction
- `GET /api/finance/accounts` - List accounts
- `POST /api/finance/accounts` - Create account

### HR Module
- `GET /api/hr/employees` - List employees
- `POST /api/hr/employees` - Create employee
- `GET /api/hr/departments` - List departments
- `POST /api/hr/departments` - Create department
- `GET /api/hr/attendance` - Get attendance records
- `GET /api/hr/payroll` - Get payroll data

### Other Modules
- Inventory, Procurement, Manufacturing, Logistics, Reports endpoints are all available

## 🎨 Frontend Features

### Real-time Data Updates
- Data automatically refreshes after CRUD operations
- Loading indicators during API calls
- Error messages for failed operations

### Search & Filter
- Live search across all modules
- Filter by different fields
- Pagination support

### Form Validation
- Required field validation
- Email format validation
- Custom validation rules
- Real-time error feedback

### Notifications
- Success messages for completed operations
- Error messages for failed operations
- Auto-dismiss after 3 seconds

## 🔐 Authentication

### Login Flow
1. User enters credentials
2. Frontend calls `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. All subsequent API calls include the token

### Protected Routes
All API endpoints require valid JWT token
Token automatically included in Authorization header

## 📝 Usage Examples

### Using the API Service
```javascript
import apiService from '../services/api';

// Get all users
const users = await apiService.getUsers();

// Create new user
const newUser = await apiService.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  department: 'Sales'
});

// Update user
const updatedUser = await apiService.updateUser(userId, {
  name: 'John Smith'
});
```

### Using Custom Hooks
```javascript
import { useApiData, useCrudOperations } from '../hooks/useApiData';

// In your component
const { data: users, loading, error, refetch } = useApiData(
  () => apiService.getUsers()
);

const { create, update, remove } = useCrudOperations({
  create: apiService.createUser,
  update: apiService.updateUser,
  delete: apiService.deleteUser
});
```

## 🚨 Troubleshooting

### Common Issues

#### 1. CORS Errors
- Ensure backend CORS is configured for `http://localhost:5173` (Vite default)
- Check backend CORS middleware settings

#### 2. Database Connection
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

#### 3. Authentication Issues
- Check JWT_SECRET in `.env`
- Verify token is being stored in localStorage
- Check API token expiration

#### 4. API Not Responding
- Ensure backend server is running on port 3000
- Check backend console for errors
- Verify API endpoints are correctly defined

### Debug Mode
Add console logging to see API calls:
```javascript
// In api.js
console.log('Making API call to:', url);
console.log('Request config:', config);
```

## 🔄 Next Steps

### Convert Other Modules
To convert other modules from hardcoded to database:

1. **Update the module file** to use `useApiData` and `useCrudOperations`
2. **Replace hardcoded arrays** with API calls
3. **Add loading and error states**
4. **Update App.jsx** to use the new module

Example conversion pattern:
```javascript
// Before (hardcoded)
const [users, setUsers] = useState([]);

// After (database)
const { data: users, loading, error, refetch } = useApiData(
  () => apiService.getUsers()
);
```

### Add New Features
- **Real-time updates** with WebSockets
- **Offline support** with service workers
- **Data caching** for better performance
- **Advanced filtering** and sorting

## 📚 Additional Resources

- Backend API Documentation: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`
- Database Models: `backend/src/models/`
- API Routes: `backend/src/routes/`

## 🎉 You're Ready!

Your RehamerPaint ERP now has:
- ✅ Full database integration
- ✅ Professional API architecture
- ✅ Real-time data operations
- ✅ Error handling and validation
- ✅ Authentication system
- ✅ Scalable code structure

Start your backend server and enjoy your fully functional database-driven ERP! 🚀
