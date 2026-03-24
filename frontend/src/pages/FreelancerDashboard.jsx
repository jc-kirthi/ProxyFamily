import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import DocumentUpload from '../components/DocumentUpload';
import axios from 'axios';
import {
  Briefcase, DollarSign, Clock, Users, Star,
  FileText, Zap, TrendingUp, Search, Filter, Plus, MapPin,
  CheckCircle, AlertCircle, Activity, X, Brain, Shield, Upload,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDescription, setBidDescription] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock projects for now (will be replaced with API call in Phase 2)
  const mockProjects = [
    {
      _id: 'proj_1',
      title: 'E-commerce Website Redesign',
      description: 'Redesign our aging e-commerce platform with modern UI/UX. Need expertise in React and Tailwind CSS.',
      clientName: 'TechStartup Inc',
      skillsRequired: ['React', 'Tailwind CSS', 'UI/UX', 'MongoDB'],
      budgetMin: 5000,
      budgetMax: 15000,
      timeline: '8 weeks',
      status: 'published',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      applicants: 12,
      scope: 'Complete redesign of existing platform with new features'
    },
    {
      _id: 'proj_2',
      title: 'Mobile App Backend API',
      description: 'Build scalable REST API for a fintech mobile application. Must handle high transaction volume.',
      clientName: 'FinanceApp Ltd',
      skillsRequired: ['Node.js', 'Express', 'PostgreSQL', 'AWS'],
      budgetMin: 8000,
      budgetMax: 20000,
      timeline: '12 weeks',
      status: 'published',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      applicants: 8,
      scope: 'Production-grade API with authentication, payment processing, and analytics'
    },
    {
      _id: 'proj_3',
      title: 'Data Analytics Dashboard',
      description: 'Create an interactive dashboard for business intelligence and data visualization.',
      clientName: 'DataCorp Solutions',
      skillsRequired: ['Python', 'Pandas', 'Plotly', 'JavaScript'],
      budgetMin: 3000,
      budgetMax: 8000,
      timeline: '4 weeks',
      status: 'published',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      applicants: 15,
      scope: 'Real-time analytics with drill-down capabilities and automated reporting'
    },
    {
      _id: 'proj_4',
      title: 'Blockchain Integration',
      description: 'Integrate blockchain for supply chain tracking in our logistics platform.',
      clientName: 'LogisHub Global',
      skillsRequired: ['Solidity', 'Web3.js', 'Smart Contracts', 'Algorand'],
      budgetMin: 15000,
      budgetMax: 30000,
      timeline: '16 weeks',
      status: 'published',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      applicants: 5,
      scope: 'End-to-end blockchain solution with smart contracts and token economics'
    }
  ];

  // Load projects (will be API call in future)
  useEffect(() => {
    setProjects(mockProjects);
  }, []);

  const handleSubmitBid = () => {
    if (!bidAmount || !bidDescription) {
      toast.error('Please fill in all bid details');
      return;
    }
    
    if (isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newBid = {
        projectId: selectedProject._id,
        projectTitle: selectedProject.title,
        bidAmount: parseFloat(bidAmount),
        description: bidDescription,
        submittedAt: new Date(),
        status: 'pending'
      };

      setMyBids([...myBids, newBid]);
      toast.success('Bid submitted successfully!');
      setShowBidForm(false);
      setBidAmount('');
      setBidDescription('');
      setIsLoading(false);
    }, 1000);
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.skillsRequired.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500 overflow-hidden">
      {/* Premium Header */}
      <div className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              >
                <Zap className="w-3 h-3" />
                {t('DASHBOARD COMMAND')}
              </motion.div>
              <h1 className="text-5xl font-black tracking-tighter leading-none mb-2 text-slate-900 dark:text-white">
                {t('PROJECT')} <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic">{t('MARKETPLACE')}</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide">{t('Welcome back')}, {user?.name || 'Agent'}. {t('Your verified workspace is active.')}</p>
            </div>
            
            <div className="flex gap-4">
               <div className="text-right bg-white dark:bg-slate-900 shadow-xl dark:shadow-none p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('Session Identity')}</p>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white">
                     {user?.name?.charAt(0) || 'U'}
                   </div>
                   <div className="text-left">
                     <p className="text-sm font-black whitespace-nowrap text-slate-900 dark:text-white">{user?.name || t('freelancer')}</p>
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter underline">{t('Verified Professional')}</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar - Premium Grid */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('Active Projects'), value: projects.length, icon: Briefcase, color: 'indigo' },
            { label: t('My Bids'), value: myBids.length, icon: CheckCircle, color: 'purple' },
            { label: t('Total Value'), value: `₹${myBids.reduce((sum, bid) => sum + bid.bidAmount, 0).toLocaleString()}`, icon: TrendingUp, color: 'pink' },
            { label: t('Avg Bid'), value: `₹${myBids.length > 0 ? Math.round(myBids.reduce((sum, bid) => sum + bid.bidAmount, 0) / myBids.length).toLocaleString() : 0}`, icon: Activity, color: 'blue' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all group shadow-xl dark:shadow-none"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                <stat.icon className={`w-5 h-5 text-${stat.color}-500 opacity-50 group-hover:opacity-100 transition-opacity`} />
              </div>
              <p className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        {/* Tabs - Premium Pill Navigation */}
        <div className="flex gap-4 mb-12 p-1 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5 inline-flex shadow-xl dark:shadow-none">
          {[
            { id: 'projects', label: t('Marketplace'), count: filteredProjects.length, icon: Briefcase },
            { id: 'bids', label: t('My Proposals'), count: myBids.length, icon: FileText },
            { id: 'kb', label: t('Intelligence'), count: 'Pro', icon: Brain }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all ${
                activeTab === tab.id
                  ? 'text-white bg-indigo-600 shadow-lg shadow-indigo-500/40'
                  : 'text-slate-500 hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-800 text-indigo-400'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content: Available Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Search & Filter - Redesigned */}
            <div className="flex gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder={t('Search projects...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-[2rem] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-indigo-500/50 focus:ring-0 transition-all font-medium shadow-sm"
                />
              </div>
              <button className="px-8 py-5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-[2rem] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 transition-all flex items-center gap-3 font-bold uppercase text-xs tracking-widest shadow-sm">
                <Filter className="w-5 h-5" />
                {t('ADJUST FILTERS')}
              </button>
            </div>

            {/* Projects Grid - Premium Cards */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-24 glass rounded-[3rem] border border-white/5">
                <Briefcase className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
                <p className="text-slate-500 font-bold uppercase tracking-widest">No matching projects found in the network</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden shadow-xl dark:shadow-none"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32" />
                    
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                           <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                             {t('Tech Spec Verified')}
                           </span>
                           <span className="text-slate-500 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest">{t('Posted')} {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white mb-3 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6 max-w-3xl">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-xs font-black text-slate-500 uppercase tracking-tighter border-t border-slate-100 dark:border-white/5 pt-6">
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-500" />
                            {project.applicants} {t('Elite Applicants')}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-500" />
                            {project.timeline} {t('Horizon')}
                          </span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-black tracking-normal">
                             {t('Budget')}: ₹{project.budgetMin.toLocaleString()} — ₹{project.budgetMax.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="lg:w-72 w-full flex flex-col gap-6">
                         <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{t('Target Stack')}</p>
                            <div className="flex flex-wrap gap-2">
                              {project.skillsRequired.map((skill) => (
                                <span key={skill} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-[10px] font-black rounded-lg border border-indigo-500/20 tracking-wide">
                                  {skill}
                                </span>
                              ))}
                            </div>
                         </div>

                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setShowBidForm(true);
                          }}
                          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20"
                        >
                          {t('INITIALIZE PROPOSAL')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content: My Bids */}
        {activeTab === 'bids' && (
          <div>
            {myBids.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">You haven't submitted any bids yet</p>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                >
                  Browse Projects
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBids.map((bid) => (
                  <motion.div
                    key={`${bid.projectId}-${bid.submittedAt}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{bid.projectTitle}</h3>
                        <p className="text-gray-400 mb-4">{bid.description}</p>
                        <div className="flex items-center gap-6 text-sm">
                          <span className="text-purple-400 font-semibold">
                            Bid: ${bid.bidAmount.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            Submitted: {new Date(bid.submittedAt).toLocaleDateString()}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            bid.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {bid.status === 'pending' ? 'Pending Review' : 'Accepted'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content: Intelligence / Knowledge Base Tab */}
        {activeTab === 'kb' && (
          <div className="space-y-8 pb-12">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] -mr-48 -mt-48" />
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="flex-1">
                   <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">{t('Living Brief Engine')}</h2>
                   <p className="text-indigo-100 font-bold mb-6 text-lg max-w-2xl">
                     {t('Transform complex PDFs and Technical Specs into a searchable AI Knowledge Base. Freelancers can query these documents instantly to provide accurate, context-aware bids.')}
                   </p>
                   <div className="flex gap-4">
                      <div className="px-4 py-2 bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Brain className="w-4 h-4" /> {t('Neural RAG Enabled')}
                      </div>
                      <div className="px-4 py-2 bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-4 h-4" /> {t('Algorand Anchored')}
                      </div>
                   </div>
                 </div>
                 <div className="bg-white/10 p-6 rounded-3xl border border-white/20 text-center w-full md:w-64 backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">{t('Indexing Efficiency')}</p>
                    <p className="text-5xl font-black mb-2">99.8%</p>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                       <div className="h-full bg-white w-[99%]" />
                    </div>
                 </div>
               </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <div className="md:col-span-2 space-y-8">
                 <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl">
                   <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3">
                     <Upload className="w-6 h-6 text-indigo-500" />
                     {t('Upload Project Briefs')}
                   </h3>
                   <DocumentUpload projectId="demo-project" onDocumentsUpdated={() => toast.success('Brief Indexed Successfully')} />
                 </div>
               </div>

               <div className="space-y-6">
                 <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                   <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-indigo-400">{t('Why RAG Matters?')}</h4>
                   <ul className="space-y-6">
                     {[
                       { title: t('Contextual Accuracy'), desc: t('No more generic bids. Data-grounded proposals only.') },
                       { title: t('Blind-side Detection'), desc: t('AI identifies hidden technical risks in 50-page specs.') },
                       { title: t('Global Sync'), desc: t('One brief, searchable in any regional language.') }
                     ].map((item, i) => (
                       <li key={i} className="flex gap-4">
                         <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400 font-black text-[10px]">
                           {i + 1}
                         </div>
                         <div>
                           <p className="text-xs font-black uppercase tracking-tight mb-1">{item.title}</p>
                           <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                         </div>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Bid Form Modal - Premium Reveal */}
      {showBidForm && selectedProject && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass max-w-2xl w-full p-10 rounded-[3rem] border border-white/10 shadow-3xl relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
             
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Technical Engagement</p>
                <h2 className="text-4xl font-black text-white tracking-tighter leading-none">
                  PROPOSAL <br />
                  <span className="italic text-slate-500">INITIALIZATION</span>
                </h2>
              </div>
              <button 
                onClick={() => setShowBidForm(false)}
                className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="glass-light p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Project Target</p>
                  <p className="text-sm font-black text-white truncate">{selectedProject.title}</p>
                </div>
                <div className="glass-light p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Budget Horizon</p>
                  <p className="text-sm font-black text-indigo-400">₹{selectedProject.budgetMin.toLocaleString()} - ₹{selectedProject.budgetMax.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Your Financial Quote (₹)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-indigo-500">₹</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-6 py-5 bg-slate-900 border border-white/10 rounded-2xl text-2xl font-black text-white focus:border-indigo-500 transition-all placeholder-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Technical Approach & Vision</label>
                <textarea
                  value={bidDescription}
                  onChange={(e) => setBidDescription(e.target.value)}
                  placeholder="Draft your solution architecture, key deliverables, and professional credentials..."
                  rows="5"
                  className="w-full px-6 py-5 bg-slate-900 border border-white/10 rounded-2xl text-white font-medium focus:border-indigo-500 transition-all placeholder-slate-700 resize-none leading-relaxed"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmitBid}
                  disabled={isLoading}
                  className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/30"
                >
                  {isLoading ? 'ENCRYPTING & SENDING...' : 'TRANSMIT PROPOSAL'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
