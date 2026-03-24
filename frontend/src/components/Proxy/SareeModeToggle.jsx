import React from 'react';
import { motion } from 'framer-motion';
import { Heart, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDeflection } from '../../context/DeflectionContext';

const SareeModeToggle = () => {
  const { t } = useTranslation();
  const { sareeMode, toggleSareeMode } = useDeflection();

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${sareeMode ? 'bg-orange-100 text-orange-600' : 'bg-slate-800 text-slate-500'}`}>
          {sareeMode ? <UserCheck size={20} /> : <Heart size={20} />}
        </div>
        <div>
          <p className={`text-sm font-bold ${sareeMode ? 'text-orange-900' : 'text-slate-200'}`}>{t('Saree Mode')}</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
            {sareeMode ? t('RESPECTFUL ACTIVE') : t('CULTURE OFF')}
          </p>
        </div>
      </div>

      <button 
        onClick={toggleSareeMode}
        className={`relative w-14 h-8 rounded-full transition-colors duration-300 p-1 flex items-center ${
          sareeMode ? 'bg-orange-500' : 'bg-slate-700'
        }`}
      >
        <motion.div 
          animate={{ x: sareeMode ? 24 : 0 }}
          className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          {sareeMode && <div className="w-3 h-3 bg-red-500 rounded-full" />}
        </motion.div>
      </button>
    </div>
  );
};

export default SareeModeToggle;
