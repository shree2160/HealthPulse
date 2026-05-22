# System & UI/UX Design Document: HealthPulse AI

## 1. High-Level Architecture

The system uses a decoupled client-server architecture with strict TypeScript contracts shared between the frontend and backend to ensure flawless data integration during rapid development.

* **Client Layer (React 18 + Vite):** Handles UI rendering, state management (via React Context), and audio capture using the browser's MediaRecorder API.
* **API Gateway (Node.js + Express):** A strictly typed backend that validates frontend requests, orchestrates API calls, and handles server-side speech processing to keep the client lightweight.
* **Cognitive Layer (Google Gemini API):** Accessed via the `@google/generative-ai` Node SDK to process symptom NLU and generate JSON-formatted risk profiles.
* **Data Persistence (Supabase):** PostgreSQL database accessed via `@supabase/supabase-js` for user auth and conversational history.
* **Speech Processing Unit:**
  * **Input:** The `vosk` npm package processes audio buffers on the server.
  * **Output:** A Node.js TTS package generates audio buffers from Gemini's text responses.

---

## 2. UI/UX Design Specifications

The visual language uses **Tailwind CSS v4** for styling and **Framer Motion** for premium animations. The interface is a **modern premium healthcare SaaS dashboard** featuring a clean light theme, soft glassmorphism, and a calm, trustworthy atmosphere.

### 2.1 Color Palette (Tailwind Variables)

* **Primary:** `#3B82F6` (Blue)
* **Secondary:** `#60A5FA` (Light Blue)
* **Accent:** `#06B6D4` (Cyan)
* **Background:** `#F8FAFC` (Slate 50)
* **Card Surface:** `#FFFFFF` (White)
* **Text Primary:** `#0F172A` (Slate 900)
* **Text Secondary:** `#64748B` (Slate 500)
* **Gradients:** `linear-gradient(135deg, #3B82F6, #60A5FA, #06B6D4)`

### 2.2 Aesthetic & Styling Rules

* **Glassmorphism:** Use `bg-white/70 backdrop-blur-xl border border-white/60` for cards to create a premium frosted glass effect.
* **Borders & Corners:** Use soft, rounded corners extensively (`rounded-[24px]` for major cards, `rounded-full` for buttons/badges).
* **Shadows:** Use soft custom box-shadows (`card-shadow`, `card-shadow-hover`) to provide depth and subtle elevation, completely replacing stark borders.
* **Animations (Framer Motion):**
  * Use `<motion.div layout>` for smooth layout transitions (e.g., chat messages sliding up).
  * Hover states on cards should include a subtle upward lift (`-translate-y-1` or `y: -4`).
  * Add ambient floating and pulse effects (e.g., animated blobs in the background, pulse rings around voice buttons).
* **Typography:** `Inter` (sans-serif) for all UI text, utilizing varying weights to create strong visual hierarchy. No emojis.
* **Icons:** Strict use of **Lucide React** icons.

---

## 3. Frontend Layout & React Component Tree

The application is structured as a unified dashboard using React Router DOM for seamless transitions. Code-splitting is implemented via `React.lazy()` for performance.

### 3.1 App Layout

* **Sidebar:** Collapsible left navigation containing branding and links to the 8 primary views. Active states use animated indicators.
* **TopHeader:** Contains a global search bar, notification bell, health score badge, and user profile avatar.
* **Main Area:** A scrollable container rendering the active route via `<Outlet />`.

### 3.2 Routed Views

1. **Dashboard:** Welcome area with animated background blobs, Health Stats grid, Quick Actions, and Recent Insights.
2. **Symptom Checker:** Two-column layout with a text input area (plus voice/upload buttons and suggested chips) and an AI Risk Assessment card.
3. **Health Chat:** A modern chatbot UI featuring avatar bubbles, timestamps, typing indicators, and quick suggestion chips.
4. **Disease Encyclopedia:** Search bar and grid of browseable condition cards, returning symptom and prevention data.
5. **Health Insights:** Grid of metric cards (Sleep, Activity, Stress, Risk) and daily lifestyle recommendations.
6. **Voice Assistant:** Dedicated voice interaction panel with large pulsing microphone button and audio wave visualizer.
7. **Health Logs:** Tabular/list view of past triage events and symptom assessments with visual risk badges.
8. **Settings:** Profile management and application preferences (notifications, privacy, language).

---

## 4. Database Schema (Supabase PostgreSQL)

| Table Name | Column | Type | Description |
| --- | --- | --- | --- |
| `users` | `id` | UUID (PK) | Links to auth.users. |
|  | `age` | Integer | Used for dynamic prompt injection. |
|  | `gender` | Text | Used for dynamic prompt injection. |
| `chat_history` | `session_id` | UUID (PK) | Groups messages by conversation. |
|  | `user_id` | UUID (FK) | Relates to users. |
|  | `role` | Text | Enum: 'user' or 'model' (matches Gemini schema). |
|  | `content` | Text | The message string. |
|  | `created_at` | Timestamp | Orders the chat UI. |
| `health_logs` | `log_id` | UUID (PK) | Unique triage event ID. |
|  | `user_id` | UUID (FK) | Relates to users. |
|  | `symptoms` | Text | Raw string input. |
|  | `risk_level` | Text | Extracted from Gemini JSON (Low/Mod/High). |

---

## 5. Express.js API Endpoint Specifications

### POST `/api/v1/triage`

* **Request Body:** `{ symptoms: string, userId: string }`
* **Logic:** Express fetches user context from Supabase, compiles the prompt string, and calls `generativeModel.generateContent()`.
* **Response:** Strictly typed JSON payload.
```json
{
  "riskLevel": "Moderate",
  "confidence": 82,
  "primaryRecommendation": "Drink plenty of fluids and rest. If fever exceeds 102°F, consult a doctor.",
  "possibleCategories": ["Viral Infection", "Seasonal Flu"]
}
```

### POST `/api/v1/chat/audio`

* **Request:** `multipart/form-data` containing the audio blob.
* **Logic:** 
  1. Express buffers the file to VOSK.
  2. VOSK returns transcribed text.
  3. Express sends text to Gemini API (with chat history).
  4. Express sends Gemini text to TTS engine to get an audio buffer.
* **Response:** JSON object containing the transcribed user text, the Gemini text response, and a base64 encoded audio string.

### GET `/api/v1/insights`

* **Request:** GET (Includes Auth Header).
* **Logic:** Uses a lightweight Gemini prompt to generate daily preventive health tips.
* **Response:** `{ tip: "Remember to look away from your screen every 20 minutes to prevent eye strain." }`