import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'react-hot-toast';
import { Shield, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle, Zap, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDeflection } from '../context/DeflectionContext';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { sareeMode } = useDeflection();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    termsAccepted: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      toast.error('Please accept the Neural Protocol terms');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUserData = {
        user: { id: "user_new", email: formData.email, role: 'user', name: formData.name },
        token: "session_token_new_99"
      };
      login(mockUserData);
      toast.success('DECRYPTION SUCCESSFUL: PROFILE CREATED');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Network failure in neural link');
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
          Back to Home
        </Link>

        <div className={`backdrop-blur-3xl rounded-[3rem] p-12 border shadow-2xl transition-all duration-500 ${
          sareeMode ? 'bg-white/80 border-orange-100 shadow-orange-500/5' : 'bg-slate-900/40 border-slate-800 shadow-black/50'
        }`}>
          <div className="text-center mb-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl transition-all ${
              sareeMode ? 'bg-orange-600' : 'bg-indigo-600 shadow-indigo-500/20'
            }`}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-black mb-3 tracking-tighter ${sareeMode ? 'text-slate-900' : 'text-white'}`}>
                ENROLL <span className={sareeMode ? 'text-orange-600' : 'text-indigo-500'}>NEURAL LINK</span>
            </h1>
            <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.3em]">
              Initialize Biometric Identity Proxy
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-[9px] font-black uppercase tracking-widest mb-2 ${sareeMode ? 'text-slate-500' : 'text-slate-400'}`}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-5 py-3.5 rounded-[1.25rem] border font-medium transition-all focus:outline-none focus:ring-2 ${
                  sareeMode 
                    ? 'bg-slate-50/50 border-orange-100 text-slate-900 focus:border-orange-500 focus:ring-orange-500/20' 
                    : 'bg-slate-950/50 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-[9px] font-black uppercase tracking-widest mb-2 ${sareeMode ? 'text-slate-500' : 'text-slate-400'}`}>Encrypted Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-5 py-3.5 rounded-[1.25rem] border font-medium transition-all focus:outline-none focus:ring-2 ${
                  sareeMode 
                    ? 'bg-slate-50/50 border-orange-100 text-slate-900 focus:border-orange-500 focus:ring-orange-500/20' 
                    : 'bg-slate-950/50 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-[9px] font-black uppercase tracking-widest mb-2 ${sareeMode ? 'text-slate-500' : 'text-slate-400'}`}>Secure Passkey</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-5 py-3.5 rounded-[1.25rem] border font-medium transition-all focus:outline-none focus:ring-2 ${
                    sareeMode 
                      ? 'bg-slate-50/50 border-orange-100 text-slate-900 focus:border-orange-500 focus:ring-orange-500/20' 
                    : 'bg-slate-950/50 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <input
                 type="checkbox"
                 name="termsAccepted"
                 checked={formData.termsAccepted}
                 onChange={handleInputChange}
                 className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
               />
               <p className="text-[10px] text-slate-500 font-medium">
                 I accept the <span className="text-indigo-400 underline decoration-dotted underline-offset-4 cursor-pointer">Neural Handshake Protocol</span> and privacy terms.
               </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`group w-full py-4 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl relative overflow-hidden ${
                sareeMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'
              }`}
            >
              {isLoading ? (
                  <Loader2 className="animate-spin mx-auto" size={16} />
              ) : (
                <div className="flex items-center justify-center gap-3">
                   INITIALIZE ACCOUNT
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs">
             <p className="text-slate-500 font-bold tracking-tight">
               Already Verified? {' '}
               <Link to="/login" className="text-indigo-500 hover:text-indigo-400 font-black">LOGIN</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
