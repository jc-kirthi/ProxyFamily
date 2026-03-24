import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Zap, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDeflection } from '../../context/DeflectionContext';
import { relatives } from '../../utilis/excuses';

const DemoModeButton = ({ onRunDemo }) => {
  const { t } = useTranslation();
  const { sareeMode } = useDeflection();
  const [isRunning, setIsRunning] = useState(false);

  const startDemo = () => {
    setIsRunning(true);
    onRunDemo();
    setTimeout(() => {
        setIsRunning(false);
    }, 5000);
  };

  return (
    <div className={`p-6 rounded-3xl border-2 ${
      sareeMode ? 'bg-orange-50 border-orange-200 shadow-orange-100' : 'bg-indigo-900/20 border-indigo-500/30'
    } shadow-lg mt-8 relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 p-2 text-indigo-500/20 rotate-12 group-hover:rotate-45 transition-transform">
        <Sparkles size={60} />
      </div>

      <div className="relative z-10">
        <h4 className={`font-bold mb-2 flex items-center gap-2 ${sareeMode ? 'text-orange-900' : 'text-white'}`}>
          <Zap size={18} className="text-yellow-400" />
          {t('Simulate Incoming Call')}
        </h4>
        <p className="text-xs text-slate-500 mb-4 pr-10">
          {t('Trigger a realistic incoming relative call to demonstrate the full AI deflection pipeline end-to-end.')}
        </p>
        
        <button 
          onClick={startDemo}
          disabled={isRunning}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
            isRunning 
              ? 'bg-slate-800 text-slate-500' 
              : sareeMode 
                ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-500/20' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
          } shadow-xl active:scale-95`}
        >
          {isRunning ? <Loader2 className="animate-spin" /> : <Play size={20} />}
          <span>{isRunning ? t('Connecting...') : t('Simulate Call Now')}</span>
        </button>
      </div>

      {isRunning && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-indigo-500"
        />
      )}
    </div>
  );
};

const Loader2 = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

export default DemoModeButton;
