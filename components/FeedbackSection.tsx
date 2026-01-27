
import React, { useState } from 'react';

const FeedbackSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-[#00FF9D]/10 border border-[#00FF9D]/30 p-8 rounded-2xl text-center">
        <h4 className="text-[#00FF9D] font-bold text-sm mb-2 uppercase tracking-widest">Signal Locked.</h4>
        <p className="text-[#00FF9D]/60 text-[10px] uppercase tracking-widest">Feedback ingested for next epoch.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
      <h4 className="text-[11px] font-black uppercase tracking-widest text-[#444] mb-6">Contribute Data</h4>
      <p className="text-sm text-[#888] mb-8 font-medium">Is this audit accurate according to your local nodes?</p>
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => setSubmitted(true)}
          className="w-full py-3 bg-[#00FF9D] text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:brightness-110"
        >
          Affirm Audit
        </button>
        <button 
          onClick={() => setSubmitted(true)}
          className="w-full py-3 bg-transparent border border-[#222] text-[#888] text-[10px] font-bold uppercase tracking-widest rounded-lg hover:border-[#FF3E3E] hover:text-[#FF3E3E]"
        >
          Report Discrepancy
        </button>
      </div>
    </div>
  );
};

export default FeedbackSection;
