
# PRD: Project HealthPulse 

**Objective:** Build a voice-enabled, AI-driven health assistant that provides symptom-based triage, risk analysis, and accessible medical education.
**Target Audience:** General users needing quick, jargon-free health guidance before deciding to consult a doctor.
**Design Language:** Professional dark mode (Obsidian Black #0B0C10 and Cyber Orange #FF5722) utilizing Tailwind CSS to create subtle 3D container elements and glowing active states.

---

## 1. Core Features & Implementation

### Feature 1: The Triage Engine

* **Addresses:** Symptom-based guidance & Basic risk analysis.
* **Functionality:** A text and voice input field where users describe how they feel. The system processes the natural language and outputs a structured assessment.
* **Outputs:** Risk Level (Low, Moderate, High) and Triage Advice.
* **React Implementation:** A dedicated  component utilizing React Hook Form for state management.
* **Safety Constraint:** A persistent UI banner component stating: *"AI Assistant only. Not a substitute for professional medical diagnosis."*

### Feature 2: Multilingual Health Chatbot

* **Addresses:** Health awareness chatbot.
* **Functionality:** A conversational interface for general health queries supporting English and Hindi voice interaction.
* **React/Node Flow:**
1. React uses the browser's MediaRecorder API to capture audio.
2. Audio chunk is sent via WebSocket or multipart-form to the Node Express backend.
3. Node backend uses the vosk npm package for speech-to-text.
4. Text hits the Gemini API for a response.
5. Node backend generates audio via a TTS library and streams it back to the React client.



### Feature 3: Dynamic Disease Encyclopedia

* **Addresses:** Disease information and education.
* **Functionality:** A fast search interface that generates real-time, easy-to-understand summaries instead of querying a static database.
* **React Implementation:** An autocomplete  that triggers a loading skeleton while the Node backend fetches the structured markdown response from Gemini, rendering it safely using a library like react-markdown.

### Feature 4: Reactive Health Insights Widget

* **Addresses:** Preventive health tips.
* **Functionality:** A dedicated 3D-styled card that rotates daily preventive tips based on user demographics or environment.
* **Implementation:** A useEffect hook fetches the daily insight from the Node API on component mount, storing it in React context to avoid redundant API calls during navigation.

---

## 2. Technical Architecture & Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend UI** | React 18 + TypeScript | Handles UI state, routing, and component rendering. |
| **Styling** | Tailwind CSS + Framer Motion | Rapidly builds the 3D dark-mode aesthetic and smooth UI animations. |
| **Backend API** | Node.js + Express (TypeScript) | Exposes strictly typed REST endpoints and WebSocket connections for audio. |
| **AI Intelligence** | @google/generative-ai SDK | Native Node package to handle symptom analysis and structured NLU generation. |
| **Voice Processing** | VOSK (Node wrapper) + TTS | Handles local offline Hindi/English transcription on the server. |
| **Database/Auth** | Supabase JS Client | Manages user tables, chat logs, and handles OAuth/Email authentication. |

---

## 3. NLU Prompting Strategy (The ReasoningEngine.ts)

Instead of standard string manipulation, you can leverage TypeScript interfaces to ensure the Gemini API returns exactly what your frontend expects. You will use Gemini's structured output capabilities (JSON mode).

**TypeScript Interface Example:**

```typescript
interface TriageResponse {
  riskLevel: 'Low' | 'Moderate' | 'High';
  primaryRecommendation: string;
  possibleCategories: string[];
}

```

**Prompting Approach:**
Your Express backend will inject variables into a dynamic template string before sending it to Gemini:

> "You are a clinical triage assistant. Analyze these symptoms: ${symptoms}. The patient is a ${age} year old ${gender}. You must respond in valid JSON matching this schema: { riskLevel, primaryRecommendation, possibleCategories }."

---

## 4. Hackathon Scope Limits

* **No complex global state:** Skip Redux. Use React Context or just pass props for this MVP to save time.
* **No custom ML models:** Rely entirely on Gemini for cognitive tasks and VOSK for speech.
* **No heavy media assets:** Keep the app lightweight. Rely on CSS (Tailwind) for visual impact rather than heavy images.