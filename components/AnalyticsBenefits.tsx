
import React from 'react';
import { HistoryIcon, ScalesIcon, CubeIcon, EarlyDetectionIcon, AnalyticsMonitorIcon } from './Icons';

const AnalyticsBenefits: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_#111827_0%,_#030712_100%)]">
      
      {/* Background radial glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
        
        {/* Central Hub */}
        <div className="relative z-20 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            <div className="w-48 h-48 bg-white/5 border border-white/20 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                <AnalyticsMonitorIcon className="w-24 h-24 text-white group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/40 rounded-full"></div>
            </div>
            <div className="mt-6 text-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Digital Identity</h3>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Analytics</h3>
            </div>
        </div>

        {/* Orbiting Benefit Nodes */}
        
        {/* 1. Efficiency (Top Left) */}
        <div className="absolute top-[15%] left-[15%] flex flex-col items-center animate-in fade-in slide-in-from-top-10 delay-200 duration-1000">
            <div className="w-20 h-20 rounded-full bg-gray-900 border-2 border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <HistoryIcon className="w-10 h-10 text-white" />
            </div>
            <p className="mt-3 text-xs font-bold text-white uppercase tracking-widest">Efficiency</p>
            {/* SVG Arc to Center */}
            <svg className="absolute left-full top-full w-40 h-40 pointer-events-none opacity-40 overflow-visible" viewBox="0 0 100 100">
                <path d="M 0 0 Q 50 0 50 50" fill="transparent" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="2" fill="white" className="animate-pulse" />
            </svg>
        </div>

        {/* 2. Transparency (Top Right) */}
        <div className="absolute top-[15%] right-[15%] flex flex-col items-center animate-in fade-in slide-in-from-top-10 delay-400 duration-1000">
            <div className="w-20 h-20 rounded-full bg-gray-900 border-2 border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <ScalesIcon className="w-10 h-10 text-white" />
            </div>
            <p className="mt-3 text-xs font-bold text-white uppercase tracking-widest">Transparency</p>
            {/* SVG Arc to Center */}
            <svg className="absolute right-full top-full w-40 h-40 pointer-events-none opacity-40 overflow-visible" viewBox="0 0 100 100">
                <path d="M 100 0 Q 50 0 50 50" fill="transparent" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="2" fill="white" className="animate-pulse" />
            </svg>
        </div>

        {/* 3. Standardization (Bottom Left) */}
        <div className="absolute bottom-[15%] left-[15%] flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 delay-600 duration-1000">
            <div className="w-20 h-20 rounded-full bg-gray-900 border-2 border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <CubeIcon className="w-10 h-10 text-white" />
            </div>
            <p className="mt-3 text-xs font-bold text-white uppercase tracking-widest">Standardization</p>
            {/* SVG Arc to Center */}
            <svg className="absolute left-full bottom-full w-40 h-40 pointer-events-none opacity-40 overflow-visible" viewBox="0 0 100 100">
                <path d="M 0 100 Q 50 100 50 50" fill="transparent" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="2" fill="white" className="animate-pulse" />
            </svg>
        </div>

        {/* 4. Early Detection (Bottom Right) */}
        <div className="absolute bottom-[15%] right-[15%] flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 delay-800 duration-1000">
            <div className="w-20 h-20 rounded-full bg-gray-900 border-2 border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <EarlyDetectionIcon className="w-10 h-10 text-white" />
            </div>
            <p className="mt-3 text-xs font-bold text-white uppercase tracking-widest text-center">Early Detection</p>
            {/* SVG Arc to Center */}
            <svg className="absolute right-full bottom-full w-40 h-40 pointer-events-none opacity-40 overflow-visible" viewBox="0 0 100 100">
                <path d="M 100 100 Q 50 100 50 50" fill="transparent" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="2" fill="white" className="animate-pulse" />
            </svg>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsBenefits;
