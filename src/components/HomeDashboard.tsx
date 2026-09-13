import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, TrendingUp, Calendar, Menu, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { WhatsAppChannelSection } from './WhatsAppChannelSection';

export const HomeDashboard: React.FC = () => {
  const { user, setCurrentView, setIsMenuOpen, openHospitalLocator } = useApp();

  const progressPercent = Math.min(
    100,
    Math.round((user.currentSavings / user.targetPreparationAmount) * 100)
  );

  return (
    <div id="home-dashboard-screen" className="flex-1 px-5 pt-6 pb-24 max-w-md mx-auto w-full space-y-6">
      {/* Header Greeting & Menu trigger */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Welcome Back
          </p>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1E232B]">
            Good morning, {user.name} 👋
          </h1>
        </div>

        <button
          id="open-menu-button"
          onClick={() => setIsMenuOpen(true)}
          className="p-2.5 rounded-2xl bg-white border border-[#F0EBE9] text-[#64748B] hover:text-[#1E232B] hover:bg-[#FDF2F5] transition-colors shadow-xs cursor-pointer"
          title="Open Menu & USSD"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Baby Timeline Pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-[#FDF2F5] border border-[#F8B4C8] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#BE123C]"
      >
        <Calendar className="w-3.5 h-3.5 text-[#E61964]" />
        <span>Due {user.dueDate || 'March 28, 2027'}</span>
        <span>•</span>
        <span>16 weeks to go</span>
      </motion.div>

      {/* Main Motherhood Fund Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-white rounded-3xl p-6 border-2 border-[#F0EBE9] shadow-xs space-y-5"
      >
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#64748B]">
            MOTHERHOOD FUND
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-serif font-bold text-4xl sm:text-5xl tracking-tight text-[#2E7D46]">
              GH₵{user.currentSavings}
            </span>
            <span className="text-xl font-medium text-[#64748B]">
              / GH₵{user.targetPreparationAmount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-[#FDF2F5] rounded-full overflow-hidden p-0.5 border border-[#F8B4C8]/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#E61964] to-[#F43F5E] rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-[#64748B] font-medium pt-0.5">
            <span>{progressPercent}% prepared</span>
            <span>Target: Suntreso Hospital</span>
          </div>
        </div>

        {/* Weekly Target */}
        <div className="pt-3 border-t border-[#F0EBE9] flex items-center justify-between text-sm">
          <span className="text-[#64748B] font-medium">Weekly target:</span>
          <div className="flex items-center gap-1.5 font-bold text-[#1E232B]">
            <TrendingUp className="w-4 h-4 text-[#2E7D46]" />
            <span>GH₵{user.weeklyTarget}</span>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="space-y-3 pt-1">
        {/* Primary CTA */}
        <button
          id="earn-cta-button"
          onClick={() => setCurrentView('earn')}
          className="w-full py-4 rounded-2xl bg-[#E61964] hover:bg-[#D01255] active:scale-[0.99] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>EARN TOWARD MY FUND</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Secondary CTA */}
        <button
          id="ask-ama-button"
          onClick={() => setCurrentView('ama')}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-[#FDF2F5] active:scale-[0.99] text-[#1E232B] border-2 border-[#F0EBE9] hover:border-[#F8B4C8] font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-[#E61964]" />
          <span>ASK AMA</span>
        </button>
      </div>

      {/* One Short Ama Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        onClick={() => setCurrentView('ama')}
        className="bg-[#FDF2F5] rounded-2xl p-4 border border-[#F8B4C8] flex items-start gap-3.5 cursor-pointer hover:border-[#E61964] transition-colors shadow-xs"
      >
        <div className="w-9 h-9 rounded-xl bg-[#E61964] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#1E232B]">Ama's Daily Note</span>
            <span className="text-[10px] font-semibold text-[#E61964]">Chat with Ama →</span>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Akosua, you're on track! Earning GH₵30 this week will keep your Suntreso delivery fund on schedule.
          </p>
        </div>
      </motion.div>

      {/* Find a Hospital Near Me Add-on Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        onClick={openHospitalLocator}
        id="home-hospital-locator-card"
        className="bg-white rounded-2xl p-4 border-2 border-[#F0EBE9] flex items-center justify-between cursor-pointer hover:border-[#2E7D46]/50 transition-all shadow-xs group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#EDF7EE] text-[#2E7D46] flex items-center justify-center shrink-0 shadow-xs">
            <Navigation className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#1E232B]">Find a Hospital Near Me</span>
              <span className="text-[9px] font-bold uppercase bg-[#EDF7EE] text-[#1C592E] border border-[#BAE3C2] px-1.5 py-0.5 rounded-md">New</span>
            </div>
            <p className="text-[11px] text-[#64748B] truncate mt-0.5">
              Locate closest maternity wards &amp; emergency centers with GPS
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:translate-x-1 group-hover:text-[#2E7D46] transition-all shrink-0 ml-2" />
      </motion.div>

      {/* MAMA YIE ON WHATSAPP 💗 Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <WhatsAppChannelSection />
      </motion.div>
    </div>
  );
};
