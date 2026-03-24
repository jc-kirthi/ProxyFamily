import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Award, Loader2, Plus, LayoutGrid, List, CheckCircle, ExternalLink, Info, Wallet, QrCode, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDeflection } from '../../context/DeflectionContext';
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect({
    shouldShowSignTxnToast: true
});

const NFTGallery = () => {
  const { t } = useTranslation();
  const { sareeMode, totalDeflections } = useDeflection();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isMinting, setIsMinting] = useState(false);
  const [showMintSuccess, setShowMintSuccess] = useState(false);
  const [accountAddress, setAccountAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Reconnect on startup
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) {
        setAccountAddress(accounts[0]);
      }
      peraWallet.connector?.on("disconnect", handleDisconnect);
    });
  }, []);

  const handleDisconnect = () => {
    peraWallet.disconnect();
    setAccountAddress(null);
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      // THIS OPENS THE AUTHENTIC PERA WALLET MODAL WITH REAL QR CODE
      const newAccounts = await peraWallet.connect();
      peraWallet.connector?.on("disconnect", handleDisconnect);
      setAccountAddress(newAccounts[0]);
    } catch (e) {
      if (e?.data?.type !== "CONNECT_MODAL_CLOSED") {
        console.error("Pera Connect Error:", e);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const isWalletConnected = !!accountAddress;

  const nfts = [
    { id: 1, name: t("The Sacred Roti"), rarity: "COMMON", type: "aunty", image: "https://api.dicebear.com/9.x/shapes/svg?seed=roti", price: "0.05 ALGO", desc: t("Awarded for surviving a Guilt Trip regarding nutrition.") },
    { id: 2, name: t("The Flying Chappal"), rarity: "RARE", type: "uncle", image: "https://api.dicebear.com/9.x/shapes/svg?seed=chappal", price: "0.15 ALGO", desc: t("Awarded for a high-velocity deflection of financial probes.") },
    { id: 3, name: t("The WhatsApp DP"), rarity: "EPIC", type: "cousin", image: "https://api.dicebear.com/9.x/shapes/svg?seed=dp", price: "0.50 ALGO", desc: t("Proof of successfully hiding your profile picture from gossip mongers.") },
    { id: 4, name: t("The Wedding Invite"), rarity: "LEGENDARY", type: "grandma", image: "https://api.dicebear.com/9.x/shapes/svg?seed=invite", price: "1.20 ALGO", desc: t("S-Tier deflection. Avoided a 3-hour conversation about Mrs. Sharma's niece.") }
  ];

  const handleMint = () => {
    if (!isWalletConnected) {
        handleConnectWallet();
        return;
    }
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      setShowMintSuccess(true);
      setTimeout(() => setShowMintSuccess(false), 3000);
    }, 4500);
  };

  const filteredNfts = activeFilter === 'ALL' ? nfts : nfts.filter(n => n.rarity === activeFilter);

  return (
    <div className={`min-h-screen pt-40 pb-20 transition-colors duration-500 ${sareeMode ? 'bg-orange-50/50' : 'bg-slate-950'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-24">
           <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                 <span className="px-3 py-1 bg-indigo-600/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                    {t('Archive v2.0')}
                 </span>
                 <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <Database size={12} /> {t('Verified On-Chain')}
                 </span>
              </div>
              <h1 className={`text-6xl font-black mb-6 ${sareeMode ? 'text-slate-900' : 'text-white'} leading-[0.9] tracking-tighter`}>
                {t('PROOF OF')} <br/> <span className={sareeMode ? 'text-orange-600' : 'text-indigo-500'}>{t('AVOIDANCE')}</span>
              </h1>
              <p className="text-slate-500 text-lg font-medium italic leading-relaxed">
                {t('Every successful deflection is minted as an immutable NFT. Certificates of absence for the social modern era.')}
              </p>
           </div>

           <div className={`flex flex-col gap-4 ${sareeMode ? 'bg-white' : 'bg-white/5'} border border-slate-800 rounded-[2.5rem] p-8 min-w-[320px]`}>
              <div className="flex items-center justify-between gap-16 mb-4">
                 <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t('Total Collections')}</p>
                    <p className={`text-4xl font-black ${sareeMode ? 'text-orange-600' : 'text-white'}`}>{totalDeflections}</p>
                 </div>
                 <button 
                    onClick={() => isWalletConnected ? handleDisconnect() : handleConnectWallet()}
                    className={`p-3 rounded-2xl transition-all ${
                        isWalletConnected 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : (sareeMode ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400')
                    }`}
                 >
                    {isConnecting ? <Loader2 size={20} className="animate-spin" /> : <Wallet size={20} />}
                 </button>
              </div>

              <div className="flex gap-3">
                  {!isWalletConnected ? (
                    <button 
                        onClick={handleConnectWallet}
                        className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            sareeMode ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-950 shadow-xl'
                        }`}
                    >
                        <QrCode size={14} />
                        {isConnecting ? t('CONNECTING...') : t('SIGN IN WITH PERA')}
                    </button>
                  ) : (
                    <button 
                        onClick={handleMint}
                        disabled={isMinting || totalDeflections === 0}
                        className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-3 ${
                            sareeMode ? 'bg-orange-600 text-white' : 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40'
                        }`}
                    >
                        {isMinting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        {isMinting ? t('MINTING...') : t('MINT NEW')}
                    </button>
                  )}
              </div>
              
              {isWalletConnected && (
                <p className="text-[8px] text-slate-500 font-mono mt-2 truncate max-w-[200px] mx-auto opacity-50">
                    {accountAddress}
                </p>
              )}
           </div>
        </div>

        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
           {['ALL', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY'].map(filter => (
             <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${
                activeFilter === filter 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : (sareeMode ? 'text-slate-500 hover:bg-orange-100 text-[10px]' : 'text-slate-500 hover:text-white hover:bg-slate-900 text-[10px]')
              }`}
             >
               {t(filter)}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
           {filteredNfts.map((nft, i) => (
             <motion.div
               key={nft.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className={`group p-6 rounded-[2.5rem] border transition-all duration-500 ${
                 sareeMode 
                   ? 'bg-white border-orange-100 hover:shadow-2xl hover:shadow-orange-500/5' 
                   : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50'
               }`}
             >
                <div className={`aspect-square rounded-[2rem] overflow-hidden ${sareeMode ? 'bg-orange-50' : 'bg-slate-800'} mb-8 p-8 flex items-center justify-center relative`}>
                   <img src={nft.image} alt={nft.name} className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute top-4 right-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        nft.rarity === 'COMMON' ? 'bg-slate-500 text-white' :
                        nft.rarity === 'RARE' ? 'bg-emerald-500 text-white' :
                        nft.rarity === 'EPIC' ? 'bg-purple-500 text-white' :
                        'bg-amber-500 text-white shadow-lg'
                      }`}>
                        {t(nft.rarity)}
                      </span>
                   </div>
                </div>

                <div className="px-2">
                   <h3 className={`text-xl font-black uppercase tracking-tighter mb-2 ${sareeMode ? 'text-slate-900' : 'text-white'}`}>
                      {nft.name}
                   </h3>
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('Market Value')}</span>
                      <span className={`text-[11px] font-black ${sareeMode ? 'text-orange-600' : 'text-indigo-400'}`}>{nft.price}</span>
                   </div>
                   <p className="text-[10px] text-slate-500 font-medium italic line-clamp-2 leading-relaxed">
                      "{nft.desc}"
                   </p>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="mt-40 p-12 rounded-[3.5rem] border-2 border-dashed border-indigo-500/10 text-center max-w-4xl mx-auto">
           <Award size={48} className="mx-auto text-indigo-500/30 mb-8" />
           <h4 className={`text-2xl font-black tracking-tight mb-4 ${sareeMode ? 'text-slate-900' : 'text-white'}`}>
               {t('Achievement')}: {t('The Silent Legend')}
           </h4>
           <p className="text-slate-500 font-medium italic mb-0 max-w-2xl mx-auto">
              {t("Highest recorded absence in family group chats (120+ days). The blockchain confirms your digital ghost status.")}
           </p>
        </div>
      </div>

      <AnimatePresence>
        {showMintSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 right-12 z-[100] p-6 bg-slate-900 border border-emerald-500/50 text-white rounded-3xl shadow-2xl flex items-center gap-6"
          >
            <div className="p-3 bg-emerald-500 rounded-2xl">
               <CheckCircle size={20} />
            </div>
            <div>
               <p className="text-[11px] font-black uppercase tracking-widest">{t('Deflection Certificate Minted')}</p>
               <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest">{t('Verified on Algorand Ledger')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NFTGallery;
