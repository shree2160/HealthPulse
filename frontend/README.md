# HealthPulse Frontend

> React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion

## Setup (for frontend developer)

```bash
cd frontend

# Initialize Vite project (if not already done)
npx -y create-vite@latest ./ --template react-ts

# Install dependencies
npm install
npm install tailwindcss @tailwindcss/vite framer-motion react-hook-form react-markdown axios @supabase/supabase-js

# Copy env
cp .env.example .env

# Start dev server
npm run dev
```

## Key Directories

```
src/
├── components/       # UI components (Layout, Chat, Triage, Insights)
├── context/          # React Context (AuthContext)
├── hooks/            # Custom hooks (useAudioRecorder)
├── services/         # API client (already scaffolded — just uncomment)
├── styles/           # Global CSS + Tailwind config
└── types/            # TypeScript models (already synced with backend)
```

## Design Tokens

| Token | Value |
|-------|-------|
| Background (Obsidian) | `#0B0C10` |
| Surface (Charcoal) | `#1F2833` |
| Accent (Cyber Orange) | `#FF5722` |
| Primary Text | `slate-200` |
| Muted Text | `slate-400` |
| Font (Body) | Inter |
| Font (Data) | JetBrains Mono |

## API Endpoints (Backend)

The `api.client.ts` file is pre-configured. Backend runs on `http://localhost:5000`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/triage` | Submit symptoms for triage |
| POST | `/api/v1/chat/audio` | Send audio for voice chat |
| POST | `/api/v1/chat/text` | Send text message to chat |
| GET | `/api/v1/insights` | Get daily health tip |
| GET | `/api/v1/encyclopedia/:query` | Search disease info |
