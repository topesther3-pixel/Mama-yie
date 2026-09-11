import React from 'react';
import { useApp } from '../context/AppContext';
import { HealthcareService, HealthcarePartner } from '../types';
import { ShieldCheck, Stethoscope, Hospital, Activity, CheckCircle2, CircleDollarSign, ArrowRight, Info } from 'lucide-react';
import { motion } from 'motion/react';

export const HealthcarePartnersView: React.FC = () => {
  const { healthcarePartners, setActiveCareService, setActiveModal, user, setCurrentView } = useApp();

  const handleUseSavings = (service: HealthcareService) => {
    setActiveCareService(service);
    setActiveModal('useSavingsModal');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-[#281C16] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl mb-8 border border-[#E8DFC8]/40 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#FAF1E4] text-[#9C4221] px-3 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Curated Healthcare Partner Network
              </span>
              <span className="text-xs text-[#D9CAB6]">Ashanti &amp; Greater Accra</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">
              Vetted &amp; Discounted Healthcare
            </h1>
            <p className="text-xs sm:text-sm text-[#D9CAB6] mt-1.5 max-w-2xl leading-relaxed">
              Mama Yie is not an open marketplace. Our founders personally vet maternal care facilities and midwives, negotiating preferential rates so mothers can redeem their earned motherhood fund without fear of hidden hospital fees.
            </p>
          </div>

          <div className="bg-[#3D291F] p-4 rounded-2xl border border-[#FAF1E4]/10 text-right min-w-[200px]">
            <div className="text-xs text-[#D9CAB6]">Akosua's Usable Balance</div>
            <div className="text-3xl font-serif font-bold text-[#E8824A] my-1">
              GH₵{user.currentSavings}
            </div>
            <div className="text-[11px] text-[#A8988B]">
              Ready for voucher redemption
            </div>
          </div>
        </div>
      </div>

      {/* Illustrative Price Disclaimer */}
      <div className="flex items-start gap-2.5 text-xs bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFC8] text-[#5C4A3E] mb-8">
        <Info className="w-4 h-4 text-[#9C4221] shrink-0 mt-0.5" />
        <div>
          <strong>DEMO / ILLUSTRATIVE PRICING:</strong> Facility rates represent standard median Ghanaian healthcare fee benchmarks in Kumasi. Negotiated partner discounts are demonstrative for this prototype. Eligible services can be redeemed using the user's accrued Mama Yie balance (not a loan).
        </div>
      </div>

      {/* Healthcare Partners List */}
      <div className="space-y-8">
        {healthcarePartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs overflow-hidden"
          >
            {/* Partner Header */}
            <div className="p-6 bg-[#FAF7F2]/60 border-b border-[#E8DFC8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DFC8] flex items-center justify-center text-[#9C4221] shadow-2xs">
                  {partner.type === 'MIDWIFE_CLINIC' ? (
                    <Stethoscope className="w-6 h-6" />
                  ) : partner.type === 'MATERNAL_HOSPITAL' ? (
                    <Hospital className="w-6 h-6" />
                  ) : (
                    <Activity className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-bold text-[#281C16]">{partner.name}</h2>
                    <span className="text-[10px] font-bold uppercase bg-[#EAF5EF] text-[#2D6A4F] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#2D6A4F]/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Mama Yie Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#7A695C] mt-0.5">
                    {partner.location} • Rating {partner.rating} ★ • {partner.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#5C4A3E] bg-white px-3 py-1 rounded-xl border border-[#E8DFC8]">
                  Founder Vetted
                </span>
              </div>
            </div>

            {/* Partner Services */}
            <div className="p-6 divide-y divide-[#E8DFC8]/60">
              {partner.services.map((srv) => {
                const discount = srv.directPrice - srv.negotiatedPrice;
                const canAfford = user.currentSavings > 0;

                return (
                  <div
                    key={srv.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-[#281C16]">{srv.name}</h3>
                      <p className="text-xs text-[#7A695C] mt-1 max-w-xl leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-[10px] text-[#7A695C] line-through">
                          Direct: GH₵{srv.directPrice}
                        </div>
                        <div className="text-base font-serif font-bold text-[#2D6A4F]">
                          GH₵{srv.negotiatedPrice}
                        </div>
                        <div className="text-[10px] text-[#9C4221] font-semibold">
                          Save GH₵{discount}
                        </div>
                      </div>

                      <button
                        onClick={() => handleUseSavings(srv)}
                        className="py-2.5 px-4 rounded-xl bg-[#281C16] hover:bg-[#3D291F] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <CircleDollarSign className="w-3.5 h-3.5 text-[#E8824A]" />
                        <span>Use Savings</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
