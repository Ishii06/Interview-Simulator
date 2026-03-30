# InterviewAI

InterviewAI is a full-stack interview practice platform with three coordinated services:

- A modern Next.js frontend for interview practice, aptitude tests, coding sheets, profile stats, and resources.
- A Node.js + Express backend that handles authentication, database access, and API orchestration.
- A FastAPI Python service that generates AI-driven interview questions, mock tests, audio, and explanations.

The app is designed to help users practice mock interviews, take aptitude tests, track coding progress, and review their history in one place.

## Features

- Authentication with Supabase-backed sessions.
- AI interview question generation.
- Voice-first interview flow with transcription and evaluation.
- Aptitude test generation with timed submission and scoring.
- Shared coding progress tracker with persistent checklist state.
- Profile dashboard with rhythm stats, interview history, and practice test history.
- Resources and practice pages for guided preparation.
- Supabase-backed storage for tests, questions, results, and interview history.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- GSAP
- Zustand
- Lucide React

### Backend

- Node.js
- Express 5
- Supabase JS client
- Axios
- Cookie parser
- CORS
- Multer

### AI / Python Service

- FastAPI
- Pydantic
- Google Gemini API
- Whisper
- Piper TTS
- Uvicorn

### Database / Auth

- Supabase Postgres
- Supabase Auth
- Row-level security policies for service-role access

## Project Structure

```text
InterviewAI/
├─ frontend/
│  ├─ app/
│  │  ├─ interview/
│  │  ├─ practice/
│  │  ├─ profile/
│  │  ├─ login/
│  │  ├─ signup/
│  │  ├─ resources/
│  │  └─ components/
│  └─ store/
├─ backend/
│  ├─ controllers/
│  ├─ routes/
│  ├─ middleware/
│  ├─ services/
│  └─ supabase/
└─ ai-python/
	├─ app/
	├─ audio/
	├─ models/
	└─ voices/
```

## How It Works

1. The frontend collects user input and calls the backend APIs.
2. The backend validates the request, reads the authenticated user from the cookie session, and stores data in Supabase.
3. For AI-powered flows, the backend calls the Python service.
4. The Python service generates questions, answers, explanations, or audio payloads and returns structured JSON.
5. The frontend renders the live session, scores, review data, history, and progress state.

## Setup

### Prerequisites

- Node.js 18+ or 20+
- Python 3.10+
- A Supabase project
- A Gemini API key for the Python service

### 1) Clone the repository

```bash
git clone <your-repo-url>
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

## Environment Variables

### Backend

- `PORT` - Express server port, usually `5000`
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key used for protected server writes
- `NODE_ENV` - Enables production cookie behavior when set to `production`

### Python Service

- `GEMINI_API_KEY` - API key used to generate interview questions and explanations

## Main API Flow

- `POST /api/auth/login` - Logs in a user and sets the session cookie.
- `GET /api/auth/me` - Returns the current authenticated user.
- `POST /api/interview/question` - Generates the next interview question.
- `POST /api/interview/transcribe` - Converts interview audio to text.
- `POST /api/interview/evaluate` - Evaluates an interview session.
- `POST /api/tests/create` - Creates a practice test and generates questions.
- `GET /api/tests/history` - Returns practice test history for the profile page.
- `GET /api/questions/:test_id` - Returns questions for a saved practice test.
- `POST /api/results/submit` - Scores a practice test submission.

## Highlights

- The profile page shows the user name in a distinctive type style, email below it, rhythm stats, the shared coding tracker, and full history panels.
- Coding progress is shared between the coding page and profile tracker through a single persistent state key.
- Practice tests reuse generated questions immediately, reducing unnecessary refetches.
- The backend normalizes AI output before persisting it, which prevents malformed AI responses from breaking the flow.

## Useful Notes

- The backend expects Supabase to be configured with service-role access.
- The Python service must be running for interview generation and aptitude test generation.
- Cookie-based auth is used, so the frontend requests must include credentials.

## License

No license has been specified yet.

