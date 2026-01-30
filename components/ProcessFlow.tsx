
import React, { useState } from 'react';
import { WalletIcon, DataFusionIcon, AIInferenceIcon, GaugeIcon, TabletCheckIcon, SwitchVerticalIcon, CheckIcon } from './Icons';
import ArchitectureStack from './ArchitectureStack';
import AnalyticsBenefits from './AnalyticsBenefits';
import HandshakeDiagram from './HandshakeDiagram';

const steps = [
    { id: 1, name: 'Wallet Scan', icon: WalletIcon },
    { id: 2, name: 'Data Fusion', icon: DataFusionIcon },
    { id: 3, name: 'AI Inference', icon: AIInferenceIcon },
    { id: 4, name: 'Risk Score', icon: GaugeIcon },
    { id: 5, name: 'Dashboard Decision', icon: TabletCheckIcon },
];

const complianceItems = [
    "Real-time inference < 1s latency",
    "Explainable AI (no black box)",
    "Compliant with GDPR + EU AI Act (high-risk use case)"
];

type ViewMode = 'pipeline' | 'stack' | 'analytics' | 'handshake';

const ProcessFlow: React.FC<{ initialMode?: ViewMode }> = ({ initialMode = 'pipeline' }) => {
    const [viewMode, setViewMode] = useState<ViewMode>(initialMode);

    const cycleView = () => {
        if (viewMode === 'pipeline') setViewMode('stack');
        else if (viewMode === 'stack') setViewMode('analytics');
        else if (viewMode === 'analytics') setViewMode('handshake');
        else setViewMode('pipeline');
    };

    const getToggleLabel = () => {
        if (viewMode === 'pipeline') return 'Show Architecture Stack';
        if (viewMode === 'stack') return 'Show Analytics Benefits';
        if (viewMode === 'analytics') return 'Show Interaction Handshake';
        return 'Show Operational Pipeline';
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#111827] relative overflow-hidden">
            
            {/* View Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <button 
                    onClick={cycleView}
                    className="flex items-center gap-2 bg-gray-950/80 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-cyan-500 transition-all shadow-2xl backdrop-blur-md"
                >
                    <SwitchVerticalIcon className="w-4 h-4" />
                    {getToggleLabel()}
                </button>
            </div>

            {viewMode === 'handshake' && <HandshakeDiagram />}
            {viewMode === 'analytics' && <AnalyticsBenefits />}
            {viewMode === 'stack' && <ArchitectureStack />}

            {viewMode === 'pipeline' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[500px] animate-in fade-in duration-1000">
                    
                    {/* Background Neural Grid (Plexus) */}
                    <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <circle cx="1" cy="1" r="0.5" fill="white" />
                                <path d="M 1 1 L 10 10" stroke="white" strokeWidth="0.1" strokeDasharray="1 1" />
                            </pattern>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Step Row */}
                    <div className="relative z-10 flex items-center justify-between w-full max-w-5xl mb-20">
                        
                        {/* Connection Arrows Layer */}
                        <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 flex items-center justify-around px-20 pointer-events-none">
                             {steps.map((_, i) => i < steps.length - 1 && (
                                <div key={i} className="flex-1 flex items-center justify-center">
                                    <svg className="w-16 h-4 text-cyan-400 opacity-40" viewBox="0 0 100 20">
                                        <path d="M 0 10 L 90 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                        <path d="M 85 5 L 95 10 L 85 15" fill="currentColor" />
                                    </svg>
                                </div>
                             ))}
                        </div>

                        {/* Large Arced Jump Arrows */}
                        <div className="absolute inset-x-0 -top-16 pointer-events-none opacity-30">
                            <svg className="w-full h-20" viewBox="0 0 800 100" preserveAspectRatio="none">
                                <path d="M 120 80 Q 220 20 320 80" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
                                <path d="M 480 80 Q 580 20 680 80" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
                                <circle cx="320" cy="80" r="3" fill="white" />
                                <circle cx="680" cy="80" r="3" fill="white" />
                            </svg>
                        </div>

                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.id} className="relative z-20 flex flex-col items-center group">
                                    {/* High-Fidelity Node */}
                                    <div className="relative">
                                        {/* Outer Glow Ring */}
                                        <div className="absolute -inset-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 animate-pulse"></div>
                                        {/* Inner Ring */}
                                        <div className="absolute -inset-1.5 rounded-full border-2 border-cyan-400/30 group-hover:border-cyan-400 transition-colors duration-500"></div>
                                        
                                        {/* Main Circle */}
                                        <div className="w-24 h-24 rounded-full bg-[#1e293b] border-2 border-white/60 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_50px_rgba(34,211,238,0.3)] transition-all duration-500 relative z-10">
                                            <Icon className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </div>
                                    
                                    {/* Label */}
                                    <div className="absolute top-full mt-6 text-center w-32">
                                        <p className="text-[10px] font-black text-white/80 uppercase tracking-tighter whitespace-nowrap">
                                            ({step.id}) {step.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Compliance Section (Bottom Checklist) */}
                    <div className="mt-12 w-full max-w-xl space-y-4 relative z-10">
                        {complianceItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-gray-100 group">
                                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 shadow-inner">
                                    <CheckIcon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-semibold tracking-wide text-gray-200 group-hover:text-white transition-colors">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProcessFlow;
