# Task Management API

A full-featured RESTful API for task management with user authentication and role-based access control.

## Features

- **User Authentication**: JWT-based secure login and registration
- **Role-Based Access Control (RBAC)**: Super-admin, Admin, and Manager roles
- **Task Management**: Create, read, update, and delete tasks
- **User Management**: Create, read, update, and delete users
- **File Upload**: Image upload for user profiles
- **API Documentation**: Detailed API endpoints documentation

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRY=24h

# Database Configuration
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=task_management_db
DB_HOST=localhost
DB_DIALECT=mysql
```

### 4. Create the database

Create a MySQL database with the name specified in your `.env` file.

### 5. Run the application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 6. Seed initial data (optional)

```bash
node src/utils/seeder.js
```

This will create a Super-admin user with the following credentials:
- Email: admin@example.com
- Password: admin123

## API Documentation

### Authentication Endpoints

| Method | Endpoint         | Description            | Access      |
|--------|------------------|------------------------|-------------|
| POST   | /api/auth/register | Register a new user    | Public      |
| POST   | /api/auth/login    | Login and get JWT token| Public      |
| GET    | /api/auth/profile  | Get current user profile | Authenticated |

### User Endpoints

| Method | Endpoint      | Description        | Access                    |
|--------|--------------|--------------------|---------------------------|
| POST   | /api/users     | Create a new user  | Admin                    |
| GET    | /api/users     | Get all users      | Super-admin, Admin, Manager |
| GET    | /api/users/:id | Get user by ID     | Super-admin, Admin, Manager |
| PUT    | /api/users/:id | Update user        | Admin                    |
| DELETE | /api/users/:id | Delete user        | Super-admin, Admin       |

### Task Endpoints

| Method | Endpoint      | Description        | Access                    |
|--------|--------------|--------------------|---------------------------|
| POST   | /api/tasks     | Create a new task  | Admin, Manager           |
| GET    | /api/tasks     | Get all tasks      | Super-admin, Admin, Manager |
| GET    | /api/tasks/:id | Get task by ID     | Super-admin, Admin, Manager |
| PUT    | /api/tasks/:id | Update task        | Admin                    |
| DELETE | /api/tasks/:id | Delete task        | Super-admin, Admin       |

## Role Permissions

### Super-admin
- Can view users and tasks
- Can delete users and tasks

### Admin
- Can create, view, update, and delete users
- Can create, view, update, and delete tasks

### Manager
- Can view users
- Can create and view tasks

## Request & Response Examples

### User Registration

**Request:**
```json
POST /api/auth/register
Content-Type: multipart/form-data

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "gender": "Male",
  "role": "Manager",
  "image": [binary image data]
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "gender": "Male",
    "role": "Manager",
    "image": "/uploads/image-1627384517123.jpg",
    "createdAt": "2023-07-27T10:48:37.123Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Task Creation

**Request:**
```json
POST /api/tasks
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "Complete Project Documentation",
  "description": "Write detailed documentation for the task management API",
  "taskType": ["a-task", "b-task"],
  "startDate": "2023-07-27T00:00:00.000Z",
  "endDate": "2023-07-30T00:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "name": "Complete Project Documentation",
    "description": "Write detailed documentation for the task management API",
    "taskType": "a-task,b-task",
    "createdBy": "Manager",
    "startDate": "2023-07-27T00:00:00.000Z",
    "endDate": "2023-07-30T00:00:00.000Z",
    "userId": 1,
    "updatedAt": "2023-07-27T10:50:12.837Z",
    "createdAt": "2023-07-27T10:50:12.837Z"
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication failed or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Security

- Password hashing using bcrypt
- JWT authentication for API protection
- Role-based access control
- Input validation
- File upload restrictions and validation

## License

This project is licensed under the MIT License.