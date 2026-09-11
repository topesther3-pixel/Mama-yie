import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, TrendingUp, Calendar, Menu } from 'lucide-react';
import { motion } from 'motion/react';

export const HomeDashboard: React.FC = () => {
  const { user, setCurrentView, setIsMenuOpen } = useApp();

  const progressPercent = Math.min(
    100,
    Math.round((user.currentSavings / user.targetPreparationAmount) * 100)
  );

  return (
    <div id="home-dashboard-screen" className="flex-1 px-5 pt-6 pb-24 max-w-md mx-auto w-full space-y-6">
      {/* Header Greeting & Menu trigger */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6D]">
            Welcome Back
          </p>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#281C16]">
            Good morning, {user.name} 👋
          </h1>
        </div>

        <button
          id="open-menu-button"
          onClick={() => setIsMenuOpen(true)}
          className="p-2.5 rounded-2xl bg-white border border-[#E8DFC8] text-[#5C4A3E] hover:text-[#281C16] hover:bg-[#FAF1E4] transition-colors shadow-sm cursor-pointer"
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
        className="inline-flex items-center gap-2 bg-[#FAF1E4] border border-[#E8DFC8] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#8C4A28]"
      >
        <Calendar className="w-3.5 h-3.5 text-[#9C4221]" />
        <span>Due {user.dueDate || 'March 28, 2027'}</span>
        <span>•</span>
        <span>16 weeks to go</span>
      </motion.div>

      {/* Main Motherhood Fund Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-white rounded-3xl p-6 border-2 border-[#E8DFC8] shadow-sm space-y-5"
      >
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A6D]">
            MOTHERHOOD FUND
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-serif font-bold text-4xl sm:text-5xl tracking-tight text-[#1E5E3A]">
              GH₵{user.currentSavings}
            </span>
            <span className="text-xl font-medium text-[#8C7A6D]">
              / GH₵{user.targetPreparationAmount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-[#FAF1E4] rounded-full overflow-hidden p-0.5 border border-[#E8DFC8]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#2D6A4F] to-[#1E5E3A] rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-[#8C7A6D] font-medium pt-0.5">
            <span>{progressPercent}% prepared</span>
            <span>Target: Suntreso Hospital</span>
          </div>
        </div>

        {/* Weekly Target */}
        <div className="pt-3 border-t border-[#E8DFC8]/60 flex items-center justify-between text-sm">
          <span className="text-[#7A695C] font-medium">Weekly target:</span>
          <div className="flex items-center gap-1.5 font-bold text-[#281C16]">
            <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />
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
          className="w-full py-4 rounded-2xl bg-[#9C4221] hover:bg-[#853416] active:scale-[0.99] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>EARN TOWARD MY FUND</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Secondary CTA */}
        <button
          id="ask-ama-button"
          onClick={() => setCurrentView('ama')}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-[#FAF1E4] active:scale-[0.99] text-[#281C16] border-2 border-[#E8DFC8] font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-[#E8824A]" />
          <span>ASK AMA</span>
        </button>
      </div>

      {/* One Short Ama Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        onClick={() => setCurrentView('ama')}
        className="bg-[#FAF1E4] rounded-2xl p-4 border border-[#E8DFC8] flex items-start gap-3.5 cursor-pointer hover:border-[#E8824A]/50 transition-colors shadow-xs"
      >
        <div className="w-9 h-9 rounded-xl bg-[#E8824A] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#281C16]">Ama's Daily Note</span>
            <span className="text-[10px] font-semibold text-[#9C4221]">Chat with Ama →</span>
          </div>
          <p className="text-xs text-[#5C4A3E] leading-relaxed">
            Akosua, you're on track! Earning GH₵30 this week will keep your Suntreso delivery fund on schedule.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
