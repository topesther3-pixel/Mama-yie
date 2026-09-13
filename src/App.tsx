import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PhoneLogin } from './components/PhoneLogin';
import { OtpVerify } from './components/OtpVerify';
import { AmaOnboarding } from './components/AmaOnboarding';
import { HomeDashboard } from './components/HomeDashboard';
import { BottomNavigation } from './components/BottomNavigation';
import { EarnScreen } from './components/EarnScreen';
import { CareScreen } from './components/CareScreen';
import { AmaScreen } from './components/AmaScreen';
import { ReferralSuccessModal } from './components/ReferralSuccessModal';
import { AppMenuDrawer } from './components/AppMenuDrawer';
import { ArrowLeft, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Phone Login & Verification',
    description: 'Simple Ghanaian mobile phone entry and SMS OTP verification designed for market traders.',
  },
  {
    step: 2,
    title: 'Ama Maternal Onboarding',
    description: 'Empathetic maternal companion capturing due date and preferred Kumasi delivery hospital.',
  },
  {
    step: 3,
    title: 'Minimal Home Dashboard',
    description: 'No clutter. Single-focus view on due date countdown and GH₵120 / GH₵600 Motherhood Fund.',
  },
  {
    step: 4,
    title: 'Ama AI Companion',
    description: 'Sub-second culturally attuned maternal guidance, delivery checklists, and emergency detection.',
  },
  {
    step: 5,
    title: 'The Breakthrough: Earn & Save',
    description: 'No spare cash needed. Expecting mothers earn by sharing vetted Numa Organics products.',
  },
  {
    step: 6,
    title: 'Referral Commission into Savings',
    description: 'Simulate a sale with AKOSUA-NUMA: instant GH₵5 credited directly into the Motherhood Fund.',
  },
  {
    step: 7,
    title: 'Verified Healthcare Network',
    description: 'Redeem fund vouchers at Suntreso Hospital and Sister Afia Midwifery without out-of-pocket cash.',
  },
];

const JudgeTourBar: React.FC = () => {
  const { isTourActive, tourStep, nextTourStep, prevTourStep, endTour, setCurrentView } = useApp();

  if (!isTourActive) return null;

  const currentStepInfo = TOUR_STEPS[tourStep - 1] || TOUR_STEPS[0];
  const totalSteps = TOUR_STEPS.length;

  const handleNext = () => {
    if (tourStep < totalSteps) {
      nextTourStep();
      // Synchronize views with tour step
      if (tourStep === 1) setCurrentView('onboarding');
      if (tourStep === 2) setCurrentView('home');
      if (tourStep === 3) setCurrentView('ama');
      if (tourStep === 4) setCurrentView('earn');
      if (tourStep === 5) setCurrentView('earn');
      if (tourStep === 6) setCurrentView('care');
    } else {
      endTour();
      setCurrentView('home');
    }
  };

  const handlePrev = () => {
    if (tourStep > 1) {
      prevTourStep();
      if (tourStep === 2) setCurrentView('login');
      if (tourStep === 3) setCurrentView('onboarding');
      if (tourStep === 4) setCurrentView('home');
      if (tourStep === 5) setCurrentView('ama');
      if (tourStep === 6) setCurrentView('earn');
      if (tourStep === 7) setCurrentView('earn');
    }
  };

  return (
    <aside aria-label="Hackathon Judge Demo Tour" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        className="bg-[#1E232B] text-[#FAF8F8] rounded-2xl p-4 shadow-2xl border-2 border-[#E61964] flex items-center justify-between gap-3"
      >
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#E61964] text-white">
              Judge Tour • {tourStep}/{totalSteps}
            </span>
            <span className="text-xs font-bold text-white truncate">
              {currentStepInfo.title}
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8] line-clamp-1">
            {currentStepInfo.description}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handlePrev}
            disabled={tourStep <= 1}
            className="p-1.5 rounded-lg bg-[#2D3748] hover:bg-[#3E4C5F] disabled:opacity-30 text-white cursor-pointer"
            title="Previous"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleNext}
            className="py-1.5 px-3 rounded-lg bg-[#E61964] hover:bg-[#D01255] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            {tourStep < totalSteps ? (
              <>
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Done</span>
              </>
            )}
          </button>

          <button
            onClick={endTour}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white cursor-pointer"
            title="Exit"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </aside>
  );
};

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  // 1. Phone Login View
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-[#FAF8F8]">
        <JudgeTourBar />
        <PhoneLogin />
      </div>
    );
  }

  // 2. OTP Verification View
  if (currentView === 'otp') {
    return (
      <div className="min-h-screen bg-[#FAF8F8]">
        <JudgeTourBar />
        <OtpVerify />
      </div>
    );
  }

  // 3. Ama Onboarding View
  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-[#FAF8F8]">
        <JudgeTourBar />
        <AmaOnboarding />
      </div>
    );
  }

  // 4. Main App Screens (Home, Ama, Earn, Care)
  const renderTabContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard />;
      case 'ama':
        return <AmaScreen />;
      case 'earn':
        return <EarnScreen />;
      case 'care':
        return <CareScreen />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F8] flex flex-col justify-between antialiased selection:bg-[#FDF2F5] selection:text-[#BE123C]">
      {/* Centered Mobile App Container */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#FAF8F8] flex flex-col relative">
        {/* Floating Judge Tour Controller if active */}
        <JudgeTourBar />

        {/* Active Tab View */}
        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation - ONLY Home, Ama, Earn, Care */}
        <BottomNavigation />

        {/* Referral Confirmed Success Modal */}
        <ReferralSuccessModal />

        {/* Slide-over Menu for USSD Feature Phone & Demo Controls */}
        <AppMenuDrawer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
