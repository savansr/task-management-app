# Task Manager - Full Stack Application

A full-stack task management application built with Node.js, TypeScript, Prisma, and Next.js.

## Features

### Backend
-  User Authentication (Register, Login, Logout)
-  JWT-based security with Access and Refresh Tokens
-  Password hashing with bcrypt
-  Task CRUD operations
-  Task pagination, filtering, and search
-  TypeScript throughout
-  Prisma ORM with PostgreSQL

### Frontend
-  Next.js 14 with App Router
-  TypeScript
-  Responsive design (mobile and desktop)
-  Authentication pages (Login/Register)
-  Task Dashboard with filtering and search
-  Task CRUD operations
-  Toast notifications
-  Automatic token refresh

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

2. Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
JWT_ACCESS_SECRET=""
JWT_REFRESH_SECRET=""
JWT_ACCESS_EXPIRES_IN=""
JWT_REFRESH_EXPIRES_IN=""
PORT=3001
```

3. Set up the database:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

4. Start the backend server:

```bash
npm run dev
```

The backend API will be running on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

2. Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Tasks
- `GET /tasks` - Get all tasks (with pagination, filtering, search)
  - Query params: `page`, `limit`, `status`, `search`
- `GET /tasks/:id` - Get a single task
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `PATCH /tasks/:id/toggle` - Toggle task status

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── tasks.ts
│   │   ├── utils/
│   │   │   └── jwt.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskFilters.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   └── api.ts
│   └── package.json
└── README.md
```

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Register a new account or login
4. Start creating and managing your tasks!

## Technologies Used

- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, bcrypt
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Axios, React Hot Toast
