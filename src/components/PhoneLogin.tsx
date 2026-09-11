import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const PhoneLogin: React.FC = () => {
  const { phoneNumber, setPhoneNumber, setCurrentView } = useApp();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\s+/g, '');
    if (cleanNumber.length < 9) {
      setError('Please enter a valid Ghanaian phone number');
      return;
    }
    setError('');
    setCurrentView('otp');
  };

  const handleAutofillDemo = () => {
    setPhoneNumber('024 555 0192');
    setError('');
  };

  return (
    <div id="phone-login-screen" className="min-h-screen flex flex-col justify-between px-6 py-8 max-w-md mx-auto bg-[#FAF7F2]">
      {/* Top Branding */}
      <div className="pt-6 sm:pt-10 flex flex-col items-center text-center">
        {/* Mama Yie Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9C4221] to-[#E8824A] flex items-center justify-center text-white font-serif font-bold text-2xl shadow-md mb-4"
        >
          MY
        </motion.div>
        <h1 className="font-serif font-bold text-2xl tracking-tight text-[#281C16]">
          MAMA YIE
        </h1>
        <p className="text-sm font-medium text-[#7A695C] mt-1">
          Safe motherhood, earned and saved.
        </p>
      </div>

      {/* Main Question & Input Card */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="w-full my-auto py-6"
      >
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#281C16] text-center mb-8">
          What’s your phone number?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="flex items-center rounded-2xl border-2 border-[#E8DFC8] bg-white px-4 py-3.5 focus-within:border-[#E8824A] focus-within:ring-2 focus-within:ring-[#E8824A]/20 transition-all shadow-sm">
              <div className="flex items-center gap-2 pr-3 border-r border-[#E8DFC8] text-[#281C16] font-semibold text-base select-none">
                <span className="text-xl" role="img" aria-label="Ghana flag">🇬🇭</span>
                <span>+233</span>
              </div>
              <input
                id="phone-number-input"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (error) setError('');
                }}
                placeholder="24 555 0192"
                className="w-full pl-3 text-lg sm:text-xl font-semibold text-[#281C16] placeholder-[#B5A89B] outline-none bg-transparent"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-2 font-medium pl-1">
                {error}
              </p>
            )}
          </div>

          {/* Helper demo shortcut */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-[#8C7A6D]">Demo persona: Akosua</span>
            <button
              type="button"
              id="autofill-demo-phone"
              onClick={handleAutofillDemo}
              className="text-[#9C4221] hover:text-[#7D3216] font-semibold cursor-pointer underline underline-offset-2"
            >
              Use demo number
            </button>
          </div>

          {/* Primary CTA */}
          <button
            id="login-continue-button"
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#9C4221] hover:bg-[#853416] active:scale-[0.99] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-xs text-[#8C7A6D] text-center mt-5 leading-relaxed">
          We’ll send you a one-time verification code.
        </p>
      </motion.div>

      {/* Footer reassurance */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#7A695C] bg-[#FAF1E4] px-3 py-1.5 rounded-full border border-[#E8DFC8]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
          <span>Zero smartphone or mobile data needed for basic phones</span>
        </div>
      </div>
    </div>
  );
};
