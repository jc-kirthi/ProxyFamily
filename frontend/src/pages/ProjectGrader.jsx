import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { 
    Video, Shield, CheckCircle2, AlertCircle, BarChart3, 
    ArrowRight, ArrowLeft, RefreshCcw, Search, MapPin, 
    Terminal, Zap, Code, Layout, Cpu, Globe
} from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USER_ID = 'freelancer_67890';

// --- UTILITY: Dynamic Project Assessment Parameters ---
const getAssessmentParameters = (projectType) => { 
    return {
        title: 'Heuristic Assessment',
        fields: [
            { label: 'UI Polishedness', key: 'uiPolished', unit: '%', placeholder: 'Enter UI score %' },
            { label: 'UX Fluidity', key: 'uxFluid', unit: '%', placeholder: 'Enter UX score %' },
            { label: 'Feature Stability', key: 'stability', unit: '%', placeholder: 'Enter stability %' },
            { label: 'Code Cleanliness', key: 'cleanCode', unit: '/10', placeholder: 'Rate code 1–10' },
            { label: 'Complexity Score', key: 'complexity', unit: '%', placeholder: 'Enter complexity %' },
        ]
    };
};

const ProjectGrader = () => {
    const { t } = useTranslation();
    
    const [formData, setFormData] = useState({
        projectType: 'web_dev',
        expectedBudget: '',
        bidAmount: '',
        location: '',
        details: '',
        submissionType: 'primary',
        video: [], 
        assessment: {}, 
    });

    const [videoFile, setVideoFile] = useState(null); 
    const [currentStep, setCurrentStep] = useState(1);
    const [gradeResult, setGradeResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    const totalSteps = 6;
    const projectCategories = [
        'web_dev', 'mobile_app', 'ai_ml', 'blockchain', 'design', 'devops', 'marketing'
    ];
    
    const dynamicAudit = useMemo(() => getAssessmentParameters(formData.projectType), [formData.projectType]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('video/')) {
                setStatusMessage({ type: 'error', text: 'Please select a valid video demo.' });
                return;
            }
            setVideoFile(file);
            setFormData(prev => ({ ...prev, video: [file] }));
            setStatusMessage({ type: '', text: '' });
            setTimeout(() => setCurrentStep(2), 1000);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setStatusMessage({ type: 'info', text: 'Analyzing project demo frames...' });
        
        try {
            // Mocking the AI Grading process for demo purposes
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const result = {
                grade: 'Tier 1 (Elite)',
                confidence: 94.5,
                blockchain: { txId: '0x' + Math.random().toString(16).slice(2, 12), verified: true }
            };

            setGradeResult(result);
            setCurrentStep(6);
            setStatusMessage({ type: 'success', text: 'Project assessed and verified on blockchain!' });
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'AI Assessment failed. Please retry.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <div className="max-w-4xl mx-auto px-4">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between mb-4">
                        {[1, 2, 3, 4, 5, 6].map(step => (
                            <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                                {step}
                            </div>
                        ))}
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            className="h-full bg-indigo-600"
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {loading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6"
                        >
                            <div className="max-w-md w-full text-center">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    className="w-24 h-24 bg-indigo-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border-2 border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.3)]"
                                >
                                    <Cpu className="w-12 h-12 text-indigo-400" />
                                </motion.div>
                                <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">{t('AI NEURAL ANALYSIS')}</h3>
                                <p className="text-slate-400 font-medium mb-8">{t('Analyzing project demo frames and verifying on Algorand Blockchain...')}</p>
                                
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                                    <motion.div 
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, ease: "easeInOut" }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                                    />
                                </div>
                                <p className="mt-4 text-[10px] uppercase font-black tracking-widest text-indigo-500 animate-pulse">
                                    {t('Syncing with Testnet Node...')}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />
                    
                    {currentStep === 1 && (
                        <div className="text-center">
                            <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                <Video className="w-12 h-12 text-indigo-600" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">{t('AI PROJECT GRADER')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-12 text-lg font-medium">{t('Upload a video demo of your project. Our BERT-integrated AI will analyze frames to verify quality and tier.')}</p>
                            
                            <input 
                                type="file" 
                                accept="video/*" 
                                id="video-upload" 
                                className="hidden" 
                                onChange={handleVideoUpload}
                            />
                            <label 
                                htmlFor="video-upload"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl cursor-pointer transition-all shadow-xl hover:shadow-indigo-500/40"
                            >
                                <Zap className="w-6 h-6" />
                                {t('SELECT PROJECT DEMO')}
                            </label>
                            {videoFile && <p className="mt-4 text-emerald-500 font-bold">{t('Selected')}: {videoFile.name}</p>}
                        </div>
                    )}

                    {currentStep >= 2 && currentStep <= 5 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                    <Terminal className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter">{t('Project Metadata')}</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-500 ml-1">Category</label>
                                    <select 
                                        className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-indigo-500 transition-all font-bold"
                                        value={formData.projectType}
                                        onChange={(e) => handleInputChange('projectType', e.target.value)}
                                    >
                                        {projectCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat.replace('_', ' ').toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-500 ml-1">Target Budget (INR)</label>
                                    <input 
                                        type="number"
                                        placeholder="E.g. 50000"
                                        className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-indigo-500 transition-all font-bold"
                                        value={formData.expectedBudget}
                                        onChange={(e) => handleInputChange('expectedBudget', e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-500 ml-1">Project Details</label>
                                    <textarea 
                                        placeholder="Describe the stack, features, and key modules..."
                                        rows={4}
                                        className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-indigo-500 transition-all font-bold"
                                        value={formData.details}
                                        onChange={(e) => handleInputChange('details', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between pt-8">
                                <button onClick={() => setCurrentStep(prev => prev - 1)} className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold">
                                    <ArrowLeft className="w-5 h-5" /> BACK
                                </button>
                                {currentStep < 5 ? (
                                    <button onClick={() => setCurrentStep(prev => prev + 1)} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-500/20">
                                        NEXT <ArrowRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleSubmit} 
                                        disabled={loading}
                                        className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all font-black shadow-xl"
                                    >
                                        {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                        VERIFY & POST
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 6 && gradeResult && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">{t('ASSESSMENT COMPLETE')}</h2>
                            <p className="text-slate-500 mb-8">{t('AI analysis verified on Algorand Blockchain')}</p>
                            
                            <div className="grid md:grid-cols-2 gap-6 mb-12">
                                <div className="p-8 bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Assigned Tier</p>
                                    <p className="text-3xl font-black text-indigo-600">{gradeResult.grade}</p>
                                </div>
                                <div className="p-8 bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Quality Score</p>
                                    <p className="text-3xl font-black text-indigo-600">{gradeResult.confidence}%</p>
                                </div>
                            </div>

                            <div className="p-6 bg-indigo-500/5 rounded-2xl mb-8 flex flex-col items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-indigo-500" />
                                    <span className="text-xs font-bold text-indigo-600 font-mono truncate max-w-xs uppercase">Proof: {gradeResult.blockchain.txId}</span>
                                </div>
                                <a 
                                    href={`https://testnet.algoexplorer.io/tx/${gradeResult.blockchain.txId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 underline underline-offset-4 decoration-2"
                                >
                                    VIEW ON ALGOEXPLORER (TESTNET)
                                </a>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <button onClick={() => window.location.href = '/marketplace'} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl">
                                    VIEW IN MARKETPLACE
                                </button>
                                <button onClick={() => setCurrentStep(1)} className="px-10 py-4 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                    NEW ASSESSMENT
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>

                {statusMessage.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-8 p-4 rounded-xl flex items-center gap-3 border ${statusMessage.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'}`}
                    >
                        {statusMessage.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
                        <span className="font-bold text-sm tracking-tight">{statusMessage.text}</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProjectGrader;
