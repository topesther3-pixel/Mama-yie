import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UssdSimulator } from './UssdSimulator';
import { WhatsAppIcon, WhatsAppChannelSection } from './WhatsAppChannelSection';
import { Phone, RefreshCw, Play, LogOut, X, Sparkles, ShieldCheck, ChevronRight, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AppMenuDrawer: React.FC = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    user,
    resetToDefaultDemo,
    startDemoTour,
    setCurrentView,
    openHospitalLocator,
  } = useApp();
  const [showUssdModal, setShowUssdModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  if (!isMenuOpen && !showUssdModal && !showWhatsAppModal) return null;

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
              className="bg-white w-full max-w-xs h-full flex flex-col justify-between p-6 shadow-2xl border-l border-[#F0EBE9]"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE9]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E61964] to-[#F8B4C8] flex items-center justify-center text-white font-serif font-bold text-lg shadow-xs">
                      MY
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#1E232B]">Mama Yie</h3>
                      <p className="text-[11px] text-[#64748B]">Demo &amp; Tools</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 rounded-xl text-[#64748B] hover:text-[#1E232B] hover:bg-[#FAF8F8] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Card */}
                <div className="bg-[#FAF8F8] rounded-2xl p-4 border border-[#F0EBE9] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-base text-[#1E232B]">{user.name}</span>
                    <span className="text-[10px] font-bold uppercase bg-[#FDF2F5] text-[#E61964] px-2 py-0.5 rounded-full border border-[#F8B4C8]">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B]">{user.occupation}</p>
                  <p className="text-xs text-[#64748B]">{user.facility}</p>
                </div>

                {/* Menu Action Items */}
                <div className="space-y-2">
                  {/* Find a Hospital Near Me Add-on */}
                  <button
                    id="menu-open-hospital-locator-btn"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openHospitalLocator();
                    }}
                    className="w-full bg-white hover:bg-[#FAF8F8] border border-[#F0EBE9] rounded-2xl p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EDF7EE] text-[#2E7D46] flex items-center justify-center shrink-0">
                        <Navigation className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#1E232B] flex items-center gap-1.5">
                          <span>Find Hospital Near Me</span>
                          <span className="text-[9px] font-bold uppercase bg-[#EDF7EE] text-[#1C592E] px-1.5 py-0.2 rounded-md">New</span>
                        </div>
                        <div className="text-[10px] text-[#64748B]">GPS &amp; Google Places Directory</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Mama Yie on WhatsApp Channel */}
                  <button
                    id="menu-open-whatsapp-btn"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowWhatsAppModal(true);
                    }}
                    className="w-full bg-white hover:bg-[#FAF8F8] border border-[#25D366]/40 rounded-2xl p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <WhatsAppIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#1E232B] flex items-center gap-1.5">
                          <span>Mama Yie on WhatsApp 💗</span>
                        </div>
                        <div className="text-[10px] text-[#64748B]">Official Channel &amp; Updates</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* USSD Feature Phone Simulator */}
                  <button
                    id="menu-open-ussd-btn"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowUssdModal(true);
                    }}
                    className="w-full bg-white hover:bg-[#FAF8F8] border border-[#F0EBE9] rounded-2xl p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FDF2F5] text-[#E61964] flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#1E232B]">Feature Phone USSD</div>
                        <div className="text-[10px] text-[#64748B]">Dial *920*44# (No internet)</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Judge Mode Walkthrough */}
                  <button
                    id="menu-open-tour-btn"
                    onClick={() => {
                      setIsMenuOpen(false);
                      startDemoTour();
                    }}
                    className="w-full bg-white hover:bg-[#FAF8F8] border border-[#F0EBE9] rounded-2xl p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FDF2F5] text-[#E61964] flex items-center justify-center shrink-0">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#1E232B]">Demo Walkthrough</div>
                        <div className="text-[10px] text-[#64748B]">Guided Hackathon Tour</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Reset Demo State */}
                  <button
                    id="menu-reset-demo-btn"
                    onClick={() => {
                      resetToDefaultDemo();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-white hover:bg-[#FAF8F8] border border-[#F0EBE9] rounded-2xl p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF8F8] text-[#64748B] flex items-center justify-center shrink-0">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#1E232B]">Reset Demo Data</div>
                        <div className="text-[10px] text-[#64748B]">Restore initial GH₵120 fund</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Bottom Logout */}
              <div className="pt-4 border-t border-[#F0EBE9]">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setCurrentView('login');
                  }}
                  className="w-full py-3 rounded-xl bg-[#FDF2F5] hover:bg-[#FCE7EC] text-[#E61964] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
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
              className="bg-[#1E232B] text-[#FAF8F8] rounded-3xl max-w-sm w-full p-4 border border-[#F0EBE9]/20 shadow-2xl relative max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Phone className="w-4 h-4 text-[#E61964]" />
                  <span>Basic Phone USSD (*920*44#)</span>
                </div>
                <button
                  onClick={() => setShowUssdModal(false)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <UssdSimulator />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp Channel Modal Dialog */}
      <AnimatePresence>
        {showWhatsAppModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-4 border border-[#F0EBE9] shadow-2xl relative max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-end pb-1">
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-[#FAF8F8] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <WhatsAppChannelSection showDetailsToggle={true} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
