

# System & UI/UX Design Document: Sahayak Health (Node/React Edition)

## 1. High-Level Architecture

The system uses a decoupled client-server architecture with strict TypeScript contracts shared between the frontend and backend to ensure flawless data integration during rapid development.

* **Client Layer (React 18 + Vite):** Handles UI rendering, state management (via React Context), and audio capture using the browser's MediaRecorder API.
* **API Gateway (Node.js + Express):** A strictly typed backend that validates frontend requests, orchestrates API calls, and handles server-side speech processing to keep the client lightweight.
* **Cognitive Layer (Google Gemini API):** Accessed via the @google/generative-ai Node SDK to process symptom NLU and generate JSON-formatted risk profiles.
* **Data Persistence (Supabase):** PostgreSQL database accessed via @supabase/supabase-js for user auth and conversational history.
* **Speech Processing Unit:**
* **Input:** The vosk npm package processes audio buffers on the server.
* **Output:** A Node.js TTS package (like google-tts-api or a local wrapper) generates audio buffers from Gemini's text responses.



---

## 2. UI/UX Design Specifications

The visual language leverages Tailwind CSS for rapid styling and Framer Motion for premium-feeling animations, maintaining the "vibe coder" aesthetic.

### 2.1 Color Palette (Tailwind Config Variables)

* **Background:** bg-obsidian (#0B0C10)
* **Surface:** bg-charcoal (#1F2833)
* **Accent (Primary):** text-cyber-orange (#FF5722) / bg-cyber-orange
* **Typography:** text-slate-200 (Primary), text-slate-400 (Muted)

### 2.2 Aesthetic & Styling Rules

* **3D Neumorphism (Tailwind):** Use custom box shadows to make components pop. Example: shadow-[5px_5px_15px_rgba(0,0,0,0.5),*-5px*-5px_15px_rgba(255,255,255,0.05)].
* **Animations (Framer Motion):**
* Wrap the microphone button in a <motion.button> that uses animate={{ scale: [1, 1.1, 1] }} combined with an orange box-shadow glow when actively listening.
* Use <motion.div layout> for chat bubbles so they slide smoothly up the screen as new messages arrive.


* **Typography:** Inter (sans-serif) for readable chat text, and JetBrains Mono (monospace) for displaying data like heart rate or risk scores to give a technical feel.

---

## 3. Frontend Layout & React Component Tree

The application operates as a unified dashboard to minimize page routing friction.

### 3.1 Component Hierarchy

---

## 4. Database Schema (Supabase PostgreSQL)

Because you are using TypeScript, you can generate TS types directly from your Supabase schema using the Supabase CLI, ensuring your Express backend and React frontend are perfectly synced with the DB.

| Table Name | Column | Type | Description |
| --- | --- | --- | --- |
| users | id | UUID (PK) | Links to auth.users. |
|  | age | Integer | Used for dynamic prompt injection. |
|  | gender | Text | Used for dynamic prompt injection. |
| chat_history | session_id | UUID (PK) | Groups messages by conversation. |
|  | user_id | UUID (FK) | Relates to users. |
|  | role | Text | Enum: 'user' or 'model' (matches Gemini schema). |
|  | content | Text | The message string. |
|  | created_at | Timestamp | Orders the chat UI. |
| health_logs | log_id | UUID (PK) | Unique triage event ID. |
|  | user_id | UUID (FK) | Relates to users. |
|  | symptoms | Text | Raw string input. |
|  | risk_level | Text | Extracted from Gemini JSON (Low/Mod/High). |

---

## 5. Express.js API Endpoint Specifications

### POST /api/v1/triage

* **Request Body:** { symptoms: string, userId: string }
* **Logic:** Express fetches user context from Supabase, compiles the prompt string, and calls generativeModel.generateContent().
* **Response:** Strictly typed JSON payload.
```json
{
  "riskLevel": "Moderate",
  "primaryRecommendation": "Drink plenty of fluids and rest. If fever exceeds 102°F, consult a doctor.",
  "possibleCategories": ["Viral Infection", "Seasonal Flu"]
}


```



```

### POST /api/v1/chat/audio
*   **Request:** multipart/form-data containing the .webm or .wav audio blob from the React MediaRecorder.
*   **Logic:** 
    1. Express buffers the file to VOSK.
    2. VOSK returns text (Hindi/English).
    3. Express sends text to Gemini API (with chat history appended for context).
    4. Express sends Gemini text to TTS engine to get an audio buffer.
*   **Response:** Returns a JSON object containing the transcribed user text, the Gemini text response, and a base64 encoded audio string for the frontend to play.

### GET /api/v1/insights
*   **Request:** GET (Includes Auth Header).
*   **Logic:** Uses a lightweight Gemini prompt: *"Give a 1-sentence preventive health tip for a software developer in summer."*
*   **Response:** { tip: "Remember to look away from your screen every 20 minutes to prevent eye strain." }

<FollowUp label="Want the updated folder structure?" query="Provide the updated project folder structure for this React, Node, and TypeScript architecture."/>

```