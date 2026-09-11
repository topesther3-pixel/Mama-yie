import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UssdSimulator } from './UssdSimulator';
import { Phone, RefreshCw, Play, LogOut, X, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AppMenuDrawer: React.FC = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    user,
    resetToDefaultDemo,
    startDemoTour,
    setCurrentView,
  } = useApp();
  const [showUssdModal, setShowUssdModal] = useState(false);

  if (!isMenuOpen && !showUssdModal) return null;

  return (
    <>
      {/* Slide-over Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-xs h-full flex flex-col justify-between p-6 shadow-2xl border-l border-[#E8DFC8]"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9C4221] to-[#E8824A] flex items-center justify-center text-white font-serif font-bold text-lg">
                      MY
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#281C16]">Mama Yie</h3>
                      <p className="text-[11px] text-[#8C7A6D]">Demo &amp; Tools</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 rounded-xl text-[#8C7A6D] hover:text-[#281C16] hover:bg-[#FAF7F2] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Card */}
                <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8DFC8] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-base text-[#281C16]">{user.name}</span>
                    <span className="text-[10px] font-bold uppercase bg-[#FAF1E4] text-[#9C4221] px-2 py-0.5 rounded-full border border-[#E8DFC8]">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#7A695C]">{user.occupation}</p>
                  <p className="text-xs text-[#7A695C]">{user.facility}</p>
                </div>

                {/* Menu Action Items */}
                <div className="space-y-2">
                  {/* USSD Feature Phone Simulator */}
                  <button
                    id="menu-open-ussd-btn"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowUssdModal(true);
                    }}
                    className="w-full bg-white hover:bg-[#FAF7F2] border border-[#E8DFC8] rounded-2xl p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF1E4] text-[#9C4221] flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#281C16]">Feature Phone USSD</div>
                        <div className="text-[10px] text-[#8C7A6D]">Dial *920*44# (No internet)</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C7A6D] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Judge Mode Walkthrough */}
                  <button
                    id="menu-open-tour-btn"
                    onClick={() => {
                      setIsMenuOpen(false);
                      startDemoTour();
                    }}
                    className="w-full bg-white hover:bg-[#FAF7F2] border border-[#E8DFC8] rounded-2xl p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF1E4] text-[#E8824A] flex items-center justify-center shrink-0">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#281C16]">Demo Walkthrough</div>
                        <div className="text-[10px] text-[#8C7A6D]">Guided Hackathon Tour</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C7A6D] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Reset Demo State */}
                  <button
                    id="menu-reset-demo-btn"
                    onClick={() => {
                      resetToDefaultDemo();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-white hover:bg-[#FAF7F2] border border-[#E8DFC8] rounded-2xl p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#5C4A3E] flex items-center justify-center shrink-0">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#281C16]">Reset Demo Data</div>
                        <div className="text-[10px] text-[#8C7A6D]">Restore initial GH₵120 fund</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C7A6D] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Bottom Logout */}
              <div className="pt-4 border-t border-[#E8DFC8]">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setCurrentView('login');
                  }}
                  className="w-full py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF1E4] text-[#9C4221] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Switch Phone / Log Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* USSD Simulator Modal Dialog */}
      <AnimatePresence>
        {showUssdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#281C16] text-[#FAF7F2] rounded-3xl max-w-sm w-full p-4 border border-[#E8DFC8]/30 shadow-2xl relative max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#FAF1E4]/10">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Phone className="w-4 h-4 text-[#E8824A]" />
                  <span>Basic Phone USSD (*920*44#)</span>
                </div>
                <button
                  onClick={() => setShowUssdModal(false)}
                  className="p-1 rounded-lg text-[#D9CAB6] hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <UssdSimulator />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
