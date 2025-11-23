
import React, { useState } from 'react';
import TravelerView from './components/Dashboard';
import OfficerView from './components/SendMoneyForm';
import { LogoutIcon } from './components/Icons';

type Role = "Traveler Wallet" | "Officer Dashboard";

interface AppProps {
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ onLogout }) => {
  const [role, setRole] = useState<Role>("Traveler Wallet");

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700 shadow-md flex justify-between items-center shrink-0">
        <h1 className="text-xl font-bold text-cyan-400">Digital Wallet</h1>
        <nav className="flex items-center space-x-2">
            <button
                onClick={() => setRole("Traveler Wallet")}
                className={`px-4 py-2 rounded-md font-semibold transition-colors text-sm ${
                    role === "Traveler Wallet" ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                }`}
            >
                Traveler Wallet
            </button>
            <button
                onClick={() => setRole("Officer Dashboard")}
                className={`px-4 py-2 rounded-md font-semibold transition-colors text-sm ${
                    role === "Officer Dashboard" ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                }`}
            >
                Officer Dashboard
            </button>
            <div className="border-l border-gray-600 h-6 mx-2"></div>
            <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 rounded-md font-semibold transition-colors text-sm bg-gray-700 hover:bg-red-600"
                aria-label="Logout"
            >
                <LogoutIcon className="w-4 h-4 mr-2" />
                Logout
            </button>
        </nav>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {role === "Traveler Wallet" ? <TravelerView /> : <OfficerView />}
      </main>
    </div>
  );
};

export default App;