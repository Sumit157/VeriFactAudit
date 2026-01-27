
import React from 'react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'docs') => void;
  currentView: 'home' | 'docs';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      // Delay scroll until home view is rendered
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-10">
            <div 
              className="flex items-center gap-3 cursor-none" 
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-6 h-6 bg-[#00FF9D] rounded-sm flex items-center justify-center">
                <i className="fas fa-ghost text-black text-xs"></i>
              </div>
              <span className="text-sm font-black tracking-tighter uppercase">VeriFact <span className="opacity-40">Audit</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-[#888]">
              <button 
                onClick={() => onNavigate('docs')}
                className={`transition-colors hover:text-[#00FF9D] ${currentView === 'docs' ? 'text-[#00FF9D]' : ''}`}
              >
                Documentation
              </button>
              <button 
                onClick={(e) => scrollToSection(e, 'intelligence-grid')} 
                className="hover:text-[#00FF9D] transition-colors"
              >
                Neural Log
              </button>
              <a 
                href="https://x.com/googleai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#00FF9D] transition-colors"
              >
                Community
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00FF9D]">
                Neural Link Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
