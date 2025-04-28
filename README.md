# Task Management Application ||    Live Link Here : https://task-management-5c2756lcx-savan-rathods-projects.vercel.app

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to create, manage, and track their tasks with features like task filtering, priority setting, and user authentication.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete tasks
- Task filtering (all, active, completed)
- Priority levels for tasks
- Responsive design with Tailwind CSS
- Real-time task updates
- Secure API endpoints with JWT authentication

## Technical Stack

### Frontend
- React.js for UI components
- Context API for state management
- Axios for API requests
- React Router for navigation
- Tailwind CSS for styling
- React Toastify for notifications

### Backend
- Node.js with Express.js
- MongoDB for database
- Mongoose for ODM
- JWT for authentication
- Express Async Handler for error handling
- CORS for cross-origin requests

## Database Schema

### User Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### Task Model
```javascript
{
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['incomplete', 'complete'], 
    default: 'incomplete' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5001
<<<<<<< HEAD
   MONGODB_URI=mongodb://localhost:27017/task-management //use can you mongodb-atlas url as well
=======
   MONGODB_URI=mongodb://localhost:27017/task-management
>>>>>>> d30b4c5 (First commit)
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Running the Application

1. Start MongoDB (if using local instance)
2. Start the backend server (from backend directory)
3. Start the frontend development server (from frontend directory)
4. Open your browser and navigate to `http://localhost:3000`

## Seed Data

To populate the database with test data, follow these steps:

1. Make sure MongoDB is running
2. Navigate to the backend directory
3. Run the seed script:
   ```bash
   npm run seed
   ```

This will create three test users with sample tasks:

### Test Users
1. Admin User:
   - Email: admin@example.com
   - Password: admin123
   - Tasks: 5 sample tasks

2. Regular User:
   - Email: user@example.com
   - Password: user123
   - Tasks: 5 sample tasks

3. Test User:
   - Email: test@example.com
   - Password: test123
   - Tasks: 5 sample tasks

### Sample Tasks
Each user will have the following tasks:
1. High Priority Task:
   ```json
   {
     "title": "Complete Project Documentation",
     "description": "Write comprehensive documentation for the task management application",
     "priority": "high",
     "status": "incomplete"
   }
   ```

2. Medium Priority Task:
   ```json
   {
     "title": "Implement Task Filtering",
     "description": "Add functionality to filter tasks by status and priority",
     "priority": "medium",
     "status": "complete"
   }
   ```

3. Low Priority Task:
   ```json
   {
     "title": "Update UI Styling",
     "description": "Improve the visual design of the application",
     "priority": "low",
     "status": "incomplete"
   }
   ```

4. High Priority Task:
   ```json
   {
     "title": "Fix Authentication Bug",
     "description": "Resolve the issue with JWT token expiration",
     "priority": "high",
     "status": "incomplete"
   }
   ```

5. Medium Priority Task:
   ```json
   {
     "title": "Add Task Categories",
     "description": "Implement the ability to categorize tasks",
     "priority": "medium",
     "status": "incomplete"
   }
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Tasks
- GET /api/tasks - Get all tasks for current user
- POST /api/tasks - Create a new task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Input validation
- CORS configuration
- Environment variables for sensitive data

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
<<<<<<< HEAD
This project is licensed under the MIT License.


