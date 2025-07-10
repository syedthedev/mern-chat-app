# 💬 MERN Chat App

A real-time chat application built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.IO** for live messaging. Users can register, login, update their profiles, and chat with others in real-time with image support and online presence detection.

![Chat App Screenshot](https://via.placeholder.com/900x400.png?text=MERN+Chat+App+Preview)

---

## 🚀 Features

- 🔐 User Authentication (JWT + Cookies)
- 💬 Real-time Messaging (Socket.IO)
- 🧑‍🤝‍🧑 Online Users Detection
- 📷 Image Uploads (Cloudinary)
- 👤 Profile Editing (name, bio, profile pic)
- 🌐 Mobile-Responsive UI
- 🗂️ Clean Folder Structure with Context API

---

## 🛠️ Tech Stack

| Tech        | Description                  |
|-------------|------------------------------|
| **Frontend**| React, Tailwind CSS, Axios   |
| **Backend** | Node.js, Express, Socket.IO  |
| **Database**| MongoDB Atlas (Mongoose)     |
| **Auth**    | JWT + HTTPOnly Cookies       |
| **Image CDN** | Cloudinary                |

---

## 📸 Screenshots

### 🔐 Login Page
![Login](Client/public/chat-Login.PNG)

### 📝 Register Page
![Register](Client/public/Register.PNG)

### 🏠 Home Page
![Home](Client/public/chat-Home.PNG)

### 👤 Update Profile
![Profile](Client/public/Edit-Profile-update.PNG)

---

## 📦 Getting Started

### 1️⃣ Clone the Repository

```bash
# 1. Clont The Repo
git clone https://github.com/syedthedev/mern-todo-app.git
cd mern-todo-app

# 2. Backend
cd Server
npm install
node Server.js

# 3. Frontend
cd Client
npm run dev
