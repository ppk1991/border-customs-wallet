import React from 'react';
import { CrossingHistoryEntry } from '../types';
import { GlobeAltIcon } from './Icons';

interface CrossingHistoryProps {
  history: CrossingHistoryEntry[];
}

const outcomeColorMap: Record<CrossingHistoryEntry['outcome'], string> = {
    'Approved': 'text-green-400',
    'Secondary Inspection': 'text-orange-400',
    'Denied': 'text-red-400',
};


const CrossingHistory: React.FC<CrossingHistoryProps> = ({ history }) => {
  return (
    <div className="space-y-3">
        {history.length > 0 ? (
            history.map((entry, index) => (
                <div key={index} className="flex items-center bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="mr-4">
                        <GlobeAltIcon className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-gray-400">Date</p>
                            <p className="text-gray-200">{entry.date}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-400">Origin</p>
                            <p className="text-gray-200">{entry.origin}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-400">Destination</p>
                            <p className="text-gray-200">{entry.destination}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-400">Outcome</p>
                            <p className={`font-bold ${outcomeColorMap[entry.outcome]}`}>{entry.outcome}</p>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center text-gray-500 py-4 bg-gray-800 rounded-lg">
                No border crossing history available.
            </div>
        )}
    </div>
  );
};

export default CrossingHistory;
