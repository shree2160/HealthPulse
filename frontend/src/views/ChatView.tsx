import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Bot, User, Globe, AlertCircle } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PageHeader from '../components/ui/PageHeader';
import { sendTextChat, sendAudioChat } from '../services/api.client';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

const quickChips = [
  'What causes headaches?',
  'How to reduce stress?',
  'Symptoms of flu vs cold',
  'When should I see a doctor?',
];

const ChatView = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'Hello! I am your AI health assistant. How can I help you today? You can speak or type in English or Hindi.',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  
  const feedRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
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
          stream.getTracks().forEach(track => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (audioBlob.size > 1000) {
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

  const handleSendAudio = async (audioBlob: Blob) => {
    setIsTyping(true);
    setError(null);
    try {
      const data = await sendAudioChat(audioBlob, sessionId, language);
      
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: data.transcribedText,
        timestamp: new Date(),
      };

      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.geminiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMsg, modelMsg]);

      if (data.audioBase64) {
        playAudioBase64(data.audioBase64);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to process voice query. Please make sure backend is running and Gemini is configured.');
    } finally {
      setIsTyping(false);
    }
  };

  const playAudioBase64 = (base64Data: string) => {
    try {
      const audioUrl = `data:audio/mp3;base64,${base64Data}`;
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.warn('Browser audio autoplay blocked or failed:', e));
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      const data = await sendTextChat(text, sessionId);
      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setError('Failed to reach AI server. Please make sure the backend is active.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTyping && !isRecording) {
      sendMessage(inputText);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-[calc(100vh-72px-48px)] flex flex-col space-y-4 pb-2">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Health Chat"
          breadcrumb="Home / Health Chat"
          subtitle="Chat with our AI-powered health assistant"
        />
        {/* Language selector */}
        <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-1.5 shadow-sm text-sm">
          <Globe className="w-4 h-4 text-primary" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
            className="bg-transparent text-text-primary focus:outline-none font-semibold cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (हिंदी में)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <GlassCard hover={false} className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div ref={feedRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'model'
                      ? 'gradient-primary text-white'
                      : 'bg-slate-200 text-text-secondary'
                    }`}
                >
                  {msg.role === 'model' ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[70%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                        ? 'gradient-primary text-white rounded-tr-md'
                        : 'bg-slate-100 text-text-primary rounded-tl-md'
                      }`}
                  >
                    {msg.content}
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1 px-1">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full gradient-primary text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick chips */}
        {messages.length <= 1 && (
          <div className="px-6 pb-2">
            <p className="text-xs font-semibold text-text-secondary mb-2">Quick suggestions</p>
            <div className="flex flex-wrap gap-2">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  disabled={isTyping || isRecording}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-4 border-t border-border/30">
          <form onSubmit={handleSendText} className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={toggleRecording}
              animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
              transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
              disabled={isTyping}
              className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all disabled:opacity-50 ${isRecording
                  ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                  : 'bg-slate-100 text-text-secondary hover:bg-primary/10 hover:text-primary'
                }`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </motion.button>

            <div className="flex-1 flex items-center bg-slate-50 rounded-full border border-border px-4 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <input
                type="text"
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-text-primary placeholder:text-text-secondary"
                placeholder={isRecording ? 'Listening...' : 'Type your health question...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isRecording || isTyping}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isRecording || isTyping}
                className="w-8 h-8 rounded-full gradient-primary text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-shadow ml-2"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </GlassCard>
    </div>
  );
};

export default ChatView;
