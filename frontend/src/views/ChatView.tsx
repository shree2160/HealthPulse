import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, Globe, AlertCircle } from 'lucide-react';
import { sendTextChat, sendAudioChat } from '../services/api.client';
import { ChatMessage } from '../types/models';

const ChatView = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial-model', role: 'model', content: 'Hello! I am Sahayak, your AI health assistant. How can I help you today? You can speak in English or Hindi, or type your query below.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [error, setError] = useState<string | null>(null);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Handle Voice Recording Toggle
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      setError(null);
      audioChunksRef.current = [];
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          // Track and close active recording audio streams
          stream.getTracks().forEach(track => track.stop());

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (audioBlob.size > 1000) { // must contain actual audio data
            await handleSendAudio(audioBlob);
          } else {
            setError('Audio recorded was too short. Please try again.');
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err: any) {
        console.error(err);
        setError('Microphone access denied or unavailable. Please type your message instead.');
      }
    }
  };

  // Submit recorded voice audio to backend
  const handleSendAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    try {
      const data = await sendAudioChat(audioBlob, sessionId, language);
      
      // Append user's transcribed message
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: data.transcribedText,
      };

      // Append assistant's response
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.geminiResponse,
      };

      setMessages(prev => [...prev, userMsg, modelMsg]);

      // Play audio response
      if (data.audioBase64) {
        playAudioBase64(data.audioBase64);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to process voice query. Please make sure backend is running and Gemini is configured.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Play base64 audio response from backend
  const playAudioBase64 = (base64Data: string) => {
    try {
      const audioUrl = `data:audio/mp3;base64,${base64Data}`;
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.warn('Browser audio autoplay blocked or failed:', e));
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  // Submit standard text query to backend
  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userText = inputText.trim();
    setInputText('');
    setError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const data = await sendTextChat(userText, sessionId);
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.response,
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setError('Failed to reach AI server. Please make sure the backend is active.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto space-y-4">
      <header className="text-center mb-2 flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
            AI Voice Assistant
          </h1>
          <p className="text-slate-400 text-sm mt-1">Speak in Hindi/English or type your health concerns.</p>
        </div>
        
        {/* Language selector */}
        <div className="flex items-center gap-2 bg-charcoal border border-white/10 rounded-xl px-3 py-1.5 shadow-md">
          <Globe className="w-4 h-4 text-cyber-orange" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
            className="bg-transparent text-slate-200 focus:outline-none text-sm font-semibold cursor-pointer"
          >
            <option value="en" className="bg-charcoal text-slate-200">English (STT/TTS)</option>
            <option value="hi" className="bg-charcoal text-slate-200">Hindi (हिंदी में)</option>
          </select>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <p className="text-sm leading-relaxed">{error}</p>
        </div>
      )}

      {/* Chat Feed */}
      <div className="flex-1 bg-obsidian rounded-2xl p-6 shadow-neumorphic border border-white/5 overflow-y-auto flex flex-col gap-4 min-h-[300px]">
        {messages.map((msg) => (
          <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 flex flex-col gap-1 ${
              msg.role === 'user' 
                ? 'bg-cyber-orange text-white rounded-tr-none' 
                : 'bg-charcoal text-slate-200 border border-white/10 rounded-tl-none'
            }`}>
              <p className="leading-relaxed text-sm md:text-base">{msg.content}</p>
              {msg.role === 'model' && msg.id !== 'initial-model' && (
                <div className="text-[10px] text-slate-400/80 flex items-center gap-1 self-end mt-1 font-mono uppercase tracking-wider">
                  <Volume2 className="w-3 h-3 text-cyber-orange" /> voice played
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* AI Loading bubble */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-charcoal text-slate-200 border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
              <span className="text-sm font-medium text-slate-400">Sahayak is processing</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-cyber-orange rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-cyber-orange rounded-full animate-bounce delay-150" />
                <div className="w-1.5 h-1.5 bg-cyber-orange rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-charcoal rounded-2xl p-4 shadow-neumorphic border border-white/5 flex items-center gap-4">
        
        {/* Voice Button with Pulsing Wave */}
        <motion.button
          onClick={toggleRecording}
          animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
          transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
          disabled={isProcessing}
          className={`p-4 rounded-full flex-shrink-0 transition-colors disabled:opacity-50 ${
            isRecording 
              ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
              : 'bg-obsidian text-cyber-orange border border-white/10 hover:bg-cyber-orange/10'
          }`}
        >
          {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </motion.button>

        {/* Text Input */}
        <form onSubmit={handleSendText} className="flex-1 flex items-center gap-2 bg-obsidian rounded-xl border border-white/10 px-4 py-2 focus-within:border-cyber-orange transition-colors">
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-200 py-2 disabled:opacity-50"
            placeholder={isRecording ? "Listening... click mic to send speech." : isProcessing ? "AI responding..." : "Type your message..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRecording || isProcessing}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isRecording || isProcessing}
            className="p-2 text-cyber-orange disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyber-orange/10 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatView;
