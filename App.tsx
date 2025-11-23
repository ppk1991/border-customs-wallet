import React, { useState } from 'react';
import TravelerView from './components/Dashboard';
import OfficerView from './components/SendMoneyForm';
import SystemDiagram from './components/SystemDiagram';

type Role = "Traveler Wallet" | "Officer Dashboard";

const App: React.FC = () => {
  const [role, setRole] = useState<Role>("Traveler Wallet");

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700 shadow-md flex justify-between items-center shrink-0">
        <h1 className="text-xl font-bold text-cyan-400">Digital Wallet Prototype</h1>
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
        </nav>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Diagram Panel (visible on large screens) */}
        <aside className="w-5/12 p-8 border-r border-gray-700 hidden lg:flex flex-col items-center justify-between bg-gray-800/30">
           <SystemDiagram />
           <div className="text-xs text-gray-400 border-t border-gray-700 pt-4 mt-8 w-full">
                <p><strong>Note:</strong> This is a demo prototype for research on digital wallets, border and customs risk analysis, and explainable AI.</p>
           </div>
        </aside>
        
        {/* Main View Panel */}
        <main className="flex-1 overflow-y-auto p-8">
            {role === "Traveler Wallet" ? <TravelerView /> : <OfficerView />}
        </main>
      </div>

       {/* Footer Note for smaller screens */}
      <footer className="lg:hidden p-4 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <p><strong>Note:</strong> This is a demo prototype for research on digital wallets, border and customs risk analysis, and explainable AI.</p>
      </footer>
    </div>
  );
};

export default App;
