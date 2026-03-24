import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'react-hot-toast';
import { Shield, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDeflection } from '../context/DeflectionContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { sareeMode } = useDeflection();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error(t('Please fill all fields'));
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUserData = {
        user: { id: "demo_1", email: formData.email, role: 'user', name: "Demo User" },
        token: "demo_token_12345"
      };
      login(mockUserData);
      toast.success(t('messages.loginSuccess'));
      navigate('/dashboard');
    } catch (err) {
      toast.error(t('errors.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative flex items-center justify-center px-4 py-8 font-sans transition-colors duration-500 ${sareeMode ? 'bg-orange-50/50' : 'bg-slate-950'}`}>
      <Toaster position="top-center" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${sareeMode ? 'bg-orange-400' : 'bg-indigo-600'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 ${sareeMode ? 'bg-rose-400' : 'bg-blue-600'}`}></div>
      </div>

      <div className="relative w-full max-w-lg">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 mb-12 group transition-colors text-[10px] font-black uppercase tracking-widest ${
            sareeMode ? 'text-slate-500 hover:text-orange-600' : 'text-slate-500 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('navigation.backToHome')}
        </Link>

        <div className={`backdrop-blur-3xl rounded-[3rem] p-12 border shadow-2xl transition-all duration-500 ${
          sareeMode ? 'bg-white/80 border-orange-100 shadow-orange-500/5' : 'bg-slate-900/40 border-slate-800 shadow-black/50'
        }`}>
          <div className="text-center mb-12">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transition-all ${
              sareeMode ? 'bg-orange-600' : 'bg-indigo-600 shadow-indigo-500/20'
            }`}>
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-5xl font-black mb-4 tracking-tighter leading-none ${sareeMode ? 'text-slate-900' : 'text-white'}`}>
                IDENTITY<br/> <span className={sareeMode ? 'text-orange-600' : 'text-indigo-500'}>VERIFIED</span>
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">
              Secure Neural Access Protocol
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${sareeMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('form.emailLabel')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 rounded-[1.5rem] border font-medium transition-all focus:outline-none focus:ring-2 ${
                  sareeMode 
                    ? 'bg-slate-50/50 border-orange-100 text-slate-900 focus:border-orange-500 focus:ring-orange-500/20' 
                    : 'bg-slate-950/50 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${sareeMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('form.passwordLabel')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 rounded-[1.5rem] border font-medium transition-all focus:outline-none focus:ring-2 ${
                    sareeMode 
                      ? 'bg-slate-50/50 border-orange-100 text-slate-900 focus:border-orange-500 focus:ring-orange-500/20' 
                      : 'bg-slate-950/50 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`group w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl relative overflow-hidden ${
                sareeMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'
              }`}
            >
              {isLoading ? (
                  <Loader2 className="animate-spin mx-auto" size={18} />
              ) : (
                <div className="flex items-center justify-center gap-3">
                   {t('form.submitButton')}
                   <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-800/10 dark:border-slate-800 flex flex-col items-center">
             <button
                type="button"
                onClick={() => {
                  const demoUser = {
                    user: { id: "demo_judge", email: "demo@proxyfamily.ai", role: "user", name: "Judge Demo" },
                    token: "demo_token_perfect_123"
                  };
                  login(demoUser);
                  toast.success("DEMO SESSION: FULL ACCESS GRANTED", { icon: '🔥' });
                  navigate('/dashboard');
                }}
                className={`w-full py-5 rounded-[1.5rem] border-2 border-dashed font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 ${
                    sareeMode ? 'border-orange-500/30 text-orange-600 hover:bg-orange-50' : 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/5'
                }`}
             >
                <div className={`w-2 h-2 rounded-full animate-pulse ${sareeMode ? 'bg-orange-600' : 'bg-indigo-500'}`} />
                {t('ENTER DEMO MODE')}
                <div className={`w-2 h-2 rounded-full animate-pulse ${sareeMode ? 'bg-orange-600' : 'bg-indigo-500'}`} />
             </button>
             <p className="text-[9px] text-slate-500 font-bold mt-4 uppercase tracking-widest opacity-50 text-center leading-relaxed">
                Exclusive Judge Preview:<br/> Bio-Sync & Algorand Ready
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
