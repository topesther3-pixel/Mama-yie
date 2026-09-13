import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, Heart, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const JudgeMomentModal: React.FC = () => {
  const { activeModal, setActiveModal, user, lastEarningAmount, setCurrentView } = useApp();

  if (activeModal !== 'judgeMoment') return null;

  const previousSavings = Math.max(0, user.currentSavings - lastEarningAmount);
  const currentSavings = user.currentSavings;
  const progressPercent = Math.min(100, Math.round((currentSavings / user.targetPreparationAmount) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#E61964]/30 relative overflow-hidden"
        >
          {/* Subtle warm decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#E61964]/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#2E7D46]/10 blur-2xl pointer-events-none"></div>

          {/* Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF7EE] text-[#2E7D46] text-xs font-bold tracking-wide uppercase border border-[#BAE3C2]">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D46]" />
              Referral Purchase Confirmed 🎉
            </span>
            <span className="text-[11px] font-mono text-[#64748B] bg-[#FAF8F8] px-2 py-0.5 rounded border border-[#F0EBE9]">
              AKOSUA-NUMA
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl font-bold text-[#1E232B] leading-tight mb-2">
            You earned this.
          </h2>

          <p className="text-sm text-[#64748B] mb-6">
            A customer in Kumasi purchased with your referral link. Your demo commission of{' '}
            <strong className="text-[#2E7D46] font-bold">GH₵{lastEarningAmount}</strong> has been deposited directly into
            your Motherhood Fund.
          </p>

          {/* The Dramatic Financial Transformation State */}
          <div className="bg-[#FAF8F8] rounded-2xl p-5 border border-[#F0EBE9] mb-6">
            <div className="text-xs uppercase font-bold text-[#64748B] tracking-wider mb-3">
              Motherhood Fund Balance Update
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Previous */}
              <div className="text-left">
                <div className="text-xs text-[#64748B]">Starting Balance</div>
                <div className="text-xl font-mono text-[#64748B] line-through">
                  GH₵{previousSavings}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-full bg-[#2E7D46] text-white text-xs font-bold flex items-center gap-1 animate-bounce shadow-xs">
                  +GH₵{lastEarningAmount} Earned
                </div>
                <ArrowRight className="w-5 h-5 text-[#E61964] mt-1" />
              </div>

              {/* New Balance */}
              <div className="text-right">
                <div className="text-xs font-semibold text-[#2E7D46]">New Prepared Fund</div>
                <div className="text-3xl font-serif font-bold text-[#2E7D46]">
                  GH₵{currentSavings}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 pt-3 border-t border-[#F0EBE9]">
              <div className="flex justify-between text-xs font-medium text-[#64748B] mb-1.5">
                <span>Preparation Target: GH₵{user.targetPreparationAmount}</span>
                <span className="font-bold text-[#2E7D46]">{progressPercent}% Ready</span>
              </div>
              <div className="w-full h-3 bg-[#F0EBE9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2E7D46] to-[#40A35E] rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* The Core Insight Reinforcement for Judges */}
          <div className="bg-[#FDF2F5] rounded-xl p-4 border-l-4 border-[#E61964] mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E61964] mb-1">
              The Mama Yie Principle
            </p>
            <p className="text-sm font-semibold text-[#1E232B] leading-snug">
              She didn't have spare cash. She earned her way into preparedness.
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Akosua started with GH₵0. Without borrowing or taking loans, she has begun preparing for safe childbirth through vetted local commerce.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                setActiveModal('none');
                setCurrentView('dashboard');
              }}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#E61964] hover:bg-[#D01255] text-white font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View Fund Ledger</span>
            </button>
            <button
              onClick={() => {
                setActiveModal('none');
                setCurrentView('circles');
              }}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#EDF7EE] hover:bg-[#DBEEDB] text-[#1C592E] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors border border-[#BAE3C2]"
            >
              <Users className="w-4 h-4" />
              <span>Support Circle Reacts</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
