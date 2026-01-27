
import React from 'react';

interface CredibilityGaugeProps {
  score: number;
  invert?: boolean;
}

const CredibilityGauge: React.FC<CredibilityGaugeProps> = ({ score, invert = false }) => {
  const barColor = invert ? 'bg-white' : 'bg-black';
  const trackColor = invert ? 'bg-white/10' : 'bg-black/5';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-80 transition-opacity">
        <span>Trust Index</span>
        <span>{Math.round(score)}%</span>
      </div>
      <div className={`h-[3px] w-full ${trackColor} overflow-hidden`}>
        <div 
          className={`h-full ${barColor} transition-all duration-1000 ease-in-out`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CredibilityGauge;
