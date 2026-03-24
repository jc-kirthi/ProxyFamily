import React from 'react';
import { motion } from 'framer-motion';
import { PhoneOff, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import { relatives } from '../../utilis/excuses';
import { useDeflection } from '../../context/DeflectionContext';
import { useTranslation } from 'react-i18next';

const CallList = ({ onDeflect }) => {
  const { t } = useTranslation();
  const { sareeMode } = useDeflection();

  return (
    <div className="space-y-4">
      {relatives.map((relative, index) => (
        <motion.div
          key={relative.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-5 rounded-3xl border-2 transition-all hover:scale-[1.01] ${
            sareeMode 
              ? 'bg-white border-orange-100 shadow-sm' 
              : 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/50'
          } flex items-center justify-between group`}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={relative.image} alt={relative.name} className="w-14 h-14 rounded-2xl bg-slate-800" />
              {relative.urgency === 'critical' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`font-bold ${sareeMode ? 'text-slate-900' : 'text-white'}`}>{t(relative.name)}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  relative.urgency === 'critical' ? 'bg-red-500/10 text-red-500' :
                  relative.urgency === 'high' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-indigo-500/10 text-indigo-400'
                }`}>
                  {t(relative.urgency)}
                </span>
              </div>
              <p className="text-sm text-slate-500">{t(relative.relation)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onDeflect(relative)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all ${
                sareeMode
                  ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
              } shadow-lg`}
            >
              <PhoneOff size={18} />
              <span>{sareeMode ? t('Respectfully Decline') : t('Deflect')}</span>
            </button>
            
            <button className={`p-2.5 rounded-2xl border ${
              sareeMode ? 'border-orange-200 text-orange-600' : 'border-slate-800 text-slate-400 group-hover:border-slate-700'
            }`}>
              <MessageSquare size={18} />
            </button>
          </div>
        </motion.div>
      ))}
      
      <div className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center ${
        sareeMode ? 'border-orange-200 bg-orange-50/50' : 'border-slate-800 bg-slate-900/20'
      }`}>
        <div className="p-3 bg-slate-800 rounded-2xl mb-3 text-slate-500">
          <Clock size={24} />
        </div>
        <p className="text-slate-500 text-sm">{t("Waiting for more relatives to notice you're successful...")}</p>
      </div>
    </div>
  );
};

export default CallList;
