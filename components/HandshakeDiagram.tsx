
import React from 'react';
import { LockIcon, LaptopIcon, SmartphoneIcon, ShieldCheckIcon, SparklesIcon } from './Icons';

const HandshakeDiagram: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-[#a3b8c2]">
      
      {/* Background Plexus Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>
      </div>

      <div className="relative w-full max-w-4xl flex items-center justify-between px-12 sm:px-24">
        
        {/* Left Side: Border Officer System */}
        <div className="flex flex-col items-center gap-6 z-10 animate-in fade-in slide-in-from-left-10 duration-1000">
           <div className="relative">
                {/* Laptop Graphic */}
                <div className="w-56 h-36 bg-gray-300 rounded-lg border-2 border-gray-400 shadow-xl flex items-center justify-center relative">
                    <div className="w-[90%] h-[85%] bg-gray-100 rounded border border-gray-300 flex items-center justify-center overflow-hidden">
                        {/* Mini Gauge Mock */}
                        <div className="w-24 h-12 relative overflow-hidden">
                            <svg className="w-24 h-24 -rotate-90 origin-center" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4caf50" strokeWidth="15" strokeDasharray="41.8 251.2" strokeDashoffset="0" className="rotate-[180deg] origin-center" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ffc107" strokeWidth="15" strokeDasharray="41.8 251.2" strokeDashoffset="-41.8" className="rotate-[180deg] origin-center" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f44336" strokeWidth="15" strokeDasharray="41.8 251.2" strokeDashoffset="-83.6" className="rotate-[180deg] origin-center" />
                            </svg>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gray-800 origin-bottom rotate-[-30deg]"></div>
                        </div>
                    </div>
                </div>
                <div className="w-64 h-2 bg-gray-400 rounded-b-lg shadow-lg -mt-1 mx-auto"></div>

                {/* Annotation Bubbles Left */}
                <div className="absolute -top-16 -left-8 w-28 h-12 bg-white/40 border border-white rounded-xl backdrop-blur-sm animate-bounce delay-100"></div>
                <div className="absolute top-16 -left-20 w-32 h-14 bg-white/40 border border-white rounded-xl backdrop-blur-sm animate-pulse delay-500"></div>
                
                {/* Connecting lines for annotations */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100">
                   <path d="M -10 -20 Q 10 -10 20 20" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                   <path d="M -20 50 Q 10 50 30 50" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                </svg>
           </div>
           <p className="text-sm font-bold text-white uppercase tracking-tighter">Border Officer System</p>
        </div>

        {/* Center: Secure Connection Handshake */}
        <div className="flex-1 flex items-center justify-center relative">
            {/* Dotted Connection Line */}
            <div className="w-full h-0.5 border-t-2 border-dashed border-white opacity-40"></div>
            
            {/* Marching Ants Animation Line Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-marching-ants"></div>
            </div>

            {/* Glowing Lock */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.8)] border border-gray-200 animate-pulse z-20">
                    <LockIcon className="w-10 h-10 text-gray-400" />
                </div>
                
                {/* Floating Security Icons */}
                <div className="absolute -top-12 left-8 flex gap-4">
                     <div className="p-2 bg-white/30 rounded-lg backdrop-blur-md border border-white/50 animate-bounce">
                        <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                             <div className="bg-gray-600 rounded-sm"></div>
                             <div className="bg-transparent rounded-sm"></div>
                             <div className="bg-transparent rounded-sm"></div>
                             <div className="bg-gray-600 rounded-sm"></div>
                        </div>
                     </div>
                     <ShieldCheckIcon className="w-6 h-6 text-white drop-shadow-lg animate-pulse" />
                     <SparklesIcon className="w-6 h-6 text-yellow-100 drop-shadow-lg animate-spin-slow" />
                </div>
            </div>
            
            {/* Directional Arrow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
                 <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-white opacity-60"></div>
            </div>
        </div>

        {/* Right Side: Digital Wallet */}
        <div className="flex flex-col items-center gap-6 z-10 animate-in fade-in slide-in-from-right-10 duration-1000">
            <div className="relative">
                {/* Smartphone Graphic */}
                <div className="w-28 h-56 bg-gray-700 rounded-[2.5rem] border-4 border-gray-600 shadow-2xl flex items-center justify-center relative p-1 overflow-hidden">
                    <div className="w-full h-full bg-[#f0f4f8] rounded-[2rem] flex flex-col p-4 gap-3">
                        <div className="w-full h-16 bg-gray-400/30 rounded-xl"></div>
                        <div className="w-full h-8 bg-gray-400/20 rounded-lg"></div>
                        <div className="w-3/4 h-3 bg-gray-400/20 rounded-full"></div>
                        <div className="w-1/2 h-3 bg-gray-400/10 rounded-full"></div>
                    </div>
                </div>

                {/* Annotation Bubbles Right */}
                <div className="absolute -top-12 -right-8 w-24 h-24 bg-white/40 border border-white rounded-[30px] backdrop-blur-sm animate-pulse"></div>
                <div className="absolute bottom-4 -right-20 w-28 h-12 bg-white/40 border border-white rounded-xl backdrop-blur-sm animate-bounce delay-300"></div>

                {/* Connecting lines for annotations */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100">
                   <path d="M 110 -10 Q 100 10 90 20" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                   <path d="M 120 80 Q 100 80 90 80" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                </svg>
            </div>
            <p className="text-sm font-bold text-white uppercase tracking-tighter">Digital Wallet</p>
        </div>

      </div>

      {/* Styles for animation */}
      <style>{`
        @keyframes marching-ants {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        .animate-marching-ants {
          animation: marching-ants 3s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HandshakeDiagram;
