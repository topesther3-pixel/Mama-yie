import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const OtpVerify: React.FC = () => {
  const { phoneNumber, setCurrentView } = useApp();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input box
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Handle pasting
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      const nextIndex = Math.min(5, pasted.length);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }
    setError('');
    setCurrentView('onboarding');
  };

  const handleUseDemoCode = () => {
    setOtp(['4', '4', '0', '2', '9', '1']);
    setError('');
    setTimeout(() => {
      inputRefs.current[5]?.focus();
    }, 50);
  };

  return (
    <div id="otp-verify-screen" className="min-h-screen flex flex-col justify-between px-6 py-8 max-w-md mx-auto bg-[#FAF7F2]">
      {/* Top Bar */}
      <div>
        <button
          id="otp-back-button"
          onClick={() => setCurrentView('login')}
          className="p-2 -ml-2 rounded-xl text-[#7A695C] hover:text-[#281C16] hover:bg-[#F4EFE6] transition-colors cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Edit number</span>
        </button>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full my-auto py-6"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#281C16] mb-2">
            Verify your number
          </h1>
          <p className="text-sm text-[#7A695C] max-w-xs mx-auto">
            Enter the 6-digit code sent to{' '}
            <span className="font-semibold text-[#281C16]">
              +233 {phoneNumber || '024 555 0192'}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-[#281C16] bg-white border-2 border-[#E8DFC8] rounded-2xl focus:border-[#E8824A] focus:ring-2 focus:ring-[#E8824A]/20 outline-none transition-all shadow-sm"
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-red-600 text-center font-medium">
              {error}
            </p>
          )}

          {/* Quick autofill helper */}
          <div className="flex items-center justify-center gap-1 text-xs">
            <span className="text-[#8C7A6D]">Testing?</span>
            <button
              type="button"
              id="autofill-demo-otp"
              onClick={handleUseDemoCode}
              className="text-[#9C4221] hover:text-[#7D3216] font-semibold cursor-pointer underline underline-offset-2"
            >
              Fill demo code (440291)
            </button>
          </div>

          {/* Verify CTA */}
          <button
            id="verify-button"
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#9C4221] hover:bg-[#853416] active:scale-[0.99] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Verify</span>
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleUseDemoCode}
            className="text-xs text-[#7A695C] hover:text-[#281C16] cursor-pointer"
          >
            Didn’t receive a code? <span className="font-semibold text-[#9C4221]">Resend code</span>
          </button>
        </div>
      </motion.div>

      <div className="h-6"></div>
    </div>
  );
};
