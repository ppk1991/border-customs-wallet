
import React from 'react';
import { CrossingHistoryEntry } from '../types';
import { AlertOctagonIcon, CheckCircleIcon, ShieldCheckIcon, GlobeAltIcon } from './Icons';

// Comprehensive list of Schengen Area members
const SCHENGEN_MEMBER_CODES = [
    'AT', 'BE', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IT', 'LV', 
    'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'SK', 'SI', 'ES', 'SE', 'CH', 'HR', 'RO', 'BG'
];

// EU Members that are NOT in Schengen
const EU_NON_SCHENGEN_CODES = ['IE', 'CY'];

// Helper to check memberships
const isSchengen = (code: string) => SCHENGEN_MEMBER_CODES.includes(code.toUpperCase());
const isEU = (code: string) => isSchengen(code) || EU_NON_SCHENGEN_CODES.includes(code.toUpperCase());

interface SISHistoryProps {
  history: CrossingHistoryEntry[];
  hasAlerts: boolean;
}

const SchengenBadge: React.FC<{ code: string }> = ({ code }) => {
    const isS = isSchengen(code);
    const isE = isEU(code);
    
    let typeChar = 'E';
    let bgColor = 'bg-gray-600';
    let tooltip = 'External State (Non-EU)';

    if (isS) {
        typeChar = 'S';
        bgColor = 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]';
        tooltip = 'Schengen Area Member';
    } else if (isE) {
        typeChar = 'EU';
        bgColor = 'bg-emerald-600';
        tooltip = 'EU Member (Non-Schengen)';
    }

    return (
        <div className="flex items-center gap-1 group relative">
            <span className="font-bold text-gray-200">{code}</span>
            <div className={`w-3.5 h-3.5 ${bgColor} rounded-full flex items-center justify-center text-[6px] font-bold text-white cursor-help`}>
                {typeChar}
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 p-2 bg-gray-900 border border-gray-700 text-[8px] text-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center shadow-xl">
                {tooltip}
            </div>
        </div>
    );
};

const SISHistory: React.FC<SISHistoryProps> = ({ history, hasAlerts }) => {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-6 bg-cyan-500 rounded-full"></div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1 text-[#FFCC00]">EES / SIS II Identity Stream</h3>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Biometric & Travel History Audit</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className={`flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
             hasAlerts ? 'bg-red-900/40 text-red-400 border border-red-800' : 'bg-green-900/40 text-green-400 border border-green-800'
           }`}>
             {hasAlerts ? (
               <><AlertOctagonIcon className="w-3 h-3 mr-1" />Flags Detected</>
             ) : (
               <><CheckCircleIcon className="w-3 h-3 mr-1" />Clear Profile</>
             )}
           </div>
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700/50">
                <th className="pb-2 font-black uppercase tracking-tighter">Event Date</th>
                <th className="pb-2 font-black uppercase tracking-tighter">Route</th>
                <th className="pb-2 font-black uppercase tracking-tighter">Status Type</th>
                <th className="pb-2 font-black uppercase tracking-tighter text-center">Auth ID</th>
                <th className="pb-2 font-black uppercase tracking-tighter text-right">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {history.map((entry, idx) => {
                const s1 = isSchengen(entry.origin);
                const s2 = isSchengen(entry.destination);
                const e1 = isEU(entry.origin);
                const e2 = isEU(entry.destination);
                
                let crossingType = "EXTERNAL FRONTIER";
                let typeColor = "text-amber-500";
                
                if (s1 && s2) {
                    crossingType = "SCHENGEN INTERNAL";
                    typeColor = "text-blue-400/80";
                } else if (e1 && e2) {
                    crossingType = "EU INTERNAL BORDER";
                    typeColor = "text-emerald-400";
                } else if (!e1 && !e2) {
                    crossingType = "EXTERNAL TRANSIT";
                    typeColor = "text-gray-500";
                }

                return (
                  <tr key={idx} className="hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 font-mono text-gray-300 whitespace-nowrap">{entry.date}</td>
                    <td className="py-3">
                        <div className="flex items-center gap-2">
                            <SchengenBadge code={entry.origin} />
                            <span className="text-gray-600">→</span>
                            <SchengenBadge code={entry.destination} />
                        </div>
                    </td>
                    <td className="py-3">
                        <div className="flex items-center gap-2">
                            {crossingType.includes("INTERNAL") ? (
                                <ShieldCheckIcon className={`w-3 h-3 ${typeColor.replace('text-', 'text-opacity-50 ')}`} />
                            ) : (
                                <GlobeAltIcon className={`w-3 h-3 ${typeColor}`} />
                            )}
                            <span className={`font-black tracking-tighter ${typeColor}`}>{crossingType}</span>
                        </div>
                        <span className="text-gray-500 text-[8px] block mt-0.5 uppercase">{entry.transport_mode}</span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1 font-mono text-[9px] text-gray-500">
                        {entry.stamp_id ? (
                            <span className="bg-gray-700/50 px-1.5 py-0.5 rounded text-cyan-600 border border-cyan-900/30">{entry.stamp_id}</span>
                        ) : (
                            <span className="italic">IDENTITY_ONLY</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                        entry.outcome === 'Approved' ? 'bg-green-950 text-green-400 border border-green-900' : 
                        entry.outcome === 'Denied' ? 'bg-red-950 text-red-400 border border-red-800' :
                        'bg-orange-950 text-orange-400 border border-orange-900'
                      }`}>
                        {entry.outcome.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center text-[9px] text-gray-500 font-mono">
          <div>STAMP_VAULT_ACTIVE | SYNC: {new Date().toLocaleTimeString()}</div>
          <div className="flex items-center gap-1"><ShieldCheckIcon className="w-3 h-3 text-cyan-500" />EES-SIS-FUSE_V2</div>
        </div>
      </div>
    </div>
  );
};

export default SISHistory;
