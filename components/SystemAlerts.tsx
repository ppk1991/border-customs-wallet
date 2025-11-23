import React from 'react';
import { SystemAlert } from '../types';
import { timeAgo } from '../utils';
import { InfoIcon, AlertTriangleIcon, AlertOctagonIcon } from './Icons';

interface SystemAlertsProps {
  alerts: SystemAlert[];
}

const alertConfig = {
  info: {
    icon: InfoIcon,
    bgColor: 'bg-blue-900/50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-300',
    title: 'Informational Alert',
  },
  warning: {
    icon: AlertTriangleIcon,
    bgColor: 'bg-orange-900/50',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-300',
    title: 'Warning',
  },
  critical: {
    icon: AlertOctagonIcon,
    bgColor: 'bg-red-900/50',
    borderColor: 'border-red-500',
    textColor: 'text-red-300',
    title: 'CRITICAL ALERT',
  },
};


const SystemAlerts: React.FC<SystemAlertsProps> = ({ alerts }) => {
  return (
    <div>
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">System Alerts & Flags</h3>
        <div className="space-y-3">
            {alerts.length > 0 ? (
                alerts.map((alert, index) => {
                    const config = alertConfig[alert.type];
                    const Icon = config.icon;
                    return (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${config.borderColor} ${config.bgColor}`}>
                           <div className="flex items-start">
                                <Icon className={`w-6 h-6 mr-3 shrink-0 ${config.textColor}`} />
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <h4 className={`font-bold ${config.textColor}`}>{config.title}</h4>
                                        <span className="text-xs text-gray-400">{timeAgo(alert.timestamp)}</span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                                    <p className="text-xs text-gray-500 mt-2">Source: {alert.source}</p>
                                </div>
                           </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center text-gray-500 py-4 px-2 bg-gray-800 rounded-lg border border-gray-700">
                    No active system alerts for this traveler.
                </div>
            )}
        </div>
    </div>
  );
};

export default SystemAlerts;