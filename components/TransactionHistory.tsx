
import React from 'react';
import { Credential } from '../types';
import { CheckCircleIcon, ShieldCheckIcon, GlobeAltIcon, PlaneIcon } from './Icons';

interface CredentialsListProps {
  credentials: Credential[];
  walletId: string;
  onCardClick?: (type: string) => void;
}

const getCredentialStyle = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('eid') || t.includes('passport')) {
    return {
      bg: 'bg-[#4080D0]', // Mid blue
      icon: <ShieldCheckIcon className="w-8 h-8 text-white" />,
    };
  }
  if (t.includes('visa')) {
    return {
      bg: 'bg-[#50C878]', // Emerald green
      icon: <GlobeAltIcon className="w-8 h-8 text-white" />,
    };
  }
  if (t.includes('history') || t.includes('travel')) {
    return {
      bg: 'bg-[#7BC9E2]', // Light blue
      icon: <PlaneIcon className="w-8 h-8 text-white" />,
    };
  }
  return {
    bg: 'bg-gray-600',
    icon: <ShieldCheckIcon className="w-8 h-8 text-white" />,
  };
};

const CredentialsList: React.FC<CredentialsListProps> = ({ credentials, onCardClick }) => {
  return (
    <div className="space-y-4 pb-12">
      {credentials.length > 0 ? (
        credentials.map((cred, idx) => {
          const style = getCredentialStyle(cred.cred_type);
          return (
            <div
              key={`${cred.id_number}-${idx}`}
              onClick={() => onCardClick?.(cred.cred_type)}
              className={`${style.bg} rounded-[2rem] p-6 shadow-xl flex items-center justify-between transition-transform active:scale-95 cursor-pointer hover:brightness-110`}
            >
              <div className="flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm">
                  {style.icon}
                </div>
                <div>
                  <h4 className="text-white font-black text-xl tracking-tight leading-tight">
                    {cred.cred_type}
                  </h4>
                  <p className="text-white/80 text-sm font-bold mt-0.5">
                    {cred.cred_type.toLowerCase().includes('visa')
                      ? `Expiry: ${cred.valid_to}`
                      : cred.metadata?.owner_short || cred.id_number}
                  </p>
                </div>
              </div>
              <div className="bg-white/20 rounded-full p-1.5 border border-white/40">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-400 py-12 bg-white/5 rounded-3xl border border-white/10 border-dashed">
          No active credentials in secure vault.
        </div>
      )}
    </div>
  );
};

export default CredentialsList;
