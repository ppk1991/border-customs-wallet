
import React, { useState, useEffect } from 'react';
import { WALLETS } from '../services/geminiService';
import CredentialsList from './TransactionHistory';
import CrossingHistory from './CrossingHistory';
import ProcessFlow from './ProcessFlow';
import { BellIcon, ShieldCheckIcon } from './Icons';

const TravelerView: React.FC = () => {
  const walletIds = Object.keys(WALLETS);
  const [selectedId, setSelectedId] = useState<string>(() => {
      return localStorage.getItem('border_core_selected_wallet') || walletIds[0];
  });
  const [activeSubView, setActiveSubView] = useState<'list' | 'history' | 'workflow'>('list');
  const wallet = WALLETS[selectedId];

  useEffect(() => {
    setActiveSubView('list');
  }, [selectedId]);

  const initials = wallet.owner.full_name.split(' ').map(n => n[0]).join('').toUpperCase();

  const displayCredentials = wallet.credentials.filter(c => 
    !c.cred_type.toLowerCase().includes('vaccination') && 
    !c.cred_type.toLowerCase().includes('pass')
  );
  
  const SCHENGEN_MEMBER_CODES = [
      'AT', 'BE', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IT', 'LV', 
      'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'SK', 'SI', 'ES', 'SE', 'CH', 'HR', 'RO', 'BG'
  ];
  
  const isSchengenCitizen = SCHENGEN_MEMBER_CODES.includes(wallet.owner.nationality.toUpperCase());
  
  if (!isSchengenCitizen) {
      displayCredentials.push({
          cred_type: 'Schengen Visa',
          issuer: 'EU Border Authority',
          id_number: 'VISA-992-EU',
          valid_from: '2023-01-01',
          valid_to: '12/25',
          metadata: { status: 'Verified' }
      });
  }

  displayCredentials.push({
      cred_type: isSchengenCitizen ? 'Mobility History' : 'Travel History',
      issuer: isSchengenCitizen ? 'EU Mobility Vault' : 'EES System',
      id_number: 'VAULT-001',
      valid_from: 'N/A',
      valid_to: 'N/A',
      metadata: { owner_short: `${wallet.owner.crossing_history.length} Events Registered` }
  });

  const handleCredentialClick = (type: string) => {
    if (type.toLowerCase().includes('history')) {
        setActiveSubView('history');
    }
  };

  return (
    <div className="relative min-h-[85vh] max-w-md mx-auto flex flex-col pt-4 px-6 pb-24 overflow-hidden rounded-[3rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border border-white/10" style={{
        background: 'radial-gradient(circle at top, #4A90E2 0%, #357ABD 100%)'
    }}>
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="wallet-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <rect width="100" height="100" fill="url(#wallet-grid)" />
          </svg>
      </div>

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            {activeSubView !== 'list' ? (
                <button 
                    onClick={() => setActiveSubView('list')}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            ) : (
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <span className="text-white font-bold text-sm">{initials}</span>
                </div>
            )}
            
            <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="bg-transparent text-white/80 text-xs font-black uppercase tracking-widest outline-none cursor-pointer border-none appearance-none"
            >
                {walletIds.map(id => (
                    <option key={id} value={id} className="text-black">{WALLETS[id].owner.full_name}</option>
                ))}
            </select>
        </div>
        <div className="relative">
            <BellIcon className="w-6 h-6 text-white" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-500"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {activeSubView === 'list' && (
            <>
                <h2 className="text-white text-4xl font-black tracking-tight leading-tight mb-8 drop-shadow-lg">
                    My Verified<br />Credentials
                </h2>
                <CredentialsList 
                    credentials={displayCredentials} 
                    walletId={wallet.wallet_id} 
                    onCardClick={handleCredentialClick}
                />
            </>
        )}

        {activeSubView === 'history' && (
            <div className="animate-in slide-in-from-right duration-300">
                <h2 className="text-white text-3xl font-black tracking-tight leading-tight mb-6 drop-shadow-lg">
                    {isSchengenCitizen ? 'Mobility' : 'Entry/Exit'}<br />Timeline
                </h2>
                <CrossingHistory history={wallet.owner.crossing_history} />
            </div>
        )}

        {activeSubView === 'workflow' && (
            <div className="animate-in slide-in-from-bottom duration-300 h-full flex flex-col">
                <h2 className="text-white text-3xl font-black tracking-tight leading-tight mb-6 drop-shadow-lg">
                    System<br />Transparency
                </h2>
                <div className="flex-1 min-h-[400px] rounded-[2rem] overflow-hidden border border-white/20">
                    <ProcessFlow initialMode="handshake" />
                </div>
                <p className="mt-4 text-white/60 text-[10px] font-bold uppercase tracking-widest text-center">
                    End-to-End Encrypted Handshake Visualization
                </p>
            </div>
        )}
      </div>

      {/* Bottom Action Button (Conditional for List View) */}
      {activeSubView === 'list' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[320px] px-6 z-20">
            <button 
                onClick={() => setActiveSubView('workflow')}
                className="w-full bg-[#4080D0] hover:bg-[#357ABD] text-white py-4 px-8 rounded-[2rem] font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border border-white/20"
            >
                Transparency Hub
                <div className="bg-white/20 p-1.5 rounded-full">
                    <ShieldCheckIcon className="w-5 h-5" />
                </div>
            </button>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TravelerView;
