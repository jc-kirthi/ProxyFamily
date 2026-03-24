import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Search, MapPin, Bell, Sun, Moon, Package, Truck, Phone, Navigation, 
    XCircle, DollarSign, Brain, Target as TargetIcon, Users as UsersIcon, 
    BarChart3, Shield, TrendingUp, Activity, Percent, ChevronsRight, 
    Layers, Zap, Crown, Trash2, Video, Terminal, Clock, Globe, Briefcase, 
    CheckCircle2, Info, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RAGChat from '../components/RAGChat';
import axios from 'axios';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';

const API_BASE_URL = 'http://localhost:5000/api';
const USER_ID = 'user_67890'; // Mock freelancer ID
const MIN_BID_RANGE = 500; // Minimum increment for bidding in INR
const MARKET_PRICE_ALERT_THRESHOLD = 0.8;

// --- Mock Data Generators ---
const generateMockHistory = (baseBudget, days = 30) => {
    const history = [];
    let budget = baseBudget * 0.95;
    for (let i = days; i >= 0; i--) {
        budget += (Math.random() - 0.5) * (baseBudget * 0.02);
        history.push({ 
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(), 
            budget: Math.round(budget) 
        });
    }
    return history;
};

const INITIAL_MOCK_PROJECTS = [
    {
        _id: 'mock_p1',
        projectTitle: 'E-commerce Mobile App',
        service: 'Web Development',
        budget: 45000,
        marketPrice: 50000,
        details: 'Full-stack React Native app with payment integration and real-time tracking.',
        location: 'Remote / Bangalore',
        complexity: 'Advanced',
        durationWeeks: 8,
        clientId: { name: 'Nexus Digital Systems' },
        status: 'open',
        videoUrl: null
    },
    {
        _id: 'mock_p2',
        projectTitle: 'UI/UX Redesign for Fintech',
        service: 'Design',
        budget: 15000,
        marketPrice: 18000,
        details: 'Complete overhaul of user dashboard and mobile presence for a leading fintech startup.',
        location: 'Remote / Mumbai',
        complexity: 'Intermediate',
        durationWeeks: 4,
        clientId: { name: 'FinFlow Inc.' },
        status: 'open',
        videoUrl: null
    }
];

const INITIAL_MOCK_BIDS = [
    { id: 'mb1', projectListingId: 'mock_p1', amount: 46000, userId: 'freelancer_001', time: new Date().toISOString() },
    { id: 'mb2', projectListingId: 'mock_p2', amount: 16000, userId: 'freelancer_002', time: new Date().toISOString() }
];

const INITIAL_MOCK_ORDERS = [
    {
        id: 'ORD-101',
        projectName: 'Landing Page SEO',
        clientName: 'BlueSky Enterprise',
        budget: 5000,
        totalAmount: 5500,
        status: 'in_transit', // Using in_transit for 'working'
        deliveryPerson: { name: 'Amit Kumar', phone: '+91 9876543210', vehicleNumber: 'KA-01-EF-1234', currentLocation: '2km from milestone 1' },
        estimatedDeliveryHours: 48,
        trackingUpdates: [
            { status: 'Contract Signed', time: '10:00 AM', icon: CheckCircle2 },
            { status: 'In Development', time: '02:00 PM', icon: Activity }
        ]
    }
];

// --- Helper Components ---

const getCurrentHighestBid = (projectId, allProjects, allBids) => {
    const projectBids = allBids.filter(b => b.projectListingId === projectId);
    if (projectBids.length === 0) {
        const project = allProjects.find(p => p._id === projectId);
        return project ? project.budget : 0;
    }
    return Math.max(...projectBids.map(b => b.amount));
};

