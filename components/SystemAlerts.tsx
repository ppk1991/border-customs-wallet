
import React from 'react';
import { SystemAlert } from '../types';
import { timeAgo } from '../utils';
import { InfoIcon, AlertTriangleIcon, AlertOctagonIcon, ShieldCheckIcon, CubeIcon } from './Icons';

interface SystemAlertsProps {
  alerts: SystemAlert[];
}

const SOURCE_DESCRIPTIONS: Record<string, string> = {
    'National Police': 'Direct feed from internal state law enforcement databases. Tracks domestic criminal records, local warrants, and regional persons of interest.',
    'Europol': 'EU Agency for Law Enforcement Cooperation. Provides intelligence on organized crime, terrorism, and cross-border criminal activities within the Schengen area.',
    'Interpol': 'Global law enforcement database. Includes Red Notices, alerts for lost/stolen travel documents (SLTD), and international criminal tracking.',
    'Customs Intel': 'Risk profiling based on past trade declarations, suspicious commodity patterns, and shared customs enforcement networks.'
};

const alertConfig = {
  info: {
    icon: InfoIcon,
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-300',
    title: 'Informational',
  },
  warning: {
    icon: AlertTriangleIcon,
    bgColor: 'bg-orange-900/20',
    borderColor: 'border-orange-500/50',
    textColor: 'text-orange-300',
    title: 'Warning',
  },
  critical: {
    icon: AlertOctagonIcon,
    bgColor: 'bg-red-900/30',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-300',
    title: 'CRITICAL',
  },
};

const AlertItem: React.FC<{ alert: SystemAlert }> = ({ alert }) => {
    const config = alertConfig[alert.type];
    const Icon = config.icon;
    return (
        <div className={`p-3 rounded-xl border-l-4 mb-2 last:mb-0 bg-gray-900/40 ${config.borderColor} transition-all hover:bg-gray-800/60`}>
            <div className="flex items-start gap-3">
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.textColor}`} />
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${config.textColor}`}>
                            {config.title} • {alert.source}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">{timeAgo(alert.timestamp)}</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-snug">{alert.message}</p>
                    
                    <div className="mt-1.5 relative group inline-block">
                        <span className="text-[9px] font-bold text-gray-600 hover:text-cyan-500 cursor-help flex items-center gap-1 uppercase">
                            <InfoIcon className="w-2.5 h-2.5" /> Source Intel
                        </span>
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-gray-900 border border-gray-700 text-gray-400 text-[10px] rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible z-50 pointer-events-none">
                            {SOURCE_DESCRIPTIONS[alert.source] || 'No additional source information.'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SystemAlerts: React.FC<SystemAlertsProps> = ({ alerts }) => {
  const borderAlerts = alerts.filter(a => ['National Police', 'Europol', 'Interpol'].includes(a.source));
  const customsAlerts = alerts.filter(a => a.source === 'Customs Intel');

  return (
    <div className="space-y-4">
        {/* Border Security Authority Column */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="px-4 py-2.5 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Border Security Alerts (SIS II)</h3>
                </div>
                <span className={`text-[9px] font-bold px-1.5 rounded ${borderAlerts.length > 0 ? 'bg-red-900/40 text-red-400' : 'bg-gray-700 text-gray-500'}`}>
                    {borderAlerts.length} Active
                </span>
            </div>
            <div className="p-3">
                {borderAlerts.length > 0 ? (
                    borderAlerts.map((alert, idx) => <AlertItem key={idx} alert={alert} />)
                ) : (
                    <div className="py-4 text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight italic">No Security Flags from SIS/LE</p>
                    </div>
                )}
            </div>
        </div>

        {/* Customs Intelligence Column */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="px-4 py-2.5 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CubeIcon className="w-3.5 h-3.5 text-blue-400" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Customs Intelligence Alerts</h3>
                </div>
                <span className={`text-[9px] font-bold px-1.5 rounded ${customsAlerts.length > 0 ? 'bg-orange-900/40 text-orange-400' : 'bg-gray-700 text-gray-500'}`}>
                    {customsAlerts.length} Active
                </span>
            </div>
            <div className="p-3">
                {customsAlerts.length > 0 ? (
                    customsAlerts.map((alert, idx) => <AlertItem key={idx} alert={alert} />)
                ) : (
                    <div className="py-4 text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight italic">No Trade or Revenue Risk Flags</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default SystemAlerts;
