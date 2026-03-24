import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff, Shield, ShieldAlert } from 'lucide-react';
import { useDeflection } from '../../context/DeflectionContext';
import { useTranslation } from 'react-i18next';
import { speakAsRelative } from '../../utilis/audioHelper';

const IncomingCallSimulator = ({ relative, onAccept, onDeflect }) => {
  const { sareeMode } = useDeflection();
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    // Ringtone sound simulation
    const ringtone = setInterval(() => {
       speakAsRelative(t("RING_RING"), "cousin", i18n.language); 
    }, 4000);
    return () => clearInterval(ringtone);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
    >
      <div className={`w-full max-w-sm h-[80vh] flex flex-col items-center justify-between py-16 px-8 rounded-[3rem] shadow-2xl relative overflow-hidden ${
        sareeMode ? 'bg-gradient-to-b from-orange-50 to-orange-100 border border-orange-200' : 'bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800'
      }`}>
        
        {/* Ringing Animation Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
           <motion.div 
             animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             className={`w-40 h-40 rounded-full ${sareeMode ? 'bg-orange-500' : 'bg-indigo-500'}`}
           />
        </div>

        {/* Contact Info */}
        <div className="text-center relative z-10 w-full pt-10">
          <div className="w-32 h-32 mx-auto rounded-full bg-slate-800 mb-6 overflow-hidden border-4 border-white/10 relative">
            <img src={relative.image} alt={relative.name} className="w-full h-full object-cover" />
          </div>
          <motion.p 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`text-sm font-black tracking-[0.2em] uppercase mb-2 ${sareeMode ? 'text-orange-600' : 'text-slate-400'}`}
          >
            {t('Incoming Video Call')}
          </motion.p>
          <h2 className={`text-4xl font-black tracking-tighter ${sareeMode ? 'text-slate-900' : 'text-white'}`}>
            {t(relative.name)}
          </h2>
          <p className="text-slate-500 font-medium mt-2">{t('Risk Level High')}</p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex justify-between px-4 relative z-10">
           <div className="flex flex-col items-center gap-3">
             <button 
               onClick={onAccept}
               className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-red-500/20"
             >
               <PhoneOff size={28} />
             </button>
             <span className={`text-[10px] font-black uppercase tracking-widest ${sareeMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('Decline')}
             </span>
           </div>

           <div className="flex flex-col items-center gap-3">
             <motion.button 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               onClick={onDeflect}
               className={`w-20 h-20 rounded-full text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl ${
                 sareeMode ? 'bg-orange-600 shadow-orange-500/40' : 'bg-indigo-600 shadow-indigo-500/40'
               }`}
             >
               <ShieldAlert size={34} />
             </motion.button>
             <span className={`text-[10px] font-black uppercase tracking-widest ${sareeMode ? 'text-orange-600' : 'text-indigo-400'}`}>
                {t('Deflect via AI')}
             </span>
           </div>

           <div className="flex flex-col items-center gap-3">
             <button 
               onClick={onAccept}
               className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20"
             >
               <Phone size={28} />
             </button>
             <span className={`text-[10px] font-black uppercase tracking-widest ${sareeMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('Accept')}
             </span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IncomingCallSimulator;
