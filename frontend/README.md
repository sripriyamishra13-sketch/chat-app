# 💬 Browser-Based Real-Time Chat Application

A full-stack real-time chat application built with React and FastAPI supporting chat rooms, emojis, media sharing, and WebSocket communication.

---

## 🚀 Features

### Frontend (React)

* Responsive modern UI
* Multiple chat rooms
* Emoji support
* Message timestamps
* File/Image sharing
* Browser notifications
* Real-time updates

### Backend (FastAPI)

* User Registration & Login
* Password hashing (bcrypt)
* WebSocket communication
* Chat history storage
* File upload handling
* Secure data processing

### Database

* SQLite storage
* Users table
* Messages table
* Chat room tracking

---

## 🧠 Tech Stack

### Frontend

* React
* HTML5 / CSS3
* JavaScript
* WebSocket API

### Backend

* Python
* FastAPI
* Uvicorn
* Passlib (security)
* SQLAlchemy

### Database

* SQLite

---

## 📦 Installation

### 1️⃣ Clone Repository

```bash
git clone <https://github.com/sripriyamishra13-sketch/chat-app.git>
cd chat-app
```

---

### 2️⃣ Start Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Server runs on:

```
http://127.0.0.1:8000
```

---

### 3️⃣ Start Frontend

```bash
cd frontend
npm install
npm start
```

App runs on:

```
http://localhost:3000
```

---

## 🖼 Project Structure

```
chat-app/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── uploads/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
```

---

## 🔐 Security Implemented

* Password hashing
* Input validation
* WebSocket isolation by room
* Basic data protection

---

## 🌍 Deployment (Planned)

* Version Control → GitHub

---

## 👨‍💻 Author
**Sripriya Mishra**

Built as an advanced full-stack project for learning real-time systems and web architecture.

---


