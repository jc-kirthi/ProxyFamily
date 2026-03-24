import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, Globe, Bell, User, Zap, Activity, Database, 
  Settings, LogOut, Menu, X, Cpu, Wifi, Laptop, Search, ChevronDown
} from 'lucide-react';
import { useDeflection } from '../../context/DeflectionContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const Header = ({ isDark }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { sareeMode } = useDeflection();
  
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const languages = [
    { id: 'en', label: 'English', code: 'EN' },
    { id: 'kn', label: 'ಕನ್ನಡ', code: 'KN' },
    { id: 'hi', label: 'हिन्दी', code: 'HI' },
    { id: 'ta', label: 'தமிழ்', code: 'TA' },
    { id: 'te', label: 'తెలుగు', code: 'TE' },
    { id: 'mr', label: 'मराठी', code: 'MR' },
    { id: 'bn', label: 'বাংলা', code: 'BN' },
    { id: 'ml', label: 'മലയാളം', code: 'ML' },
    { id: 'gu', label: 'ગુજરાતી', code: 'GU' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[90] p-6 pointer-events-none">
      <nav className={`max-w-6xl mx-auto h-16 pointer-events-auto rounded-full border px-8 flex items-center justify-between transition-all duration-500 shadow-xl backdrop-blur-md ${
        sareeMode 
          ? 'bg-white/80 border-orange-100 shadow-orange-500/5' 
          : 'bg-slate-900/60 border-slate-800/50 shadow-indigo-500/10'
      }`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            sareeMode ? 'bg-orange-600' : 'bg-indigo-600 shadow-lg shadow-indigo-500/20'
          }`}>
            <Shield size={20} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className={`text-sm font-black uppercase tracking-tight ${
              sareeMode ? 'text-slate-900' : 'text-white'
            }`}>
              {t('Proxy Family')}
            </h1>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                    {t('NEURAL_LINK_STABLE')}
                  </span>
               </div>
               <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
                  <span className="text-[7px] font-bold text-indigo-500 uppercase tracking-widest">
                    BLK: 42,912
                  </span>
               </div>
            </div>
          </div>
        </Link>

        {/* Minimal Navigation */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/10 border border-slate-800/5">
           <NavLink to="/" active={activeTab === '/' || activeTab === '/dashboard'} sareeMode={sareeMode}>{t('Deflect')}</NavLink>
           <NavLink to="/nft-gallery" active={activeTab === '/nft-gallery'} sareeMode={sareeMode}>{t('NFT Gallery')}</NavLink>
           <NavLink to="/history" active={activeTab === '/history'} sareeMode={sareeMode}>{t('History')}</NavLink>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
           {/* Language Switcher */}
           <div className="relative">
              <button 
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center gap-2 py-1 transition-all text-[11px] font-black tracking-widest ${
                  sareeMode ? 'text-orange-600' : 'text-slate-400 hover:text-white'
                }`}
              >
                {i18n.language.toUpperCase()}
                <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`absolute right-0 mt-4 w-40 rounded-2xl shadow-2xl border p-2 overflow-hidden z-[100] ${
                      sareeMode ? 'bg-white border-orange-100' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          i18n.changeLanguage(lang.id);
                          setIsLanguageOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                          i18n.language === lang.id 
                            ? 'bg-indigo-600 text-white' 
                            : (sareeMode ? 'text-slate-700 hover:bg-orange-50' : 'text-slate-300 hover:bg-slate-800')
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* Profile */}
           {isAuthenticated ? (
              <div className="flex items-center gap-4">
                 <button 
                  onClick={logout}
                  className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                    sareeMode ? 'text-orange-600' : 'text-slate-500 hover:text-red-400'
                  }`}
                 >
                   {t('Exit')}
                 </button>
                 <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                   sareeMode ? 'bg-orange-100 text-orange-600' : 'bg-indigo-600 text-white'
                 }`}>
                   {user?.name?.charAt(0) || 'U'}
                 </div>
              </div>
           ) : (
             <button 
              onClick={() => navigate('/login')}
              className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                sareeMode ? 'bg-orange-600 text-white' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              }`}
             >
               {t('Login')}
             </button>
           )}
        </div>
      </nav>
    </header>
  );
};

const NavLink = ({ to, children, active, sareeMode }) => (
  <Link 
    to={to} 
    className={`px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
      active 
        ? (sareeMode ? 'bg-orange-100 text-orange-600' : 'bg-indigo-600 text-white shadow-sm') 
        : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    {children}
  </Link>
);

export default Header;