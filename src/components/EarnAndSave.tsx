import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PartnerProduct } from '../types';
import { Sparkles, Share2, ExternalLink, ShieldCheck, ArrowRight, CheckCircle2, TrendingUp, HeartHandshake, Leaf, Info } from 'lucide-react';
import { motion } from 'motion/react';

export const EarnAndSave: React.FC = () => {
  const { partners, setActiveModal, setActiveProductForShare, simulateReferralPurchase, user } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const numaPartner = partners.find((p) => p.id === 'partner_numa_organics') || partners[0];
  const products = numaPartner?.products || [];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleShareClick = (product: PartnerProduct) => {
    setActiveProductForShare(product);
    setActiveModal('shareProduct');
  };

  const handleQuickSimulate = (product: PartnerProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    simulateReferralPurchase(product, 'Customer in Kumasi Adum');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section of Earn & Save */}
      <div className="bg-[#1E232B] text-white p-6 sm:p-10 rounded-3xl mb-8 relative overflow-hidden shadow-lg border border-[#F0EBE9]/20">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F5] text-[#E61964] text-xs font-bold uppercase tracking-wider mb-4 border border-[#F8B4C8]">
            <Sparkles className="w-3.5 h-3.5 text-[#E61964]" />
            The Central Innovation of Mama Yie
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mb-4">
            Earn your way to prepared.
          </h1>

          <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed mb-8">
            You don't need spare money to start. Mama Yie founders vet authentic local brands, so expecting mothers like Akosua can share products and earn directly into their motherhood fund.
          </p>

          {/* The 4-Step Core Loop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { step: '1. PARTNER', desc: 'Founders source & vet local Ghanaian makers' },
              { step: '2. SHARE', desc: 'Mother shares approved product via link/SMS' },
              { step: '3. EARN', desc: 'Customer buys; mother receives demo commission' },
              { step: '4. SAVE', desc: 'Commission deposits straight into Motherhood Fund' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="text-xs font-bold font-mono text-[#F8B4C8]">{item.step}</div>
                <div className="text-[11px] text-[#CBD5E1] mt-1 leading-snug">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Numa Organics Partner Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EBE9] shadow-xs mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#F0EBE9]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EDF7EE] border border-[#BAE3C2] flex items-center justify-center text-[#2E7D46] font-serif font-bold text-2xl">
              <Leaf className="w-8 h-8 text-[#2E7D46]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#1E232B]">Numa Organics</h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF2F5] text-[#E61964] border border-[#F8B4C8]">
                  Potential Mama Yie Partner
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDF7EE] text-[#1C592E] flex items-center gap-1 border border-[#BAE3C2]">
                  <ShieldCheck className="w-3 h-3" />
                  Founder Vetted
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1 max-w-xl">
                {numaPartner?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <a
              href="https://numaorganics.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#FAF8F8] hover:bg-[#FDF2F5] text-[#1E232B] text-xs font-semibold flex items-center gap-1.5 border border-[#F0EBE9] transition-colors"
            >
              <span>Visit Official Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Disclaimer on Demo Commission */}
        <div className="flex items-start gap-2.5 text-xs bg-[#FAF8F8] p-3.5 rounded-2xl border border-[#F0EBE9] text-[#64748B] mt-4">
          <Info className="w-4 h-4 text-[#E61964] shrink-0 mt-0.5" />
          <div>
            <strong>DEMO PARTNER MODE:</strong> Product names and descriptions are drawn from publicly available Ghanaian organic skincare lines. Commission amounts (e.g. GH₵4–7) are demonstration parameters for this MVP and not partner-contracted.
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Products' },
            { id: 'belly_care', label: 'Maternal Belly Care' },
            { id: 'skincare', label: 'Natural Skincare' },
            { id: 'baby_essentials', label: 'Baby & Newborn' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-[#E61964] text-white'
                  : 'bg-[#FAF8F8] text-[#64748B] hover:bg-[#F0EBE9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl border border-[#F0EBE9] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-[#FAF8F8]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#2E7D46] shadow-xs">
                  Earn +GH₵{product.demoCommission}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E61964]">
                  Numa Organics
                </span>
                <h3 className="font-serif font-bold text-base text-[#1E232B] mt-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#F0EBE9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#64748B] block">Retail Price</span>
                    <span className="text-sm font-bold text-[#1E232B]">GH₵{product.retailPrice}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#2E7D46] font-bold block">Your Earning</span>
                    <span className="text-sm font-bold text-[#2E7D46] bg-[#EDF7EE] px-2 py-0.5 rounded-full border border-[#BAE3C2]">
                      +GH₵{product.demoCommission}
                    </span>
                  </div>
                </div>

                <div className="text-[9px] text-[#64748B] mt-2 italic">
                  {product.commissionNote}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 space-y-2">
              <button
                onClick={() => handleShareClick(product)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#E61964] hover:bg-[#D01255] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share &amp; Earn (+GH₵{product.demoCommission})</span>
              </button>

              <button
                onClick={(e) => handleQuickSimulate(product, e)}
                className="w-full py-1.5 px-2 rounded-xl bg-[#EDF7EE] hover:bg-[#DBEEDB] text-[#1C592E] text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors border border-[#BAE3C2]"
                title="Instantly test the referral earning flow"
              >
                <Sparkles className="w-3 h-3 text-[#2E7D46]" />
                <span>Simulate Purchase Now</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
