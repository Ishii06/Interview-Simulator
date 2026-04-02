# 🚀 InterviewSimulator

InterviewSimulator is a full-stack interview practice platform that combines AI, real-time interaction, and progress tracking to simulate real interview experiences. The project consists of three coordinated services:

- A modern Next.js frontend for interview practice, aptitude tests, coding sheets, profile stats, and resources.
- A Node.js + Express backend that handles authentication, database access, and API orchestration.
- A FastAPI Python service that generates AI-driven interview questions, mock tests, audio, and explanations.

The app is designed to help users practice mock interviews, take aptitude tests, track coding progress, and review their history in one place.

---

## 🛠️ Tech Stack

### 🎨 Frontend

- Next.js 16 → ⚡ Full-stack React framework for fast and SEO-friendly apps  
- React 19 → 🧩 Component-based UI development  
- TypeScript → 🔒 Adds type safety and scalability  
- Tailwind CSS v4 → 🎨 Utility-first styling for rapid UI building  
- Framer Motion → 🎬 Smooth animations and transitions  
- GSAP → 🎥 Advanced high-performance animations  
- Zustand → 🧠 Lightweight global state management  
- Lucide React → ✨ Clean and customizable icons  

---

### ⚙️ Backend

- Node.js → 🚀 Server-side JavaScript runtime  
- Express 5 → 🌐 Minimal framework for building APIs  
- Supabase JS Client → 🔗 Connects backend with database and auth  
- Axios → 📡 Handles HTTP requests between services  
- Cookie Parser → 🍪 Manages cookies for authentication  
- CORS → 🔐 Enables secure cross-origin requests  
- Multer → 📁 Handles file uploads (audio, etc.)  

---

### 🤖 AI / Python Service

- FastAPI → ⚡ High-performance API framework for Python  
- Pydantic → ✅ Data validation and structured schemas  
- Google Gemini API → 🧠 Generates AI interview questions and explanations  
- Whisper → 🎙️ Converts speech to text  
- Piper TTS → 🔊 Converts text to speech  
- Uvicorn → 🚀 Runs FastAPI efficiently  

---

### 🗄️ Database / Auth

- Supabase Postgres → 🧾 Managed PostgreSQL database  
- Supabase Auth → 🔐 User authentication and session handling  
- Row-Level Security → 🛡️ Fine-grained access control  

---

## ⚙️ Setup

### 📌 Prerequisites

- Node.js 18+ or 20+  
- Python 3.10+  
- Supabase project  
- Gemini API key  

---

### 1) Clone the repository

```bash
git clone https://github.com/Ishii06/Interview-Simulator.git
cd InterviewAI
```

### 2) Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NODE_ENV=development
```

Run the backend:

```bash
npm run dev
```

### 3) Frontend setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/` if you want to centralize API URLs or other client config.

Run the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000`.

### 4) Python AI service setup

```bash
cd ai-python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `ai-python/`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Run the Python service:

```bash
uvicorn app.main:app --reload --port 8000
```

## ✨ Features

- 🔐 Authentication with Supabase-backed secure sessions  
- 🤖 AI-powered interview question generation using Gemini  
- 🎙️ Voice-first interview flow with speech-to-text and evaluation  
- ⏱️ Timed aptitude tests with automatic scoring  
- 💻 Coding progress tracker with persistent checklist state  
- 📊 Profile dashboard with interview history and performance stats  
- 📚 Curated resources and guided practice pages  
- ☁️ Supabase-backed storage for tests, results, and user data  

---

## 🔄 How It Works

1. 🧑‍💻 The frontend collects user input (answers, audio, test actions)  
2. ⚙️ The backend authenticates the user and validates requests  
3. 🗄️ Backend reads/writes data to Supabase (tests, results, history)  
4. 🤖 For AI features, backend calls the FastAPI Python service  
5. 🧠 Python service generates questions, answers, audio, and explanations  
6. 📡 Structured JSON is returned back to the backend  
7. 🎨 Frontend renders live sessions, scores, and analytics