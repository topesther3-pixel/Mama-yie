import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, ArrowRight, Heart, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export const AmaOnboarding: React.FC = () => {
  const { user, updateUserProfile, setCurrentView } = useApp();
  const [dueDate, setDueDate] = useState<string>('2027-03-28');
  const [facility, setFacility] = useState<string>('Suntreso Government Hospital');

  const handleContinue = () => {
    // Format human readable date
    const dateObj = new Date(dueDate);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);

    updateUserProfile({
      dueDate: formattedDate || 'March 28, 2027',
      facility,
      pregnancyMonth: 5,
    });

    setCurrentView('home');
  };

  return (
    <div id="ama-onboarding-screen" className="min-h-screen flex flex-col justify-between px-6 py-8 max-w-md mx-auto bg-[#FAF8F8]">
      {/* Top indicator */}
      <div className="flex justify-center pt-2">
        <div className="w-12 h-1 rounded-full bg-[#F0EBE9]"></div>
      </div>

      {/* Main Ama Introduction & Date Selection */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full my-auto py-6 space-y-6"
      >
        {/* Ama Avatar Card */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-3xl bg-[#E61964] flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-10 h-10" />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
              <span className="text-sm">🇬🇭</span>
            </span>
          </div>

          <h1 className="font-serif font-bold text-3xl text-[#1E232B] mb-2">
            Hi, I’m Ama 👋
          </h1>
          <p className="text-base text-[#64748B] leading-relaxed max-w-xs">
            I’m here to help you prepare for your baby — one step at a time.
          </p>
        </div>

        {/* Due Date Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#F0EBE9] shadow-xs space-y-4">
          <label htmlFor="due-date-picker" className="block text-center font-serif font-bold text-xl text-[#1E232B]">
            When is your baby due?
          </label>

          <div className="relative">
            <div className="flex items-center rounded-2xl border border-[#F0EBE9] bg-[#FAF8F8] px-4 py-3.5 focus-within:border-[#E61964] focus-within:bg-white transition-all">
              <Calendar className="w-5 h-5 text-[#E61964] mr-3 shrink-0" />
              <input
                id="due-date-picker"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-base font-semibold text-[#1E232B] outline-none bg-transparent cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-[#FDF2F5] rounded-2xl p-3.5 border border-[#F8B4C8] flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-medium">Gestational stage:</span>
            <span className="font-bold text-[#E61964]">Month 5 (16 weeks to go)</span>
          </div>

          {/* Preferred Facility */}
          <div className="pt-2 border-t border-[#F0EBE9]">
            <div className="text-xs font-semibold text-[#64748B] mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#E61964]" />
              <span>Target Antenatal Clinic / Hospital:</span>
            </div>
            <select
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="w-full bg-[#FAF8F8] border border-[#F0EBE9] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1E232B] outline-none cursor-pointer"
            >
              <option value="Suntreso Government Hospital">Suntreso Government Hospital (Kumasi)</option>
              <option value="Sister Afia Midwifery Clinic">Sister Afia Midwifery Clinic (Bantama)</option>
              <option value="Komfo Anokye Teaching Hospital (KATH)">Komfo Anokye Teaching Hospital (KATH)</option>
              <option value="Manhyia District Hospital">Manhyia District Hospital</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Action CTA */}
      <div className="w-full pb-4">
        <button
          id="onboarding-continue-button"
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-[#E61964] hover:bg-[#D01255] active:scale-[0.99] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
