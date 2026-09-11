import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShieldCheck, QrCode, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const CareSuccessModal: React.FC = () => {
  const { activeModal, setActiveModal, activeCareService, redeemedCareAmount, user, setCurrentView } = useApp();

  if (activeModal !== 'careSuccessModal' || !activeCareService) return null;

  const voucherCode = `MY-VOUCHER-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFC8] text-center"
      >
        <div className="w-14 h-14 rounded-full bg-[#EAF5EF] text-[#2D6A4F] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF1E4] text-[#9C4221]">
          Vetted Care Voucher Confirmed
        </span>

        <h3 className="font-serif text-2xl font-bold text-[#281C16] mt-2 mb-1">
          Care Voucher Ready
        </h3>
        <p className="text-xs text-[#7A695C] mb-5">
          Present this verified voucher at reception. Your earned savings have been credited.
        </p>

        {/* Voucher Pass */}
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border-2 border-dashed border-[#2D6A4F]/50 text-left mb-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#7A695C]">Patient Name</div>
              <div className="text-sm font-bold text-[#281C16]">{user.name} ({user.age} yrs)</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-[#7A695C]">Voucher Code</div>
              <div className="text-xs font-mono font-bold text-[#9C4221]">{voucherCode}</div>
            </div>
          </div>

          <div className="py-2.5 border-y border-[#E8DFC8]">
            <div className="text-xs font-semibold text-[#281C16]">{activeCareService.name}</div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-[#7A695C]">Amount Paid from Fund:</span>
              <span className="font-bold text-[#2D6A4F]">GH₵{redeemedCareAmount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-[11px] text-[#2D6A4F] font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Mama Yie Negotiated Healthcare Partner</span>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveModal('none');
            setCurrentView('dashboard');
          }}
          className="w-full py-3 px-4 rounded-xl bg-[#281C16] hover:bg-[#3D291F] text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          <span>Return to Savings Dashboard</span>
          <ArrowRight className="w-4 h-4 text-[#E8824A]" />
        </button>
      </motion.div>
    </div>
  );
};
