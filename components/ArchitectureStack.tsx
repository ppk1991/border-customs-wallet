
import React from 'react';
// Added CheckCircleIcon to the imports from ./Icons
import { ChipIcon, MultiDatabaseIcon, PassportIcon, ShieldCheckIcon, SearchIcon, LinkIcon, CheckCircleIcon } from './Icons';

const ArchitectureStack: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-[1000px] overflow-hidden bg-[radial-gradient(circle_at_center,_#111827_0%,_#030712_100%)]">
      
      {/* Background Neural Grid (Simulated Plexus) */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
      </div>

      {/* Isometric Stack Container */}
      <div className="relative transform rotate-x-[35deg] rotate-z-[-20deg] scale-[0.8] sm:scale-100 transition-transform duration-700">
        
        {/* Layer 3: Data Integration (Bottom) */}
        <div className="relative w-[400px] h-[250px] bg-white/5 border border-white/20 rounded-3xl translate-y-[150px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col p-6 animate-in fade-in slide-in-from-bottom-20 duration-1000">
           <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                   <MultiDatabaseIcon className="w-8 h-8 text-cyan-400" />
               </div>
               <div>
                   <h3 className="text-lg font-black text-white uppercase tracking-tighter">Data Integration</h3>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">APIS, customs, watchlists</p>
               </div>
           </div>
           <div className="flex-1 flex items-center justify-around">
               <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                  <MultiDatabaseIcon className="w-6 h-6 text-gray-500" />
               </div>
               <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                  <MultiDatabaseIcon className="w-6 h-6 text-gray-500" />
               </div>
               <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                  <MultiDatabaseIcon className="w-6 h-6 text-gray-500" />
               </div>
           </div>
        </div>

        {/* Data to AI Connector (Arrow Up) */}
        <div className="absolute left-[50%] top-[250px] -translate-x-1/2 w-0.5 h-[100px] bg-gradient-to-t from-cyan-500 to-transparent animate-pulse opacity-50"></div>

        {/* Layer 2: AI Engine (Middle) */}
        <div className="relative w-[400px] h-[250px] bg-blue-900/40 border-2 border-blue-500/50 rounded-3xl translate-y-[0px] shadow-[0_40px_80px_-20px_rgba(30,58,138,0.6)] flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-20 delay-300 duration-1000 overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
            {/* AI Chip Visual */}
            <div className="relative z-10 p-6 bg-gray-950 rounded-3xl border-2 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-4">
                <ChipIcon className="w-16 h-16 text-blue-400" />
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-blue-400"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-blue-400"></div>
            </div>
            <div className="relative z-10 text-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">AI Engine - Decision Tree</h3>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Real-Time Logic Model</p>
            </div>
            
            {/* Neural Connections Visual (Lines) */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-10 left-10 w-20 h-0.5 bg-blue-400 rotate-45"></div>
                <div className="absolute top-10 right-10 w-20 h-0.5 bg-blue-400 -rotate-45"></div>
                <div className="absolute bottom-10 left-10 w-20 h-0.5 bg-blue-400 -rotate-45"></div>
                <div className="absolute bottom-10 right-10 w-20 h-0.5 bg-blue-400 rotate-45"></div>
            </div>
        </div>

        {/* AI to Wallet Connector (Double Arrows) */}
        <div className="absolute left-[30%] top-[-100px] w-0.5 h-[100px] bg-gradient-to-b from-blue-400 to-transparent opacity-30"></div>
        <div className="absolute right-[30%] top-[-100px] w-0.5 h-[100px] bg-gradient-to-t from-blue-400 to-transparent opacity-30"></div>

        {/* Layer 1: Digital Wallet Module (Top) */}
        <div className="relative w-[400px] h-[250px] bg-white border border-white/20 rounded-3xl -translate-y-[150px] shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex flex-col p-8 animate-in fade-in slide-in-from-bottom-20 delay-500 duration-1000">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                    <div>
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Digital Wallet Module</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">eIDAS 2.0, SSI</p>
                    </div>
                </div>
                <PassportIcon className="w-10 h-10 text-gray-300" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                    <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="w-3/4 h-3 bg-gray-200 rounded-full"></div>
                    <div className="w-1/2 h-3 bg-gray-100 rounded-full"></div>
                </div>
            </div>
        </div>

        {/* Human in the Loop (Side Panel) */}
        <div className="absolute left-[450px] top-[50%] -translate-y-1/2 w-[180px] p-6 bg-blue-600 border border-blue-400 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-right-20 delay-700 duration-1000">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                    <SearchIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter">Human in the Loop</h3>
                    <p className="text-[10px] text-blue-100 font-bold uppercase mt-1">Audit Trail Active</p>
                </div>
            </div>
            {/* Lateral Connection Line */}
            <div className="absolute -left-[50px] top-1/2 w-[50px] h-0.5 bg-blue-400"></div>
        </div>

      </div>

      {/* Floating Labels & Technical Annotations */}
      <div className="absolute bottom-10 left-10 space-y-2">
         <div className="flex items-center gap-3 text-cyan-400/60 text-[10px] font-black uppercase tracking-widest">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            Operational Infrastructure v3.1
         </div>
      </div>
    </div>
  );
};

export default ArchitectureStack;
