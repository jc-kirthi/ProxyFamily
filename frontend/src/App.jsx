import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import ProxyVoice from './components/Voicebot/VoiceBot';
import { AuthProvider } from './context/AuthContext';
import { DeflectionProvider } from './context/DeflectionContext';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add('dark');
    else html.classList.remove('dark');
  }, [isDark]);

  return (
    <AuthProvider>
      <DeflectionProvider>
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
          
          <Header
            isDark={isDark}
            toggleTheme={toggleTheme}
          />

          <main className="pt-0">
            <Outlet />
          </main>

          {/* ✅ Add VoiceBot globally - renamed to ProxyVoice potentially */}
          <ProxyVoice />
          
        </div>
      </DeflectionProvider>
    </AuthProvider>
  );
}

export default App;
