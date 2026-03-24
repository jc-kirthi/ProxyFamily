import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, MessageCircle, CheckCircle, Clock, Target, Shield, Briefcase, Award, Zap, Code, Layout } from 'lucide-react';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
    const { id } = useParams();
    
    const projectInfo = [
        { id: 1, title: 'Category', description: 'Full-stack Web Development', icon: Code },
        { id: 2, title: 'Post Date', description: 'Sep 22, 2024', icon: Calendar },
        { id: 3, title: 'Duration', description: '8-12 Weeks', icon: Clock },
        { id: 4, title: 'Budget Range', description: '₹45,000 - ₹60,000', icon: Zap },
    ];

    const contractTimeline = [
        {
            id: 1,
            date: 'Sep 25, 2024',
            author: 'Client Alex',
            type: 'milestone',
            content: 'Initial brief and design requirements finalized. Verification completed.'
        },
        {
            id: 2,
            date: 'Sep 20, 2024',
            author: 'BidBuddy AI',
            type: 'verification',
            content: 'Budget escrow verified. Blockchain anchor ID: 0x7a...bc92'
        },
        {
            id: 3,
            date: 'Sep 10, 2024',
            author: 'Client Alex',
            type: 'posted',
            content: 'Project listed on the marketplace. Looking for skilled React developers.'
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Software Development</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm">Project ID: {id || 'PRJ-1082'}</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4">E-commerce Scalability Redesign</h1>
                    <p className="text-slate-600 dark:text-slate-300 text-xl max-w-3xl leading-relaxed">
                        Seeking a senior developer to overhaul our current infrastructure for a multi-vendor marketplace.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Overview */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Mission Statement</h2>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-bold text-indigo-500 uppercase mb-3 tracking-widest">The Problem</h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                        Our current platform struggles with high traffic concurrent sessions. We need a robust architecture that can handle up to 50k active users without latency issues.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-emerald-500 uppercase mb-3 tracking-widest">Scope of Work</h3>
                                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
                                        <li>Refactor core API endpoints for better caching</li>
                                        <li>Implement real-time inventory updates via WebSockets</li>
                                        <li>Optimize database queries and indexing</li>
                                        <li>Set up CI/CD pipelines for staging and production</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-purple-500 uppercase mb-3 tracking-widest">Client Background</h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        FastMarket Inc. is a leading digital distributor in the APAC region. We prioritize clean code, test-driven development, and modular design.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Project Metrics */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {projectInfo.map((item) => (
                                <div key={item.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center gap-6 shadow-sm">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">{item.title}</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Verification & Contract History */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Chain of Custody & Verification</h2>
                            <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                                {contractTimeline.map((item) => (
                                    <div key={item.id} className="relative pl-12">
                                        <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-900 z-10" />
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <span className="text-slate-900 dark:text-white font-black">{item.author}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                                                item.type === 'verification' 
                                                    ? 'bg-emerald-500/10 text-emerald-600' 
                                                    : item.type === 'milestone' 
                                                    ? 'bg-amber-500/10 text-amber-600' 
                                                    : 'bg-indigo-500/10 text-indigo-600'
                                            }`}>
                                                {item.type}
                                            </span>
                                            <span className="text-slate-400 text-xs font-bold ml-auto">{item.date}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.content}</p>
                                        {item.anchorId && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Anchor:</span>
                                                <a 
                                                    href={`https://testnet.algoexplorer.io/tx/${item.anchorId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 truncate max-w-[150px] underline decoration-indigo-500/30"
                                                >
                                                    {item.anchorId}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Project Economics */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-slate-900/50 border-2 border-indigo-500 rounded-3xl p-8 shadow-xl"
                        >
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter leading-none">Economics</h3>
                            <div className="space-y-6">
                                <div className="text-center p-6 bg-indigo-500/5 rounded-2xl mb-4">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Target Budget</p>
                                    <p className="text-5xl font-black text-indigo-600 leading-none">₹55K</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-slate-500 uppercase tracking-wider">Complexity</span>
                                        <span className="text-slate-900 dark:text-white px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">HARD</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-slate-500 uppercase tracking-wider">Milestones</span>
                                        <span className="text-slate-900 dark:text-white underline">3 Stages</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-slate-500 uppercase tracking-wider">Status</span>
                                        <span className="text-emerald-500 animate-pulse">● ACCEPTING PROPOSALS</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Client Rating */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8"
                        >
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter leading-none">Client Trust</h3>
                            <div className="space-y-6">
                                {[
                                    { name: 'Alex Johnson', role: 'Head of Infra', rating: '5.0', icon: 'A' },
                                    { name: 'FastMarket Inc.', role: 'Enterprise Client', rating: '98% Success', icon: 'F' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-black leading-tight">{item.name}</p>
                                            <p className="text-indigo-500 text-[10px] font-bold uppercase tracking-widest">{item.role}</p>
                                        </div>
                                        <div className="ml-auto text-xs font-black text-emerald-500">{item.rating}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-4"
                        >
                            <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-3">
                                <MessageCircle className="w-6 h-6" />
                                SUBMIT PROPOSAL
                            </button>
                            <button className="w-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                                <Shield className="w-4 h-4" />
                                REQUEST AUDIT
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
