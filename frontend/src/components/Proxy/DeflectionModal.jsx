import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, CheckCircle, Loader2, Database, Volume2, ExternalLink, Hash, Brain, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDeflection } from '../../context/DeflectionContext';
import { getNextExcuse } from '../../utilis/excuses';
import { speakExcuse, isVoiceEnrolled } from '../../utilis/audioHelper';

const ALGO_EXPLORER = 'https://lora.algokit.io/testnet/application/756282697';

// Animated hash generation
const HashAnimation = ({ hash }) => {
  const [displayHash, setDisplayHash] = useState('');
  
  useEffect(() => {
    let i = 0;
    const chars = '0123456789abcdef';
    const interval = setInterval(() => {
      if (i >= hash.length) {
        clearInterval(interval);
        setDisplayHash(hash);
        return;
      }
      setDisplayHash(prev => {
        const scrambled = hash.split('').map((c, idx) => 
          idx < i ? c : chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        return scrambled;
      });
      i++;
    }, 30);
    return () => clearInterval(interval);
  }, [hash]);

  return <code className="text-[10px] font-mono text-indigo-300 break-all">{displayHash}</code>;
};

const DeflectionModal = ({ relative, onComplete }) => {
  const { t, i18n } = useTranslation();
  const { incrementDeflections, sareeMode } = useDeflection();
  const [step, setStep] = useState(0);
  // getNextExcuse() mirrors the audio queue — same index, same sample
  const [excuseData] = useState(() => getNextExcuse());
  const excuse = excuseData.text;
  const sampleNum = excuseData.sampleNum;
  const [txHash] = useState(() => `PROXY-${Math.random().toString(36).substring(2, 12).toUpperCase()}`);
  const [contentHash] = useState(() => {
    // Generate a fake SHA-256 hash from the excuse text
    const chars = '0123456789abcdef';
    return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join('');
  });
  const [confidence] = useState(() => (92 + Math.random() * 6).toFixed(1));

  const steps = [
    { title: t("Biometric Uplink"), icon: <Volume2 size={28} />, description: t("Mapping vocal spectral fingerprint to neural weights..."), metric: "Match: 98.4%" },
    { title: t("Intent Extraction"), icon: <Brain size={28} />, description: t("Analyzing emotional vectors via ProxyBERT LLM..."), metric: "Latency: 28ms" },
    { title: t("Excuse Synthesis"), icon: <Zap size={28} />, description: t("Selected variant #842 — Optimal social resistance index"), metric: `Conf: ${confidence}%` },
    { title: t("Blockchain Anchor"), icon: <Database size={28} />, description: t("Submitting SHA-256 state to Algorand Testnet..."), metric: t("Pending...") }
  ];

  useEffect(() => {
    // CRITICAL: Stop ALL other speech immediately when deflection starts
    window.speechSynthesis?.cancel();

    const runSteps = async () => {
      await new Promise(r => setTimeout(r, 2000));
      setStep(1);
      await new Promise(r => setTimeout(r, 2000));
      setStep(2);
      // Cancel again right before speaking excuse (in case relative voice restarted)
      window.speechSynthesis?.cancel();
      await new Promise(r => setTimeout(r, 300)); // Brief pause so cancel takes effect
      speakExcuse(t(excuse), i18n.language); // Sequential queue will pick next sample automatically
      await new Promise(r => setTimeout(r, 3500)); // Give enough time for excuse to be spoken
      setStep(3);
      await new Promise(r => setTimeout(r, 2000));
      setStep(4); // Completion
      incrementDeflections();
    };
    runSteps();
  }, []);

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-md p-8 rounded-[32px] border-2 shadow-2xl ${
          sareeMode ? 'bg-white border-orange-200' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-3xl mb-6 flex items-center justify-center ${
            step < 4
              ? (sareeMode ? 'bg-orange-100 text-orange-600' : 'bg-indigo-500/10 text-indigo-400')
              : 'bg-emerald-500/10 text-emerald-400'
          }`}>
            {step < 4 ? steps[Math.min(step, 3)].icon : <CheckCircle size={40} />}
          </div>

          <AnimatePresence mode="wait">
            {step < 4 ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3 w-full"
              >
                <h3 className={`text-xl font-bold ${sareeMode ? 'text-slate-900' : 'text-white'}`}>
                  {steps[step].title}
                </h3>
                <p className="text-slate-500 text-sm italic">{steps[step].description}</p>
                
                {/* Technical metric badge */}
                <div className="flex justify-center gap-2">
                  <span className="text-[9px] px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-bold">
                    {steps[step].metric}
                  </span>
                  {isVoiceEnrolled() && step >= 2 && (
                    <span className="text-[9px] px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-bold animate-pulse">
                      🎙️ Voice Sample {sampleNum}/5 Active
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: "linear" }}
                    key={`progress-${step}`}
                    className={`h-full ${sareeMode ? 'bg-orange-500' : 'bg-indigo-500'}`}
                  />
                </div>

                {/* Step indicator */}
                <div className="flex justify-center gap-2 mt-3">
                  {steps.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                      i <= step ? (sareeMode ? 'bg-orange-500' : 'bg-indigo-500') : 'bg-slate-700'
                    }`} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 w-full"
              >
                <div>
                  <h3 className={`text-2xl font-bold ${sareeMode ? 'text-slate-900' : 'text-white'}`}>
                    {t('Deflection Successful')}
                  </h3>
                  <p className="text-emerald-500 font-bold text-sm tracking-widest uppercase">
                    {t('Verified')} ✓
                  </p>
                </div>

                {/* Excuse Used */}
                <div className={`p-3 rounded-xl text-left border ${sareeMode ? 'bg-orange-50 border-orange-100' : 'bg-slate-800/50 border-slate-700'}`}>
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">{t('Excuse Deployed')}</p>
                  <p className={`text-sm italic ${sareeMode ? 'text-slate-700' : 'text-slate-300'}`}>"{t(excuse)}"</p>
                </div>

                {/* Transaction Details */}
                <div className={`p-4 rounded-xl text-left border ${sareeMode ? 'bg-orange-50 border-orange-100' : 'bg-slate-800/50 border-slate-700'}`}>
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-2">{t('On-Chain Proofs')}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">TX Hash</span>
                      <code className={`text-xs font-mono font-bold ${sareeMode ? 'text-orange-900' : 'text-indigo-300'}`}>{txHash}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">App ID</span>
                      <span className="text-xs font-mono text-emerald-400">756282697</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">{t('Success Rate')}</span>
                      <span className="text-xs font-bold text-purple-400">{confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Content Hash */}
                <div className={`p-3 rounded-xl text-left border ${sareeMode ? 'bg-orange-50 border-orange-100' : 'bg-slate-800/30 border-slate-700/30'}`}>
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">SHA-256 Content Hash</p>
                  <HashAnimation hash={contentHash} />
                </div>

                {/* Verify Button */}
                <div className="flex gap-3">
                  <a
                    href={ALGO_EXPLORER}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${
                      sareeMode ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <ExternalLink size={16} />
                    {t('Verified')}
                  </a>
                  <button
                    onClick={onComplete}
                    className={`flex-[2] py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-widest ${
                      sareeMode ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20'
                    }`}
                  >
                    <CheckCircle size={16} />
                    {t('DONE')}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[8px] text-slate-600 font-bold uppercase tracking-widest pt-2">
                  <span>Block: 42,912,841</span>
                  <span>Neural Latency: 14ms</span>
                  <span>{t('Success Rate')}: 100%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default DeflectionModal;
