import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Partner, PartnerProduct } from '../types';
import {
  Share2,
  Check,
  Copy,
  ArrowRight,
  ArrowLeft,
  X,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EarnScreen: React.FC = () => {
  const { partners, user, simulateReferralPurchase, setCurrentView } = useApp();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<PartnerProduct | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  // Selected partner object (if any)
  const selectedPartner = partners.find((p) => p.id === selectedPartnerId) || null;

  // Handler: Open Product Detail & Share Modal
  const handleOpenShare = (product: PartnerProduct) => {
    setActiveProduct(product);
    setCopiedLink(false);
  };

  // Handler: Copy User Referral Code
  const handleCopyCode = () => {
    navigator.clipboard?.writeText(user.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Handler: Copy Product Demo Referral Link
  const getReferralUrl = (productId: string) => {
    return `https://mama-yie.app/r/demo/${productId}?ref=${user.referralCode}`;
  };

  const handleCopyLink = (productId: string) => {
    navigator.clipboard?.writeText(getReferralUrl(productId));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Handler: Share via WhatsApp
  const handleShareWhatsApp = (product: PartnerProduct) => {
    const link = getReferralUrl(product.id);
    const message = encodeURIComponent(
      `Hello! I recommend this ${product.name} from ${selectedPartner?.name || 'our local partner'}. You can check it out here: ${link} (Use my referral code ${user.referralCode} for tracking!)`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  // Handler: Simulate Purchase
  const handleSimulatePurchase = (product: PartnerProduct, partnerName?: string) => {
    if (simulatingId) return; // Prevent double trigger
    setSimulatingId(product.id);

    setTimeout(() => {
      setSimulatingId(null);
      setActiveProduct(null);
      simulateReferralPurchase(
        product,
        'Customer in Kumasi Adum',
        partnerName || selectedPartner?.name || 'Demo Partner'
      );
    }, 300);
  };

  return (
    <div id="earn-screen" className="flex-1 px-4 sm:px-5 pt-6 pb-24 max-w-md mx-auto w-full space-y-6">
      {/* View 1: Partners Directory */}
      {!selectedPartner ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#BE123C] bg-[#FDF2F5] px-2.5 py-0.5 rounded-full border border-[#F8B4C8]">
                DEMO EARN &amp; SAVE
              </span>
              <span className="text-[10px] font-medium text-[#64748B]">Prototype</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1E232B] leading-tight">
              Earn while you prepare for motherhood.
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Discover selected local Ghanaian partner businesses, share products through your referral link, and earn demo commissions added straight into your Mama Yie Motherhood Fund.
            </p>
          </div>

          {/* Motherhood Fund Progress Summary Pill */}
          <div
            onClick={() => setCurrentView('home')}
            className="bg-white rounded-2xl p-4 border border-[#F0EBE9] flex items-center justify-between cursor-pointer hover:border-[#BAE3C2] transition-colors shadow-xs"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                Your Motherhood Fund Balance
              </span>
              <div className="font-serif font-bold text-xl text-[#2E7D46] mt-0.5">
                GH₵{user.currentSavings}{' '}
                <span className="text-xs font-normal text-[#64748B]">/ GH₵{user.targetPreparationAmount}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#E61964]">
              <span>View Fund</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Referral Code Bar */}
          <div className="bg-[#FDF2F5] rounded-2xl p-3.5 border border-[#F8B4C8] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Your Referral Code
              </span>
              <span className="font-mono font-bold text-base text-[#1E232B]">
                {user.referralCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#F8B4C8] text-xs font-semibold text-[#E61964] hover:bg-[#FDF2F5] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#2E7D46]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Partner Businesses Heading */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Local Demo Partners
            </h2>
            <span className="text-[11px] text-[#64748B]">
              {partners.length} businesses
            </span>
          </div>

          {/* Partners Cards List */}
          <div className="space-y-4">
            {partners.map((partner) => {
              const productCount = partner.products?.length || 0;
              const firstProduct = partner.products?.[0];

              return (
                <div
                  key={partner.id}
                  id={`partner-card-${partner.id}`}
                  className="bg-white rounded-3xl p-5 border-2 border-[#F0EBE9] shadow-xs flex flex-col gap-3.5 hover:border-[#BAE3C2] transition-all"
                >
                  {/* Card Top: DEMO PARTNER Badge & External Link */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#BE123C] bg-[#FDF2F5] px-2.5 py-0.5 rounded-full border border-[#F8B4C8]">
                      DEMO PARTNER
                    </span>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-medium text-[#64748B] hover:text-[#E61964] flex items-center gap-1 transition-colors"
                      title="Visit official shop website"
                    >
                      <span>Visit Shop</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Partner Identity */}
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#1E232B]">
                      {partner.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#2E7D46] mt-0.5">
                      {partner.category || 'Local Ghanaian business'}
                    </p>
                    <p className="text-xs text-[#64748B] leading-relaxed mt-1.5">
                      {partner.description}
                    </p>
                  </div>

                  {/* Products Peek */}
                  <div className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#E61964]" />
                    <span>Explore {productCount} products</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      id={`view-products-btn-${partner.id}`}
                      onClick={() => setSelectedPartnerId(partner.id)}
                      className="py-3 px-3 rounded-2xl bg-white hover:bg-[#FAF8F8] border-2 border-[#F0EBE9] text-[#1E232B] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>View Products</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E61964]" />
                    </button>

                    <button
                      id={`share-earn-partner-btn-${partner.id}`}
                      onClick={() => {
                        setSelectedPartnerId(partner.id);
                        if (firstProduct) {
                          handleOpenShare(firstProduct);
                        }
                      }}
                      className="py-3 px-3 rounded-2xl bg-[#E61964] hover:bg-[#D01255] active:scale-[0.99] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share &amp; Earn</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prototype Disclosure Notice */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#F0EBE9] text-[11px] text-[#64748B] leading-relaxed space-y-1">
            <span className="font-bold text-[#1E232B] block">Important Prototype Disclosure</span>
            <p>
              These businesses are featured as <strong>Demo Partners</strong> for the Mama Yie hackathon prototype. Mama Yie does not claim a signed commercial contract, and transactions are simulated for demonstration.
            </p>
          </div>
        </div>
      ) : (
        /* View 2: Partner Profile & Products List */
        <div className="space-y-6">
          {/* Back Navigation Bar */}
          <button
            onClick={() => setSelectedPartnerId(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#E61964] hover:text-[#D01255] py-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Partners</span>
          </button>

          {/* Partner Profile Header Card */}
          <div className="bg-white rounded-3xl p-5 border-2 border-[#F0EBE9] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#BE123C] bg-[#FDF2F5] px-2.5 py-0.5 rounded-full border border-[#F8B4C8]">
                DEMO PARTNER
              </span>
              <a
                href={selectedPartner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-[#64748B] hover:text-[#E61964] flex items-center gap-1 transition-colors"
              >
                <span>Visit Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <h1 className="font-serif font-bold text-2xl text-[#1E232B]">
                {selectedPartner.name}
              </h1>
              <p className="text-xs font-semibold text-[#2E7D46] mt-0.5">
                {selectedPartner.category}
              </p>
              <p className="text-xs text-[#64748B] leading-relaxed mt-2">
                {selectedPartner.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#F0EBE9] flex items-center justify-between text-xs text-[#64748B]">
              <span>Products available: <strong>{selectedPartner.products?.length || 0}</strong></span>
              <span>Commission: <strong>GH₵4 – GH₵7 per sale</strong></span>
            </div>
          </div>

          {/* Section: Select a product to share */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Select a product to share &amp; earn
              </h2>
              <span className="text-[11px] text-[#64748B]">
                {selectedPartner.products?.length || 0} items
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Share via WhatsApp or copy your link. Tapping <em>Simulate Purchase</em> instantly credits your fund.
            </p>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {selectedPartner.products?.map((product) => (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#F0EBE9] shadow-xs flex flex-col gap-3.5"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] bg-[#FAF8F8] px-2 py-0.5 rounded-md border border-[#F0EBE9]">
                    {product.category ? product.category.replace('_', ' ') : 'Botanical'}
                  </span>
                  <span className="text-xs font-bold text-[#1C592E] bg-[#EDF7EE] border border-[#BAE3C2] px-2.5 py-0.5 rounded-full">
                    Earn GH₵{product.demoCommission}
                  </span>
                </div>

                {/* Product Image & Details */}
                <div className="flex gap-3.5 items-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-[#F0EBE9] shrink-0 bg-[#FAF8F8]"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-serif font-bold text-base text-[#1E232B] leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="font-bold text-base sm:text-lg text-[#1E232B]">
                        GH₵{product.price || product.retailPrice}
                      </span>
                      <span className="text-[11px] text-[#64748B]">retail price</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions: Share & Earn / Simulate Purchase */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    id={`share-btn-${product.id}`}
                    onClick={() => handleOpenShare(product)}
                    className="py-3 px-3 rounded-2xl bg-[#E61964] hover:bg-[#D01255] active:scale-[0.99] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share &amp; Earn</span>
                  </button>

                  <button
                    id={`simulate-purchase-card-btn-${product.id}`}
                    onClick={() => handleSimulatePurchase(product, selectedPartner.name)}
                    disabled={simulatingId === product.id}
                    className="py-3 px-3 rounded-2xl bg-[#2E7D46] hover:bg-[#256637] active:scale-[0.99] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Simulate (+GH₵{product.demoCommission})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Dialog & Simulated Purchase Modal */}
      <AnimatePresence>
        {activeProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border-2 border-[#F0EBE9] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE9]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#BE123C] bg-[#FDF2F5] px-2 py-0.5 rounded-full border border-[#F8B4C8]">
                    DEMO PARTNER
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#1E232B]">
                    Share Product
                  </h3>
                </div>
                <button
                  onClick={() => setActiveProduct(null)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#1E232B] cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Card Summary */}
              <div className="flex gap-3 items-center bg-[#FAF8F8] p-3 rounded-2xl border border-[#F0EBE9]">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-16 h-16 object-cover rounded-xl border border-[#F0EBE9] shrink-0"
                />
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                    {selectedPartner?.name || 'Partner Business'}
                  </span>
                  <p className="font-semibold text-xs text-[#1E232B] line-clamp-1">
                    {activeProduct.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#1E232B]">GH₵{activeProduct.price || activeProduct.retailPrice}</span>
                    <span>•</span>
                    <span className="font-bold text-[#2E7D46]">
                      Earn GH₵{activeProduct.demoCommission}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share This Product Section */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                  Share this product
                </span>

                {/* Simulated Referral Link Display */}
                <div className="bg-[#FDF2F5] rounded-2xl p-3 border border-[#F8B4C8] space-y-1">
                  <span className="text-[10px] font-semibold text-[#64748B] block">
                    Simulated Referral Link
                  </span>
                  <div className="font-mono text-xs text-[#BE123C] break-all select-all font-semibold">
                    {getReferralUrl(activeProduct.id)}
                  </div>
                </div>

                {/* Share Actions (WhatsApp & Copy Link) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    id="share-whatsapp-btn"
                    onClick={() => handleShareWhatsApp(activeProduct)}
                    className="py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    id="copy-referral-link-btn"
                    onClick={() => handleCopyLink(activeProduct.id)}
                    className="py-3 px-3 rounded-xl bg-white border border-[#F0EBE9] text-[#1E232B] hover:bg-[#FAF8F8] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-[#2E7D46]" /> : <Copy className="w-4 h-4 text-[#E61964]" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Simulated Purchase Section */}
              <div className="bg-[#FAF8F8] rounded-2xl p-4 border border-[#F0EBE9] space-y-3 pt-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D46] block">
                    Prototype Test Action
                  </span>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    This is a demo transaction for the Mama Yie prototype. Simulating a purchase instantly records a commission in your Motherhood Fund.
                  </p>
                </div>

                <button
                  id="simulate-demo-purchase-modal-btn"
                  onClick={() => handleSimulatePurchase(activeProduct, selectedPartner?.name)}
                  disabled={simulatingId === activeProduct.id}
                  className="w-full py-3.5 rounded-2xl bg-[#2E7D46] hover:bg-[#256637] active:scale-[0.99] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>
                    {simulatingId === activeProduct.id
                      ? 'Simulating...'
                      : `Simulate Purchase (+GH₵${activeProduct.demoCommission})`}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
