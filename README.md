# TaskFlow - Modern Team Task Manager

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://task-management-system-project-six.vercel.app/login)

TaskFlow is a professional full-stack task management platform designed for team collaboration. It features a modern UI, secure authentication, and robust project tracking.

## 🚀 Key Features
- **Secure Authentication**: JWT-based login/signup with bcrypt password hashing.
- **Project Management**: Create, edit, and track multiple projects.
- **Team Collaboration**: Assign tasks to team members within specific projects.
- **Advanced Task Tracking**: Status badges, priority levels (Low/Medium/High), and due dates.
- **Interactive Dashboard**: Real-time statistics for total, completed, pending, and overdue tasks.
- **Modern UI**: Fully responsive interface built with React and Tailwind CSS v4.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (with In-Memory fallback for testing).
- **Authentication**: JSON Web Tokens (JWT).

## 💻 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/zaki391/Task-Management-System-Project.git
cd Task-Management-System-Project
```

### 2. Setup Backend
```bash
cd backend
npm install
npm start
```
*The backend will run on port 5000 and automatically use an in-memory database if a local MongoDB is not found.*

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser.*

## 🧪 Testing with Seed Data
I've included a seed script to quickly populate the app with demo data:
```bash
cd backend
node src/utils/seed.js
```
**Demo Accounts:**
- **Admin**: `admin@taskflow.com` / `password123`
- **Member**: `member@taskflow.com` / `password123`

---
Built by [zaki](https://github.com/zaki391)
