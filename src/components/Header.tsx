import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Phone, ShieldCheck, HeartHandshake, Layers, RefreshCw, Play, CircleDollarSign } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, setCurrentView, user, startDemoTour, resetToDefaultDemo, isTourActive } = useApp();

  const progressPercent = Math.min(100, Math.round((user.currentSavings / user.targetPreparationAmount) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8]">
      {/* Top Demo Context Bar for Judges */}
      <div className="bg-[#281C16] text-[#F4EFE6] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-[#E8824A]">
            <span className="w-2 h-2 rounded-full bg-[#E8824A] animate-pulse"></span>
            HACKATHON DEMO PERSONA:
          </span>
          <span className="hidden sm:inline text-[#D9CAB6]">
            <strong>Akosua</strong> (24, Kejetia Market Trader, Kumasi • 5 months pregnant • Basic phone • GH₵0 start savings)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaultDemo}
            title="Reset demo data to initial state"
            className="flex items-center gap-1 text-[#D9CAB6] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
          <button
            onClick={startDemoTour}
            className="bg-[#E8824A] hover:bg-[#D46E35] text-white px-2.5 py-0.5 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-sm"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>DEMO MAMA YIE (Judge Mode)</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9C4221] to-[#E8824A] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                MY
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-xl tracking-tight text-[#281C16]">MAMA YIE</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FAF1E4] text-[#9C4221] border border-[#E8DFC8]">
                    Twi: Safe Motherhood
                  </span>
                </div>
                <p className="text-[11px] text-[#7A695C] leading-none">Earn, save &amp; access care</p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'landing' ? 'bg-[#FAF1E4] text-[#9C4221]' : 'text-[#5C4A3E] hover:text-[#281C16] hover:bg-[#F4EFE6]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('ama')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'ama' ? 'bg-[#FAF1E4] text-[#9C4221]' : 'text-[#5C4A3E] hover:text-[#281C16] hover:bg-[#F4EFE6]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#E8824A]" />
              <span>Ama AI</span>
            </button>
            <button
              onClick={() => setCurrentView('earn')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'earn' ? 'bg-[#FAF1E4] text-[#9C4221]' : 'text-[#5C4A3E] hover:text-[#281C16] hover:bg-[#F4EFE6]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F]"></span>
              <span>Earn Money</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'dashboard' ? 'bg-[#FAF1E4] text-[#9C4221]' : 'text-[#5C4A3E] hover:text-[#281C16] hover:bg-[#F4EFE6]'
              }`}
            >
              Savings Fund
            </button>
            <button
              onClick={() => setCurrentView('circles')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'circles' ? 'bg-[#FAF1E4] text-[#9C4221]' : 'text-[#5C4A3E] hover:text-[#281C16] hover:bg-[#F4EFE6]'
              }`}
            >
              Support Circles
            </button>
            <button
              onClick={() => setCurrentView('care')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'care' ? 'bg-[#FAF1E4] text-[#9C4221]' : 'text-[#5C4A3E] hover:text-[#281C16] hover:bg-[#F4EFE6]'
              }`}
            >
              Vetted Care
            </button>
            <button
              onClick={() => setCurrentView('ussd')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                currentView === 'ussd' ? 'bg-[#281C16] text-white' : 'text-[#5C4A3E] hover:text-[#281C16] hover:bg-[#F4EFE6]'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#E8824A]" />
              <span>USSD (*920*44#)</span>
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'admin' ? 'bg-[#FAF1E4] text-[#9C4221]' : 'text-[#7A695C] hover:text-[#281C16]'
              }`}
            >
              Founder Portal
            </button>
          </nav>

          {/* Right Action: Savings Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-white border border-[#E8DFC8] hover:border-[#D46E35] rounded-full px-3.5 py-1.5 flex items-center gap-2.5 shadow-xs cursor-pointer transition-all hover:scale-102"
              title="Click to view Akosua's savings fund breakdown"
            >
              <CircleDollarSign className="w-5 h-5 text-[#2D6A4F]" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-[#7A695C] leading-none">Fund Balance</div>
                <div className="text-sm font-bold text-[#281C16] leading-tight">
                  GH₵{user.currentSavings}{' '}
                  <span className="text-[11px] font-normal text-[#7A695C]">/ GH₵{user.targetPreparationAmount}</span>
                </div>
              </div>
              <div className="hidden sm:block pl-1 text-[11px] font-bold text-[#2D6A4F] bg-[#EAF5EF] px-1.5 py-0.5 rounded-full">
                {progressPercent}%
              </div>
            </button>

            {/* Mobile USSD shortcut */}
            <button
              onClick={() => setCurrentView('ussd')}
              className="lg:hidden p-2 rounded-lg bg-[#281C16] text-white"
              title="USSD Simulator"
            >
              <Phone className="w-4 h-4 text-[#E8824A]" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Strip */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-[#E8DFC8]/60 no-scrollbar">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'landing' ? 'bg-[#9C4221] text-white' : 'bg-[#FAF1E4] text-[#5C4A3E]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView('ama')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium flex items-center gap-1 ${
              currentView === 'ama' ? 'bg-[#9C4221] text-white' : 'bg-[#FAF1E4] text-[#5C4A3E]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Ama AI
          </button>
          <button
            onClick={() => setCurrentView('earn')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'earn' ? 'bg-[#2D6A4F] text-white' : 'bg-[#FAF1E4] text-[#2D6A4F] font-bold'
            }`}
          >
            Earn Money (Numa)
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'dashboard' ? 'bg-[#9C4221] text-white' : 'bg-[#FAF1E4] text-[#5C4A3E]'
            }`}
          >
            Savings
          </button>
          <button
            onClick={() => setCurrentView('circles')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'circles' ? 'bg-[#9C4221] text-white' : 'bg-[#FAF1E4] text-[#5C4A3E]'
            }`}
          >
            Circles
          </button>
          <button
            onClick={() => setCurrentView('care')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'care' ? 'bg-[#9C4221] text-white' : 'bg-[#FAF1E4] text-[#5C4A3E]'
            }`}
          >
            Care
          </button>
          <button
            onClick={() => setCurrentView('ussd')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'ussd' ? 'bg-[#281C16] text-white' : 'bg-[#FAF1E4] text-[#5C4A3E]'
            }`}
          >
            USSD
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'admin' ? 'bg-[#9C4221] text-white' : 'bg-[#FAF1E4] text-[#5C4A3E]'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};
