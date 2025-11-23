import React from 'react';
import { DigitalWallet } from '../types';
import { InfoIcon } from './Icons';

const RISK_FLAG_DESCRIPTIONS: Record<string, string> = {
    "past_refusal": "Indicates a previous denial of entry at a border crossing.",
    "overstay_history": "Indicates a past incident of staying beyond the permitted visa duration."
};

interface WalletSummaryProps {
  wallet: DigitalWallet;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ wallet }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">Wallet Summary</h3>
      <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
        
        <span className="font-semibold text-gray-400">Wallet ID:</span>
        <span className="text-gray-200">{wallet.wallet_id}</span>
        
        <span className="font-semibold text-gray-400">Owner:</span>
        <span className="text-gray-200">{wallet.owner.full_name}</span>

        <span className="font-semibold text-gray-400">Nationality:</span>
        <span className="text-gray-200">{wallet.owner.nationality}</span>

        <span className="font-semibold text-gray-400">Date of birth:</span>
        <span className="text-gray-200">{wallet.owner.date_of_birth}</span>
        
        <span className="font-semibold text-gray-400">Frequent traveler:</span>
        <span className="text-gray-200">{wallet.owner.frequent_traveler ? 'Yes' : 'No'}</span>

        {/* Risk Flags with Tooltip */}
        <div className="flex items-center font-semibold text-gray-400">
          <span>Existing risk flags</span>
          <div className="relative group ml-1.5">
            <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 border border-gray-600 text-gray-300 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-10">
              <h4 className="font-bold mb-2 text-white">Risk Flag Definitions</h4>
              <ul className="space-y-1 text-left">
                {Object.entries(RISK_FLAG_DESCRIPTIONS).map(([key, value]) => (
                  <li key={key}>
                    <strong className="capitalize text-gray-100">{key.replace(/_/g, ' ')}:</strong> {value}
                  </li>
                ))}
              </ul>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-600"></div>
            </div>
          </div>
        </div>
        <div>
            {wallet.owner.risk_flags.length > 0 ? (
                <span className="text-red-400">
                    {wallet.owner.risk_flags.map(flag => flag.replace(/_/g, ' ')).join(', ')}
                </span>
            ) : (
                <span className="text-gray-300">None</span>
            )}
        </div>
      </div>
      <p className="text-xs text-gray-500 pt-4 mt-4 border-t border-gray-700/50">Last updated: {new Date(wallet.last_updated).toLocaleString()} | Version: {wallet.version}</p>
    </div>
  );
};

export default WalletSummary;