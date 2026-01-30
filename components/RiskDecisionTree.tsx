
import React from 'react';
import { DecisionNode } from '../types';
import { CheckCircleIcon, AlertTriangleIcon, AlertOctagonIcon } from './Icons';

interface RiskDecisionTreeProps {
  nodes: DecisionNode[];
  color: 'green' | 'orange' | 'red';
}

const statusConfig = {
    PASSED: {
        icon: CheckCircleIcon,
        colorClass: 'text-emerald-500',
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/30'
    },
    FLAGGED: {
        icon: AlertTriangleIcon,
        colorClass: 'text-orange-500',
        bgClass: 'bg-orange-500/10',
        borderClass: 'border-orange-500/30'
    },
    CRITICAL: {
        icon: AlertOctagonIcon,
        colorClass: 'text-red-500',
        bgClass: 'bg-red-500/10',
        borderClass: 'border-red-500/30'
    }
};

const RiskDecisionTree: React.FC<RiskDecisionTreeProps> = ({ nodes }) => {
  return (
    <div className="mt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
        <h5 className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-4">Tree Traversal Execution</h5>
        
        <div className="relative pl-3 space-y-4">
            {/* Vertical Connector Line with logic path appearance */}
            <div className={`absolute left-[10.5px] top-1 bottom-1 w-[1px] bg-gradient-to-b from-cyan-500/50 via-gray-700 to-transparent`}></div>

            {nodes.map((node, index) => {
                const config = statusConfig[node.status];
                const Icon = config.icon;
                
                return (
                    <div key={index} className="relative group" style={{ transitionDelay: `${index * 100}ms` }}>
                        {/* Logic Node Point */}
                        <div className={`absolute -left-[10.5px] top-1 w-3 h-3 rounded-full border border-gray-800 flex items-center justify-center bg-gray-900 z-10 transition-transform group-hover:scale-125`}>
                             <div className={`w-1 h-1 rounded-full bg-current shadow-[0_0_8px_currentColor] ${config.colorClass}`}></div>
                        </div>

                        <div className={`ml-4 p-2.5 rounded-xl border ${config.borderClass} ${config.bgClass} backdrop-blur-sm transition-all hover:bg-gray-800/40 cursor-default`}>
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[9px] font-black text-white uppercase tracking-tighter">{node.node_name}</span>
                                <div className="flex items-center gap-1">
                                    <Icon className={`w-2.5 h-2.5 ${config.colorClass}`} />
                                    <span className={`text-[7px] font-black uppercase tracking-widest ${config.colorClass}`}>{node.status}</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-gray-400 leading-tight">
                                {node.observation}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default RiskDecisionTree;
