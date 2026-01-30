
import React from 'react';
import { DigitalWallet } from '../types';
import { InfoIcon } from './Icons';

const RISK_FLAG_DESCRIPTIONS: Record<string, string> = {
  "past_refusal": "Indicates a previous denial of entry at a border crossing or a visa application rejection.",
  "overstay_history": "Records indicate the traveler has previously exceeded the permitted length of stay.",
  "identity_mismatch": "Discrepancies found between digital credentials and database records.",
  "suspicious_pattern": "Travel behavior matches known profiles for illicit activity.",
  "undeclared_goods": "History of failing to declare taxable or restricted items.",
  "behavioral_shift": "Detected anomaly where activities diverge sharply from historical patterns."
};

interface WalletSummaryProps {
  wallet: DigitalWallet;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ wallet }) => {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg shadow-black/20">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 border-b border-gray-700">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Wallet Identification Summary</h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
          <span className="font-medium text-gray-500">Wallet ID</span>
          <span className="text-gray-200 font-mono text-xs bg-gray-900/50 px-2 py-0.5 rounded border border-gray-700 w-fit">{wallet.wallet_id}</span>
          
          <span className="font-medium text-gray-500">Full Name</span>
          <span className="text-gray-100 font-semibold">{wallet.owner.full_name}</span>

          <span className="font-medium text-gray-500">Citizenship</span>
          <div className="flex items-center space-x-2 text-gray-100">
            <span className="px-1.5 py-0.5 bg-blue-900/40 text-blue-300 border border-blue-800/50 rounded text-xs font-bold uppercase">{wallet.owner.citizenship}</span>
            <span className="text-gray-500 text-[10px] font-mono">({wallet.owner.nationality})</span>
          </div>

          <span className="font-medium text-gray-500">Date of Birth</span>
          <span className="text-gray-200">{wallet.owner.date_of_birth}</span>
          
          <span className="font-medium text-gray-500">Traveler Status</span>
          <span className="text-gray-200">
            {wallet.owner.frequent_traveler ? (
              <span className="inline-flex items-center text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span>
                Frequent Traveler
              </span>
            ) : (
              'Standard'
            )}
          </span>

          <span className="font-medium text-gray-500 flex items-center gap-1">
            Risk Analysis Flags
            <div className="relative group">
                <InfoIcon className="w-3.5 h-3.5 text-gray-500 hover:text-cyan-400 cursor-help transition-colors" />
                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 border border-gray-700 text-[11px] text-gray-300 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all invisible group-hover:visible z-50 pointer-events-none font-normal normal-case">
                    <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Flag Definitions</p>
                    <div className="space-y-2">
                        {Object.entries(RISK_FLAG_DESCRIPTIONS).map(([key, desc]) => (
                            <div key={key}>
                                <span className={`font-bold ${wallet.owner.risk_flags.includes(key) ? 'text-red-400' : 'text-cyan-600'}`}>
                                    {key.replace(/_/g, ' ')}:
                                </span> {desc}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </span>
          
          <div className="flex items-center gap-3">
            {wallet.owner.risk_flags.length > 0 ? (
              <div className="flex flex-wrap gap-2 items-center">
                {wallet.owner.risk_flags.map(flag => (
                  <span key={flag} className="px-2 py-0.5 bg-red-900/20 text-red-400 border border-red-800/40 rounded text-[10px] font-bold uppercase tracking-tight">
                    {flag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <span className="inline-flex items-center text-green-400 text-xs font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
                Clear Record
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[10px] text-gray-500">
          <div className="flex items-center uppercase tracking-widest font-semibold">
            <span className="mr-3">Version: {wallet.version}</span>
            <span className="px-2 py-0.5 bg-gray-700 rounded text-gray-300">SECURE_ID_PASS</span>
          </div>
          <span className="italic">Sync: {new Date(wallet.last_updated).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default WalletSummary;
