import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Phone, ShieldCheck, HeartHandshake, Layers, RefreshCw, Play, CircleDollarSign } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, setCurrentView, user, startDemoTour, resetToDefaultDemo, isTourActive } = useApp();

  const progressPercent = Math.min(100, Math.round((user.currentSavings / user.targetPreparationAmount) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F8]/95 backdrop-blur-md border-b border-[#F0EBE9]">
      {/* Top Demo Context Bar for Judges */}
      <div className="bg-[#1E232B] text-[#F8FAFC] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-[#E61964]">
            <span className="w-2 h-2 rounded-full bg-[#E61964] animate-pulse"></span>
            HACKATHON DEMO PERSONA:
          </span>
          <span className="hidden sm:inline text-[#CBD5E1]">
            <strong>Akosua</strong> (24, Kejetia Market Trader, Kumasi • 5 months pregnant • Basic phone • GH₵0 start savings)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaultDemo}
            title="Reset demo data to initial state"
            className="flex items-center gap-1 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
          <button
            onClick={startDemoTour}
            className="bg-[#E61964] hover:bg-[#D01255] text-white px-2.5 py-0.5 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E61964] to-[#F43F5E] flex items-center justify-center text-white font-serif font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
                MY
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-xl tracking-tight">
                    <span className="text-[#E61964]">MAMA</span>{' '}
                    <span className="text-[#2E7D46]">YIE</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FDF2F5] text-[#BE123C] border border-[#F8B4C8]">
                    Safe Motherhood
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] leading-none">Earn, save &amp; access care</p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'landing' ? 'bg-[#FDF2F5] text-[#E61964]' : 'text-[#64748B] hover:text-[#1E232B] hover:bg-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('ama')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'ama' ? 'bg-[#FDF2F5] text-[#E61964]' : 'text-[#64748B] hover:text-[#1E232B] hover:bg-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#E61964]" />
              <span>Ama AI</span>
            </button>
            <button
              onClick={() => setCurrentView('earn')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'earn' ? 'bg-[#EDF7EE] text-[#1C592E]' : 'text-[#64748B] hover:text-[#1E232B] hover:bg-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#2E7D46]"></span>
              <span>Earn Money</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'dashboard' ? 'bg-[#FDF2F5] text-[#E61964]' : 'text-[#64748B] hover:text-[#1E232B] hover:bg-white'
              }`}
            >
              Savings Fund
            </button>
            <button
              onClick={() => setCurrentView('circles')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'circles' ? 'bg-[#FDF2F5] text-[#E61964]' : 'text-[#64748B] hover:text-[#1E232B] hover:bg-white'
              }`}
            >
              Support Circles
            </button>
            <button
              onClick={() => setCurrentView('care')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'care' ? 'bg-[#EDF7EE] text-[#1C592E]' : 'text-[#64748B] hover:text-[#1E232B] hover:bg-white'
              }`}
            >
              Vetted Care
            </button>
            <button
              onClick={() => setCurrentView('ussd')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                currentView === 'ussd' ? 'bg-[#1E232B] text-white' : 'text-[#64748B] hover:text-[#1E232B] hover:bg-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#E61964]" />
              <span>USSD (*920*44#)</span>
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'admin' ? 'bg-[#FDF2F5] text-[#E61964]' : 'text-[#64748B] hover:text-[#1E232B]'
              }`}
            >
              Founder Portal
            </button>
          </nav>

          {/* Right Action: Savings Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-white border border-[#F0EBE9] hover:border-[#BAE3C2] rounded-full px-3.5 py-1.5 flex items-center gap-2.5 shadow-xs cursor-pointer transition-all hover:scale-102"
              title="Click to view Akosua's savings fund breakdown"
            >
              <CircleDollarSign className="w-5 h-5 text-[#2E7D46]" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-[#64748B] leading-none">Fund Balance</div>
                <div className="text-sm font-bold text-[#1E232B] leading-tight">
                  GH₵{user.currentSavings}{' '}
                  <span className="text-[11px] font-normal text-[#64748B]">/ GH₵{user.targetPreparationAmount}</span>
                </div>
              </div>
              <div className="hidden sm:block pl-1 text-[11px] font-bold text-[#1C592E] bg-[#EDF7EE] px-1.5 py-0.5 rounded-full">
                {progressPercent}%
              </div>
            </button>

            {/* Mobile USSD shortcut */}
            <button
              onClick={() => setCurrentView('ussd')}
              className="lg:hidden p-2 rounded-lg bg-[#1E232B] text-white"
              title="USSD Simulator"
            >
              <Phone className="w-4 h-4 text-[#E61964]" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Strip */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-[#F0EBE9] no-scrollbar">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'landing' ? 'bg-[#E61964] text-white' : 'bg-white border border-[#F0EBE9] text-[#64748B]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView('ama')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium flex items-center gap-1 ${
              currentView === 'ama' ? 'bg-[#E61964] text-white' : 'bg-white border border-[#F0EBE9] text-[#64748B]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Ama AI
          </button>
          <button
            onClick={() => setCurrentView('earn')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'earn' ? 'bg-[#2E7D46] text-white' : 'bg-[#EDF7EE] text-[#1C592E] font-bold'
            }`}
          >
            Earn Money (Numa)
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'dashboard' ? 'bg-[#E61964] text-white' : 'bg-white border border-[#F0EBE9] text-[#64748B]'
            }`}
          >
            Savings
          </button>
          <button
            onClick={() => setCurrentView('circles')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'circles' ? 'bg-[#E61964] text-white' : 'bg-white border border-[#F0EBE9] text-[#64748B]'
            }`}
          >
            Circles
          </button>
          <button
            onClick={() => setCurrentView('care')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'care' ? 'bg-[#2E7D46] text-white' : 'bg-white border border-[#F0EBE9] text-[#64748B]'
            }`}
          >
            Care
          </button>
          <button
            onClick={() => setCurrentView('ussd')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'ussd' ? 'bg-[#1E232B] text-white' : 'bg-white border border-[#F0EBE9] text-[#64748B]'
            }`}
          >
            USSD
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
              currentView === 'admin' ? 'bg-[#E61964] text-white' : 'bg-white border border-[#F0EBE9] text-[#64748B]'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};
