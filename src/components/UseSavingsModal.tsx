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
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFC8] relative"
      >
        <button
          onClick={() => setActiveModal('none')}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#7A695C] hover:text-[#281C16] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EAF5EF] text-[#2D6A4F] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Mama Yie Vetted Partner Service
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#281C16] mb-1">
          Apply Motherhood Fund
        </h3>
        <p className="text-sm text-[#7A695C] mb-5">
          Redeem your earned balance to offset healthcare costs at partner clinics.
        </p>

        {/* Care Service Card */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] mb-5">
          <h4 className="font-bold text-sm text-[#281C16]">{service.name}</h4>
          <p className="text-xs text-[#7A695C] mt-1">{service.description}</p>
          
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#E8DFC8]">
            <div>
              <span className="text-[11px] text-[#7A695C] block">Direct Hospital Price</span>
              <span className="text-sm line-through text-[#7A695C] font-mono">GH₵{service.directPrice}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#2D6A4F] font-bold block">Mama Yie Negotiated</span>
              <span className="text-lg font-bold text-[#2D6A4F] font-mono">GH₵{service.negotiatedPrice}</span>
            </div>
          </div>
        </div>

        {/* Current Available Fund */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF1E4] border border-[#E8DFC8] mb-5">
          <div className="flex items-center gap-2.5">
            <CircleDollarSign className="w-5 h-5 text-[#9C4221]" />
            <div>
              <div className="text-xs font-semibold text-[#281C16]">Your Available Motherhood Fund</div>
              <div className="text-[11px] text-[#7A695C]">Earned through Numa Organics referrals</div>
            </div>
          </div>
          <div className="text-lg font-serif font-bold text-[#9C4221]">
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
            <div className="flex justify-between text-xs text-[#5C4A3E] font-medium mb-1.5">
              <span>Redeemable Toward Service:</span>
              <span className="font-bold text-[#2D6A4F]">GH₵{maxRedeemable}</span>
            </div>
            <p className="text-xs text-[#7A695C]">
              You will generate an approved digital Mama Yie care voucher accepted at the reception desk.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal('none')}
            className="flex-1 py-3 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#5C4A3E] text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplySavings}
            disabled={currentSavings <= 0}
            className="flex-1 py-3 px-4 rounded-xl bg-[#281C16] hover:bg-[#3D291F] disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-[#E8824A]" />
            <span>Generate Care Voucher</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
