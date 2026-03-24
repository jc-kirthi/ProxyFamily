import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useDeflection } from '../../context/DeflectionContext';

const GasMeter = () => {
  const { gasAmount, sareeMode } = useDeflection();
  
  // Max gas for progress calculation (humorous limit)
  const maxGas = 5000;
  const progress = Math.min((gasAmount / maxGas) * 100, 100);

  return (
    <div className={`p-6 rounded-3xl border-2 ${
      sareeMode ? 'bg-white border-orange-200' : 'bg-slate-900 border-slate-800'
    } shadow-lg mb-8`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className={`text-lg font-bold ${sareeMode ? 'text-orange-950' : 'text-white'}`}>
            {sareeMode ? t('Blessing Cost (Namaste Meter)') : t('Blockchain Gas Fees (₹)')}
          </h3>
          <p className="text-xs text-slate-500">{t('Real gas is expensive. This is just for show.')}</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${sareeMode ? 'text-orange-600' : 'text-indigo-400'}`}>₹{gasAmount}</p>
          <p className="text-[10px] text-emerald-500 flex items-center gap-1 justify-end">
             <TrendingUp size={10} /> +₹50 last call
          </p>
        </div>
      </div>

      <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 p-1">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full rounded-full ${
            sareeMode 
              ? 'bg-gradient-to-r from-orange-400 to-orange-600' 
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
          }`}
        />
        
        {/* Animated spikes */}
        {progress > 80 && (
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="absolute top-0 right-0 h-full w-4 bg-red-500 blur-sm"
          />
        )}
      </div>

      <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        <span>{t('Low Pressure')}</span>
        <span className={progress > 90 ? 'text-red-500 animate-pulse' : ''}>
          {progress > 90 ? t('Wedding Season Peak') : t('Normal Pressure')}
        </span>
      </div>
    </div>
  );
};

export default GasMeter;
