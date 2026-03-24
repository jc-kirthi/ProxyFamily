import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneOff, Mic, MicOff, Volume2, Shield, Zap, X, Wifi, Activity, Brain, AlertTriangle, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDeflection } from '../../context/DeflectionContext';
import DeflectionModal from './DeflectionModal';
import { speakAsRelative, isVoiceEnrolled } from '../../utilis/audioHelper';

// Multi-turn relative dialogue scripts
const RELATIVE_SCRIPTS = {
  aunty: [
    { text: "Beta, why are you not picking up? Is this how I raised you?", emotion: "Guilt Trip", intensity: 87, delay: 2000 },
    { text: "Your cousin Rahul just got promoted at Google. What are YOU doing?", emotion: "Comparison Mode", intensity: 94, delay: 6000 },
    { text: "When are you getting married? Mrs. Sharma's daughter is still available...", emotion: "Marriage Pressure", intensity: 91, delay: 11000 },
    { text: "Are you even eating properly? You look so thin on WhatsApp DP.", emotion: "Passive Concern", intensity: 72, delay: 16000 },
  ],
  uncle: [
    { text: "Beta, what is your salary package? Just curious only...", emotion: "Financial Probe", intensity: 88, delay: 2000 },
    { text: "In my time, we had real jobs. Not this computer-shomputer business.", emotion: "Generational Flex", intensity: 79, delay: 7000 },
    { text: "Your father was telling me you spent ₹500 on coffee. FIVE HUNDRED RUPEES.", emotion: "Financial Shock", intensity: 96, delay: 12000 },
  ],
  cousin: [
    { text: "Bro when are you coming home? Everyone is asking about you only.", emotion: "Social Pressure", intensity: 65, delay: 2000 },
    { text: "Aunty was saying you have a girlfriend. Is it true? TELL ME.", emotion: "Gossip Extraction", intensity: 82, delay: 7000 },
    { text: "Also can you help me with my Java assignment? It's due tomorrow.", emotion: "Exploitation", intensity: 71, delay: 12000 },
  ],
  grandma: [
    { text: "Chinna, have you eaten? I made your favorite dosa but you never come home.", emotion: "Emotional Blackmail", intensity: 99, delay: 2000 },
    { text: "Your grandfather's photo is looking at me and asking where you are.", emotion: "Supernatural Guilt", intensity: 97, delay: 7000 },
    { text: "I told the priest to pray for your marriage. He said next month is auspicious.", emotion: "Divine Intervention", intensity: 95, delay: 12000 },
  ]
};

// Waveform visualization component
const AudioWaveform = ({ isActive }) => {
  const bars = 32;
  return (
    <div className="flex items-end justify-center gap-[2px] h-12 px-4">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          animate={isActive ? {
            height: [4, Math.random() * 40 + 8, Math.random() * 20 + 4, Math.random() * 48 + 4],
          } : { height: 4 }}
          transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse", delay: i * 0.03 }}
          className="w-[3px] rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 opacity-80"
          style={{ minHeight: 4 }}
        />
      ))}
    </div>
  );
};

