# 🗨️ Let'sChatBuddy

Real-time chat web application with friend discovery, connection requests, and live chatting — powered by **Django**, **React**, **Redis**, and **WebSockets**.

---

## 📁 Project Structure

```
letschatbuddy/
├── server/
│   └── letschatbuddy/         # Django backend
│       ├── accounts/          # Handles authentication
│       ├── chats/             # WebSocket chat, Redis channel
│       └── letschatbuddy/     # Core Django project
├── client/
│   └── letschatbuddy/         # React frontend (Vite-based)
```

---

## 🚀 Features

### ✅ Frontend (React + Vite)

- Discover users
- Send connection requests
- View received connection requests
- Live chat (via WebSockets)
- Built using Tailwind CSS, Axios, Lucide Icons

### 🛠 Backend (Django + DRF + Channels)

- JWT Authentication (via Django REST Framework)
- Real-time chat with Django Channels and Redis as channel layer
- WebSocket middleware for JWT token-based authentication
- RESTful API using Django REST Framework

---

## 🧠 Tech Stack

| Layer     | Tech Used                                   |
|-----------|---------------------------------------------|
| Frontend  | React (Vite), Tailwind CSS, Axios           |
| Backend   | Django, Django REST Framework, Channels     |
| Auth      | JWT Authentication                          |
| Realtime  | Django Channels, Redis (as channel layer)   |
| Hosting   | Render, Vercel, Neon                        |

---

## 🛠 Setup Instructions

### 📦 Backend

```bash
cd server/letschatbuddy
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `.env` file with necessary keys:

```env
DATABASE_URL=your-db-url
SECRET_KEY=your-secret-key
CORS_ALLOWED_ORIGINS=your-allowed-origins
ALLOWED_HOSTS=your-allowed-hosts
DEBUG=True
REDIS_URL=your-redis-url
REDIS_CACHE_TIMEOUT=timeout-in-seconds
```

```bash
python manage.py migrate
python manage.py runserver
```

### Redis Setup

Ensure Redis server is running locally or remotely. For local testing:

```bash
sudo apt install redis
sudo service redis start
```

---

### 💻 Frontend

```bash
cd client/letschatbuddy
npm install
npm run dev
```

Create `.env` file in frontend:

```env
VITE_API_URL=https://your-backend-url/api/v1/
VITE_WEBSOCKET_URL=ws://your-backend-url/ws/chat/
```

---

### 💡 Development Tips

- Use `daphne` or `uvicorn` to run ASGI server for WebSocket support
- Use Postman or frontend for testing API and auth flows

---

## 📄 License

MIT © 2025 Let'sChatBuddy Team