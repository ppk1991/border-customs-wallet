
import React, { useState, useRef, useEffect } from 'react';
import { WALLETS } from '../services/geminiService';
import CredentialsList from './TransactionHistory';
import CrossingHistory from './CrossingHistory';
import { ShieldCheckIcon, CheckCircleIcon, BellIcon } from './Icons';

const TravelerView: React.FC = () => {
  const walletIds = Object.keys(WALLETS);
  const [selectedId, setSelectedId] = useState<string>(() => {
      return localStorage.getItem('border_core_selected_wallet') || walletIds[0];
  });
  const [activeSubView, setActiveSubView] = useState<'list' | 'history'>('list');
  const wallet = WALLETS[selectedId];

  const [showQR, setShowQR] = useState(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setIsScanning(false);
    setScanComplete(false);
    setShowQR(false);
    setActiveSubView('list');
  }, [selectedId]);

  const handleTerminalScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const duration = 2000;
    const start = Date.now();

    scanIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setScanProgress(progress);
      if (progress >= 100) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        setIsScanning(false);
        setScanComplete(true);
      }
    }, 50);
  };

  const initials = wallet.owner.full_name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Filter out any unwanted credentials and handle citizenship logic
  const displayCredentials = wallet.credentials.filter(c => 
    !c.cred_type.toLowerCase().includes('vaccination') && 
    !c.cred_type.toLowerCase().includes('pass')
  );
  
  // Comprehensive list of Schengen members to handle visa injection logic accurately
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

  // Always show Travel/Mobility History aggregate card
  // For Schengen citizens, we emphasize "Mobility" as they have Freedom of Movement
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
            {activeSubView === 'history' ? (
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
        {activeSubView === 'list' ? (
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
        ) : (
            <div className="animate-in slide-in-from-right duration-300">
                <h2 className="text-white text-3xl font-black tracking-tight leading-tight mb-6 drop-shadow-lg">
                    {isSchengenCitizen ? 'Mobility' : 'Entry/Exit'}<br />Timeline
                </h2>
                <CrossingHistory history={wallet.owner.crossing_history} />
            </div>
        )}
      </div>

      {/* Bottom Action Button (Conditional for List View) */}
      {activeSubView === 'list' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[320px] px-6 z-20">
            <button 
                onClick={() => setShowQR(true)}
                className="w-full bg-[#4080D0] hover:bg-[#357ABD] text-white py-4 px-8 rounded-[2rem] font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border border-white/20"
            >
                Show QR Code
                <div className="bg-white/20 p-1.5 rounded-full">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                </div>
            </button>
        </div>
      )}

      {/* QR Code Presentation Overlay */}
      {showQR && (
          <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 border border-gray-700 p-8 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Secure Presentation</h3>
                  <p className="text-gray-400 text-sm mb-8">Point your device toward the kiosk scanner.</p>
                  
                  <div className="relative aspect-square bg-white p-6 rounded-[2rem] mb-8 flex items-center justify-center group overflow-hidden">
                      <div className="grid grid-cols-4 gap-1 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                        {Array.from({length: 16}).map((_, i) => (
                            <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}></div>
                        ))}
                      </div>
                      {isScanning && (
                          <div className="absolute inset-0 bg-cyan-500/20 flex flex-col items-center justify-center">
                              <div className="w-full h-1 bg-cyan-400 absolute top-0 animate-scan shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
                              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] bg-gray-900 px-3 py-1 rounded-full">Syncing...</p>
                          </div>
                      )}
                      {scanComplete && (
                          <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center backdrop-blur-[1px]">
                              <CheckCircleIcon className="w-20 h-20 text-emerald-500 animate-in zoom-in-50 duration-300" />
                              <p className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-4">Verified</p>
                          </div>
                      )}
                  </div>

                  {!scanComplete ? (
                    <button 
                        onClick={handleTerminalScan}
                        disabled={isScanning}
                        className="w-full bg-cyan-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg disabled:opacity-50"
                    >
                        {isScanning ? `Syncing (${Math.round(scanProgress)}%)` : 'Initiate Handshake'}
                    </button>
                  ) : (
                    <button 
                        onClick={() => setShowQR(false)}
                        className="w-full bg-gray-800 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-400"
                    >
                        Close
                    </button>
                  )}
              </div>
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