// Live emotion detection component
const EmotionAnalysisPanel = ({ emotions, currentEmotion }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-sm space-y-3 p-4 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <Brain size={14} className="text-purple-400" />
        <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em]">NLP Emotion Engine v3.2</span>
        <span className="ml-auto text-[8px] text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />{t('Live Transmission')}
        </span>
      </div>
      {emotions.map((e, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold">{t(e.emotion)}</span>
            <span className={`text-[10px] font-black ${e.intensity > 90 ? 'text-red-400' : e.intensity > 70 ? 'text-orange-400' : 'text-yellow-400'}`}>
              {e.intensity}%{e.intensity > 90 ? ` ${t('Risk Level High')}` : e.intensity > 70 ? ` ${t('Risk Level High')}` : ''}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${e.intensity}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full rounded-full ${e.intensity > 90 ? 'bg-gradient-to-r from-red-500 to-pink-500' : e.intensity > 70 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}`}
            />
          </div>
        </div>
      ))}
      {currentEmotion && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
          <AlertTriangle size={12} className="text-red-400" />
          <span className="text-[10px] text-red-400 font-bold">{t('Detected Intent')}: {t(currentEmotion)}</span>
        </div>
      )}
    </div>
  );
};

// Technical metrics sidebar
const TechMetrics = () => {
  const { t } = useTranslation();
  const [latency, setLatency] = useState(23);
  const [fps, setFps] = useState(60);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 15) + 18);
      setFps(Math.floor(Math.random() * 5) + 58);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-8 left-8 space-y-2 z-20">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800 text-[9px]">
        <Wifi size={10} className="text-emerald-400" />
        <span className="text-emerald-400 font-black">HD Voice</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">5G LTE</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800 text-[9px]">
        <Activity size={10} className="text-cyan-400" />
        <span className="text-cyan-400 font-bold">Neural Link: {latency}ms</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800 text-[9px]">
        <Brain size={10} className={isVoiceEnrolled() ? "text-purple-400" : "text-amber-500"} />
        <span className={isVoiceEnrolled() ? "text-purple-400 font-bold" : "text-amber-500 font-bold"}>
          Voice Profile: {isVoiceEnrolled() ? t('CLONED v3') : t('Standby')}
        </span>
      </div>
      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2 border border-slate-800/50">
        <motion.div 
          animate={{ x: [-100, 400] }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-20 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"
        />
      </div>
      <div className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800 text-[8px] text-slate-500">
        AI Model: ProxyBERT-v3 | FPS: {fps}
      </div>
    </div>
  );
};

const LiveCallUI = ({ relative, onClose }) => {
  const { t, i18n } = useTranslation();
  const { sareeMode } = useDeflection();
  const [callStatus, setCallStatus] = useState(t('Connecting...'));
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showDeflection, setShowDeflection] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [allEmotions, setAllEmotions] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const timerRef = useRef(null);
  const dialogueTimers = useRef([]);
  const scripts = RELATIVE_SCRIPTS[relative.type] || RELATIVE_SCRIPTS.aunty;

  useEffect(() => {
    // Simulate connection
    const connectTimer = setTimeout(() => {
      setCallStatus('00:00');
      startTimer();

      // Schedule multi-turn dialogue
      scripts.forEach((line) => {
        const tid = setTimeout(() => {
          setCurrentDialogue(line);
          setIsSpeaking(true);
          setAllEmotions(prev => {
            const exists = prev.find(e => e.emotion === line.emotion);
            if (exists) return prev;
            return [...prev, { emotion: line.emotion, intensity: line.intensity }];
          });

          // Speak using Web Speech API
          speakAsRelative(t(line.text), relative.type, i18n.language);
          setIsSpeaking(true);
          setTimeout(() => setIsSpeaking(false), 4000);
        }, line.delay);
        dialogueTimers.current.push(tid);
      });
    }, 2500);

    return () => {
      clearTimeout(connectTimer);
      if (timerRef.current) clearInterval(timerRef.current);
      dialogueTimers.current.forEach(t => clearTimeout(t));
      window.speechSynthesis?.cancel();
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    if (callStatus !== t('Connecting...')) {
      const mins = Math.floor(timer / 60).toString().padStart(2, '0');
      const secs = (timer % 60).toString().padStart(2, '0');
      setCallStatus(`${mins}:${secs}`);
    }
  }, [timer]);

  const handleDeflectionComplete = () => {
    setShowDeflection(false);
    window.speechSynthesis?.cancel();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-between py-12 px-6 overflow-y-auto"
    >
      {/* Background Pulse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Tech Metrics Overlay */}
      <TechMetrics />

      {/* Close Button */}
      <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-slate-900/80 rounded-full text-slate-500 hover:text-white transition-colors z-30">
        <X size={20} />
      </button>

      {/* Profile + Waveform */}
      <div className="flex flex-col items-center text-center relative z-10">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500/30 p-1">
            <img src={relative.image} alt={relative.name} className="w-full h-full rounded-full object-cover bg-slate-800" />
          </div>
          {callStatus === t('Connecting...') && (
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-4 border-indigo-500"
            />
          )}
          {isSpeaking && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center border-2 border-slate-950"
            >
              <Volume2 size={12} className="text-white" />
            </motion.div>
          )}
        </motion.div>

        <h2 className="text-2xl font-black text-white mb-1">{t(relative.name)}</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{t(relative.type)}</p>
        <p className="text-indigo-400 font-bold tracking-widest text-sm mb-4">{callStatus}</p>

        {/* Audio Waveform */}
        <AudioWaveform isActive={isSpeaking} />

        {/* Current Dialogue Bubble */}
        <AnimatePresence mode="wait">
          {currentDialogue && (
            <motion.div
              key={currentDialogue.text}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 max-w-xs p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl"
            >
              <p className="text-slate-300 italic text-sm leading-relaxed">"{t(currentDialogue.text)}"</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[8px] text-indigo-400 font-black uppercase tracking-widest">
                  Tone: {t(currentDialogue.emotion)}
                </span>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded ${currentDialogue.intensity > 90 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {currentDialogue.intensity}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Emotion Analysis Panel */}
      {allEmotions.length > 0 && (
        <EmotionAnalysisPanel
          emotions={allEmotions}
          currentEmotion={currentDialogue?.emotion}
        />
      )}

      {/* Call Actions */}
      <div className="flex flex-col items-center gap-6 w-full max-w-sm relative z-10">
        <div className="flex items-center justify-center gap-8 w-full">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full border-2 transition-all ${isMuted ? 'bg-white text-slate-950 border-white' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button className="p-4 rounded-full bg-slate-900 border-2 border-slate-800 text-slate-300">
            <Volume2 size={24} />
          </button>
        </div>

        <button
          onClick={() => {
            // Stop ALL relative speech before showing deflection
            window.speechSynthesis?.cancel();
            dialogueTimers.current.forEach(t => clearTimeout(t));
            setIsSpeaking(false);
            setShowDeflection(true);
          }}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-2xl ${
            sareeMode
              ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
          }`}
        >
          <Shield size={20} />
          <span>{sareeMode ? t('Respectfully Decline') : t('Deploy Proxy Shield')}</span>
        </button>

        <button
          onClick={() => { window.speechSynthesis?.cancel(); onClose(); }}
          className="w-full py-3 rounded-2xl font-bold text-slate-400 bg-slate-900 border-2 border-slate-800 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all flex items-center justify-center gap-3"
        >
          <PhoneOff size={18} />
          <span>{t('End Call')}</span>
        </button>
      </div>

      {/* Deflection Modal */}
      <AnimatePresence>
        {showDeflection && (
          <DeflectionModal relative={relative} onComplete={handleDeflectionComplete} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LiveCallUI;
