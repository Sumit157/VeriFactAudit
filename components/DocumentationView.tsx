
import React from 'react';

const DocumentationView: React.FC = () => {
  const techs = [
    {
      name: "Google Gemini 3 Pro",
      desc: "Advanced neural reasoning engine used for deep forensic analysis of media artifacts and semantic claim verification.",
      icon: "fa-brain"
    },
    {
      name: "Search Grounding",
      desc: "Real-time verification against global news databases and institutional reports via Google Search integration.",
      icon: "fa-globe"
    },
    {
      name: "React 19 & TypeScript",
      desc: "High-performance frontend architecture ensuring type-safe neural data processing and responsive interaction.",
      icon: "fa-code"
    },
    {
      name: "Tailwind CSS",
      desc: "Utility-first CSS framework enabling the high-fidelity terminal aesthetic and cinematic motion design.",
      icon: "fa-palette"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#080808]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00FF9D] mb-4 block">System Dossier</span>
          <h1 className="text-6xl font-black tracking-tighter mb-8">Core Infrastructure</h1>
          <p className="text-xl text-[#888] font-medium leading-relaxed max-w-3xl">
            VeriFact Audit leverages a multi-layered neural stack designed to detect synthetic anomalies and verify information integrity at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techs.map((tech, i) => (
            <div key={i} className="bg-[#111] border border-[#222] p-10 rounded-2xl hover:border-[#00FF9D] transition-all group">
              <div className="w-12 h-12 bg-[#00FF9D]/10 rounded-lg flex items-center justify-center mb-8 border border-[#00FF9D]/20 group-hover:bg-[#00FF9D] group-hover:text-black transition-all">
                <i className={`fas ${tech.icon} text-lg`}></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">{tech.name}</h3>
              <p className="text-[#666] leading-relaxed group-hover:text-[#AAA] transition-colors">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-gradient-to-r from-[#111] to-[#0A0A0A] border border-[#222] rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <i className="fas fa-microchip text-9xl"></i>
          </div>
          <h2 className="text-3xl font-black mb-6 tracking-tight">Forensic Methodology</h2>
          <div className="space-y-6 text-[#888] font-medium leading-relaxed">
            <p>
              Our audit process begins with <span className="text-white">Neural Anomaly Detection</span>. The system parses frequency domains in media to find patterns inconsistent with organic capture (e.g., GAN artifacts, diffusion noise).
            </p>
            <p>
              Simultaneously, the <span className="text-white">Grounding Engine</span> constructs a temporal web of citations. We don't just find results; we score sources based on historical accuracy, institutional weight, and consensus velocity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationView;