const getMyCurrentBidStatus = (projectId, allBids) => {
    const projectBids = allBids.filter(b => b.projectListingId === projectId);
    if (projectBids.length === 0) return 'No Proposal';
    
    // Sort bids descending by amount
    const sortedBids = [...projectBids].sort((a, b) => b.amount - a.amount);
    if (sortedBids[0].userId === USER_ID) return 'Winning';
    
    const myBid = projectBids.find(b => b.userId === USER_ID);
    return myBid ? 'Outbid' : 'No Proposal';
};

const getTrendColor = (trend, isDarkMode) => {
    if (trend === 'Up') return isDarkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-700';
    return isDarkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-700';
};

// --- Sub-Components ---

const ProjectROIChart = ({ isDarkMode, t }) => {
    const data = [
        { name: 'Start', budget: 5000, prediction: 5000 },
        { name: 'Wk 1', budget: 5100, prediction: 5200 },
        { name: 'Wk 2', budget: 4900, prediction: 5400 },
        { name: 'Wk 3', budget: 5300, prediction: 5700 },
        { name: 'Wk 4', budget: 5500, prediction: 6100 },
    ];
    return (
        <div className="h-64 mt-4">
            <h4 className={`text-sm font-bold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('AI-Powered Budget vs. Value Forecast')}
            </h4>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} />
                    <YAxis stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                            borderColor: isDarkMode ? '#4F46E5' : '#6366F1'
                        }}
                    />
                    <Area type="monotone" dataKey="prediction" stroke="#6366f1" fillOpacity={1} fill="url(#colorBudget)" strokeWidth={3} />
                    <Line type="monotone" dataKey="budget" stroke="#F59E0B" strokeDasharray="5 5" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const SmartFeatureButton = ({ icon: Icon, title, mlInsight, isDarkMode, onClick }) => (
    <div 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-all border ${isDarkMode ? 'bg-gray-700 hover:bg-indigo-900 border-indigo-700/50' : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-300'}`} 
        title={mlInsight.primary.value.replace(/\*\*/g, '').replace(/\n/g, ' ')}
    >
        <Icon className={`w-5 h-5 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
        <span className={`text-xs font-semibold mt-1 text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{title.split(' ')[0]}</span>
    </div>
);

const BidCard = ({ bid, isDarkMode, allProjects, t }) => {
    const project = allProjects.find(c => c._id === bid.projectListingId);
    return (
        <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`${isDarkMode ? 'bg-slate-900 border-indigo-800' : 'bg-white border-indigo-200'} border p-4 rounded-xl shadow-md flex justify-between items-center transition-all`}>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{bid.amount.toLocaleString()}
                    </p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${bid.userId === USER_ID ? 'bg-yellow-500 text-black' : (isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700')}`}>
                        {bid.userId === USER_ID ? t('Your Bid') : `${t('Elite')} ${bid.userId.slice(-3)}`}
                    </span>
                </div>
                <p className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{project?.projectTitle || t('Unknown Project')}</p>
            </div>
            
            <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-indigo-500 mb-0.5">
                    <Brain className="w-3 h-3" />
                    <span className="text-xs font-black">{bid.comprehensionScore || 92}%</span>
                </div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{t('AI Comprehension verified')}</p>
            </div>
        </motion.div>
    );
};

const ProjectsMarketplace = () => {
    const { t } = useTranslation();
    const [allProjects, setAllProjects] = useState(INITIAL_MOCK_PROJECTS);
    const [allBids, setAllBids] = useState(INITIAL_MOCK_BIDS);
    const [selectedProjectId, setSelectedProjectId] = useState(INITIAL_MOCK_PROJECTS[0]._id);
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [bidQuantity, setBidQuantity] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [userAddress, setUserAddress] = useState(localStorage.getItem('freelancerAddress') || '');
    const [newAddress, setNewAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('milestone_escrow');
    const [activeMLView, setActiveMLView] = useState('roi');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [myOrders, setMyOrders] = useState(INITIAL_MOCK_ORDERS);
    const [showOrdersView, setShowOrdersView] = useState(false);
    const [showRAGChat, setShowRAGChat] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const themeClasses = useMemo(() => ({
        bg: isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900',
        cardBg: isDarkMode ? 'bg-slate-900/50 backdrop-blur-md border border-slate-700/50' : 'bg-white shadow-xl border border-slate-200',
        inputBg: isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-900',
        border: isDarkMode ? 'border-slate-800' : 'border-slate-200',
        highlightBg: isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50',
        textColor: isDarkMode ? 'text-slate-100' : 'text-slate-900',
        subTextColor: isDarkMode ? 'text-slate-400' : 'text-slate-600',
        btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    }), [isDarkMode]);

    const selectedProject = useMemo(() => allProjects.find(p => p._id === selectedProjectId), [allProjects, selectedProjectId]);

    const filteredProjects = useMemo(() => {
        let result = allProjects;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => p.projectTitle?.toLowerCase().includes(query) || p.details?.toLowerCase().includes(query));
        }
        if (filter === 'ACTIVE_BIDS') {
            const projectIdsWithMyBids = new Set(allBids.filter(b => b.userId === USER_ID).map(b => b.projectListingId));
            result = result.filter(p => projectIdsWithMyBids.has(p._id));
        } else if (filter === 'MY_WINNING_BIDS') {
            result = result.filter(p => getMyCurrentBidStatus(p._id, allBids) === 'Winning');
        }
        return result;
    }, [allProjects, allBids, searchQuery, filter]);

    const winningBidsCount = useMemo(() => allProjects.filter(p => getMyCurrentBidStatus(p._id, allBids) === 'Winning').length, [allProjects, allBids]);

    const handlePlaceBid = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedProject) return;
        if (!userAddress) {
            setShowAddressModal(true);
            return;
        }

        const bid = parseFloat(bidAmount);
        const currentHighest = getCurrentHighestBid(selectedProject._id, allProjects, allBids);
        const minBid = currentHighest + MIN_BID_RANGE;

        if (Number.isNaN(bid) || bid < minBid) {
            setNotifications(prev => [...prev, { message: t('Proposal must be at least ₹{{min}}', { min: minBid.toLocaleString() }), type: 'error' }]);
            return;
        }

        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            const newBid = { 
                id: `b${allBids.length + 1}`, 
                projectListingId: selectedProject._id, 
                amount: bid, 
                userId: USER_ID, 
                time: new Date().toISOString() 
            };
            setAllBids(prev => [...prev, newBid]);
            setNotifications(prev => [...prev, { message: t('Proposal submitted successfully! Secured on Blockchain.'), type: 'success' }]);
            setBidAmount((bid + MIN_BID_RANGE).toString());
        } catch (error) {
            setNotifications(prev => [...prev, { message: t('Failed to submit proposal.'), type: 'error' }]);
        }
    }, [selectedProject, bidAmount, userAddress, allBids, allProjects, t]);

    const handleSaveAddress = () => {
        if (!newAddress.trim()) return;
        localStorage.setItem('freelancerAddress', newAddress);
        setUserAddress(newAddress);
        setShowAddressModal(false);
        setNotifications(prev => [...prev, { message: t('Profile updated! Ready to bid.'), type: 'success' }]);
    };

    const mlFeatures = useMemo(() => {
        if (!selectedProject) return [];
        const currentHighest = getCurrentHighestBid(selectedProject._id, allProjects, allBids);
        return [
            { 
                icon: Brain, 
                title: t('Project Valuation'), 
                mlInsight: { primary: { label: t('Est. Value'), value: t('AI predicts project value to reach **₹{{val}}**', { val: (selectedProject.marketPrice * 1.15).toLocaleString() }) } },
                view: 'roi'
            },
            { 
                icon: TargetIcon, 
                title: t('Win Probability'), 
                mlInsight: { primary: { label: t('Win Chance'), value: t('High probability of winning with current bid strategy.') } },
                view: 'roi'
            },
            { 
                icon: Activity, 
                title: t('Market Trends'), 
                mlInsight: { primary: { label: t('Trend'), value: t('Increasing demand for {{service}} projects.', { service: selectedProject.service }) } },
                view: 'roi'
            },
            { 
                icon: Shield, 
                title: t('Client Trust'), 
                mlInsight: { primary: { label: t('Security'), value: t('Client has 100% payment verification history.') } },
                view: 'roi'
            }
        ];
    }, [selectedProject, allProjects, allBids, t]);

    useEffect(() => {
        if (selectedProject) {
            const currentHighest = getCurrentHighestBid(selectedProject._id, allProjects, allBids);
            setBidAmount((currentHighest + MIN_BID_RANGE).toString());
        }
    }, [selectedProjectId, allProjects, allBids, selectedProject]);

    return (
        <div className={`min-h-screen pt-20 ${themeClasses.bg} transition-colors duration-300`}>
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
                            {t('BIDBUDDY MARKETPLACE')}
                        </h1>
                        <p className={themeClasses.subTextColor}>{t('Premium Freelance Project Exchange')}</p>
                    </motion.div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder={t('Search projects...')} 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`pl-10 pr-4 py-2 rounded-full text-sm ${themeClasses.inputBg} focus:ring-2 ring-indigo-500 outline-none w-64 transition-all`}
                            />
                        </div>
                        <button onClick={() => setShowOrdersView(!showOrdersView)} className={`p-2 rounded-full ${themeClasses.cardBg} hover:scale-110 transition-transform relative`}>
                            <Briefcase className="w-5 h-5 text-indigo-500" />
                            {myOrders.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{myOrders.length}</span>}
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: t('Open Projects'), value: allProjects.length, icon: Layers, color: 'text-indigo-500', id: 'ALL' },
                        { label: t('My Proposals'), value: allBids.filter(b => b.userId === USER_ID).length, icon: Zap, color: 'text-blue-500', id: 'ACTIVE_BIDS' },
                        { label: t('Awarded'), value: winningBidsCount, icon: Crown, color: 'text-yellow-500', id: 'MY_WINNING_BIDS' },
                        { label: t('Escrow Balance'), value: '₹1.2L', icon: DollarSign, color: 'text-green-500', id: null }
                    ].map(stat => (
                        <motion.div 
                            key={stat.label}
                            whileHover={{ y: -5 }}
                            onClick={() => stat.id && setFilter(stat.id)}
                            className={`${themeClasses.cardBg} p-6 rounded-2xl cursor-pointer ${filter === stat.id ? 'ring-2 ring-indigo-500' : ''}`}
                        >
                            <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-black">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column: List */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                {t('Market Feed')}
                            </h2>
                            <span className="text-xs bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-full font-bold">{t('LIVE')}</span>
                        </div>
                        
                        <div className="space-y-4 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
                            {isLoading ? (
                                // Skeleton Loaders
                                [1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`${themeClasses.cardBg} p-5 rounded-2xl animate-pulse`}>
                                        <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-4" />
                                        <div className="flex justify-between items-end">
                                            <div className="w-1/2">
                                                <div className="h-8 bg-indigo-500/20 rounded w-full mb-2" />
                                                <div className="h-3 bg-slate-700/50 rounded w-1/2" />
                                            </div>
                                            <div className="w-1/4 h-8 bg-slate-700/50 rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : filteredProjects.map(project => {
                                const highest = getCurrentHighestBid(project._id, allProjects, allBids);
                                const status = getMyCurrentBidStatus(project._id, allBids);
                                return (
                                    <motion.div 
                                        key={project._id}
                                        layout
                                        onClick={() => setSelectedProjectId(project._id)}
                                        className={`${themeClasses.cardBg} p-5 rounded-2xl cursor-pointer transition-all border-l-4 ${selectedProjectId === project._id ? 'border-indigo-500 bg-indigo-500/5' : 'border-transparent hover:border-indigo-500/50'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg truncate w-40">{project.projectTitle}</h3>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${status === 'Winning' ? 'bg-yellow-500/20 text-yellow-500' : status === 'Outbid' ? 'bg-red-500/20 text-red-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                                {status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-2xl font-black text-indigo-500">₹{highest.toLocaleString()}</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold">{project.service}</p>
                                            </div>
                                            <div className="text-right text-[10px] text-slate-500 font-bold">
                                                <div className="flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {project.durationWeeks} Weeks</div>
                                                <div className="flex items-center gap-1 justify-end"><Terminal className="w-3 h-3" /> {project.complexity}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Detail & Bidding */}
                    <div className="lg:col-span-2 space-y-8">
                        {selectedProject ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                {/* Project Details Card */}
                                <div className={`${themeClasses.cardBg} p-8 rounded-3xl relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1 rounded-full text-indigo-500 text-[10px] font-black ring-1 ring-indigo-500/20 uppercase tracking-widest">
                                            <Shield className="w-3 h-3" /> {t('ALGORAND VERIFIED CONTRACT')}
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-4xl font-black mb-2">{selectedProject.projectTitle}</h2>
                                    <div className="flex gap-4 mb-6">
                                        <span className="flex items-center gap-1 text-xs font-bold text-slate-500"><MapPin className="w-3 h-3" /> {selectedProject.location}</span>
                                        <span className="flex items-center gap-1 text-xs font-bold text-slate-500"><Globe className="w-3 h-3" /> {selectedProject.clientId.name}</span>
                                        <a 
                                            href="https://lora.algokit.io/testnet/application/756282697" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-[10px] font-black text-indigo-400 hover:text-indigo-300 ml-auto group"
                                        >
                                            <Shield className="w-3 h-3 group-hover:animate-pulse" /> {t('VIEW IMMUTABLE PROOF')}
                                        </a>
                                    </div>
                                    
                                    <p className={`${themeClasses.subTextColor} text-lg leading-relaxed mb-8`}>
                                        {selectedProject.details}
                                    </p>

                                    {/* AI Features Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {mlFeatures.map(feat => (
                                            <div key={feat.title} className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} border border-transparent hover:border-indigo-500/30 transition-all`}>
                                                <feat.icon className="w-5 h-5 text-indigo-500 mb-2" />
                                                <p className="text-[10px] uppercase font-black text-slate-500 truncate">{feat.title}</p>
                                                <p className="text-[10px] font-bold leading-tight mt-1">{feat.mlInsight.primary.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bidding Arena & Knowledge Base Grid */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Column 1: Bidding Arena */}
                                    <div className={`${themeClasses.cardBg} p-8 rounded-3xl border-2 border-indigo-500/20 flex flex-col`}>
                                        <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tighter">
                                            <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                                            {t('Bidding Arena')}
                                        </h3>
                                        
                                        <div className="mb-8 p-6 rounded-2xl bg-indigo-500/5 text-center">
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t('Target Budget')}</p>
                                            <p className="text-5xl font-black text-indigo-500">₹{getCurrentHighestBid(selectedProject._id, allProjects, allBids).toLocaleString()}</p>
                                        </div>

                                        <form onSubmit={handlePlaceBid} className="space-y-6 flex-1">
                                            <div>
                                                <label className="text-xs font-black uppercase text-slate-500 mb-2 block">{t('Your Proposal (INR)')}</label>
                                                <input 
                                                    type="number" 
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    className={`w-full p-4 rounded-xl text-2xl font-black text-center ${themeClasses.inputBg} focus:ring-4 ring-indigo-500/20 transition-all`}
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                            <button 
                                                data-automation="transmit-proposal"
                                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl mt-auto"
                                            >
                                                {t('EXECUTE PROPOSAL')}
                                                <ChevronsRight className="w-6 h-6" />
                                            </button>
                                            <p className="text-[10px] text-center text-slate-500 font-bold px-4">
                                                {t('By submitting, you agree to the smart contract terms and milestone-based escrow payouts.')}
                                            </p>
                                        </form>
                                    </div>

                                    {/* Column 2: Living Knowledge Base (RAG) */}
                                    <div className={`${themeClasses.cardBg} p-8 rounded-3xl border-2 border-purple-500/20 flex flex-col`}>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter">
                                                <Brain className="w-5 h-5 text-purple-500" />
                                                {t('Knowledge AI')}
                                            </h3>
                                            <div className="px-3 py-1 bg-purple-500/10 rounded-full text-[10px] font-black text-purple-500 uppercase tracking-widest ring-1 ring-purple-500/20">
                                                {t('RAG Enabled')}
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-500 mb-6 font-bold leading-relaxed">
                                            {t('Query the 15-page project technical spec instantly. Our AI is grounded in the project documents anchored on Algorand.')}
                                        </p>

                                        <div 
                                            data-automation="kb-container"
                                            className="flex-1 min-h-[400px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                                        >
                                            <RAGChat projectId={selectedProject._id} projectDocuments={['Technical_Spec.pdf']} />
                                        </div>

                                        <div className="mt-4 flex items-center gap-2">
                                            <Shield className="w-3 h-3 text-indigo-500" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('Document Hash Verified: 0x8f2...')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button 
                                        data-automation="init-bid"
                                        onClick={() => {
                                            const input = document.querySelector('input[type="number"]');
                                            if (input) {
                                                input.focus();
                                                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }
                                        }}
                                        className="w-full py-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-lg uppercase tracking-[0.3em] hover:scale-[1.01] transition-all shadow-2xl flex items-center justify-center gap-4 group"
                                    >
                                        <Sparkles className="w-6 h-6 text-indigo-500 group-hover:animate-spin" />
                                        {t('GENERATE CONTEXT-AWARE BID')}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                                <Package className="w-20 h-20 mb-4 text-indigo-500" />
                                <h3 className="text-2xl font-black mb-2">{t('Select a project')}</h3>
                                <p className="max-w-xs">{t('Choose an active project from the feed to view details and submit your proposal.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="fixed bottom-6 right-6 space-y-3 z-[100]">
                <AnimatePresence>
                    {notifications.map((n, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border ${n.type === 'success' ? 'bg-indigo-500/90 border-indigo-400 text-white' : 'bg-red-500/90 border-red-400 text-white'}`}
                        >
                            {n.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                            <span className="font-bold text-sm tracking-tight">{n.message}</span>
                            <button onClick={() => setNotifications(prev => prev.filter((_, idx) => idx !== i))} className="ml-2 hover:opacity-50">
                                <XCircle className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Address Modal */}
            <AnimatePresence>
                {showAddressModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            onClick={() => setShowAddressModal(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className={`${themeClasses.cardBg} w-full max-w-md p-10 rounded-[2.5rem] relative z-20 border-2 border-indigo-500/30`}
                        >
                            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">{t('Finalize Profile')}</h3>
                            <p className={`${themeClasses.subTextColor} text-sm font-bold mb-8 leading-relaxed`}>
                                {t('We need your business address to generate secure legal smart contracts for project milestones.')}
                            </p>
                            <textarea 
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                className={`w-full p-4 rounded-2xl ${themeClasses.inputBg} mb-6 focus:ring-4 ring-indigo-500/20 outline-none transition-all font-bold`}
                                placeholder={t('Enter office or billing address...')}
                                rows={3}
                            />
                            <button 
                                onClick={handleSaveAddress}
                                className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1"
                            >
                                {t('SAVE & START BIDDING')}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Styles for Scrollbar */}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }
            `}} />
        </div>
    );
};

export default ProjectsMarketplace;
