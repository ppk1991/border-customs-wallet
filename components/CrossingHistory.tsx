
import React from 'react';
import { CrossingHistoryEntry } from '../types';
import { ShieldCheckIcon, CubeIcon, GlobeAltIcon } from './Icons';

interface CrossingHistoryProps {
  history: CrossingHistoryEntry[];
}

// Comprehensive list of Schengen Area members
const SCHENGEN_MEMBER_CODES = [
    'AT', 'BE', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IT', 'LV', 
    'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'SK', 'SI', 'ES', 'SE', 'CH', 'HR', 'RO', 'BG'
];

// EU Members that are NOT in Schengen
const EU_NON_SCHENGEN_CODES = ['IE', 'CY'];

const CrossingHistory: React.FC<CrossingHistoryProps> = ({ history }) => {
  const isSchengen = (code: string) => SCHENGEN_MEMBER_CODES.includes(code.toUpperCase());
  const isEU = (code: string) => isSchengen(code) || EU_NON_SCHENGEN_CODES.includes(code.toUpperCase());

  return (
    <div className="space-y-4 pb-12">
        {history.length > 0 ? (
            <div className="space-y-4">
                {history.map((entry, index) => {
                    const isApproved = entry.outcome === 'Approved';
                    const hasStamp = !!entry.stamp_id;
                    const s1 = isSchengen(entry.origin);
                    const s2 = isSchengen(entry.destination);
                    const e1 = isEU(entry.origin);
                    const e2 = isEU(entry.destination);
                    
                    const isSchengenInternal = s1 && s2;
                    const isEUInternal = e1 && e2;

                    let headerLabel = 'External Frontier';
                    let headerIcon = <GlobeAltIcon className={`w-4 h-4 ${isApproved ? 'text-amber-300' : 'text-red-300'}`} />;
                    let headerBg = 'bg-amber-500/10';
                    
                    if (isSchengenInternal) {
                        headerLabel = 'Internal Mobility';
                        headerIcon = <ShieldCheckIcon className={`w-4 h-4 ${isApproved ? 'text-emerald-300' : 'text-red-300'}`} />;
                        headerBg = 'bg-emerald-500/10';
                    } else if (isEUInternal) {
                        headerLabel = 'Internal Border (EU)';
                        headerIcon = <ShieldCheckIcon className={`w-4 h-4 ${isApproved ? 'text-emerald-300' : 'text-red-300'}`} />;
                        headerBg = 'bg-emerald-500/10';
                    }

                    if (!isApproved) headerBg = 'bg-red-500/20';

                    return (
                        <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] overflow-hidden shadow-lg">
                            <div className={`px-5 py-3 flex justify-between items-center ${headerBg}`}>
                                <div className="flex items-center gap-2">
                                    {headerIcon}
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                        {headerLabel}
                                    </span>
                                </div>
                                <span className="text-[9px] font-mono text-white/50">{entry.stamp_id || 'IDENTITY_VERIFIED'}</span>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Origin</p>
                                            <p className="text-xl font-black text-white">{entry.origin}</p>
                                        </div>
                                        <div className="w-8 h-[2px] bg-white/20 rounded-full"></div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Dest</p>
                                            <p className="text-xl font-black text-white">{entry.destination}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Date</p>
                                        <p className="text-sm font-black text-white/90">{entry.date}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-black/10 rounded-2xl p-3">
                                        <p className="text-[8px] font-black text-white/30 uppercase mb-1">Port / Zone</p>
                                        <p className="text-xs font-bold text-white/80 leading-tight">{entry.bcp_name}</p>
                                    </div>
                                    <div className="bg-black/10 rounded-2xl p-3">
                                        <p className="text-[8px] font-black text-white/30 uppercase mb-1">Mode</p>
                                        <p className="text-xs font-bold text-white/80 leading-tight">{entry.transport_mode}</p>
                                    </div>
                                </div>

                                {entry.customs_clearance_id && (
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CubeIcon className="w-5 h-5 text-blue-300" />
                                            <div>
                                                <p className="text-[9px] font-black text-blue-300 uppercase">Customs Clearance</p>
                                                <p className="text-[10px] font-mono text-white/60">{entry.customs_clearance_id}</p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full font-black border border-blue-500/20">CLEARED</span>
                                    </div>
                                )}

                                <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isApproved ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`}></div>
                                        <span className="text-[10px] font-black text-white/60 uppercase tracking-wider">{entry.outcome}</span>
                                    </div>
                                    <span className="text-[8px] bg-white/10 px-2 py-1 rounded text-white/40 font-black">
                                        {hasStamp ? 'EES_ENCLAVE_SYNC' : isSchengenInternal ? 'INTERNAL_MOBILITY' : isEUInternal ? 'EU_INTERNAL_FRONTIER' : 'EXTERNAL_FRONTIER_VERIFIED'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="bg-white/5 border border-dashed border-white/20 rounded-[2rem] py-16 text-center">
                <p className="text-sm text-white/40 font-bold uppercase tracking-widest">No entry events detected.</p>
            </div>
        )}
    </div>
  );
};

export default CrossingHistory;
