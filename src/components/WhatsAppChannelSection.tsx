import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WHATSAPP_CONFIG } from '../config/whatsapp';
import { getWhatsAppChannelConfig, generateChannelQrCode } from '../services/whatsappService';
import {
  Sparkles,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Heart,
  X,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Crisp WhatsApp SVG Icon
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.164 8.164 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.08l-.29-.17-3.02.79.81-2.94-.19-.3a8.162 8.162 0 0 1-1.25-4.53c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7 2.46 1.06 2.46.71 2.91.66.44-.04 1.47-.6 1.67-1.18.21-.57.21-1.07.15-1.18-.06-.12-.22-.19-.47-.31z" />
  </svg>
);

interface WhatsAppChannelSectionProps {
  compact?: boolean;
  className?: string;
  showDetailsToggle?: boolean;
}

export const WhatsAppChannelSection: React.FC<WhatsAppChannelSectionProps> = ({
  compact = false,
  className = '',
  showDetailsToggle = true,
}) => {
  const { setCurrentView } = useApp();
  const [channelUrl, setChannelUrl] = useState<string>(WHATSAPP_CONFIG.channelUrl);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [expandedTopics, setExpandedTopics] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const config = await getWhatsAppChannelConfig();
      if (isMounted) {
        setChannelUrl(config.channelUrl);
        const qr = await generateChannelQrCode(config.channelUrl);
        if (isMounted) {
          setQrCodeDataUrl(qr);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(channelUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      // Fallback
    }
  };

  const handleOpenChannel = () => {
    window.open(channelUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div
        id="whatsapp-channel-section"
        className={`bg-white rounded-3xl p-6 border-2 border-[#25D366]/30 shadow-xs relative overflow-hidden space-y-5 ${className}`}
      >
        {/* Subtle decorative background tint */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#25D366]/5 rounded-full pointer-events-none blur-2xl" />

        {/* Section Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0">
              <WhatsAppIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C592E] bg-[#EDF7EE] px-2 py-0.5 rounded-full border border-[#BAE3C2]">
                  Official Channel
                </span>
                <span className="text-[10px] text-[#64748B] font-medium">Broadcast</span>
              </div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#1E232B] mt-0.5">
                MAMA YIE ON WHATSAPP 💗
              </h2>
            </div>
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            className="p-2 rounded-xl border border-[#F0EBE9] text-[#64748B] hover:text-[#1E232B] hover:bg-[#FAF8F8] transition-colors cursor-pointer shrink-0"
            title="Show Channel QR Code"
            aria-label="Show Channel QR Code"
          >
            <QrCode className="w-5 h-5 text-[#25D366]" />
          </button>
        </div>

        {/* Description as specified in user request */}
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
          Get maternal-health tips, important updates, Earn &amp; Save opportunities and Mama Yie news directly on WhatsApp.
        </p>

        {/* Channel Name & Guarantee Pill */}
        <div className="bg-[#FAF8F8] rounded-2xl p-3 border border-[#F0EBE9] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1E232B]">Channel Name:</span>
            <span className="font-medium text-[#2E7D46] font-serif text-[11px] sm:text-xs">
              MAMA YIE 💗 | Care. Connect. Earn. Save.
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] pt-1 border-t border-[#F0EBE9]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D46] shrink-0" />
            <span>One-way broadcast channel. Your personal phone number stays private.</span>
          </div>
        </div>

        {/* Primary Action Button: [FOLLOW OUR WHATSAPP CHANNEL] */}
        <div className="space-y-2.5">
          <button
            id="follow-whatsapp-channel-btn"
            onClick={handleOpenChannel}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] active:scale-[0.99] text-white font-bold text-sm sm:text-base transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>FOLLOW OUR WHATSAPP CHANNEL</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </button>

          {/* Quick link copy & QR modal triggers */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-[#64748B] hover:text-[#1E232B] font-medium py-1 px-2 rounded-lg hover:bg-[#FAF8F8] transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E7D46]" />
                  <span className="text-[#2E7D46] font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Channel Link</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 text-[#2E7D46] hover:text-[#1C592E] font-medium py-1 px-2 rounded-lg hover:bg-[#EDF7EE] transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>View QR Code</span>
            </button>
          </div>
        </div>

        {/* Two-Way Mama Yie Support Section (Clearly Marked Coming Soon) */}
        <div className="pt-4 border-t border-[#F0EBE9] space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs sm:text-sm text-[#1E232B]">Need personal help?</h3>
                <span className="text-[9px] font-extrabold uppercase tracking-wide bg-[#FDF2F5] text-[#E61964] px-2 py-0.5 rounded-full border border-[#F8B4C8]">
                  COMING SOON
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Two-way Mama Yie support on WhatsApp is coming soon.
              </p>
            </div>
          </div>

          {/* Button: [CHAT WITH MAMA YIE] with COMING SOON mark */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              id="chat-with-mama-yie-btn"
              onClick={() => setShowComingSoonModal(true)}
              className="w-full py-3 px-4 rounded-xl bg-[#FAF8F8] hover:bg-[#FDF2F5] border border-[#F0EBE9] text-[#1E232B] font-bold text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>CHAT WITH MAMA YIE</span>
              </div>
              <span className="text-[10px] font-bold uppercase bg-[#FDF2F5] text-[#E61964] border border-[#F8B4C8] px-2 py-0.5 rounded-md">
                COMING SOON
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Topic Highlights */}
        {showDetailsToggle && (
          <div className="pt-2">
            <button
              onClick={() => setExpandedTopics(!expandedTopics)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#64748B] hover:text-[#1E232B] py-1 cursor-pointer"
            >
              <span>What you'll receive on the channel</span>
              {expandedTopics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {expandedTopics && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-2.5 space-y-2 text-xs text-[#64748B] bg-[#FAF8F8] p-3.5 rounded-2xl border border-[#F0EBE9]">
                    {WHATSAPP_CONFIG.channelTopics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#25D366] font-bold">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                    <li className="pt-2 border-t border-[#F0EBE9] text-[11px] text-[#64748B] italic flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 text-[#E61964]" />
                      <span>Not a medical emergency service. In emergencies, please visit the hospital labor ward directly.</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* QR Code Modal Dialog */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#F0EBE9] shadow-2xl relative space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE9]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center">
                    <WhatsAppIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1E232B]">Mama Yie Channel QR</h3>
                    <p className="text-[11px] text-[#64748B]">Scan to follow on WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="p-1.5 rounded-xl text-[#64748B] hover:text-[#1E232B] hover:bg-[#FAF8F8] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Code Image */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#FAF8F8] rounded-2xl border border-[#F0EBE9]">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Mama Yie WhatsApp Channel QR Code"
                    className="w-56 h-56 rounded-xl shadow-xs bg-white p-2"
                  />
                ) : (
                  <div className="w-56 h-56 rounded-xl bg-white flex items-center justify-center text-xs text-[#64748B]">
                    Generating QR Code...
                  </div>
                )}
                <p className="text-xs font-bold text-[#1E232B] text-center mt-3">
                  MAMA YIE 💗 | Care. Connect. Earn. Save.
                </p>
                <p className="text-[11px] text-[#64748B] text-center mt-0.5">
                  Point any phone camera or WhatsApp camera to follow
                </p>
              </div>

              {/* Action Buttons inside QR modal */}
              <div className="space-y-2">
                <button
                  onClick={handleOpenChannel}
                  className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Channel on WhatsApp</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 rounded-xl border border-[#F0EBE9] bg-white hover:bg-[#FAF8F8] text-[#1E232B] font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2E7D46]" />
                      <span className="text-[#2E7D46] font-bold">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Channel Link</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* "Coming Soon" Two-Way WhatsApp Support Modal */}
      <AnimatePresence>
        {showComingSoonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#F0EBE9] shadow-2xl relative space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE9]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FDF2F5] text-[#E61964] flex items-center justify-center border border-[#F8B4C8]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1E232B]">Chat with Mama Yie</h3>
                    <p className="text-[11px] text-[#E61964] font-bold uppercase">Coming Soon on WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowComingSoonModal(false)}
                  className="p-1.5 rounded-xl text-[#64748B] hover:text-[#1E232B] hover:bg-[#FAF8F8] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-[#64748B] space-y-2.5 leading-relaxed">
                <p>
                  Two-way Mama Yie support on WhatsApp is currently in development. We are connecting our secure WhatsApp Business backend so you can safely:
                </p>
                <div className="bg-[#FAF8F8] p-3.5 rounded-2xl border border-[#F0EBE9] space-y-1.5 text-[11px]">
                  {WHATSAPP_CONFIG.twoWayService.plannedCapabilities.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#2E7D46] font-bold">✓</span>
                      <span className="text-[#1E232B]">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[#64748B] text-[11px]">
                  In the meantime, you can chat directly with <strong>Ama</strong> right here in the Mama Yie web app with zero wait time!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#F0EBE9]">
                <button
                  onClick={() => {
                    setShowComingSoonModal(false);
                    setCurrentView('ama');
                  }}
                  className="w-full py-3 rounded-xl bg-[#E61964] hover:bg-[#D01255] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Chat with Ama in App Now</span>
                </button>

                <button
                  onClick={() => {
                    setShowComingSoonModal(false);
                    handleOpenChannel();
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#BAE3C2] bg-[#EDF7EE] hover:bg-[#DBEEDB] text-[#1C592E] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>Follow WhatsApp Channel Instead</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
