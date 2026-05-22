
This setup uses a monorepo style (both frontend and backend in one root folder), which makes it incredibly easy for your team to share TypeScript interfaces and run the entire project from a single IDE workspace.

```text
sahayak-health/
│
├── backend/                              # Node.js + Express + TypeScript
│   ├── .env                              # GEMINI_API_KEY, SUPABASE_URL, etc.
│   ├── package.json
│   ├── tsconfig.json
│   │
│   ├── models_data/                      # Local offline models (Critical for hackathons)
│   │   ├── vosk-model-en-us/             # Downloaded English VOSK model
│   │   └── vosk-model-hi/                # Downloaded Hindi VOSK model
│   │
│   └── src/
│       ├── index.ts                      # Express app entry point & middleware setup
│       │
│       ├── routes/                       # API Route definitions
│       │   ├── triage.routes.ts          # POST /api/v1/triage
│       │   ├── chat.routes.ts            # POST /api/v1/chat/audio
│       │   └── insights.routes.ts        # GET /api/v1/insights
│       │
│       ├── controllers/                  # Request handling logic
│       │   ├── triage.controller.ts
│       │   ├── chat.controller.ts
│       │   └── insights.controller.ts
│       │
│       ├── services/                     # External API wrappers (Keep logic isolated)
│       │   ├── gemini.service.ts         # Handles @google/generative-ai calls & prompts
│       │   ├── vosk.service.ts           # Handles audio buffer to text conversion
│       │   └── supabase.service.ts       # Database queries
│       │
│       └── types/                        # TypeScript Interfaces (Crucial for Gemini JSON)
│           └── api.types.ts              # e.g., TriageResponse interface
│
├── frontend/                             # React 18 + Vite + TypeScript
│   ├── .env                              # VITE_API_BASE_URL (points to localhost backend)
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js                # Defines obsidian, charcoal, and cyber-orange colors
│   ├── index.html
│   │
│   └── src/
│       ├── main.tsx                      # React DOM render
│       ├── App.tsx                       # Main DashboardLayout and routing
│       │
│       ├── components/                   # UI Widgets
│       │   ├── Layout/
│       │   │   ├── Sidebar.tsx
│       │   │   └── DashboardLayout.tsx
│       │   ├── Chat/
│       │   │   ├── VoiceMicButton.tsx    # Uses Framer Motion for the orange glowing pulse
│       │   │   └── ChatFeed.tsx          
│       │   ├── Triage/
│       │   │   ├── SymptomForm.tsx       # Uses React Hook Form
│       │   │   └── RiskCard.tsx          # 3D Neumorphic styled card displaying risk
│       │   └── Insights/
│       │       ├── DailyTip.tsx
│       │       └── DiseaseSearch.tsx     
│       │
│       ├── context/                      # Global State
│       │   └── AuthContext.tsx           # Wraps Supabase auth state
│       │
│       ├── hooks/                        # Custom React Hooks
│       │   └── useAudioRecorder.ts       # Abstracts the browser MediaRecorder API logic
│       │
│       ├── services/                     # Backend communication
│       │   └── api.client.ts             # Axios instance setup
│       │
│       ├── styles/                       
│       │   └── globals.css               # Tailwind directives and custom 3D shadow utilities
│       │
│       └── types/                        # Frontend Interfaces
│           └── models.ts                 # Mirrors the backend api.types.ts
│
└── README.md                             # Setup instructions for judges/teammates

```

### Why this structure wins at Hackathons:

1. **backend/src/services/**: By isolating Gemini and VOSK into "services", one teammate can work entirely on the AI prompting logic (gemini.service.ts) without ever needing to touch the Express routes (chat.routes.ts).
2. **frontend/src/hooks/useAudioRecorder.ts**: Handling microphones in React can get messy. Extracting it into a custom hook keeps your VoiceMicButton.tsx UI component perfectly clean.
3. **Shared Types**: You can literally copy-paste api.types.ts from the backend to the frontend models.ts. This guarantees that when Gemini returns riskLevel, your frontend React component won't crash expecting risk_level.