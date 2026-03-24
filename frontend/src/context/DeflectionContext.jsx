import React, { createContext, useContext, useState, useEffect } from 'react';

const DeflectionContext = createContext();

export const DeflectionProvider = ({ children }) => {
  const [totalDeflections, setTotalDeflections] = useState(() => {
    return parseInt(localStorage.getItem('proxy_total_deflections') || '0');
  });

  const [gasAmount, setGasAmount] = useState(() => {
    return parseInt(localStorage.getItem('proxy_gas_amount') || '150');
  });

  const [sareeMode, setSareeMode] = useState(() => {
    return localStorage.getItem('proxy_saree_mode') === 'true';
  });

  const [voiceMode, setVoiceMode] = useState(() => {
    return localStorage.getItem('proxy_voice_mode') || 'ai'; // 'ai', 'illusion', 'clone'
  });

  useEffect(() => {
    localStorage.setItem('proxy_total_deflections', totalDeflections);
  }, [totalDeflections]);

  useEffect(() => {
    localStorage.setItem('proxy_gas_amount', gasAmount);
  }, [gasAmount]);

  useEffect(() => {
    localStorage.setItem('proxy_saree_mode', sareeMode);
  }, [sareeMode]);

  useEffect(() => {
    localStorage.setItem('proxy_voice_mode', voiceMode);
  }, [voiceMode]);

  const incrementDeflections = () => {
    setTotalDeflections(prev => prev + 1);
    setGasAmount(prev => prev + Math.floor(Math.random() * 50) + 10);
  };

  const toggleSareeMode = () => setSareeMode(prev => !prev);

  return (
    <DeflectionContext.Provider value={{
      totalDeflections,
      gasAmount,
      sareeMode,
      voiceMode,
      setVoiceMode,
      incrementDeflections,
      toggleSareeMode
    }}>
      {children}
    </DeflectionContext.Provider>
  );
};

export const useDeflection = () => useContext(DeflectionContext);
