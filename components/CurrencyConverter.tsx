
import React, { useState } from 'react';
import { RiskResult, RiskFactor, RiskSubResult } from '../types';
import InferenceGauge from './InferenceGauge';
import { CheckIcon, SearchIcon, AlertTriangleIcon, ShieldCheckIcon, CubeIcon, AlertOctagonIcon, InfoIcon } from './Icons';

interface RiskAnalysisResultProps {
  result: RiskResult;
  traveler: {
    name: string;
    id: string;
    nationality: string;
  };
}

const CategoryIcon: React.FC<{ category: RiskFactor['category']; className?: string }> = ({ category, className }) => {
  switch (category) {
    case 'identity':
      return <ShieldCheckIcon className={className || "w-3.5 h-3.5 text-blue-500"} />;
    case 'customs':
      return <CubeIcon className={className || "w-3.5 h-3.5 text-orange-500"} />;
    case 'alert':
      return <AlertOctagonIcon className={className || "w-3.5 h-3.5 text-red-500"} />;
    default:
      return <AlertTriangleIcon className={className || "w-3.5 h-3.5 text-gray-400"} />;
  }
};

interface FactorGroupProps {
  title: string;
  source: 'Border' | 'Customs';
  result?: RiskSubResult;
  accentColor: string;
}

