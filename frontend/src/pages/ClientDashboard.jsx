import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Shield, 
  Brain, 
  Search, 
  Filter, 
  ChevronRight, 
  Zap, 
  Activity, 
  Clock, 
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Globe,
  Layout,
  Briefcase,
  Users,
  BarChart3,
  Download,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Star,
  Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import DocumentUpload from '../components/DocumentUpload';

export default function ClientDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [anchorProgress, setAnchorProgress] = useState(0);
  const [selectedProjectForApps, setSelectedProjectForApps] = useState(null);

  // Mock data for projects
  const [projects, setProjects] = useState([
    {
      id: '1',
      title: 'E-commerce Mobile App',
      status: 'Active',
      bids: 12,
      briefStatus: 'Synced',
      blockchainId: '756282697',
      budget: '₹5,00,000 - ₹8,00,000',
      postedAt: '2024-03-10'
    },
    {
      id: '2',
      title: 'AI Sentiment Tracker',
      status: 'Indexing',
      bids: 0,
      briefStatus: 'Processing',
      blockchainId: 'Pending',
      budget: '₹2,50,000 - ₹4,00,000',
      postedAt: '2024-03-12'
    }
  ]);

  const handleCreateProject = () => {
    setIsAnchoring(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setAnchorProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsAnchoring(false);
        setShowCreateModal(false);
        toast.success(t('Project Anchored on Algorand!'));
        setProjects([
          {
            id: Date.now().toString(),
            title: 'New AI Venture Brief',
            status: 'Active',
            bids: 0,
            briefStatus: 'Synced',
            blockchainId: '756282697',
            budget: '₹10,00,000',
            postedAt: new Date().toISOString().split('T')[0]
          },
          ...projects
        ]);
      }
    }, 300);
  };

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
                <Shield className="w-3 h-3" />
                {t('CLIENT IDENTITY VERIFIED')}
              </motion.div>
              <h1 className="text-5xl font-black tracking-tighter leading-none mb-2 text-slate-900 dark:text-white">
                {t('CLIENT')} <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic">{t('ECOSYSTEM')}</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide">
                {t('Managing project briefs and blockchain-anchored knowledge bases.')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] active:scale-95"
              >
                <Plus className="w-5 h-5" />
                {t('Anchor New Project')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 mb-12 border-b border-slate-200 dark:border-white/5 pb-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'projects', label: t('Active Briefs'), icon: Layout },
            { id: 'insights', label: t('Brief Intelligence'), icon: BarChart3 },
            { id: 'network', label: t('Applicant Pool'), icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 px-2 relative transition-all ${
                activeTab === tab.id ? 'text-indigo-500 font-black' : 'text-slate-400 font-bold'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest whitespace-nowrap">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabClient" 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Projects Feed */}
          <div className="lg:col-span-2 space-y-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-xl hover:shadow-2xl overflow-hidden"
              >
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                            project.briefStatus === 'Synced' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {project.briefStatus}
                          </span>
                          <a 
                            href={project.blockchainId === 'Pending' ? '#' : `https://lora.algokit.io/testnet/application/${project.blockchainId}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`font-black text-[10px] tracking-tighter flex items-center gap-1 group ${project.blockchainId === 'Pending' ? 'text-slate-500 cursor-not-allowed' : 'text-indigo-400 hover:text-indigo-300 underline'}`}
                          >
                            <Shield className={`w-3 h-3 ${project.blockchainId !== 'Pending' && 'group-hover:animate-pulse'}`} />
                            ID: {project.blockchainId}
                          </a>
                       </div>
                       <h3 className="text-2xl font-black tracking-tight">{project.title}</h3>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all">
                          <Download className="w-4 h-4" />
                       </button>
                       <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('Total Applicants')}</p>
                       <p className="text-xl font-black text-indigo-500">{project.bids}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('Budget Range')}</p>
                       <p className="text-xs font-black truncate">{project.budget}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('Living Brief Status')}</p>
                       <div className="flex items-center gap-2">
                          <Brain className="w-3 h-3 text-purple-400" />
                          <p className="text-[10px] font-black text-purple-400 uppercase">{t('RAG Ready')}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                    <div className="flex -space-x-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-900 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=agent${i+idx}`} alt="applicant" />
                         </div>
                       ))}
                       <div className="w-10 h-10 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                         +8
                       </div>
                    </div>
                     <button 
                        onClick={() => setSelectedProjectForApps(project)}
                        className="flex items-center gap-2 text-xs font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors"
                     >
                        {t('View Applications')} <ChevronRight className="w-4 h-4" />
                     </button>
                 </div>
              </motion.div>
            ))}
          </div>

          {/* Side Panels */}
          <div className="space-y-8">
            {/* Blockchain Stats Card */}
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] -mr-32 -mt-32" />
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">{t('Trust Horizon')}</p>
                  <h4 className="text-3xl font-black tracking-tighter leading-none mb-6">BLOCKCHAIN <br/><span className="text-slate-500 italic">VERIFICATION</span></h4>
                  
                  <div className="space-y-6">
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{t('Total Anchored Assets')}</p>
                           <p className="text-3xl font-black">24</p>
                        </div>
                        <Activity className="w-8 h-8 text-indigo-500 animate-pulse" />
                     </div>
                     <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                        />
                     </div>
                     <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                        <div>
                           <p className="text-[10px] font-black text-white uppercase">{t('Real-time Node Status')}</p>
                           <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{t('Algorand Testnet Active')}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Knowledge Base Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <Brain className="w-12 h-12 text-white/30 absolute top-10 right-10" />
               <h4 className="text-sm font-black uppercase tracking-widest mb-4">Living Brief RAG</h4>
               <p className="text-sm font-bold text-indigo-100 mb-8 leading-relaxed">
                 {t('Your project documents are instantly searchable by freelancers. This reduces scope creep by 84%.')}
               </p>
               <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                 <LinkIcon className="w-4 h-4" /> {t('Manage Knowledge Base')}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
              onClick={() => !isAnchoring && setShowCreateModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-slate-900 w-full max-w-2xl p-12 rounded-[4rem] relative z-[110] border-2 border-white/5 shadow-[0_0_80px_rgba(79,70,229,0.3)] overflow-hidden"
            >
              {isAnchoring ? (
                <div className="py-20 text-center space-y-8">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" className="stroke-slate-800 fill-none" strokeWidth="8" />
                      <motion.circle 
                        cx="64" cy="64" r="60" 
                        className="stroke-indigo-500 fill-none" 
                        strokeWidth="8" 
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * anchorProgress) / 100}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white">
                      {anchorProgress}%
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{t('Anchoring Brief')}</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{t('Creating SHA-256 Hash & Syncing with Algorand')}</p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">{t('Market Entry Initiation')}</p>
                      <h3 className="text-5xl font-black text-white tracking-tighter leading-none">CREATE <br/><span className="text-slate-500 italic">PROJECT BRIEF</span></h3>
                    </div>
                    <button onClick={() => setShowCreateModal(false)} className="p-4 bg-slate-800 rounded-3xl text-slate-400 hover:text-white transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 block">{t('Project Title')}</label>
                      <input 
                        type="text" 
                        className="w-full p-6 bg-slate-950 border-2 border-white/5 rounded-3xl text-white font-bold focus:border-indigo-500 outline-none transition-all"
                        placeholder="e.g., Enterprise Kubernetes Strategy"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 block">{t('Budget Range')}</label>
                          <select className="w-full p-6 bg-slate-950 border-2 border-white/5 rounded-3xl text-white font-bold focus:border-indigo-500 outline-none transition-all">
                             <option>₹1L - ₹5L</option>
                             <option>₹5L - ₹10L</option>
                             <option>₹10L+</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 block">{t('Timeline')}</label>
                          <select className="w-full p-6 bg-slate-950 border-2 border-white/5 rounded-3xl text-white font-bold focus:border-indigo-500 outline-none transition-all">
                             <option>1 Month</option>
                             <option>3 Months</option>
                             <option>6+ Months</option>
                          </select>
                       </div>
                    </div>

                    <div className="bg-slate-950 rounded-[2rem] border-2 border-indigo-500/20 overflow-hidden shadow-[0_0_40px_-10px_rgba(79,70,229,0.15)]">
                       <div className="text-center p-8 bg-gradient-to-b from-indigo-500/10 to-transparent border-b border-white/5">
                          <Brain className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                          <h4 className="text-lg font-black text-white uppercase tracking-[0.2em]">{t('Intelligence Input')}</h4>
                          <p className="text-[10px] text-indigo-300/70 font-bold mt-2 uppercase tracking-widest">{t('Upload your Technical Specs, Scope of Work, or PDFs')}</p>
                       </div>
                       <div className="p-8">
                          <DocumentUpload projectId="new-project" onDocumentsUpdated={() => toast.success('Brief Uploaded!')} />
                       </div>
                    </div>

                    <button 
                      onClick={handleCreateProject}
                      className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-3xl group"
                    >
                      {t('Anchor Brief to Blockchain')}
                      <Zap className="w-5 h-5 group-hover:fill-current" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Screening Applications Modal */}
      <AnimatePresence>
        {selectedProjectForApps && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
              onClick={() => setSelectedProjectForApps(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 w-full max-w-4xl p-8 rounded-[3rem] relative z-[110] border-2 border-indigo-500/20 shadow-[0_0_80px_rgba(79,70,229,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{t('AI Smart Screening')}</p>
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter">APPLICANT <span className="text-slate-500 italic">POOL</span></h3>
                  <p className="text-sm font-bold text-slate-400 mt-1">{t('For')}: {selectedProjectForApps.title}</p>
                </div>
                <button onClick={() => setSelectedProjectForApps(null)} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar pr-4 space-y-4 flex-1">
                {[
                  { name: "Arjun Mehta", match: 98, trust: 99, rate: "₹15,000", skills: ["React", "Node.js", "AWS"], time: "2h ago" },
                  { name: "Sarah Chen", match: 94, trust: 95, rate: "₹20,000", skills: ["Next.js", "Python", "GraphQL"], time: "5h ago" },
                  { name: "Rahul Verma", match: 88, trust: 92, rate: "₹12,000", skills: ["React", "Firebase"], time: "1d ago" },
                  { name: "Priya Sharma", match: 76, trust: 85, rate: "₹10,000", skills: ["Vue", "Express"], time: "2d ago" }
                ].map((applicant, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-6 p-6 bg-slate-950 border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-indigo-500/20 overflow-hidden relative">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.name}`} alt={applicant.name} />
                        {i === 0 && <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-slate-950"><Star className="w-2 h-2 text-white fill-current" /></div>}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white">{applicant.name}</h4>
                        <p className="text-xs font-bold text-slate-500">{applicant.time}</p>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center mt-4 md:mt-0">
                      <div className="text-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                        <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">{t('AI Match')}</p>
                        <p className="text-2xl font-black text-white">{applicant.match}%</p>
                      </div>
                      <div className="text-center p-3 rounded-2xl bg-green-500/10 border border-green-500/20">
                        <p className="text-[10px] font-black uppercase text-green-400 tracking-widest mb-1">{t('Trust Score')}</p>
                        <p className="text-2xl font-black text-white">{applicant.trust}%</p>
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex flex-wrap gap-2">
                          {applicant.skills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">{skill}</span>
                          ))}
                        </div>
                        <p className="text-sm font-bold text-slate-400 mt-3">{t('Bid')}: <span className="text-white">{applicant.rate}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-500/20 w-full md:w-auto">
                        {t('Hire')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
}
