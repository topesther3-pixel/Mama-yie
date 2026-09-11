import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Partner, VerificationStatus } from '../types';
import {
  ShieldCheck,
  Building2,
  Users,
  TrendingUp,
  CircleDollarSign,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Stethoscope,
  Filter,
} from 'lucide-react';
import { motion } from 'motion/react';

export const FounderDashboard: React.FC = () => {
  const {
    partners,
    healthcarePartners,
    transactions,
    referrals,
    user,
    addPartner,
    updatePartnerStatus,
    updateHealthcareStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'partners' | 'healthcare' | 'referrals' | 'mothers'>('overview');
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);

  // New partner form state
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newRetailPrice, setNewRetailPrice] = useState('50');
  const [newCommission, setNewCommission] = useState('5');

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim()) return;

    const newP: Partner = {
      id: `partner_${Date.now()}`,
      name: newPartnerName,
      website: newWebsite || 'https://example.com',
      logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=160&auto=format&fit=crop&q=80',
      description: newDescription || 'Local Ghanaian artisanal brand.',
      foundedLocation: 'Kumasi / Accra',
      verificationStatus: 'VERIFIED',
      isPotentialPartner: true,
      products: [
        {
          id: `prod_${Date.now()}`,
          partnerId: `partner_${Date.now()}`,
          name: newProductName || 'Organic Care Product',
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
          description: 'Ethical natural wellness product.',
          retailPrice: parseFloat(newRetailPrice) || 50,
          demoCommission: parseFloat(newCommission) || 5,
          commissionNote: 'DEMO EARNING — NOT PARTNER-CONFIRMED',
          productUrl: newWebsite || 'https://numaorganics.shop',
          category: 'skincare',
          demoMode: true,
          status: 'ACTIVE',
        },
      ],
    };

    addPartner(newP);
    setShowAddPartnerModal(false);
    setNewPartnerName('');
    setNewWebsite('');
    setNewDescription('');
    setNewProductName('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#281C16] text-[#FAF7F2] px-2.5 py-0.5 rounded-full">
              Founder &amp; Administrator Portal
            </span>
            <span className="text-xs text-[#7A695C]">• Mama Yie Ecosystem</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#281C16]">
            Gatekeeper &amp; Operations Control
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddPartnerModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#281C16] hover:bg-[#3D291F] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-[#E8824A]" />
            <span>Add Vetted Partner</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DFC8] pb-3 mb-8 overflow-x-auto">
        {[
          { id: 'overview', label: 'Ecosystem Overview' },
          { id: 'partners', label: 'Brand Partners' },
          { id: 'healthcare', label: 'Healthcare Gatekeeping' },
          { id: 'referrals', label: 'Referral & Fund Ledger' },
          { id: 'mothers', label: 'Mothers Triage' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#FAF1E4] text-[#9C4221] border border-[#E8DFC8]'
                : 'text-[#5C4A3E] hover:text-[#281C16]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E8DFC8] shadow-xs">
              <div className="text-xs text-[#7A695C] font-semibold">Registered Mothers</div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#281C16] mt-1">1,420</div>
              <div className="text-[10px] text-[#2D6A4F] font-bold mt-1">Ashanti &amp; Greater Accra</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8DFC8] shadow-xs">
              <div className="text-xs text-[#7A695C] font-semibold">Total Savings Prepared</div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2D6A4F] mt-1">GH₵348,600</div>
              <div className="text-[10px] text-[#7A695C] mt-1">Across all mother funds</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8DFC8] shadow-xs">
              <div className="text-xs text-[#7A695C] font-semibold">Referral Earnings Paid</div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#9C4221] mt-1">GH₵84,500</div>
              <div className="text-[10px] text-[#7A695C] mt-1">100% deposited to funds</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8DFC8] shadow-xs">
              <div className="text-xs text-[#7A695C] font-semibold">USSD Sessions Handled</div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#281C16] mt-1">14,890</div>
              <div className="text-[10px] text-amber-700 font-bold mt-1">Zero-data GSM queries</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Gatekeeper Philosophy */}
            <div className="bg-[#FAF1E4] p-6 rounded-3xl border border-[#E8DFC8]">
              <h3 className="font-serif text-lg font-bold text-[#9C4221] mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Vetting &amp; Gatekeeping System
              </h3>
              <p className="text-xs text-[#5C4A3E] leading-relaxed mb-4">
                Mama Yie deliberately rejects the open marketplace model. As founders, we protect vulnerable expecting mothers by personally verifying every business product (preventing skin-lightening toxins or harmful decoctions) and credentialing every midwife and facility.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#281C16] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#2D6A4F]"></span>
                  <span><strong>Businesses:</strong> Product safety audit &amp; fair commission guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-[#281C16] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#2D6A4F]"></span>
                  <span><strong>Healthcare:</strong> Nurses &amp; Midwives Council verification</span>
                </div>
              </div>
            </div>

            {/* Current Demo Mother Status */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#281C16] mb-2">
                Active Demo Case: Akosua
              </h3>
              <div className="space-y-2 text-xs text-[#5C4A3E]">
                <div className="flex justify-between py-1 border-b border-[#E8DFC8]/60">
                  <span>Location / Market:</span>
                  <span className="font-bold text-[#281C16]">{user.region}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8DFC8]/60">
                  <span>Starting Savings:</span>
                  <span className="font-mono font-bold text-[#7A695C]">GH₵{user.startingSavings}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8DFC8]/60">
                  <span>Current Prepared Balance:</span>
                  <span className="font-mono font-bold text-[#2D6A4F]">GH₵{user.currentSavings}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8DFC8]/60">
                  <span>Delivery Facility:</span>
                  <span className="font-bold text-[#281C16]">{user.facility}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Referral Code:</span>
                  <span className="font-mono font-bold text-[#9C4221]">{user.referralCode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BRAND PARTNERS TAB */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-[#281C16]">
              Vetted Commercial Partners ({partners.length})
            </h2>
            <button
              onClick={() => setShowAddPartnerModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold cursor-pointer"
            >
              + Onboard New Brand
            </button>
          </div>

          <div className="space-y-4">
            {partners.map((p) => (
              <div
                key={p.id}
                className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-serif text-lg font-bold text-[#281C16]">{p.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.verificationStatus === 'VERIFIED'
                          ? 'bg-[#EAF5EF] text-[#2D6A4F]'
                          : p.verificationStatus === 'PENDING'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {p.verificationStatus}
                    </span>
                    {p.isPotentialPartner && (
                      <span className="text-[10px] bg-[#FAF1E4] text-[#9C4221] px-2 py-0.5 rounded-full font-bold">
                        Demo Mode
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7A695C] mt-1 max-w-xl">{p.description}</p>
                  <div className="text-xs text-[#5C4A3E] mt-2 flex items-center gap-3">
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9C4221] hover:underline flex items-center gap-1"
                    >
                      <span>{p.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span>•</span>
                    <span>{p.products.length} Products Active</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updatePartnerStatus(p.id, 'VERIFIED')}
                    className="px-3 py-1.5 rounded-xl bg-[#EAF5EF] text-[#2D6A4F] hover:bg-[#d8ece0] text-xs font-bold cursor-pointer"
                  >
                    Set Verified
                  </button>
                  <button
                    onClick={() => updatePartnerStatus(p.id, 'UNDER_REVIEW')}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#5C4A3E] hover:bg-[#F4EFE6] text-xs font-medium cursor-pointer border border-[#E8DFC8]"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => updatePartnerStatus(p.id, 'REJECTED')}
                    className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HEALTHCARE GATEKEEPING TAB */}
      {activeTab === 'healthcare' && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#281C16]">
            Clinical &amp; Maternal Gatekeeping ({healthcarePartners.length})
          </h2>

          <div className="space-y-4">
            {healthcarePartners.map((hp) => (
              <div
                key={hp.id}
                className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#281C16]">{hp.name}</h3>
                    <span className="text-[10px] font-bold bg-[#EAF5EF] text-[#2D6A4F] px-2 py-0.5 rounded-full">
                      ✓ {hp.verificationStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A695C] mt-1">
                    {hp.location} • {hp.phone} • {hp.services.length} Negotiated Services
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#2D6A4F] bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#E8DFC8]">
                    Credentials Audited
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REFERRAL LEDGER TAB */}
      {activeTab === 'referrals' && (
        <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs p-6">
          <h2 className="font-serif text-xl font-bold text-[#281C16] mb-4">
            Auditable Referral &amp; Fund Allocation Ledger
          </h2>

          <div className="space-y-3">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-bold text-sm text-[#281C16]">{ref.productName}</div>
                  <div className="text-[#7A695C] mt-0.5">
                    Referral Code: <span className="font-mono font-bold text-[#9C4221]">{ref.referralCode}</span> • Customer: {ref.customerName || 'Anonymous'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-[#2D6A4F]">+GH₵{ref.commission}</div>
                  <div className="text-[10px] font-bold uppercase text-[#2D6A4F] bg-[#EAF5EF] px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {ref.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOTHERS TRIAGE TAB */}
      {activeTab === 'mothers' && (
        <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs p-6">
          <h2 className="font-serif text-xl font-bold text-[#281C16] mb-4">
            Mothers Risk &amp; Preparation Triage
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-[#281C16]">Akosua (24) — Kejetia, Kumasi</div>
                <div className="text-xs text-[#7A695C]">5 months pregnant • Due March 28, 2027 • Basic Phone (USSD)</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-[#2D6A4F]">
                  GH₵{user.currentSavings} / GH₵{user.targetPreparationAmount}
                </div>
                <span className="text-[10px] font-bold bg-[#EAF5EF] text-[#2D6A4F] px-2 py-0.5 rounded-full inline-block mt-0.5">
                  ON TRACK VIA NUMA
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Partner */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFC8]">
            <h3 className="font-serif text-2xl font-bold text-[#281C16] mb-1">Onboard Vetted Brand Partner</h3>
            <p className="text-xs text-[#7A695C] mb-5">
              Only authentic, clean local products that pass safety verification are admitted.
            </p>

            <form onSubmit={handleCreatePartner} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#5C4A3E] block mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asanka Organics"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#5C4A3E] block mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#5C4A3E] block mb-1">Vetted Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pure Cocoa Butter Glow"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#5C4A3E] block mb-1">Retail Price (GH₵)</label>
                  <input
                    type="number"
                    value={newRetailPrice}
                    onChange={(e) => setNewRetailPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#5C4A3E] block mb-1">Mother Commission (GH₵)</label>
                  <input
                    type="number"
                    value={newCommission}
                    onChange={(e) => setNewCommission(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPartnerModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#FAF7F2] text-[#5C4A3E] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#281C16] text-white font-bold"
                >
                  Approve &amp; Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
