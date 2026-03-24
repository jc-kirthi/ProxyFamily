import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Zap, Activity, Volume2, Mic, BarChart3 } from 'lucide-react';
import { useDeflection } from '../../context/DeflectionContext';

const AIMetricsPanel = () => {
  const { sareeMode } = useDeflection();
  const [metrics, setMetrics] = useState({
    modelAccuracy: 97.3,
    voiceMatchScore: 94.8,
    inferenceLatency: 23,
    trainingHours: 10247,
    tokenizerSpeed: 847,
    emotionF1: 0.96,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        modelAccuracy: +(97 + Math.random() * 0.8).toFixed(1),
        voiceMatchScore: +(93 + Math.random() * 3).toFixed(1),
        inferenceLatency: Math.floor(18 + Math.random() * 12),
        tokenizerSpeed: Math.floor(820 + Math.random() * 60),
        emotionF1: +(0.94 + Math.random() * 0.04).toFixed(2),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-6 rounded-3xl border-2 ${
      sareeMode ? 'bg-white border-orange-200' : 'bg-slate-900 border-slate-800'
    } shadow-xl`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl ${sareeMode ? 'bg-purple-100' : 'bg-purple-500/10'}`}>
          <Brain size={20} className="text-purple-400" />
        </div>
        <div>
          <h3 className={`font-bold text-sm ${sareeMode ? 'text-slate-900' : 'text-white'}`}>AI/ML Pipeline Status</h3>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">ProxyBERT v3.2 · Gemini 2.0 Flash</p>
        </div>
      </div>

      {/* NLP Pipeline Visualization */}
      <div className={`p-4 rounded-2xl border mb-4 ${sareeMode ? 'bg-purple-50 border-purple-100' : 'bg-slate-800/50 border-slate-700/50'}`}>
        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-3">Processing Pipeline</p>
        <div className="flex items-center gap-1 flex-wrap">
          {['Audio Input', '→', 'Tokenizer', '→', 'BERT Encoder', '→', 'Emotion Classifier', '→', 'Response Gen', '→', 'Voice Synth'].map((step, i) => (
            <span key={i} className={`text-[9px] font-bold ${
              step === '→' ? 'text-slate-600' :
              `px-2 py-1 rounded-lg ${sareeMode ? 'bg-white text-purple-700 border border-purple-200' : 'bg-slate-900 text-purple-300 border border-slate-700'}`
            }`}>
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<BarChart3 size={14} />}
          label="Model Accuracy"
          value={`${metrics.modelAccuracy}%`}
          color="emerald"
          sareeMode={sareeMode}
        />
        <MetricCard
          icon={<Volume2 size={14} />}
          label="Voice Match"
          value={`${metrics.voiceMatchScore}%`}
          color="indigo"
          sareeMode={sareeMode}
        />
        <MetricCard
          icon={<Zap size={14} />}
          label="Inference"
          value={`${metrics.inferenceLatency}ms`}
          color="yellow"
          sareeMode={sareeMode}
        />
        <MetricCard
          icon={<Cpu size={14} />}
          label="Tokenizer"
          value={`${metrics.tokenizerSpeed} tok/s`}
          color="cyan"
          sareeMode={sareeMode}
        />
        <MetricCard
          icon={<Activity size={14} />}
          label="Emotion F1"
          value={metrics.emotionF1}
          color="pink"
          sareeMode={sareeMode}
        />
        <MetricCard
          icon={<Mic size={14} />}
          label="Training Data"
          value={`${metrics.trainingHours.toLocaleString()}h`}
          color="purple"
          sareeMode={sareeMode}
        />
      </div>

      {/* Disclaimer */}
      <p className="text-[8px] text-slate-600 mt-4 italic text-center">
        "Trained on 10,000+ hours of Indian family drama. Model weights are proprietary and emotionally scarring."
      </p>
    </div>
  );
};

const MetricCard = ({ icon, label, value, color, sareeMode }) => {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    indigo: 'text-indigo-400 bg-indigo-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    pink: 'text-pink-400 bg-pink-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-3 rounded-xl border ${sareeMode ? 'bg-white border-slate-200' : 'bg-slate-800/50 border-slate-700/50'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={c.split(' ')[0]}>{icon}</span>
        <span className="text-[9px] text-slate-500 font-bold uppercase">{label}</span>
      </div>
      <p className={`text-lg font-black ${sareeMode ? 'text-slate-900' : 'text-white'}`}>{value}</p>
    </div>
  );
};

export default AIMetricsPanel;
