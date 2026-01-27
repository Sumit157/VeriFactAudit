
import React from 'react';
import { GroundingChunk } from '../types';

interface SourceCardProps {
  source: GroundingChunk;
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  const data = source.web || source.maps;
  const score = source.credibilityScore || 50;

  if (!data) return null;

  return (
    <div className="group border-b border-[#222] pb-6 last:border-0 last:pb-0">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#444] group-hover:text-[#00FF9D] transition-colors">
          {source.sourceType || 'Node'}
        </span>
        <span className="mono text-[10px] text-[#444]">{Math.round(score)}%</span>
      </div>
      <h5 className="text-sm font-bold text-[#AAA] group-hover:text-white leading-tight">
        <a href={data.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2">
          <span className="line-clamp-2">{data.title || "Unknown Fragment"}</span>
          <i className="fas fa-external-link-alt text-[10px] opacity-0 group-hover:opacity-40"></i>
        </a>
      </h5>
    </div>
  );
};

export default SourceCard;
