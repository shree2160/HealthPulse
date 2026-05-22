import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PageHeader from '../components/ui/PageHeader';
import { sendAudioChat } from '../services/api.client';

const VoiceAssistantView = () => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [history, setHistory] = useState<{ command: string; response: string }[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleListening = async () => {
    if (isListening) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
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
            await handleProcessAudio(audioBlob);
          } else {
            setError('Audio recorded was too short. Please try again.');
          }
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (err: any) {
        console.error(err);
        setError('Microphone access denied or unavailable.');
      }
    }
  };

  const handleProcessAudio = async (audioBlob: Blob) => {
    setError(null);
    try {
      const data = await sendAudioChat(audioBlob, sessionId, 'en');
      
      setHistory((prev) => [
        { command: data.transcribedText, response: data.geminiResponse },
        ...prev,
      ]);

      if (data.audioBase64) {
        const audioUrl = `data:audio/mp3;base64,${data.audioBase64}`;
        const audio = new Audio(audioUrl);
        audio.play().catch(e => console.warn('Audio autoplay failed:', e));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to process voice query.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8">
      <PageHeader
        title="Voice Assistant"
        breadcrumb="Home / Voice Assistant"
        subtitle="Speak naturally to interact with your health assistant"
      />

      {/* Main mic panel */}
      <div className="flex justify-center py-8">
        <div className="relative flex items-center justify-center">
          {/* Pulse rings */}
          <AnimatePresence>
            {isListening && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 1, opacity: 0.4 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute w-28 h-28 rounded-full border-2 border-primary/30"
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <motion.button
            onClick={toggleListening}
            whileTap={{ scale: 0.95 }}
            className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? 'gradient-primary text-white shadow-[0_0_40px_rgba(59,130,246,0.4)]'
                : 'bg-white border-2 border-border text-text-secondary hover:border-primary hover:text-primary card-shadow'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </motion.button>
        </div>
      </div>

      {/* Status */}
      <p className="text-center text-sm font-semibold text-text-secondary">
        {isListening ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-primary"
          >
            Listening...
          </motion.span>
        ) : (
          'Tap the microphone to start'
        )}
      </p>

      {error && (
        <div className="mx-auto max-w-lg bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Wave visualization placeholder */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-1 h-12"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, Math.random() * 32 + 8, 4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
              className="w-1 rounded-full bg-primary/60"
              style={{ height: 4 }}
            />
          ))}
        </motion.div>
      )}

      {/* History */}
      <GlassCard hover={false} className="p-6">
        <h3 className="font-semibold text-text-primary mb-4">Voice Command History</h3>
        <div className="space-y-4">
          {history.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Volume2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{item.command}</p>
                <p className="text-sm text-text-secondary mt-1">{item.response}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default VoiceAssistantView;
