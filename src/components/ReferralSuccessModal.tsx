import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ArrowRight, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReferralSuccessModal: React.FC = () => {
  const { referralSuccess, setReferralSuccess, setCurrentView, user } = useApp();

  if (!referralSuccess.isOpen) return null;

  const handleViewFund = () => {
    setReferralSuccess({ ...referralSuccess, isOpen: false });
    setCurrentView('home');
  };

  const handleClose = () => {
    setReferralSuccess({ ...referralSuccess, isOpen: false });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full text-center border border-[#F0EBE9] shadow-2xl space-y-4 relative"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full text-[#64748B] hover:text-[#1E232B] hover:bg-[#FAF8F8] cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Confetti icon badge */}
          <div className="w-14 h-14 rounded-full bg-[#FDF2F5] text-2xl flex items-center justify-center mx-auto border border-[#F8B4C8]">
            🎉
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D46] bg-[#EDF7EE] px-2.5 py-0.5 rounded-full inline-block border border-[#BAE3C2]">
              Purchase Simulated Successfully
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#1E232B]">
              Nice! You earned GH₵{referralSuccess.amount}.
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              GH₵{referralSuccess.amount} has been added to your Mama Yie motherhood fund.
            </p>
            {referralSuccess.productName && (
              <p className="text-[11px] font-medium text-[#64748B] truncate pt-0.5">
                {referralSuccess.partnerName ? `${referralSuccess.partnerName} • ` : ''}
                {referralSuccess.productName}
              </p>
            )}
          </div>

          {/* Updated Motherhood Fund display */}
          <div className="bg-[#FAF8F8] rounded-2xl p-3.5 border border-[#F0EBE9] text-center space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">
              Motherhood Fund Updated
            </span>
            <div className="text-xl font-serif font-bold text-[#2E7D46]">
              GH₵{user.currentSavings} <span className="text-sm font-medium text-[#64748B]">/ GH₵{user.targetPreparationAmount}</span>
            </div>
          </div>

          <p className="text-[10px] text-[#64748B]/80 leading-tight">
            This was a simulated demo transaction for the prototype. No real money was charged.
          </p>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              id="view-my-fund-button"
              onClick={handleViewFund}
              className="w-full py-3.5 rounded-2xl bg-[#2E7D46] hover:bg-[#256639] active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Motherhood Fund</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-white border border-[#F0EBE9] text-xs font-semibold text-[#64748B] hover:bg-[#FAF8F8] transition-colors cursor-pointer"
            >
              Continue Earning
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
