import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HealthcarePartner, HealthcareService } from '../types';
import { ShieldCheck, MapPin, CheckCircle2, ArrowRight, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CareScreen: React.FC = () => {
  const { healthcarePartners, user, redeemSavingsForCare } = useApp();
  const [selectedService, setSelectedService] = useState<{
    partner: HealthcarePartner;
    service: HealthcareService;
  } | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);

  // Show only verified partners (Suntreso, Sister Afia, Adum Diagnostic)
  const verifiedClinics = healthcarePartners.filter(
    (h) => h.verificationStatus === 'VERIFIED'
  );

  const handleRedeem = () => {
    if (!selectedService) return;
    const { service, partner } = selectedService;
    const amount = Math.min(service.negotiatedPrice, user.currentSavings);

    const success = redeemSavingsForCare(service, amount);
    if (success) {
      setVoucherSuccess(`MY-${partner.name.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  return (
    <div id="care-screen" className="flex-1 px-5 pt-6 pb-24 max-w-md mx-auto w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1E5E3A]">
          Verified Care Network
        </span>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#281C16]">
          Partner Care Options
        </h1>
        <p className="text-xs sm:text-sm text-[#7A695C] leading-relaxed">
          Use your Motherhood Fund at verified maternal health providers across Kumasi.
        </p>
      </div>

      {/* Fund balance indicator */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8DFC8] flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[11px] font-semibold text-[#8C7A6D] block">
            Your Available Motherhood Fund
          </span>
          <span className="font-serif font-bold text-2xl text-[#1E5E3A]">
            GH₵{user.currentSavings}
          </span>
        </div>
        <span className="text-xs font-bold text-[#8C4A28] bg-[#FAF1E4] px-3 py-1 rounded-full border border-[#E8DFC8]">
          No cash needed at desk
        </span>
      </div>

      {/* Clinic Cards */}
      <div className="space-y-4">
        {verifiedClinics.map((partner) => (
          <div
            key={partner.id}
            id={`care-card-${partner.id}`}
            className="bg-white rounded-3xl p-5 border-2 border-[#E8DFC8] shadow-sm space-y-4"
          >
            {/* Top Partner Badge */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E5E3A] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Partner</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#281C16]">
                  {partner.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#7A695C]">
              <MapPin className="w-3.5 h-3.5 text-[#9C4221] shrink-0" />
              <span>{partner.location}, {partner.region}</span>
            </div>

            {/* Services List */}
            <div className="space-y-2 pt-2 border-t border-[#E8DFC8]/60">
              {partner.services.slice(0, 2).map((service) => (
                <div
                  key={service.id}
                  className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8DFC8] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-[#281C16] line-clamp-1">
                      {service.name}
                    </p>
                    <p className="text-[11px] text-[#7A695C]">
                      Standard: <span className="line-through">GH₵{service.directPrice}</span> •{' '}
                      <strong className="text-[#1E5E3A]">GH₵{service.negotiatedPrice} with Fund</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedService({ partner, service });
                      setVoucherSuccess(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#1E5E3A] hover:bg-[#16482C] text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
                  >
                    Use Fund
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Redemption Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-[#E8DFC8] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC8]">
                <h3 className="font-serif font-bold text-lg text-[#281C16]">
                  {voucherSuccess ? 'Care Voucher Ready' : 'Use Motherhood Fund'}
                </h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1 text-[#8C7A6D] hover:text-[#281C16] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!voucherSuccess ? (
                <>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8C7A6D]">Provider:</p>
                    <p className="font-bold text-sm text-[#281C16]">{selectedService.partner.name}</p>
                    <p className="text-xs text-[#8C7A6D] mt-2">Service:</p>
                    <p className="font-bold text-sm text-[#281C16]">{selectedService.service.name}</p>
                  </div>

                  <div className="bg-[#FAF1E4] p-3 rounded-2xl border border-[#E8DFC8] flex justify-between items-center text-xs">
                    <span className="text-[#281C16]">Negotiated Rate:</span>
                    <strong className="text-base text-[#1E5E3A]">
                      GH₵{selectedService.service.negotiatedPrice}
                    </strong>
                  </div>

                  <button
                    onClick={handleRedeem}
                    className="w-full py-3.5 rounded-2xl bg-[#1E5E3A] hover:bg-[#16482C] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
                  >
                    Generate Verified Voucher
                  </button>
                </>
              ) : (
                <div className="text-center space-y-3 py-2">
                  <div className="w-12 h-12 bg-[#E8F5E9] text-[#1E5E3A] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A6D] tracking-wider block">
                      Voucher Code (Show at Reception)
                    </span>
                    <span className="font-mono font-bold text-2xl text-[#1E5E3A] mt-1 block">
                      {voucherSuccess}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A695C] leading-relaxed">
                    Accepted at {selectedService.partner.name}. No upfront cash required.
                  </p>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="w-full py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-xs font-bold text-[#281C16] hover:bg-[#FAF1E4] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
