import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, ExternalLink, CheckCircle, Database, Hash } from 'lucide-react';
import { useDeflection } from '../context/DeflectionContext';

const ALGO_EXPLORER = 'https://lora.algokit.io/testnet/application/756282697';

// Mock history entries
const mockHistory = [
  { id: 1, relative: "Aunty Radha", type: "aunty", excuse: "I'm at a meditation retreat with no phones allowed.", emotion: "Guilt Trip", intensity: 87, txHash: "PROXY-A7F3B2E9C1", timestamp: "2 mins ago", status: "verified" },
  { id: 2, relative: "Uncle Shankar", type: "uncle", excuse: "My phone fell in the dal. Currently drying with rice.", emotion: "Financial Probe", intensity: 92, txHash: "PROXY-D4E8F1A3B7", timestamp: "15 mins ago", status: "verified" },
  { id: 3, relative: "Cousin Priya", type: "cousin", excuse: "I'm volunteering at a temple. Very holy right now.", emotion: "Gossip Extraction", intensity: 65, txHash: "PROXY-C2B9E6F4A8", timestamp: "1 hour ago", status: "verified" },
  { id: 4, relative: "Grandma Kamala", type: "grandma", excuse: "The network is down. (Technically I turned off WiFi)", emotion: "Supernatural Guilt", intensity: 99, txHash: "PROXY-F8A1D3C7E5", timestamp: "3 hours ago", status: "verified" },
];

const DeflectionHistory = () => {
  const { sareeMode, totalDeflections } = useDeflection();

  const displayHistory = totalDeflections > 0
    ? mockHistory
    : mockHistory; // Always show mock data for demo

  return (
    <div className={`min-h-screen pt-28 pb-10 ${sareeMode ? 'bg-orange-50' : 'bg-slate-950'}`}>
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className={`text-4xl font-black mb-2 ${sareeMode ? 'text-orange-900' : 'text-white'}`}>
            Deflection Ledger
          </h1>
          <p className="text-slate-500 max-w-lg">
            Every excuse is immutably recorded on the Algorand blockchain. Your lies live forever, Beta.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className={`grid grid-cols-3 gap-4 mb-8 p-4 rounded-2xl border-2 ${sareeMode ? 'bg-white border-orange-200' : 'bg-slate-900 border-slate-800'
          }`}>
          <div className="text-center">
            <p className={`text-2xl font-black ${sareeMode ? 'text-orange-600' : 'text-indigo-400'}`}>{displayHistory.length}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Total Deflections</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-black ${sareeMode ? 'text-orange-600' : 'text-emerald-400'}`}>100%</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Success Rate</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-black ${sareeMode ? 'text-orange-600' : 'text-purple-400'}`}>4</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase">On-Chain Proofs</p>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {displayHistory.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-3xl border-2 ${sareeMode ? 'bg-white border-orange-200' : 'bg-slate-900 border-slate-800'
                } shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${sareeMode ? 'bg-orange-100' : 'bg-indigo-500/10'
                    }`}>
                    {entry.type === 'aunty' ? '👩' : entry.type === 'uncle' ? '👨' : entry.type === 'grandma' ? '👵' : '🧑'}
                  </div>
                  <div>
                    <h3 className={`font-bold ${sareeMode ? 'text-slate-900' : 'text-white'}`}>{entry.relative}</h3>
                    <p className="text-[10px] text-slate-500 flex items-center gap-2">
                      <Clock size={10} /> {entry.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-black uppercase">Verified</span>
                </div>
              </div>

              {/* Excuse Used */}
              <div className={`p-3 rounded-xl mb-3 ${sareeMode ? 'bg-orange-50' : 'bg-slate-800/50'}`}>
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Excuse Deployed</p>
                <p className={`text-sm italic ${sareeMode ? 'text-slate-700' : 'text-slate-300'}`}>"{entry.excuse}"</p>
              </div>

              {/* Emotion + Hash */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] px-2 py-1 rounded font-bold ${entry.intensity > 90 ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'
                    }`}>
                    {entry.emotion}: {entry.intensity}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash size={10} className="text-slate-600" />
                  <code className="text-[10px] text-slate-500 font-mono">{entry.txHash}</code>
                  <a href={ALGO_EXPLORER} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={10} className="text-indigo-400 hover:text-indigo-300 cursor-pointer" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <a
            href={ALGO_EXPLORER}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${sareeMode ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
          >
            <Database size={16} />
            View Full Ledger on Algorand Explorer
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeflectionHistory;
