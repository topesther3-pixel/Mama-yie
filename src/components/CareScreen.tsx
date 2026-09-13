import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HealthcarePartner, HealthcareService } from '../types';
import { ShieldCheck, MapPin, CheckCircle2, ArrowRight, X, Phone, Hospital, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HospitalLocator } from './HospitalLocator';

export const CareScreen: React.FC = () => {
  const { healthcarePartners, user, redeemSavingsForCare, careSubTab, setCareSubTab } = useApp();
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
      {/* Sub-tab Navigation Pill */}
      <div className="bg-white p-1 rounded-2xl border border-[#F0EBE9] flex items-center shadow-xs">
        <button
          id="tab-hospital-locator-btn"
          onClick={() => setCareSubTab('locator')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            careSubTab === 'locator'
              ? 'bg-[#E61964] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#1E232B]'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Find Hospital Near Me</span>
        </button>

        <button
          id="tab-verified-partners-btn"
          onClick={() => setCareSubTab('partners')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            careSubTab === 'partners'
              ? 'bg-[#2E7D46] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#1E232B]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Partners</span>
        </button>
      </div>

      {/* RENDER ACTIVE SUB-TAB */}
      {careSubTab === 'locator' ? (
        <HospitalLocator onBackToPartners={() => setCareSubTab('partners')} />
      ) : (
        <>
          {/* Header */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D46]">
              Verified Care Network
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1E232B]">
              Partner Care Options
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Use your Motherhood Fund at verified maternal health providers across Kumasi.
            </p>
          </div>

          {/* Quick link to Hospital Locator */}
          <button
            id="care-screen-find-hospital-banner"
            onClick={() => setCareSubTab('locator')}
            className="w-full bg-white hover:bg-[#FAF8F8] p-3.5 rounded-2xl border border-[#F0EBE9] flex items-center justify-between text-left transition-colors cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FDF2F5] text-[#E61964] flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-[#1E232B] block">
                  Looking for nearby hospitals using GPS?
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Tap to search Google Places &amp; local maternity wards
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#E61964] group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Fund balance indicator */}
          <div className="bg-white rounded-2xl p-4 border border-[#F0EBE9] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-semibold text-[#64748B] block">
                Your Available Motherhood Fund
              </span>
              <span className="font-serif font-bold text-2xl text-[#2E7D46]">
                GH₵{user.currentSavings}
              </span>
            </div>
            <span className="text-xs font-bold text-[#1C592E] bg-[#EDF7EE] px-3 py-1 rounded-full border border-[#BAE3C2]">
              No cash needed at desk
            </span>
          </div>

          {/* Clinic Cards */}
          <div className="space-y-4">
            {verifiedClinics.map((partner) => (
              <div
                key={partner.id}
                id={`care-card-${partner.id}`}
                className="bg-white rounded-3xl p-5 border-2 border-[#F0EBE9] shadow-xs space-y-4"
              >
                {/* Top Partner Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1C592E] bg-[#EDF7EE] px-2.5 py-0.5 rounded-full mb-1 border border-[#BAE3C2]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Partner</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#1E232B]">
                      {partner.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <MapPin className="w-3.5 h-3.5 text-[#E61964] shrink-0" />
                  <span>{partner.location}, {partner.region}</span>
                </div>

                {/* Services List */}
                <div className="space-y-2 pt-2 border-t border-[#F0EBE9]">
                  {partner.services.slice(0, 2).map((service) => (
                    <div
                      key={service.id}
                      className="bg-[#FAF8F8] p-3 rounded-2xl border border-[#F0EBE9] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-[#1E232B] line-clamp-1">
                          {service.name}
                        </p>
                        <p className="text-[11px] text-[#64748B]">
                          Standard: <span className="line-through">GH₵{service.directPrice}</span> •{' '}
                          <strong className="text-[#2E7D46]">GH₵{service.negotiatedPrice} with Fund</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedService({ partner, service });
                          setVoucherSuccess(null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2E7D46] hover:bg-[#256637] text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
                      >
                        Use Fund
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Redemption Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-[#F0EBE9] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE9]">
                <h3 className="font-serif font-bold text-lg text-[#1E232B]">
                  {voucherSuccess ? 'Care Voucher Ready' : 'Use Motherhood Fund'}
                </h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1 text-[#64748B] hover:text-[#1E232B] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!voucherSuccess ? (
                <>
                  <div className="space-y-1">
                    <p className="text-xs text-[#64748B]">Provider:</p>
                    <p className="font-bold text-sm text-[#1E232B]">{selectedService.partner.name}</p>
                    <p className="text-xs text-[#64748B] mt-2">Service:</p>
                    <p className="font-bold text-sm text-[#1E232B]">{selectedService.service.name}</p>
                  </div>

                  <div className="bg-[#EDF7EE] p-3 rounded-2xl border border-[#BAE3C2] flex justify-between items-center text-xs">
                    <span className="text-[#1E232B]">Negotiated Rate:</span>
                    <strong className="text-base text-[#2E7D46]">
                      GH₵{selectedService.service.negotiatedPrice}
                    </strong>
                  </div>

                  <button
                    onClick={handleRedeem}
                    className="w-full py-3.5 rounded-2xl bg-[#2E7D46] hover:bg-[#256637] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
                  >
                    Generate Verified Voucher
                  </button>
                </>
              ) : (
                <div className="text-center space-y-3 py-2">
                  <div className="w-12 h-12 bg-[#EDF7EE] text-[#2E7D46] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                      Voucher Code (Show at Reception)
                    </span>
                    <span className="font-mono font-bold text-2xl text-[#2E7D46] mt-1 block">
                      {voucherSuccess}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Accepted at {selectedService.partner.name}. No upfront cash required.
                  </p>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="w-full py-3 rounded-xl bg-white border border-[#F0EBE9] text-xs font-bold text-[#1E232B] hover:bg-[#FAF8F8] cursor-pointer"
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
