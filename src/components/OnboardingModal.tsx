import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const OnboardingModal: React.FC = () => {
  const { user, updateUserProfile, setCurrentView } = useApp();
  const [step, setStep] = useState(1);

  // Form states initialized with Akosua demo persona
  const [name, setName] = useState(user.name);
  const [dueDate, setDueDate] = useState('March 28, 2027');
  const [location, setLocation] = useState('Kumasi / Ashanti Region');
  const [facility, setFacility] = useState('Suntreso Government Hospital');
  const [startingSavings, setStartingSavings] = useState(0);
  const [phoneType, setPhoneType] = useState<'basic' | 'smartphone' | 'both'>('basic');
  const [riskInfo, setRiskInfo] = useState('No high-risk complications noted; routine care path');

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      // Complete onboarding!
      updateUserProfile({
        name,
        dueDate,
        region: location,
        facility,
        startingSavings,
        phoneType,
        riskProfile: riskInfo,
      });
      setStep(8); // Finish screen
    }
  };

  const handleFinish = () => {
    setCurrentView('ama');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-md p-6 sm:p-10 relative">
        {/* Step Indicator */}
        {step <= 7 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[#7A695C] font-semibold mb-2">
              <span>Step {step} of 7</span>
              <span>Onboarding Akosua</span>
            </div>
            <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8DFC8]">
              <div
                className="h-full bg-[#E8824A] rounded-full transition-all duration-300"
                style={{ width: `${(step / 7) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* STEP 1: Name */}
        {step === 1 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-2.5 py-0.5 rounded-full">
              Step 1: Introduction
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#281C16]">
              What is your name?
            </h2>
            <p className="text-sm text-[#7A695C]">
              We use your name to personalize your guidance with Ama and match you with a local Support Circle.
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] text-base font-bold text-[#281C16] focus:outline-none focus:border-[#E8824A]"
            />
          </div>
        )}

        {/* STEP 2: Due Date */}
        {step === 2 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-2.5 py-0.5 rounded-full">
              Step 2: Timeline
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#281C16]">
              When is your baby due?
            </h2>
            <p className="text-sm text-[#7A695C]">
              This allows Ama to calculate the exact preparation weeks remaining and establish your weekly target.
            </p>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] text-base font-bold text-[#281C16] focus:outline-none focus:border-[#E8824A]"
            />
            <div className="text-xs text-[#7A695C] italic">
              Example: March 2027 (~16 weeks to delivery)
            </div>
          </div>
        )}

        {/* STEP 3: Location */}
        {step === 3 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-2.5 py-0.5 rounded-full">
              Step 3: Location
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#281C16]">
              Where are you located?
            </h2>
            <p className="text-sm text-[#7A695C]">
              Hospital fees and midwife networks vary by district in Ghana.
            </p>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] text-base font-bold text-[#281C16] focus:outline-none"
            >
              <option value="Kumasi / Ashanti Region">Kumasi / Ashanti Region (Kejetia, Bantama, Tafo)</option>
              <option value="Accra / Greater Accra">Accra / Greater Accra (Madina, Makola, Tema)</option>
              <option value="Western Region (Takoradi)">Western Region (Takoradi)</option>
              <option value="Northern Region (Tamale)">Northern Region (Tamale)</option>
            </select>
          </div>
        )}

        {/* STEP 4: Facility */}
        {step === 4 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-2.5 py-0.5 rounded-full">
              Step 4: Healthcare Facility
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#281C16]">
              Which facility are you planning to use?
            </h2>
            <p className="text-sm text-[#7A695C]">
              We compare facility tiers (CHPS compound, Polyclinic, Regional Hospital) to estimate realistic preparation numbers.
            </p>
            <select
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] text-base font-bold text-[#281C16] focus:outline-none"
            >
              <option value="Suntreso Government Hospital">Suntreso Government Hospital (District Polyclinic)</option>
              <option value="Sister Afia Midwifery & Maternal Home">Sister Afia Midwifery &amp; Maternal Home (Bantama)</option>
              <option value="Manhyia District Hospital">Manhyia District Hospital</option>
              <option value="Komfo Anokye Teaching Hospital (KATH)">Komfo Anokye Teaching Hospital (Tertiary)</option>
            </select>
          </div>
        )}

        {/* STEP 5: Starting Savings */}
        {step === 5 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-2.5 py-0.5 rounded-full">
              Step 5: Financial Baseline
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#281C16]">
              Do you currently have pregnancy savings?
            </h2>
            <p className="text-sm text-[#7A695C]">
              Most expecting mothers have GH₵0 dedicated savings. Mama Yie exists specifically to help you earn what you don't have yet.
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF1E4] border border-[#E8DFC8] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9C4221] block">Akosua Starting Savings</span>
                <span className="text-xs text-[#7A695C]">Starting from zero cash</span>
              </div>
              <div className="text-2xl font-serif font-bold text-[#281C16]">
                GH₵{startingSavings}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStartingSavings(0)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                  startingSavings === 0 ? 'bg-[#281C16] text-white border-[#281C16]' : 'bg-[#FAF7F2] text-[#5C4A3E]'
                }`}
              >
                GH₵0 (No spare cash)
              </button>
              <button
                type="button"
                onClick={() => setStartingSavings(50)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                  startingSavings === 50 ? 'bg-[#281C16] text-white border-[#281C16]' : 'bg-[#FAF7F2] text-[#5C4A3E]'
                }`}
              >
                GH₵50
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Phone Type */}
        {step === 6 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-2.5 py-0.5 rounded-full">
              Step 6: Technology Access
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#281C16]">
              How do you normally access the phone/internet?
            </h2>
            <p className="text-sm text-[#7A695C]">
              Mama Yie is accessible through USSD on basic feature phones without data or smartphones.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'basic', label: 'Basic Phone (USSD *920*44#)', desc: 'Yam / button phone' },
                { id: 'smartphone', label: 'Smartphone', desc: 'Android / Touch' },
                { id: 'both', label: 'Both', desc: 'USSD + Web' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPhoneType(opt.id as any)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    phoneType === opt.id
                      ? 'border-[#9C4221] bg-[#FAF1E4]'
                      : 'border-[#E8DFC8] bg-[#FAF7F2]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#281C16]">{opt.label}</div>
                  <div className="text-[11px] text-[#7A695C] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: Risk Factors */}
        {step === 7 && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-2.5 py-0.5 rounded-full">
              Step 7: Antenatal Notes
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#281C16]">
              Any pregnancy notes or prior delivery experience?
            </h2>
            <p className="text-sm text-[#7A695C]">
              Optional. Helps Ama tailor recommendations. (Non-confidential general notes only).
            </p>
            <input
              type="text"
              value={riskInfo}
              onChange={(e) => setRiskInfo(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] text-sm text-[#281C16] focus:outline-none"
            />
          </div>
        )}

        {/* STEP 8: Conclusion Screen */}
        {step === 8 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-[#EAF5EF] text-[#2D6A4F] flex items-center justify-center mx-auto text-2xl font-bold">
              👋
            </div>

            <h2 className="font-serif text-3xl font-bold text-[#281C16]">
              Hi Akosua 👋
            </h2>

            <p className="text-base text-[#5C4A3E] max-w-md mx-auto">
              Let's prepare for your baby together. You don't need spare cash to begin — Ama is ready with your personalized plan.
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] text-xs text-[#5C4A3E] max-w-sm mx-auto text-left space-y-1">
              <div>• <strong>Due:</strong> {dueDate} (Kumasi)</div>
              <div>• <strong>Facility:</strong> {facility}</div>
              <div>• <strong>Target Preparation:</strong> ~GH₵600</div>
              <div>• <strong>Current Savings:</strong> GH₵0</div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 px-6 rounded-2xl bg-[#281C16] hover:bg-[#3D291F] text-white font-bold text-base flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
            >
              <Sparkles className="w-5 h-5 text-[#E8824A]" />
              <span>MEET AMA</span>
            </button>
          </motion.div>
        )}

        {/* Navigation buttons for steps 1-7 */}
        {step <= 7 && (
          <div className="flex items-center justify-between pt-8 border-t border-[#E8DFC8] mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5C4A3E] hover:bg-[#FAF7F2] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-[#281C16] hover:bg-[#3D291F] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <span>{step === 7 ? 'Complete' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E8824A]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
