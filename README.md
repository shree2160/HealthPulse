# 🏥 HealthPulse — AI-Powered Health Assistant

> Voice-enabled, AI-driven health assistant providing symptom-based triage, risk analysis, and accessible medical education.

⚠️ **Disclaimer:** This is an AI assistant for health guidance only. It is NOT a substitute for professional medical diagnosis.

---

## 🏗️ Architecture

```
HealthPulse/
├── backend/          # Node.js + Express + TypeScript (API Server)
├── frontend/         # React 18 + Vite + TypeScript (UI Client)
├── DesignDocument.md # UI/UX specifications
├── PRD.md            # Product requirements
└── ProjectStructure.md
```

**Monorepo** — Both frontend and backend live in one workspace for shared TypeScript contracts.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 9+
- [Gemini API Key](https://aistudio.google.com/apikey)
- [Supabase Project](https://supabase.com)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your API keys in .env

npm install
npm run dev
# Server starts on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env

# Initialize Vite (first time only)
npx -y create-vite@latest ./ --template react-ts

npm install
npm install tailwindcss @tailwindcss/vite framer-motion react-hook-form react-markdown axios @supabase/supabase-js
npm run dev
# Client starts on http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/v1/triage` | Symptom-based triage analysis |
| `POST` | `/api/v1/chat/audio` | Voice chat (audio → text → AI → TTS) |
| `POST` | `/api/v1/chat/text` | Text-based health chat |
| `GET` | `/api/v1/insights` | Daily preventive health tip |
| `GET` | `/api/v1/encyclopedia/:query` | Disease information search |

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| AI | Google Gemini API (`@google/generative-ai`) |
| Speech-to-Text | VOSK (offline, Hindi + English) |
| Text-to-Speech | google-tts-api |
| Database & Auth | Supabase (PostgreSQL + Auth) |

---

## 🗄️ Database Schema

### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Links to auth.users |
| age | Integer | For personalized prompts |
| gender | Text | For personalized prompts |

### `chat_history`
| Column | Type | Description |
|--------|------|-------------|
| session_id | UUID (PK) | Groups messages |
| user_id | UUID (FK) | Relates to users |
| role | Text | 'user' or 'model' |
| content | Text | Message text |
| created_at | Timestamp | Ordering |

### `health_logs`
| Column | Type | Description |
|--------|------|-------------|
| log_id | UUID (PK) | Triage event ID |
| user_id | UUID (FK) | Relates to users |
| symptoms | Text | Raw input |
| risk_level | Text | Low/Moderate/High |

---

## 👥 Team

| Role | Responsibility |
|------|----------------|
| Backend Dev | Express API, Gemini integration, VOSK/TTS, Supabase |
| Frontend Dev | React UI, Tailwind styling, Framer Motion animations |

---

## 📜 License

MIT