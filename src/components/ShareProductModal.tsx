import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, ExternalLink, ShoppingBag, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const ShareProductModal: React.FC = () => {
  const { activeModal, setActiveModal, activeProductForShare, simulateReferralPurchase, user } = useApp();
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  if (activeModal !== 'shareProduct' || !activeProductForShare) return null;

  const product = activeProductForShare;
  const referralLink = `https://numaorganics.shop?ref=${user.referralCode}&prod=${product.id}`;
  const smsTemplate = `Hello! I am preparing for my baby with Mama Yie. Check out ${product.name} from Ghanaian natural brand Numa Organics: ${referralLink}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulatePurchase = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      simulateReferralPurchase(product, 'Auntie Faustina (Kumasi Kejetia)');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFC8] relative my-8"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveModal('none')}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#7A695C] hover:text-[#281C16] hover:bg-[#F4EFE6] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Partner Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF1E4] text-[#9C4221] border border-[#E8DFC8]">
            Potential Mama Yie Partner • Demo Mode
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#281C16] mb-1">
          Share &amp; Earn for Your Fund
        </h3>
        <p className="text-sm text-[#7A695C] mb-5">
          You are sharing this vetted organic Ghanaian product through Mama Yie.
        </p>

        {/* Product Card Summary */}
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] mb-5">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 rounded-xl object-cover border border-[#E8DFC8] shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-[#281C16] truncate">{product.name}</h4>
            <p className="text-xs text-[#7A695C] line-clamp-2 mt-0.5">{product.description}</p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8DFC8]/60">
              <span className="text-xs font-semibold text-[#281C16]">Retail: GH₵{product.retailPrice}</span>
              <span className="text-xs font-bold text-[#2D6A4F] bg-[#EAF5EF] px-2 py-0.5 rounded-full">
                Your Earning: +GH₵{product.demoCommission}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="flex items-start gap-2 text-xs bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-200/80 mb-5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>DEMO EARNING — NOT PARTNER-CONFIRMED:</strong> Commission rate is configured for this hackathon demonstration. Products &amp; pricing reflect publicly available Numa Organics goods.
          </div>
        </div>

        {/* Referral Code & Link Box */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-xs font-bold text-[#5C4A3E] uppercase tracking-wider block mb-1">
              Your Unique Referral Code
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border-2 border-dashed border-[#E8824A] text-[#281C16] font-mono font-bold text-base">
              <span>{user.referralCode}</span>
              <span className="text-xs font-sans font-normal text-[#9C4221]">Tied to Akosua's Fund</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#5C4A3E] uppercase tracking-wider block mb-1">
              Referral Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-xs text-[#5C4A3E] font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2.5 rounded-xl bg-[#281C16] hover:bg-[#3D291F] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Simulate Purchase Button - Central for Judges */}
          <button
            onClick={handleSimulatePurchase}
            disabled={isSimulating}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#2D6A4F] to-[#1E523C] hover:from-[#245841] hover:to-[#174130] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:scale-101 disabled:opacity-75"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isSimulating ? 'Simulating Purchase...' : `Simulate Customer Purchase (+GH₵${product.demoCommission})`}</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href="https://numaorganics.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#5C4A3E] hover:text-[#281C16] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E8DFC8] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View on Numa Organics</span>
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(smsTemplate);
                alert('SMS text copied! You can send this via basic phone SMS.');
              }}
              className="py-2.5 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#5C4A3E] hover:text-[#281C16] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E8DFC8] transition-colors"
              title="Copy SMS text for basic phone users"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Copy Basic SMS</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
