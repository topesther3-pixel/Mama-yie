import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Heart, CircleDollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const UseSavingsModal: React.FC = () => {
  const { activeModal, setActiveModal, activeCareService, user, redeemSavingsForCare } = useApp();
  const [redeemAmount, setRedeemAmount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (activeModal !== 'useSavingsModal' || !activeCareService) return null;

  const service = activeCareService;
  const maxRedeemable = Math.min(user.currentSavings, service.negotiatedPrice);
  const currentSavings = user.currentSavings;

  const handleApplySavings = () => {
    const amount = redeemAmount > 0 ? redeemAmount : maxRedeemable;
    if (amount <= 0) {
      setErrorMsg('You need savings in your Motherhood Fund to redeem. Earn via Numa Organics referrals first!');
      return;
    }
    if (amount > currentSavings) {
      setErrorMsg('Cannot redeem more than your available fund balance.');
      return;
    }

    const success = redeemSavingsForCare(service, amount);
    if (!success) {
      setErrorMsg('Unable to process care voucher. Please check your fund balance.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#F0EBE9] relative"
      >
        <button
          onClick={() => setActiveModal('none')}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF8F8] text-[#64748B] hover:text-[#1E232B] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EDF7EE] text-[#2E7D46] flex items-center gap-1 border border-[#BAE3C2]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Mama Yie Vetted Partner Service
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#1E232B] mb-1">
          Apply Motherhood Fund
        </h3>
        <p className="text-sm text-[#64748B] mb-5">
          Redeem your earned balance to offset healthcare costs at partner clinics.
        </p>

        {/* Care Service Card */}
        <div className="p-4 rounded-2xl bg-[#FAF8F8] border border-[#F0EBE9] mb-5">
          <h4 className="font-bold text-sm text-[#1E232B]">{service.name}</h4>
          <p className="text-xs text-[#64748B] mt-1">{service.description}</p>
          
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#F0EBE9]">
            <div>
              <span className="text-[11px] text-[#64748B] block">Direct Hospital Price</span>
              <span className="text-sm line-through text-[#64748B] font-mono">GH₵{service.directPrice}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#2E7D46] font-bold block">Mama Yie Negotiated</span>
              <span className="text-lg font-bold text-[#2E7D46] font-mono">GH₵{service.negotiatedPrice}</span>
            </div>
          </div>
        </div>

        {/* Current Available Fund */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FDF2F5] border border-[#F8B4C8] mb-5">
          <div className="flex items-center gap-2.5">
            <CircleDollarSign className="w-5 h-5 text-[#E61964]" />
            <div>
              <div className="text-xs font-semibold text-[#1E232B]">Your Available Motherhood Fund</div>
              <div className="text-[11px] text-[#64748B]">Earned through Numa Organics referrals</div>
            </div>
          </div>
          <div className="text-lg font-serif font-bold text-[#E61964]">
            GH₵{currentSavings}
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2 text-xs bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        {currentSavings === 0 ? (
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 mb-6">
            <p className="font-bold mb-1">Your Motherhood Fund is currently at GH₵0.</p>
            <p>
              Akosua can earn towards this service right now without upfront cash! Share a Numa Organics product to earn your first GH₵5–7 commission.
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[#64748B] font-medium mb-1.5">
              <span>Redeemable Toward Service:</span>
              <span className="font-bold text-[#2E7D46]">GH₵{maxRedeemable}</span>
            </div>
            <p className="text-xs text-[#64748B]">
              You will generate an approved digital Mama Yie care voucher accepted at the reception desk.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal('none')}
            className="flex-1 py-3 px-4 rounded-xl bg-[#FAF8F8] hover:bg-[#F0EBE9] text-[#64748B] text-sm font-medium transition-colors border border-[#F0EBE9] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApplySavings}
            disabled={currentSavings <= 0}
            className="flex-1 py-3 px-4 rounded-xl bg-[#E61964] hover:bg-[#D01255] disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Generate Care Voucher</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
