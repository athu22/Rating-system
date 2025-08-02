# Store Rating System

A full-stack web application for managing store ratings with role-based access control. Built with Express.js, PostgreSQL, and React.js.

## Features

### Admin Features
- Dashboard with total users, stores, and ratings statistics
- User management (add, edit, delete users)
- Store management (add, edit, delete stores)
- View all users and stores with filtering and sorting
- Analytics and reporting

### Store Owner Features
- Dashboard showing store performance
- View ratings for their stores
- See average ratings and customer feedback
- Manage store information

### Normal User Features
- Register and login
- Browse all stores with search functionality
- Submit and edit ratings (1-5 stars)
- View personal rating history
- Search stores by name or address

## Technology Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** for security headers
- **cors** for cross-origin requests

### Frontend
- **React.js** with hooks
- **React Router** for navigation
- **React Query** for data fetching
- **Styled Components** for styling
- **React Hook Form** for form handling
- **React Hot Toast** for notifications
- **React Icons** for icons

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(60) NOT NULL, 20-60 characters)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `password` (VARCHAR(255) NOT NULL, 8-16 chars with uppercase and special char)
- `role` (VARCHAR(20) NOT NULL, 'admin', 'store_owner', 'user')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Stores Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100) NOT NULL)
- `address` (VARCHAR(400) NOT NULL)
- `owner_id` (INTEGER REFERENCES users(id))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Ratings Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users(id))
- `store_id` (INTEGER REFERENCES stores(id))
- `rating` (INTEGER NOT NULL, 1-5)
- `comment` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- UNIQUE(user_id, store_id)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/athu22/Rating-system.git
cd store-rating-system
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (backend and frontend)
npm run install-all
```

### 3. Database Setup
1. Create a PostgreSQL database:
```sql
CREATE DATABASE store_rating_system;
```

2. Create a `.env` file in the `server` directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_system
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

3. Run the database setup script:
```bash
cd server
npm run db:setup
```

### 4. Start the Application

#### Development Mode (Both Backend and Frontend)
```bash
npm run dev
```

#### Separate Development Servers
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Default User Accounts

After running the database setup, you can login with the following default accounts:

### Admin Account
- **Email**: admin@store-rating.com
- **Password**: Admin123!
- **Role**: Admin (Full system access)

### Store Owner Account
- **Email**: storeowner@store-rating.com
- **Password**: Store123!
- **Role**: Store Owner (Manage own stores and view ratings)

### Normal User Account
- **Email**: user@store-rating.com
- **Password**: User123!
- **Role**: User (Browse stores and submit ratings)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Users (Admin Only)
- `GET /api/users` - Get all users with pagination
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Stores
- `GET /api/stores` - Get all stores with pagination
- `POST /api/stores` - Create store (Admin only)
- `GET /api/stores/:id` - Get store by ID
- `PUT /api/stores/:id` - Update store (Admin only)
- `DELETE /api/stores/:id` - Delete store (Admin only)
- `GET /api/stores/owner/:ownerId` - Get stores by owner

### Ratings
- `POST /api/ratings` - Submit rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating
- `GET /api/ratings/store/:storeId` - Get ratings by store
- `GET /api/ratings/user/me` - Get user's ratings
- `GET /api/ratings/owner/me` - Get store owner's ratings

### Dashboard
- `GET /api/dashboard` - Get dashboard data based on user role

## Validation Rules

### User Registration/Update
- **Name**: 20-60 characters
- **Email**: Valid email format
- **Password**: 8-16 characters, at least one uppercase letter and one special character

### Store Creation/Update
- **Name**: 1-100 characters
- **Address**: 1-400 characters

### Rating Submission
- **Rating**: 1-5 stars
- **Comment**: Optional, max 1000 characters

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- Rate limiting
- Security headers with helmet

## Project Structure
```
store-rating-system/
├── server/                 # Backend
│   ├── controllers/        # Route controllers
│   ├── database/          # Database setup and connection
│   ├── middleware/        # Authentication and validation
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── package.json
├── client/                # Frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

