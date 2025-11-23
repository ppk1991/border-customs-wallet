import React from 'react';
import { RiskResult } from '../types';

interface RiskAnalysisResultProps {
  result: RiskResult;
}

const colorMap = {
  green: 'text-green-400 border-green-500',
  orange: 'text-orange-400 border-orange-500',
  red: 'text-red-400 border-red-500',
};

const RiskAnalysisResult: React.FC<RiskAnalysisResultProps> = ({ result }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-cyan-400">Risk Analysis Result</h3>
      
      <div className="flex space-x-8 items-center">
        <div className={`p-4 border-l-4 ${colorMap[result.color]} bg-gray-800 rounded-r-lg`}>
            <p className="text-sm text-gray-400">Risk Score (0-100)</p>
            <p className="text-4xl font-bold">{result.score}</p>
        </div>
        <div>
            <p className="text-lg font-semibold">
                Risk Level: <span className={`${colorMap[result.color].split(' ')[0]} font-bold`}>{result.level}</span>
            </p>
        </div>
      </div>

      <div>
        <p className="font-semibold text-gray-300">Explanation:</p>
        <div className="mt-2 p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-300">
            {result.explanation}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-cyan-400 mt-6">Decision Options</h3>
        <div className="flex space-x-4 mt-4">
            <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition">Approve</button>
            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded transition">Send to secondary inspection</button>
            <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition">Hold / deny</button>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysisResult;