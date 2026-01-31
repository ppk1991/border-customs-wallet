
import React, { useState, useEffect } from 'react';
import { WALLETS, analyzeBorderRisk, analyzeCustomsRisk } from '../services/geminiService';
import { CrossingContext, RiskSubResult } from '../types';
import SystemAlerts from './SystemAlerts';
import SISHistory from './SISHistory';
import IntelligencePanel from './CurrencyConverter';
import ProcessFlow from './ProcessFlow';
// Fixed the missing ShieldCheckIcon import
import { CheckCircleIcon, SparklesIcon, WalletIcon, DataFusionIcon, AIInferenceIcon, GaugeIcon, FingerPrintIcon, CubeIcon, GlobeAltIcon, HistoryIcon, ShieldCheckIcon } from './Icons';

const STORAGE_KEYS = {
  WALLET_ID: 'border_core_selected_wallet',
  CONTEXT: 'border_core_crossing_context'
};

const OfficerView: React.FC = () => {
  const walletIds = Object.keys(WALLETS);
  
  const [selectedId, setSelectedId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.WALLET_ID) || walletIds[0];
  });

  const [context, setContext] = useState<CrossingContext>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTEXT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved context", e);
      }
    }
    return {
      direction: 'entry',
      border_type: 'air',
      origin_country: 'AE',
      origin_port: 'DXB',
      destination_country: 'FR',
      arrival_port: 'CDG',
      transport_mode: 'air',
      has_customs_declaration: true,
      declared_goods_value: 1250,
      goods_type: 'electronics',
      goods_usage: 'personal',
      num_items: 3,
      trip_intent: 'tourism'
    };
  });

  const wallet = WALLETS[selectedId] || WALLETS[walletIds[0]];
  const lastCrossing = wallet.owner.crossing_history[0];

  const [borderResult, setBorderResult] = useState<RiskSubResult | null>(null);
  const [customsResult, setCustomsResult] = useState<RiskSubResult | null>(null);
  
  const [isBorderAnalyzing, setIsBorderAnalyzing] = useState(false);
  const [isCustomsAnalyzing, setIsCustomsAnalyzing] = useState(false);
  
  const [fusionStep, setFusionStep] = useState<string>('');
  const [currentStepIcon, setCurrentStepIcon] = useState<React.ReactNode>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLET_ID, selectedId);
  }, [selectedId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTEXT, JSON.stringify(context));
  }, [context]);

  const runAnalysisSteps = async (type: string) => {
    const steps = [
        { label: `(1) ${type} Handshake: Secure Enclave...`, icon: <WalletIcon className="w-5 h-5" /> },
        { label: `(2) Fusing SIS-II & Customs Intel...`, icon: <DataFusionIcon className="w-5 h-5" /> },
        { label: `(3) Running Neural Inference...`, icon: <AIInferenceIcon className="w-5 h-5" /> },
        { label: `(4) Generating Risk Vectors...`, icon: <GaugeIcon className="w-5 h-5" /> }
    ];

    for (const step of steps) {
        setFusionStep(step.label);
        setCurrentStepIcon(step.icon);
        await new Promise(r => setTimeout(r, 450));
    }
  };

  const runBorderAnalysis = async () => {
    setIsBorderAnalyzing(true);
    await runAnalysisSteps('Border Security');
    try {
        const res = await analyzeBorderRisk(wallet, context);
        setBorderResult(res);
    } catch (e) {
        console.error("Border Analysis Error:", e);
    } finally {
        setIsBorderAnalyzing(false);
        setFusionStep('');
    }
  };

  const runCustomsAnalysis = async () => {
    setIsCustomsAnalyzing(true);
    await runAnalysisSteps('Customs Compliance');
    try {
        const res = await analyzeCustomsRisk(wallet, context);
        setCustomsResult(res);
    } catch (e) {
        console.error("Customs Analysis Error:", e);
    } finally {
        setIsCustomsAnalyzing(false);
        setFusionStep('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Traveler Identity */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 text-center flex flex-col items-center">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-3xl bg-gray-900 border-2 border-cyan-500/30 flex items-center justify-center overflow-hidden shadow-inner">
                            <FingerPrintIcon className="w-16 h-16 text-cyan-400/20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg border-4 border-gray-800">
                            <CheckCircleIcon className="w-5 h-5" />
                        </div>
                    </div>
                    
                    <select
                        value={selectedId}
                        onChange={(e) => {
                            setSelectedId(e.target.value);
                            setBorderResult(null);
                            setCustomsResult(null);
                        }}
                        className="mb-4 bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-xs text-cyan-400 outline-none cursor-pointer font-black uppercase tracking-widest focus:ring-2 focus:ring-cyan-500/50 w-full"
                    >
                        {walletIds.map(id => (
                            <option key={id} value={id}>{WALLETS[id].owner.full_name}</option>
                        ))}
                    </select>

                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{wallet.owner.full_name}</h2>
                    <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mt-1">{wallet.owner.citizenship} Citizen</p>

                    {/* Last Crossing Display */}
                    {lastCrossing && (
                      <div className="mt-6 pt-6 border-t border-gray-700/50 w-full text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <GlobeAltIcon className="w-3 h-3 text-gray-500" />
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Last Activity Record</p>
                        </div>
                        <div className="flex flex-col gap-1.5 bg-gray-900/50 p-3 rounded-2xl border border-gray-700/50">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-gray-500 uppercase font-black">Timestamp</span>
                            <span className="text-[11px] text-gray-300 font-bold">{lastCrossing.date}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-gray-500 uppercase font-black">Location</span>
                            <span className="text-[10px] text-cyan-400 font-black uppercase tracking-tight truncate ml-4 text-right">{lastCrossing.bcp_name}</span>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
            </div>

            <SystemAlerts alerts={wallet.owner.system_alerts} />

            {/* Infrastructure Toggle */}
            <button 
                onClick={() => setShowWorkflow(!showWorkflow)}
                className="w-full bg-gray-950/50 border border-gray-700 p-4 rounded-2xl flex items-center justify-between hover:bg-gray-800 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <HistoryIcon className="w-5 h-5 text-cyan-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white">Processing Pipeline</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${showWorkflow ? 'bg-cyan-500 animate-pulse' : 'bg-gray-700'}`}></div>
            </button>
        </div>

        {/* Center/Right: Risk Inference and Decision Support */}
        <div className="lg:col-span-8 space-y-6">
            {showWorkflow ? (
                <div className="bg-gray-800 rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl h-[600px] animate-in fade-in zoom-in-95 duration-500">
                    <div className="p-4 bg-gray-950 border-b border-gray-700 flex justify-between items-center">
                        <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Inference Infrastructure View</h4>
                        <button onClick={() => setShowWorkflow(false)} className="text-gray-500 hover:text-white uppercase text-[8px] font-black tracking-widest">Hide Diagram</button>
                    </div>
                    <ProcessFlow initialMode="stack" />
                </div>
            ) : (
                <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <SparklesIcon className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Unified Assessment Hub</h3>
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">SID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                    </div>

                    {/* Structured Context Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {/* Routing Intelligence Column */}
                        <div className="space-y-6 bg-gray-900/30 p-6 rounded-2xl border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-2">
                                <GlobeAltIcon className="w-4 h-4 text-cyan-400" />
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Routing Logistics</h4>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Origin Port</label>
                                    <input 
                                        type="text" 
                                        value={context.origin_port}
                                        onChange={(e) => setContext({...context, origin_port: e.target.value})}
                                        placeholder="DXB, JFK..."
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-300 outline-none focus:border-cyan-500 transition-colors uppercase"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Arrival Port</label>
                                    <input 
                                        type="text" 
                                        value={context.arrival_port}
                                        onChange={(e) => setContext({...context, arrival_port: e.target.value})}
                                        placeholder="CDG, LHR..."
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-300 outline-none focus:border-cyan-500 transition-colors uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Trip Intent</label>
                                <select 
                                    value={context.trip_intent}
                                    onChange={(e) => setContext({...context, trip_intent: e.target.value as any})}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-300 outline-none focus:border-cyan-500 transition-colors"
                                >
                                    <option value="tourism">Tourism / Leisure</option>
                                    <option value="business">Business / Professional</option>
                                    <option value="transit">Transit / Connection</option>
                                    <option value="family_visit">Visiting Family/Friends</option>
                                    <option value="other">Other / Specialized</option>
                                </select>
                            </div>
                        </div>

                        {/* Customs Compliance Column */}
                        <div className="space-y-6 bg-gray-900/30 p-6 rounded-2xl border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-2">
                                <CubeIcon className="w-4 h-4 text-orange-400" />
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Customs Declaration</h4>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Goods Classification</label>
                                <input 
                                    type="text" 
                                    value={context.goods_type}
                                    onChange={(e) => setContext({...context, goods_type: e.target.value})}
                                    placeholder="Electronics, Clothing, Cash..."
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-300 outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Declared Value (€)</label>
                                    <input 
                                        type="number" 
                                        value={context.declared_goods_value}
                                        onChange={(e) => setContext({...context, declared_goods_value: Number(e.target.value)})}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-300 outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Intended Usage</label>
                                    <select 
                                        value={context.goods_usage}
                                        onChange={(e) => setContext({...context, goods_usage: e.target.value as any})}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-300 outline-none focus:border-cyan-500 transition-colors"
                                    >
                                        <option value="personal">Personal Use</option>
                                        <option value="commercial">Commercial/Resale</option>
                                        <option value="gift">Gift for Third Party</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Triggers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        <button 
                            onClick={runBorderAnalysis}
                            disabled={isBorderAnalyzing || isCustomsAnalyzing}
                            className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 border-b-4 border-blue-800 ${
                                isBorderAnalyzing ? 'bg-blue-900/40 border-blue-500/50 text-blue-400 animate-pulse' : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                        >
                            {isBorderAnalyzing ? (
                                <span className="flex items-center gap-2">
                                    {currentStepIcon} {fusionStep.split(':')[0]}...
                                </span>
                            ) : (
                                <>
                                    <ShieldCheckIcon className="w-5 h-5" />
                                    Run Security Check
                                </>
                            )}
                        </button>

                        <button 
                            onClick={runCustomsAnalysis}
                            disabled={isBorderAnalyzing || isCustomsAnalyzing}
                            className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 border-b-4 border-orange-800 ${
                                isCustomsAnalyzing ? 'bg-orange-900/40 border-orange-500/50 text-orange-400 animate-pulse' : 'bg-orange-600 hover:bg-orange-500 text-white'
                            }`}
                        >
                            {isCustomsAnalyzing ? (
                                <span className="flex items-center gap-2">
                                    {currentStepIcon} {fusionStep.split(':')[0]}...
                                </span>
                            ) : (
                                <>
                                    <CubeIcon className="w-5 h-5" />
                                    Run Customs Audit
                                </>
                            )}
                        </button>
                    </div>

                    {/* Fused Intelligence Panel */}
                    {(borderResult || customsResult) && (
                      <IntelligencePanel 
                        result={{ 
                            border: borderResult || undefined, 
                            customs: customsResult || undefined 
                        }} 
                        traveler={{
                          name: wallet.owner.full_name,
                          id: wallet.credentials[0]?.id_number || 'UNKNOWN',
                          nationality: wallet.owner.nationality
                        }}
                      />
                    )}
                </div>
            )}

            <SISHistory 
                history={wallet.owner.crossing_history} 
                hasAlerts={wallet.owner.system_alerts.length > 0}
            />
        </div>

      </div>
    </div>
  );
};

export default OfficerView;
