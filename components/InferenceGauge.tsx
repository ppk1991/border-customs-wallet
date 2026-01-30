
import React from 'react';

interface InferenceGaugeProps {
  score: number; // 0-100
  label: string;
  size?: 'sm' | 'md';
}

const InferenceGauge: React.FC<InferenceGaugeProps> = ({ score, label, size = 'md' }) => {
  const rotation = (score / 100) * 180 - 90; 
  const isSmall = size === 'sm';

  return (
    <div className={`flex flex-col items-center ${isSmall ? 'scale-75 -my-4' : ''}`}>
      <div className={`relative ${isSmall ? 'w-40 h-24' : 'w-56 h-32'} overflow-hidden flex justify-center items-end`}>
        {/* The Arc */}
        <svg className={`${isSmall ? 'w-36 h-36' : 'w-48 h-48'} -rotate-90 origin-center absolute top-2`} viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="40"
            fill="transparent"
            stroke="#4caf50"
            strokeWidth="10"
            strokeDasharray="41.8 251.2"
            strokeDashoffset="0"
            className="rotate-[180deg] origin-center"
          />
          <circle
            cx="50" cy="50" r="40"
            fill="transparent"
            stroke="#ffc107"
            strokeWidth="10"
            strokeDasharray="41.8 251.2"
            strokeDashoffset="-41.8"
            className="rotate-[180deg] origin-center"
          />
          <circle
            cx="50" cy="50" r="40"
            fill="transparent"
            stroke="#f44336"
            strokeWidth="10"
            strokeDasharray="41.8 251.2"
            strokeDashoffset="-83.6"
            className="rotate-[180deg] origin-center"
          />
        </svg>

        {/* Labels on Arc */}
        {!isSmall && (
          <>
            <div className="absolute top-[35px] left-12 text-[10px] font-medium text-green-700 -rotate-[35deg]">Green</div>
            <div className="absolute top-[18px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-yellow-700">Medium</div>
            <div className="absolute top-[35px] right-12 text-[10px] font-medium text-red-700 rotate-[35deg]">High</div>
          </>
        )}

        {/* The Needle */}
        <div 
          className={`absolute bottom-4 left-1/2 ${isSmall ? 'w-1 h-12' : 'w-1.5 h-16'} bg-[#2d3e50] origin-bottom transition-transform duration-1000 ease-out z-10 rounded-full`}
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
        </div>
        
        {/* Needle Hub */}
        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 ${isSmall ? 'w-3 h-3' : 'w-4 h-4'} bg-[#2d3e50] rounded-full border-2 border-white z-20`}></div>
        
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${isSmall ? 'text-[8px]' : 'text-[10px]'} font-bold text-gray-500 uppercase tracking-tight whitespace-nowrap`}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default InferenceGauge;