const FactorGroup: React.FC<FactorGroupProps> = ({ title, source, result, accentColor }) => {
  if (!result) {
    return (
      <div className="flex-1 min-w-0 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center opacity-60">
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{title}</p>
        <p className="text-[9px] text-gray-400 italic">No Data Pending</p>
      </div>
    );
  }

  const categories: RiskFactor['category'][] = ['identity', 'alert', 'customs'];
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = result.factors.filter(f => f.category === cat);
    return acc;
  }, {} as Record<RiskFactor['category'], RiskFactor[]>);

  const hasAnyFactors = result.factors.length > 0;

  return (
    <div className="flex-1 min-w-0 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className={`px-3 py-2 border-b border-gray-100 flex items-center justify-between ${accentColor === 'blue' ? 'bg-blue-50/50' : 'bg-orange-50/50'}`}>
        <span className={`text-[10px] font-black uppercase tracking-widest ${accentColor === 'blue' ? 'text-blue-700' : 'text-orange-700'}`}>
          {title}
        </span>
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${accentColor === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
          {result.factors.length} INDICATORS
        </span>
      </div>
      
      <div className="p-3 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
        {hasAnyFactors ? (
          categories.map(cat => {
            const factors = grouped[cat];
            if (factors.length === 0) return null;
            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center gap-1.5 mb-1 opacity-70">
                  <CategoryIcon category={cat} className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-gray-500">{cat}</span>
                </div>
                {factors.map((f, i) => (
                  <div key={i} className="pl-4 border-l-2 border-gray-100 py-0.5">
                    <p className="text-[11px] text-gray-600 font-medium leading-snug">
                      {f.message}
                    </p>
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight italic">Clear Record</p>
          </div>
        )}
      </div>
    </div>
  );
};

const IntelligencePanel: React.FC<RiskAnalysisResultProps> = ({ result, traveler }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { border, customs } = result;
  if (!border && !customs) return null;

  const getLevelLabel = (scoreStr: string) => {
    const score = parseInt(scoreStr) || 0;
    if (score < 33) return "Low Risk";
    if (score < 66) return "Medium Risk";
    return "High Risk";
  };

  const factorDefinitions = [
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Evaluates biographical data consistency, credential authenticity, and biometric matching status.',
      icon: <ShieldCheckIcon className="w-5 h-5 text-blue-500" />,
      color: 'blue'
    },
    {
      id: 'customs',
      title: 'Customs Compliance',
      description: 'Profiles baggage content declarations, usage types (Personal/Commercial), and value threshold adherence.',
      icon: <CubeIcon className="w-5 h-5 text-orange-500" />,
      color: 'orange'
    },
    {
      id: 'alert',
      title: 'Active Alerts',
      description: 'Flags matches against international law enforcement databases including SIS II, Interpol Red Notices, and Europol watchlists.',
      icon: <AlertOctagonIcon className="w-5 h-5 text-red-500" />,
      color: 'red'
    }
  ];

  return (
    <div className="w-full bg-[#8ba4b4] p-8 rounded-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 300">
              <circle cx="50" cy="50" r="2" fill="white" />
              <circle cx="200" cy="20" r="2" fill="white" />
              <circle cx="350" cy="80" r="2" fill="white" />
              <circle cx="380" cy="250" r="2" fill="white" />
              <circle cx="20" cy="280" r="2" fill="white" />
              <line x1="50" y1="50" x2="200" y2="20" stroke="white" strokeWidth="0.5" />
              <line x1="200" y1="20" x2="350" y2="80" stroke="white" strokeWidth="0.5" />
              <line x1="350" y1="80" x2="380" y2="250" stroke="white" strokeWidth="0.5" />
          </svg>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="bg-[#4a677d] px-6 py-4 border-b border-[#3a5264] rounded-t-xl flex justify-between items-center">
          <h3 className="text-white text-lg font-medium tracking-tight">
            Joint Intelligence Command – Real-Time Risk Fusion
          </h3>
          <div className="flex gap-2">
            <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/20 uppercase font-black">Secure Officer Stream</span>
          </div>
        </div>

        <div className="bg-[#f0f4f7] grid grid-cols-1 md:grid-cols-12 gap-0.5 rounded-b-xl overflow-hidden">
          <div className="md:col-span-3 bg-white p-8 flex flex-col gap-6 border-r border-gray-100">
            <h4 className="text-[#333] font-semibold text-lg border-b border-gray-100 pb-2">Subject File</h4>
            <div className="space-y-4 text-gray-700 font-medium text-base">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400">Name</p>
                <p className="text-sm">{traveler.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400">Passport/ID</p>
                <p className="text-sm font-mono">{traveler.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400">Country Code</p>
                <p className="text-sm">{traveler.nationality}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-white p-8 flex flex-col items-center">
            <div className="w-full flex justify-around items-end mb-8 border-b border-gray-50 pb-6">
              <div className="flex flex-col items-center">
                <p className="text-[9px] font-black uppercase text-blue-600 mb-2 tracking-widest">Border Logic</p>
                {border ? (
                  <InferenceGauge score={parseInt(border.score)} label={getLevelLabel(border.score)} size="sm" />
                ) : (
                  <div className="w-24 h-16 bg-gray-50 rounded flex items-center justify-center border border-dashed border-gray-200">
                    <span className="text-[8px] text-gray-300 font-bold uppercase">Pending</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[9px] font-black uppercase text-orange-600 mb-2 tracking-widest">Customs Logic</p>
                {customs ? (
                  <InferenceGauge score={parseInt(customs.score)} label={getLevelLabel(customs.score)} size="sm" />
                ) : (
                  <div className="w-24 h-16 bg-gray-50 rounded flex items-center justify-center border border-dashed border-gray-200">
                    <span className="text-[8px] text-gray-300 font-bold uppercase">Pending</span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-3 mb-6 group">
                <h4 className="text-[#333] font-semibold text-lg">Categorized Risk Indicators</h4>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-blue-600"
                  aria-label="Risk category definitions"
                >
                  <InfoIcon className="w-5 h-5" />
                </button>
            </div>
            
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
               <FactorGroup 
                  title="Border Security Factors" 
                  source="Border" 
                  result={border} 
                  accentColor="blue"
               />
               <FactorGroup 
                  title="Customs Compliance Factors" 
                  source="Customs" 
                  result={customs} 
                  accentColor="orange"
               />
            </div>
          </div>

          <div className="md:col-span-3 bg-white p-8 flex flex-col justify-center gap-5 border-l border-gray-100">
            <h4 className="text-[#333] font-semibold text-lg border-b border-gray-100 pb-2 mb-2">Verdict Hub</h4>
            <button className="flex items-center justify-between px-6 py-3.5 bg-[#4caf50] hover:bg-[#43a047] text-white rounded font-bold text-base transition-all group shadow hover:shadow-lg active:scale-95">
              Approve
              <CheckIcon className="w-5 h-5 text-white/80" />
            </button>
            
            <button className="flex items-center justify-between px-6 py-3.5 bg-[#ffc107] hover:bg-[#ffb300] text-white rounded font-bold text-base transition-all group shadow hover:shadow-lg active:scale-95">
              Ref. Secondary
              <SearchIcon className="w-5 h-5 text-white/80" />
            </button>
            
            <button className="flex items-center justify-between px-6 py-3.5 bg-[#f44336] hover:bg-[#e53935] text-white rounded font-bold text-base transition-all group shadow hover:shadow-lg active:scale-95">
              Reject/Inspect
              <AlertTriangleIcon className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>
      </div>

      {/* Risk Definitions Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div 
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                  <div className="bg-[#4a677d] p-6 flex justify-between items-center">
                      <h4 className="text-white font-black uppercase tracking-widest text-sm">Indicator Classifications</h4>
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                  </div>
                  <div className="p-8 space-y-6">
                      {factorDefinitions.map(def => (
                          <div key={def.id} className="flex items-start gap-4">
                              <div className={`p-3 rounded-2xl bg-gray-50 border border-gray-100`}>
                                  {def.icon}
                              </div>
                              <div>
                                  <h5 className="font-bold text-gray-900 mb-1">{def.title}</h5>
                                  <p className="text-xs text-gray-500 leading-relaxed">{def.description}</p>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="bg-gray-50 p-6 flex justify-end">
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2 bg-[#4a677d] text-white rounded-xl font-bold text-sm hover:bg-[#3a5264] transition-colors"
                      >
                        Acknowledge
                      </button>
                  </div>
              </div>
          </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default IntelligencePanel;
