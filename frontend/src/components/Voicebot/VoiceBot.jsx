import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeflection } from '../../context/DeflectionContext';

const ProxyVoice = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { sareeMode } = useDeflection();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = i18n.language === 'kn' ? 'kn-IN' : 'en-IN';
  }

  const handleCommand = useCallback((text) => {
    const lowerText = text.toLowerCase().trim();
    
    // Command Logic - Navigation Only
    if (lowerText.includes('history') || lowerText.includes('ಇತಿಹಾಸ')) {
      navigate('/history');
    } else if (lowerText.includes('gallery') || lowerText.includes('nft') || lowerText.includes('ಗ್ಯಾಲರಿ')) {
      navigate('/nft-gallery');
    } else if (lowerText.includes('home') || lowerText.includes('dashboard') || lowerText.includes('ಡ್ಯಾಶ್‌ಬೋರ್ಡ್')) {
      navigate('/');
    }
    
    setTimeout(() => setTranscript(''), 3000);
  }, [navigate]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleCommand(text);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
  }, [recognition, handleCommand]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      setTranscript('Listening for Navigation...');
      recognition?.start();
      setIsListening(true);
    }
  };

  if (!recognition) return null; // Hide if not supported

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`px-4 py-2 rounded-2xl shadow-xl text-sm font-bold border ${
              sareeMode 
                ? 'bg-orange-50 border-orange-200 text-orange-900' 
                : 'bg-slate-900 border-slate-700 text-white'
            }`}
          >
            {transcript}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        title="Voice Navigation"
        className={`w-14 h-14 space-y-0 rounded-full flex items-center justify-center shadow-2xl transition-all relative ${
          isListening 
            ? 'bg-red-500 text-white shadow-red-500/30' 
            : (sareeMode ? 'bg-orange-600 text-white shadow-orange-500/30' : 'bg-indigo-600 text-white shadow-indigo-500/30')
        }`}
      >
        {isListening ? <MicOff size={24} className="relative z-10" /> : <Mic size={24} className="relative z-10" />}
        {isListening && (
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-red-400"
            style={{ zIndex: 0 }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default ProxyVoice;
