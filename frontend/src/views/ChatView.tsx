import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Bot, User } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PageHeader from '../components/ui/PageHeader';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'Hello! I am your AI health assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const sendMessage = (text: string) => {
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

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content:
            'I understand your concern. Could you tell me if you have any other symptoms accompanying this? Additional details help me provide a more accurate assessment.',
          timestamp: new Date(),
        },
      ]);
    }, 1500);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-[calc(100vh-72px-48px)] flex flex-col space-y-4 pb-2">
      <PageHeader
        title="Health Chat"
        breadcrumb="Home / Health Chat"
        subtitle="Chat with our AI-powered health assistant"
      />

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
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'model'
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
                    className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
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
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors"
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
              className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                isRecording
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
                disabled={isRecording}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isRecording}
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
