import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, CheckCircle, Activity, X, Volume2, Loader2, Fingerprint } from 'lucide-react';
import { useDeflection } from '../../context/DeflectionContext';
import { toast } from 'react-hot-toast';

const SAMPLE_SENTENCES = [
  "Hello. I'm currently stuck in a very important meeting with international clients. I will call you back as soon as I am free."
];

const VoiceRecorder = ({ onComplete, onClose }) => {
  const { sareeMode } = useDeflection();
  const [phase, setPhase] = useState('intro'); // intro, recording, analyzing, done
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceProfile, setVoiceProfile] = useState(null);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [sentence] = useState(() => SAMPLE_SENTENCES[Math.floor(Math.random() * SAMPLE_SENTENCES.length)]);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const analyzerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Set up audio visualization
  const setupVisualization = (stream) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);
    analyzerRef.current = analyzer;
    drawWaveform();
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyzerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#a855f7');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };
    draw();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setupVisualization(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setPhase('recording');

      // Auto-stop after 8 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 8000);
    } catch (err) {
      console.error('Mic access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeVoice = () => {
    setPhase('analyzing');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Generate fake but impressive voice profile metrics
        const profile = {
          pitch: (80 + Math.random() * 120).toFixed(1),
          rate: (0.8 + Math.random() * 0.4).toFixed(2),
          timbre: ['Warm Baritone', 'Clear Tenor', 'Smooth Alto', 'Rich Bass'][Math.floor(Math.random() * 4)],
          matchScore: (93 + Math.random() * 5).toFixed(1),
          biomarkers: Math.floor(127 + Math.random() * 50),
          spectralFingerprint: Array.from({ length: 16 }, () =>
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
          ).join(':'),
          recorded: true,
          recordedAt: new Date().toISOString(),
        };

        setVoiceProfile(profile);
        // Save to localStorage
        localStorage.setItem('proxyVoiceProfile', JSON.stringify(profile));
        if (audioBlob) {
          // Store audio URL for playback reference
          localStorage.setItem('proxyVoiceRecorded', 'true');
          // Save actual audio to IndexedDB for cross-session playback
          import('../../utilis/dbHelper').then(({ saveAudioSample }) => {
            saveAudioSample('userVoice', audioBlob).catch(console.error);
          });
        }
        setPhase('done');
      }
      setAnalyzeProgress(Math.min(progress, 100));
    }, 200);
  };

  const handleComplete = () => {
    if (onComplete) onComplete(voiceProfile);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-[32px] p-8 shadow-2xl"
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-600 hover:text-white">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Phase: Intro */}
          {phase === 'intro' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto ${sareeMode ? 'bg-orange-100 text-orange-600' : 'bg-indigo-500/10 text-indigo-400'}`}>
                <Fingerprint size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-2">Neural Biometry Enrollment</h2>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Protocol v4.2 Active</p>
              </div>
              <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50 shadow-inner">
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3 opacity-70">Read this sentence for acoustic mapping:</p>
                <p className="text-white text-lg font-medium leading-relaxed italic">"{sentence}"</p>
              </div>
              <button
                onClick={startRecording}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                    sareeMode ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                }`}
              >
                <Mic size={18} />
                Initialize Bio-Link
              </button>
              <p className="text-[8px] text-slate-600 uppercase tracking-widest font-bold opacity-50">
                Acoustic biomarkers will be extracted locally. No data leaves this device.
              </p>
            </motion.div>
          )}

          {/* Phase: Recording */}
          {phase === 'recording' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full">
              <div className="relative w-24 h-24 mx-auto">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-red-500/20"
                />
                <div className="relative w-24 h-24 rounded-full bg-red-500 flex items-center justify-center">
                  <Mic size={36} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Recording...</h2>
                <p className="text-red-400 text-sm font-bold animate-pulse">● LIVE</p>
              </div>
              
              {/* Waveform Canvas */}
              <canvas
                ref={canvasRef}
                width={400}
                height={80}
                className="w-full h-20 rounded-xl bg-slate-800"
              />

              <p className="text-slate-500 text-sm italic">"{sentence}"</p>

              <button
                onClick={stopRecording}
                className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all flex items-center justify-center gap-3"
              >
                <MicOff size={20} />
                Stop Recording
              </button>
            </motion.div>
          )}

          {/* Phase: Review + Analyze */}
          {phase !== 'intro' && phase !== 'recording' && phase !== 'analyzing' && phase !== 'done' && audioUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full">
              <h2 className="text-xl font-bold text-white">Voice Sample Captured</h2>
              <audio controls src={audioUrl} className="w-full" />
              <button
                onClick={analyzeVoice}
                className="w-full py-4 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all flex items-center justify-center gap-3"
              >
                <Activity size={20} />
                Analyze Voice Biomarkers
              </button>
            </motion.div>
          )}

          {/* Auto-transition to analyze after recording stops */}
          {phase === 'recording' && !isRecording && audioUrl && (() => { setPhase('review'); return null; })()}

          {/* Phase: Analyzing */}
          {phase === 'analyzing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full">
              <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center mx-auto">
                <Loader2 size={36} className="text-purple-400 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-white">Analyzing Voice Biomarkers</h2>
              
              <div className="space-y-3 text-left">
                {[
                  { label: 'Spectral Analysis', threshold: 20 },
                  { label: 'Pitch Extraction', threshold: 40 },
                  { label: 'Timbre Classification', threshold: 60 },
                  { label: 'Biomarker Mapping', threshold: 80 },
                  { label: 'Neural Fingerprint', threshold: 95 },
                ].map(({ label, threshold }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-400 font-bold">{label}</span>
                      <span className="text-[10px] text-slate-500">
                        {analyzeProgress >= threshold ? '✓' : '...'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${Math.min(analyzeProgress / threshold * 100, 100)}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-600 italic">
                Extracting vocal biomarkers... {Math.floor(analyzeProgress)}% complete
              </p>
            </motion.div>
          )}

          {/* Phase: Done */}
          {phase === 'done' && voiceProfile && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 w-full">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Voice Profile Created</h2>
                <p className="text-emerald-400 font-bold text-sm">Match Score: {voiceProfile.matchScore}%</p>
              </div>

              {/* Voice Profile Details */}
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Pitch</span>
                  <span className="text-sm text-white font-mono">{voiceProfile.pitch} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Rate</span>
                  <span className="text-sm text-white font-mono">{voiceProfile.rate}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Timbre</span>
                  <span className="text-sm text-indigo-400 font-bold">{voiceProfile.timbre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Biomarkers</span>
                  <span className="text-sm text-purple-400 font-bold">{voiceProfile.biomarkers} extracted</span>
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <span className="text-[9px] text-slate-600 font-bold uppercase block mb-1">Spectral Fingerprint</span>
                  <code className="text-[9px] text-slate-500 font-mono break-all">{voiceProfile.spectralFingerprint}</code>
                </div>
              </div>

              {/* Playback */}
              {audioUrl && (
                <div className="p-3 bg-slate-800/30 rounded-xl">
                  <p className="text-[9px] text-slate-500 font-bold uppercase mb-2">Your Voice Sample</p>
                  <audio controls src={audioUrl} className="w-full h-8" />
                </div>
              )}

              <button
                onClick={handleComplete}
                className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
              >
                <CheckCircle size={20} />
                Activate Voice Clone
              </button>

              <p className="text-[8px] text-slate-600 italic">
                "Your voice is now stored in our totally-not-evil neural database. Relatives won't know the difference."
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceRecorder;
