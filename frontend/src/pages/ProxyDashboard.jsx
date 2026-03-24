import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Brain, Activity, User, Grid, 
  Search, Info, Database, Heart, Volume2, Mic, Play, Award, 
  Loader2, Plus, Filter, LayoutGrid, List, Wifi, AlertTriangle, Fingerprint, ChevronRight, Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDeflection } from '../context/DeflectionContext';
import CallList from '../components/Proxy/CallList';
import GasMeter from '../components/Proxy/GasMeter';
import SareeModeToggle from '../components/Proxy/SareeModeToggle';
import LiveCallUI from '../components/Proxy/LiveCallUI';
import DemoModeButton from '../components/Proxy/DemoModeButton';
import BlockchainProofPanel from '../components/Proxy/BlockchainProofPanel';
import AIMetricsPanel from '../components/Proxy/AIMetricsPanel';
import VoiceRecorder from '../components/Proxy/VoiceRecorder';
import IncomingCallSimulator from '../components/Proxy/IncomingCallSimulator';
import { relatives } from '../utilis/excuses';
import { isVoiceEnrolled, speakExcuse } from '../utilis/audioHelper';
 

const ProxyDashboard = () => {
  const { t, i18n } = useTranslation();
  const { totalDeflections, gasAmount, sareeMode } = useDeflection();
  const [activeCall, setActiveCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(isVoiceEnrolled());
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const handleDeflect = (relative) => {
    setActiveCall(relative);
  };

  const handleRunDemo = () => {
    const randomRelative = relatives[Math.floor(Math.random() * relatives.length)];
    setIncomingCall(randomRelative);
  };

  const handleVoiceComplete = (profile) => {
    setIsEnrolled(true);
    setShowVoiceSetup(false);
  };

  return (
    <div className={`min-h-screen pt-32 pb-20 transition-colors duration-500 ${sareeMode ? 'bg-orange-50/50' : 'bg-slate-950'}`}>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Simple Profile Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 px-4">
           <div className="flex items-center gap-6 text-center md:text-left">
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-black transition-all ${
                sareeMode ? 'bg-orange-100 text-orange-600' : 'bg-slate-900 text-indigo-400 border border-slate-800'
              }`}>
                 PH
              </div>
              <div>
                 <h2 className={`text-4xl font-black tracking-tight ${sareeMode ? 'text-slate-900' : 'text-white'}`}>
                    Pavan Hosatti
                 </h2>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">
                    {t('Master of Deflections')} • {t('Verified Ghost')}
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-12">
              <StatItem label={t('GAS SAVED')} value={`₹${gasAmount}`} color="emerald" sareeMode={sareeMode} />
              <StatItem label={t('DEFLECTED')} value={`${totalDeflections}`} color="indigo" sareeMode={sareeMode} />
           </div>
        </div>

        {/* Dashboard Content - Clean 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Main Column: Targets & Deflections */}
           <div className="lg:col-span-8 space-y-12">
              <div className="flex items-center justify-between">
                 <h3 className={`text-2xl font-black tracking-tight ${sareeMode ? 'text-slate-900' : 'text-white'}`}>
                    {t('Active Targets')}
                 </h3>
                 <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('Live Transmission')}
                 </div>
              </div>

              <div className="bg-white/5 border border-slate-800/5 rounded-3xl overflow-hidden">
                 <CallList onDeflect={handleDeflect} />
              </div>
           </div>

           {/* Sidebar: Controls & Technical Status */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* Voice Link Panel - Cleaned Up */}
              <div className={`p-8 rounded-[2.5rem] border transition-all ${
                sareeMode ? 'bg-white border-orange-100' : 'bg-slate-900 border-slate-800 shadow-xl shadow-black/50'
              }`}>
                 <div className="flex items-center gap-4 mb-8">
                    <Fingerprint className={isEnrolled ? 'text-emerald-400' : 'text-slate-500'} size={28} />
                    <div>
                       <h4 className={`text-xs font-black uppercase tracking-[0.1em] ${sareeMode ? 'text-slate-900' : 'text-white'}`}>
                          {t('Voice Identity')}
                       </h4>
                       <span className={`text-[10px] font-bold ${isEnrolled ? 'text-emerald-500' : 'text-slate-500'}`}>
                          {isEnrolled ? t('Link Active') : t('Enrollment Required')}
                       </span>
                       {isEnrolled && (
                         <div className="mt-3 flex gap-1 opacity-20">
                           {Array.from({ length: 16 }).map((_, i) => (
                             <div key={i} className="w-[1.5px] h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                           ))}
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="flex gap-2">
                   <button 
                    onClick={() => setShowVoiceSetup(true)}
                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                      isEnrolled 
                        ? (sareeMode ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-800 text-slate-400 hover:bg-slate-700') 
                        : (sareeMode ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30')
                    }`}
                   >
                     {isEnrolled ? t('RECALIBRATE') : t('ESTABLISH LINK')}
                   </button>
                   {isEnrolled && (
                     <button
                       onClick={() => speakExcuse(t("Neural Link Protocol Verified. Self-test successful. Ready to deflect Aunties."), i18n.language)}
                       className={`px-4 rounded-2xl flex items-center justify-center transition-all ${
                         sareeMode ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-orange-600/10 text-orange-400 hover:bg-orange-600/20'
                       }`}
                       title="Test Configured Voice"
                     >
                       <Volume2 size={16} />
                     </button>
                   )}
                 </div>

                 {/* Voice Engine Status */}
                 <div className="mt-6 pt-5 border-t border-slate-800/50">
                    <p className={`text-[9px] font-bold uppercase tracking-[0.15em] ${sareeMode ? 'text-orange-400' : 'text-slate-500'}`}>
                      ⚡ {t('Proxy Voice Engine')}: {isEnrolled ? t('Active • AI Ready') : t('Standby')}
                    </p>
                 </div>
              </div>

              {/* Saree Mode Switch - Cleaned up */}
              <div className={`p-8 rounded-[2.5rem] border ${sareeMode ? 'bg-white border-orange-100' : 'bg-slate-900 border-slate-800'}`}>
                 <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500">{t('Protocol Control')}</span>
                    <Shield size={16} className={sareeMode ? 'text-orange-500' : 'text-indigo-400'} />
                 </div>
                 <SareeModeToggle />
              </div>

              {/* Technical Deep Dive Toggle */}
              <button 
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className={`w-full p-6 rounded-[2rem] border-2 border-dashed transition-all flex items-center justify-between ${
                  showTechnicalDetails 
                    ? 'border-indigo-500/50 bg-indigo-500/5' 
                    : (sareeMode ? 'border-orange-100 text-slate-400' : 'border-slate-800 text-slate-500 hover:border-slate-700')
                }`}
              >
                 <div className="flex items-center gap-3">
                    <Settings size={18} />
                    <span className="text-xs font-black uppercase tracking-[0.1em]">{t('Advanced Metrics')}</span>
                 </div>
                 <ChevronRight size={18} className={`transition-transform duration-300 ${showTechnicalDetails ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                 {showTechnicalDetails && (
                   <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8 overflow-hidden"
                   >
                      <BlockchainProofPanel />
                      <AIMetricsPanel />
                   </motion.div>
                 )}
              </AnimatePresence>

              <DemoModeButton onRunDemo={handleRunDemo} />
           </div>
        </div>

      </div>

      <AnimatePresence>
        {incomingCall && (
          <IncomingCallSimulator 
            relative={incomingCall} 
            onAccept={() => setIncomingCall(null)}
            onDeflect={() => {
              setActiveCall(incomingCall);
              setIncomingCall(null);
            }} 
          />
        )}
        {activeCall && (
          <LiveCallUI relative={activeCall} onClose={() => setActiveCall(null)} />
        )}
        {showVoiceSetup && (
          <VoiceRecorder onComplete={handleVoiceComplete} onClose={() => setShowVoiceSetup(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const StatItem = ({ label, value, color, sareeMode }) => (
  <div className="text-center">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{label}</p>
    <p className={`text-4xl font-black tracking-tighter ${
      color === 'emerald' ? (sareeMode ? 'text-emerald-600' : 'text-emerald-400') :
      (sareeMode ? 'text-indigo-600' : 'text-indigo-400')
    }`}>
      {value}
    </p>
  </div>
);

export default ProxyDashboard;
