import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Briefcase, Mic, ShieldCheck, Sparkles, 
    ArrowRight, Globe, Zap, Cpu, Terminal 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="p-8 rounded-[2rem] bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-500/20 transition-colors" />
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
            <Icon className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white tracking-tight">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

export default function Home() {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500 selection:bg-indigo-500 selection:text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
                    <div className="lg:w-1/2 text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                        >
                            <Sparkles className="w-3 h-3" />
                            {t('Next-Gen Freelancing')}
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.85]"
                        >
                            {t('THE FUTURE')} <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic">
                                {t('OF WORK')}
                            </span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mb-12 font-medium leading-relaxed"
                        >
                            {t('BidBuddy revolutionizes the project lifecycle. From brief upload and')} <span className="text-indigo-600 dark:text-white font-black underline decoration-indigo-500 underline-offset-4">{t('AI RAG analysis')}</span> {t('to')} <span className="text-indigo-600 dark:text-white font-black">{t('Algorand Blockchain verification')}</span>. {t('Experience a transparent, intelligent marketplace.')}
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center gap-6"
                        >
                            <Link to="/marketplace" className="group relative px-8 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-all font-black text-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center gap-3 w-full sm:w-auto justify-center text-white">
                                {t('EXPLORE PROJECTS')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/dashboard" className="px-8 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all font-black text-lg w-full sm:w-auto justify-center flex text-slate-900 dark:text-white">
                                {t('DASHBOARD')}
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="lg:w-1/2 relative pr-12"
                    >
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
                        <img 
                            src="/hero-premium.png" 
                            alt="BidBuddy AI Hero" 
                            className="relative z-10 w-full rounded-[3rem] border border-slate-700 shadow-2xl shadow-indigo-500/20"
                        />
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard 
                        icon={Terminal} 
                        title="AI Project RAG" 
                        desc="Advanced retrieval-augmented generation over project briefs for instant, accurate insights." 
                        delay={0.1}
                    />
                    <FeatureCard 
                        icon={Mic} 
                        title="Voice Q&A" 
                        desc="Seamless multilingual voice conversations with Sparky, your AI project assistant." 
                        delay={0.2}
                    />
                    <Link to="/project-grader" className="block">
                        <FeatureCard 
                            icon={ShieldCheck} 
                            title="Chain Proof" 
                            desc="Real-time Algorand Testnet verification for every milestone and agreement phase." 
                            delay={0.3}
                        />
                    </Link>
                    <FeatureCard 
                        icon={Zap} 
                        title="Smart Escrow" 
                        desc="Secure, milestone-based payouts powered by transparent smart contract logic." 
                        delay={0.4}
                    />
                </div>

                {/* Tech Stack Bar */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-32 pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
                >
                    <div className="flex items-center gap-2 font-black text-xl text-slate-400 dark:text-slate-500"><Globe className="w-6 h-6" /> {t('GLOBAL')}</div>
                    <div className="flex items-center gap-2 font-black text-xl text-slate-400 dark:text-slate-500"><ShieldCheck className="w-6 h-6" /> {t('ALGORAND')}</div>
                    <div className="flex items-center gap-2 font-black text-xl text-slate-400 dark:text-slate-500"><Cpu className="w-6 h-6" /> {t('GEMINI AI')}</div>
                    <div className="flex items-center gap-2 font-black text-xl text-slate-400 dark:text-slate-500"><Zap className="w-6 h-6" /> {t('FASTNET')}</div>
                </motion.div>
            </main>
        </div>
    );
}
