
import React, { useState } from 'react';
import TravelerView from './components/Dashboard';
import OfficerView from './components/SendMoneyForm';
import { LogoutIcon, ShieldCheckIcon } from './components/Icons';

type Role = "Traveler Wallet" | "Officer Dashboard";

interface AppProps {
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ onLogout }) => {
  const [role, setRole] = useState<Role>("Traveler Wallet");

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      {/* EES Regulatory Banner */}
      <div className="bg-[#003399] text-white px-4 py-2 flex items-center justify-between text-[10px] sm:text-xs font-bold border-b border-[#FFCC00]/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-[#FFCC00] text-[#003399] rounded px-1.5 py-0.5 text-[9px] font-black">EES ACTIVE</div>
          <p className="tracking-wide">EU Entry/Exit System (EES) operational. Real-time AI Risk Inference active.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[#FFCC00]">
          <span className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full animate-pulse"></span>
          Joint Border & Customs Protocol v2.5
        </div>
      </div>

      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700 shadow-md flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
            <div className="bg-cyan-600 p-1.5 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter">BORDER<span className="text-cyan-400">CORE</span></h1>
        </div>
        
        <nav className="flex items-center space-x-2">
            <button
                onClick={() => setRole("Traveler Wallet")}
                className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                    role === "Traveler Wallet" ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
            >
                Traveler
            </button>
            <button
                onClick={() => setRole("Officer Dashboard")}
                className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                    role === "Officer Dashboard" ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
            >
                Officer
            </button>
            <div className="border-l border-gray-700 h-6 mx-2"></div>
            <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 rounded-md font-semibold transition-colors text-sm bg-gray-700 hover:bg-red-600/80"
                aria-label="Logout"
            >
                <LogoutIcon className="w-4 h-4" />
            </button>
        </nav>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {role === "Traveler Wallet" && <TravelerView />}
          {role === "Officer Dashboard" && <OfficerView />}
      </main>

      {/* Global Compliance Footer */}
      <footer className="bg-gray-950 p-3 border-t border-gray-800 text-center shrink-0">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Lat: &lt;1s</span>
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Model: Non-Black-Box</span>
            <span className="text-[9px] font-black text-emerald-900/80 uppercase tracking-[0.3em] border border-emerald-900/30 px-2 py-0.5 rounded">EU AI ACT COMPLIANT</span>
            <span className="text-[9px] font-black text-cyan-900/80 uppercase tracking-[0.3em] border border-cyan-900/30 px-2 py-0.5 rounded">GDPR PROTECTED</span>
          </div>
      </footer>
    </div>
  );
};

export default App;
