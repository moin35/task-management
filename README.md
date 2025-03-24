# Task Manager Application

A full-stack task management system with React frontend, Laravel backend, and MySQL database, containerized using Docker.


## Features

### Frontend (React)
- 🖥️ Modern UI with Material-UI components
- 🧩 Drag-and-drop task organization using react-beautiful-dnd
- 🔄 State management with Redux Toolkit
- 🛣️ Client-side routing via React Router v7
- 🔒 JWT authentication flow
- 📡 API communication with Axios

### Backend (Laravel)
- 🔑 JWT Authentication with tymon/jwt-auth
- 🗃️ RESTful API endpoints
- 🧠 Eloquent ORM for database management
- 🧪 PHPUnit testing setup
- 📊 MySQL database integration

## Tech Stack

**Frontend**  
React 18 · Redux Toolkit · Material-UI · react-beautiful-dnd · Axios

**Backend**  
Laravel 10 · PHP 8.1 · MySQL 8 · JWT Auth

**Infrastructure**  
Docker · Docker Compose · Nginx

## Prerequisites

- 🐳 Docker Engine 20.10+
- 🐳 Docker Compose 2.20+
- ⚙️ Node.js 18.x
- 🐘 PHP 8.1
- 📦 Composer 2.5+

## Quick Start with Docker

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-repo/task-manager.git
   cd task-manager

2. **Initialize Environment**
    cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    
3.  **Build and Launch Containers**
    docker-compose up --build

4. **Access Services**
    Frontend: http://localhost:3000
    Backend API: http://localhost:8000
    MySQL: localhost:3306 (user: root, pass: root)

5. **Initialize Database**
    docker-compose exec backend php artisan migrate --seed

6. **API Documentation**
    Authentication
    POST /api/login - User authentication
    POST /api/register - User registration

    Tasks
    GET /api/tasks - List all tasks
    POST /api/tasks - Create new task
    PUT /api/tasks/{id} - Update task
    PATCH /api/tasks/{id}/status - Update Status 
    DELETE /api/tasks/{id} - Delete task
    POST   /api/logout  - Log Out

7. **Live Check**
    https://task-manager.techdemand.xyz/
    Email: moinmd@yahoo.com
    password: 123123