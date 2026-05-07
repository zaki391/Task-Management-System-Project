# 🚀 Task Manager REST API

A modern, full-stack **Task Manager application** built with **Node.js, Express, and Vanilla JavaScript**, featuring a clean REST API and an interactive frontend UI.

This project allows users to efficiently **create, update, manage, and track tasks** with proper validation, error handling, and live deployment.

---

## 🌐 Live Demo

🔗 **API Base URL:**
https://task-manager-app-wigi.onrender.com/

⚠️ *Note: The server may take 20–40 seconds to respond on the first request due to free hosting (Render sleep mode).*

---

## ✨ Features

### 🔹 Core Features

* Create tasks with title and description
* Retrieve all tasks or a single task by ID
* Update task details
* Mark tasks as completed
* Delete tasks

---

### 🔹 Bonus Features

* Filter tasks by status (`pending` / `done`)
* Sort tasks by creation time
* Proper HTTP status codes and error handling

---

### 🔹 Frontend Features

* Modern UI using Tailwind CSS
* Responsive and clean design
* Task cards with status indicators
* Real-time updates (no page reload)
* Edit, Delete, and Mark as Done actions
* Filter and sorting controls

---

## 🧱 Tech Stack

### Backend

* Node.js
* Express.js
* In-memory data storage
* UUID for unique IDs
* CORS enabled

### Frontend

* HTML
* CSS (Tailwind CSS)
* JavaScript (Fetch API)

---

## 📂 Project Structure

```
/backend
  ├── src/
  │   ├── routes/
  │   ├── controllers/
  │   ├── middlewares/
  │   └── utils/
  └── server.js

/frontend
  ├── index.html
  ├── style.css
  └── script.js
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```
git clone https://github.com/Shamim-Akhtar375/Task-manager-rest-api
cd Task-manager-rest-api
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
npm start
```

Server runs on:

```
http://localhost:3000
```

---

### 3️⃣ Frontend Setup

* Open `frontend/index.html` in your browser
  OR
* Use Live Server extension

---

## 🔗 API Endpoints

### ➤ Create Task

```
POST /tasks
```

```json
{
  "title": "Complete assignment",
  "description": "Finish API + UI + README"
}
```

---

### ➤ Get All Tasks

```
GET /tasks
```

Optional:

```
/tasks?status=pending
/tasks?sort=createdAt
```

---

### ➤ Get Task by ID

```
GET /tasks/:id
```

---

### ➤ Update Task

```
PUT /tasks/:id
```

---

### ➤ Mark Task as Done

```
PATCH /tasks/:id/done
```

---

### ➤ Delete Task

```
DELETE /tasks/:id
```

---

## ⚠️ Error Handling

* **400 Bad Request** → Invalid or missing input
* **404 Not Found** → Task does not exist
* **405 Method Not Allowed** → Unsupported HTTP method

Example:

```json
{
  "success": false,
  "message": "Task with given ID not found"
}
```

---

## 🧪 Testing

You can test the API using:

* Postman
* curl
* Browser (for GET requests)

Example:

```
curl https://task-manager-app-wigi.onrender.com/tasks
```

---

## ⭐ Code Quality

* Clean and modular architecture
* Separation of concerns (routes, controllers, middleware)
* Consistent response format
* Proper validation and error handling
* RESTful API design

---

## 🚀 Future Improvements

* Add database (MongoDB / PostgreSQL)
* User authentication
* Pagination and search
* Deployment of frontend (Netlify/Vercel)

---

## 👨‍💻 Author

**Shamim Akhtar**
B.Tech CSE

---

## 📌 Note

This project was developed as part of a **Software Developer Assignment**, focusing on building a clean and functional REST API with proper backend practices and a modern UI.
