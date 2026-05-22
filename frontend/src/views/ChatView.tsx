import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

const ChatView = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: 'Hello! I am your AI health assistant. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would trigger the MediaRecorder API
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: inputText };
    setMessages([...messages, newMsg]);
    setInputText('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        content: 'I understand. Could you tell me if you have any other symptoms accompanying this?' 
      }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto space-y-6">
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-slate-100">Voice Assistant</h1>
        <p className="text-slate-400 mt-2">Speak naturally or type your health concerns.</p>
      </header>

      {/* Chat Feed */}
      <div className="flex-1 bg-obsidian rounded-2xl p-6 shadow-neumorphic border border-white/5 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg) => (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-cyber-orange text-white rounded-tr-none' 
                : 'bg-charcoal text-slate-200 border border-white/10 rounded-tl-none'
            }`}>
              <p className="leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-charcoal rounded-2xl p-4 shadow-neumorphic border border-white/5 flex items-center gap-4">
        
        {/* Voice Button */}
        <motion.button
          onClick={toggleRecording}
          animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
          transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
          className={`p-4 rounded-full flex-shrink-0 transition-colors ${
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
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-200 py-2"
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRecording}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isRecording}
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
