
import React from 'react';

interface VerdictBadgeProps {
  verdict: string;
}

const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict }) => {
  const v = verdict.toUpperCase();
  const isSynthetic = v.includes('SYNTHETIC') || v.includes('AI');
  const isFalse = v.includes('FALSE');
  const isTrue = v.includes('TRUE');

  let colorClass = 'text-[#888] border-[#222] bg-[#111]';
  let icon = 'fa-question-circle';

  if (isSynthetic || isFalse) {
    colorClass = 'text-[#FF3E3E] border-[#FF3E3E]/30 bg-[#FF3E3E]/5';
    icon = isSynthetic ? 'fa-microchip' : 'fa-exclamation-triangle';
  } else if (isTrue) {
    colorClass = 'text-[#00FF9D] border-[#00FF9D]/30 bg-[#00FF9D]/5';
    icon = 'fa-check-circle';
  }

  return (
    <div className={`inline-flex items-center gap-4 px-6 py-3 border rounded-lg ${colorClass} transition-all`}>
      <i className={`fas ${icon} animate-pulse`}></i>
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50">Audit Verdict</span>
        <span className="text-xl font-black tracking-tighter uppercase">{verdict}</span>
      </div>
    </div>
  );
};

export default VerdictBadge;
