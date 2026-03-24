import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
    TrendingUp, BarChart3, PieChart as PieChartIcon, 
    Target, Zap, Clock, ShieldCheck, Briefcase
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const MOCK_PREDICTIONS = [
    { id: 1, category: 'Web Development', currentDemand: 'High', avgBudget: 45000, trend: '+12%', color: 'text-indigo-500' },
    { id: 2, category: 'UI/UX Design', currentDemand: 'Medium', avgBudget: 25000, trend: '+5%', color: 'text-purple-500' },
    { id: 3, category: 'Mobile Apps', currentDemand: 'Extreme', avgBudget: 85000, trend: '+24%', color: 'text-pink-500' },
];

const BudgetPrediction = () => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState(MOCK_PREDICTIONS[0]);

    const chartData = useMemo(() => {
        return Array.from({ length: 6 }, (_, i) => ({
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
            budget: selectedCategory.avgBudget + Math.random() * 10000 - 5000,
            demand: Math.random() * 100 + 50
        }));
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-12"
                >
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tighter">AI BUDGET FORECAST</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl">
                        Predict market trends, average budgets, and demand for specific project categories using our proprietary ML models.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Category Picker */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Market Segments</h2>
                        {MOCK_PREDICTIONS.map(p => (
                            <motion.div 
                                key={p.id}
                                whileHover={{ x: 5 }}
                                onClick={() => setSelectedCategory(p)}
                                className={`p-6 rounded-3xl cursor-pointer transition-all border-2 ${selectedCategory.id === p.id ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-500/20 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:border-indigo-500/50'}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-black text-lg">{p.category}</span>
                                    <TrendingUp className={`w-4 h-4 ${selectedCategory.id === p.id ? 'text-white' : p.color}`} />
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className={`text-2xl font-black ${selectedCategory.id === p.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>₹{p.avgBudget.toLocaleString()}</p>
                                    <span className={`text-xs font-bold ${selectedCategory.id === p.id ? 'text-indigo-200' : 'text-emerald-500'}`}>{p.trend} Growth</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right: Insights & Charts */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-black">{selectedCategory.category} Insights</h3>
                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">Demand Velocity: {selectedCategory.currentDemand}</p>
                                </div>
                                <div className="p-4 bg-indigo-500/10 rounded-2xl">
                                    <BarChart3 className="w-6 h-6 text-indigo-500" />
                                </div>
                            </div>

                            <div className="h-80 w-full mb-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            cursor={{ stroke: '#6366F1', strokeWidth: 2 }}
                                        />
                                        <Area type="monotone" dataKey="budget" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorBudget)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Market Saturation', value: '42%', icon: Target },
                                    { label: 'Risk Factor', value: 'Low', icon: ShieldCheck },
                                    { label: 'Growth Cap', value: '₹1.2M', icon: Zap },
                                    { label: 'Time to Award', value: '4 days', icon: Clock }
                                ].map(stat => (
                                    <div key={stat.label} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <stat.icon className="w-4 h-4 text-indigo-500 mb-2" />
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{stat.label}</p>
                                        <p className="text-lg font-black">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetPrediction;
