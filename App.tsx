
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import DocumentationView from './components/DocumentationView';
import { verifyClaimWithAI, getTrendingClaims } from './services/geminiService';
import { VerificationStatus, AuditResult, GroundingChunk, TrendingSignal } from './types';
import VerdictBadge from './components/VerdictBadge';
import SourceCard from './components/SourceCard';
import FeedbackSection from './components/FeedbackSection';
import CursorFollower from './components/CursorFollower';
import CredibilityGauge from './components/CredibilityGauge';

const CACHE_KEY = 'verifact_trends_cache';
const CACHE_TIME_KEY = 'verifact_trends_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'docs'>('home');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.IDLE);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [trendingSignals, setTrendingSignals] = useState<TrendingSignal[]>([]);
  const [isRefreshingTrends, setIsRefreshingTrends] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    
    const now = Date.now();
    if (cachedData && cachedTime && (now - parseInt(cachedTime)) < CACHE_DURATION) {
      setTrendingSignals(JSON.parse(cachedData));
      return;
    }
    
    refreshTrends();
  };

  const refreshTrends = async () => {
    setIsRefreshingTrends(true);
    try {
      const trends = await getTrendingClaims();
      if (trends.length > 0) {
        setTrendingSignals(trends);
        localStorage.setItem(CACHE_KEY, JSON.stringify(trends));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      }
    } catch (e: any) {
      if (e.message === "QUOTA_EXHAUSTED") {
        console.warn("Trends fetch skipped: Quota exhausted.");
      } else {
        console.error("Signal refresh failed", e);
      }
    } finally {
      setIsRefreshingTrends(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim() && !selectedImage) return;

    setStatus(VerificationStatus.LOADING);
    setError(null);
    setResult(null);

    try {
      const base64Data = selectedImage?.split(',')[1];
      const data = await verifyClaimWithAI(finalQuery || "Analyze media for neural integrity.", base64Data);
      setResult(data);
      setStatus(VerificationStatus.SUCCESS);
      
      setTimeout(() => {
        const report = document.getElementById('audit-report');
        if (report) report.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      if (err.message === "QUOTA_EXHAUSTED") {
        setError("API Quota Depleted. Your Gemini free tier limit has been reached. Please wait a few minutes or check your Google AI Studio dashboard.");
      } else {
        setError(err.message || "Audit interrupted by system exception.");
      }
      setStatus(VerificationStatus.ERROR);
    }
  };

  const triggerAudit = (claim: string) => {
    setView('home');
    setQuery(claim);
    // Use timeout to ensure view switched before triggering verify
    setTimeout(() => handleVerify(undefined, claim), 100);
  };

  const getIntensityStyle = (level: string) => {
    switch(level) {
      case 'Critical': return 'text-[#FF3E3E] bg-[#FF3E3E]/10 border-[#FF3E3E]/20';
      case 'High': return 'text-[#FFB800] bg-[#FFB800]/10 border-[#FFB800]/20';
      case 'Medium': return 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/20';
      default: return 'text-[#888] bg-[#111] border-[#222]';
    }
  };

  const isUrl = (str: string) => {
    try { new URL(str); return true; } catch { return false; }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#EDEDED] flex flex-col">
      <CursorFollower />
      <Header onNavigate={setView} currentView={view} />

      <main className="flex-grow pt-16">
        {view === 'docs' ? (
          <DocumentationView />
        ) : (
          <>
            {/* HERO */}
            <section className="relative py-32 overflow-hidden border-b border-[#1A1A1A]">
              <div className="scanline"></div>
              <div className="pulse-bg absolute inset-0"></div>
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#222] rounded-full mb-8">
                    <span className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF9D]">Neural Forensics Lab v4.2</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                    Neural <br/> <span className="text-[#00FF9D]">Truth Audit.</span>
                  </h1>
                  <p className="text-lg text-[#888] mb-16 max-w-2xl mx-auto font-medium">
                    Detect synthetic media and verify global news events using localized neural analysis and search grounding.
                  </p>

                  <div className="bg-[#111] border border-[#222] rounded-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto focus-within:border-[#00FF9D] transition-all shadow-2xl">
                    <div className="flex-grow flex items-center px-6">
                      <i className="fas fa-search text-[#444] mr-4"></i>
                      <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Describe a claim or paste a news/X URL..."
                        className="bg-transparent w-full py-4 text-sm font-medium focus:outline-none placeholder:text-[#333] cursor-none"
                      />
                    </div>
                    <div className="flex gap-2 p-1">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-4 py-3 rounded-lg border border-[#222] transition-all cursor-none ${selectedImage ? 'text-[#00FF9D] border-[#00FF9D]' : 'text-[#888]'}`}
                      >
                        <i className="fas fa-camera"></i>
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                      <button 
                        onClick={() => handleVerify()}
                        disabled={status === VerificationStatus.LOADING || (!query.trim() && !selectedImage)}
                        className="audit-btn px-10 py-3 rounded-lg flex items-center gap-3 disabled:opacity-20 cursor-none"
                      >
                        {status === VerificationStatus.LOADING ? 'Scanning...' : 'Run Audit'}
                        <i className="fas fa-microscope"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* DYNAMIC INTELLIGENCE FEED */}
            <section id="intelligence-grid" className="py-24 border-b border-[#1A1A1A] bg-[#0A0A0A]">
              <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#444] mb-2 block">Live Pulse</span>
                      <h2 className="text-3xl font-black tracking-tight">Intelligence Grid</h2>
                    </div>
                    <button 
                      onClick={refreshTrends}
                      disabled={isRefreshingTrends}
                      className="flex items-center justify-center w-10 h-10 border border-[#222] rounded-full hover:border-[#00FF9D] hover:text-[#00FF9D] transition-all cursor-none"
                    >
                      <i className={`fas fa-sync-alt text-xs ${isRefreshingTrends ? 'animate-spin' : ''}`}></i>
                    </button>
                  </div>
                  <div className="hidden md:block mono text-[10px] text-[#444]">
                    REFRESH_EPOCH: {new Date().toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingSignals.length > 0 ? trendingSignals.map((sig) => (
                    <div 
                      key={sig.id}
                      onClick={() => triggerAudit(sig.claim)}
                      className="group relative bg-[#0D0D0D] border border-[#1A1A1A] p-8 rounded-xl cursor-none transition-all hover:border-[#00FF9D] hover:shadow-[0_0_40px_rgba(0,255,157,0.03)]"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${getIntensityStyle(sig.intensity)}`}>
                          {sig.category} / {sig.intensity}
                        </div>
                        <span className="mono text-[10px] text-[#222] group-hover:text-[#00FF9D] transition-colors">{sig.timestamp}</span>
                      </div>
                      
                      <h3 className="text-base font-bold leading-relaxed mb-10 group-hover:text-white transition-colors">
                        {sig.claim}
                      </h3>

                      <div className="flex justify-between items-center pt-6 border-t border-[#1A1A1A]">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#333] mb-1">Source</span>
                          <span className="mono text-[10px] text-[#666]">{sig.source}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#333] mb-1">Velocity</span>
                          <span className="mono text-[10px] text-[#666]">{sig.reach}</span>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-[#00FF9D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"></div>
                    </div>
                  )) : (
                    [1,2,3].map(i => (
                      <div key={i} className="bg-[#0C0C0C] border border-[#1A1A1A] p-8 rounded-xl animate-pulse">
                        <div className="h-4 bg-[#1A1A1A] w-1/4 mb-6 rounded"></div>
                        <div className="h-4 bg-[#1A1A1A] w-3/4 mb-4 rounded"></div>
                        <div className="h-4 bg-[#1A1A1A] w-1/2 rounded"></div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* LOADING */}
            {status === VerificationStatus.LOADING && (
              <div className="py-48 text-center">
                <div className="w-24 h-24 border-2 border-[#00FF9D]/20 border-t-[#00FF9D] rounded-full animate-spin mx-auto mb-12"></div>
                <h2 className="text-2xl font-black tracking-tight uppercase mb-4">
                  {isUrl(query) ? 'Reconstructing Intelligence Vector...' : 'Auditing Neural Signatures...'}
                </h2>
                <p className="mono text-[10px] text-[#444] uppercase tracking-widest">Accessing global institutional datasets</p>
              </div>
            )}

            {/* RESULTS */}
            {status === VerificationStatus.SUCCESS && result && (
              <section id="audit-report" className="py-24 bg-[#080808]">
                <div className="container mx-auto px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-10 border-b border-[#222] flex justify-between items-center bg-gradient-to-r from-[#111] to-[#161616]">
                          <VerdictBadge verdict={result.verdict} />
                          <div className="text-right mono text-[10px] text-[#444]">
                            Dossier ID: {result.timestamp.slice(0, 10)}
                          </div>
                        </div>
                        <div className="p-10">
                          {result.text.split('\n').map((line, i) => {
                            const clean = line.replace(/VERDICT:.*|#{1,6}|\*+|-|>/gi, '').trim();
                            if (!clean) return null;
                            const isHeading = line.includes('SUMMARY') || line.includes('REPORT') || line.includes('ANALYSIS');
                            return isHeading ? (
                              <h4 key={i} className="text-xl font-black text-white mt-10 mb-4 tracking-tight uppercase border-l-4 border-[#00FF9D] pl-4">
                                {clean}
                              </h4>
                            ) : (
                              <p key={i} className="text-lg text-[#D1D1D1] mb-6 leading-relaxed font-medium">
                                {clean}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                      <div className="bg-[#111] border border-[#222] rounded-2xl p-8 shadow-xl">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[#444] mb-8">Intelligence Sources</h4>
                        <div className="space-y-8">
                          {result.sources.length > 0 ? (
                            result.sources.map((s, i) => <SourceCard key={i} source={s} />)
                          ) : (
                            <p className="text-[11px] text-[#333] italic">No grounding signals found.</p>
                          )}
                        </div>
                      </div>
                      <FeedbackSection />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ERROR */}
            {status === VerificationStatus.ERROR && (
              <div className="py-48 text-center px-6">
                <div className="inline-block p-12 border border-[#FF3E3E]/30 bg-[#FF3E3E]/5 rounded-2xl max-w-md">
                  <h2 className="text-3xl font-black text-[#FF3E3E] mb-4">Audit Exception</h2>
                  <p className="text-[#888] mb-8">{error}</p>
                  <button 
                    onClick={() => {
                      setStatus(VerificationStatus.IDLE);
                      setError(null);
                    }} 
                    className="px-8 py-3 bg-[#FF3E3E] text-white font-bold rounded-lg cursor-none hover:brightness-110"
                  >
                    Reset System
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="py-24 border-t border-[#1A1A1A] mt-auto">
        <div className="container mx-auto px-6 flex flex-col items-center gap-8">
          <div className="text-center mono text-[10px] text-[#333] uppercase tracking-widest">
            VeriFact Intelligence Laboratory // Secure Connection Active
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#555]">Contact Developer</span>
            <div className="flex gap-8">
              <a 
                href="https://www.instagram.com/sumit_3820?igsh=N2pjNThiOWZ6ZTVv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#333] hover:text-[#00FF9D] transition-all text-xl"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://www.linkedin.com/in/sumit-babar-su7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#333] hover:text-[#00FF9D] transition-all text-xl"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
