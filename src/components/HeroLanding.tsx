import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CircleDollarSign,
  Users,
  Play,
  Heart,
  Calendar,
  Building2,
  Check,
  Sparkle,
} from 'lucide-react';
import { motion } from 'motion/react';

export const HeroLanding: React.FC = () => {
  const { setCurrentView, startDemoTour, user } = useApp();

  return (
    <div className="bg-white text-[#1E232B] space-y-16 py-4 pb-24">
      {/* 1. HERO SECTION (White background, soft blush pink accent, subtle green trust details) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[36px] p-8 sm:p-14 lg:p-16 border border-[#F0EBE9] shadow-sm relative overflow-hidden">
          {/* Very subtle ambient blush glow */}
          <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-[#FFF0F4] blur-3xl pointer-events-none opacity-80" />
          <div className="absolute -bottom-28 -left-28 w-96 h-96 rounded-full bg-[#EDF7EE] blur-3xl pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-3xl">
            {/* Top Tag / Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F5] text-[#BE123C] border border-[#F8B4C8]/70 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#2E7D46] animate-pulse" />
              <span>Mama Yie: Twi for Safe Motherhood</span>
              <span className="text-[#94A3B8]">•</span>
              <span className="text-[#2E7D46] font-semibold lowercase">care &amp; savings companion</span>
            </div>

            {/* Prominent MAMA YIE Brand & Hero Messaging */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E61964] to-[#F43F5E] flex items-center justify-center text-white font-serif font-bold text-2xl shadow-xs">
                  MY
                </div>
                <div>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[#1E232B]">
                    MAMA <span className="text-[#E61964]">YIE</span>
                  </h2>
                  <p className="text-xs uppercase font-bold tracking-widest text-[#2E7D46]">
                    “Care. Connect. Earn. Save.”
                  </p>
                </div>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight text-[#1E232B] pt-2">
                No mother should walk into motherhood unprepared.
              </h1>
            </div>

            {/* Supporting text */}
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed mb-8 max-w-2xl font-normal">
              Mama Yie is a supportive digital companion for mothers and families across Ghana. We help expecting mothers predict delivery costs, earn toward their motherhood fund through vetted local partner referrals, and access trusted healthcare — without needing spare cash to start.
            </p>

            {/* Trust Badges Strip (Green & Soft Pink accents) */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#475569] mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF7EE] text-[#1C592E] border border-[#C1E6C8] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D46]" />
                <span>Verified Kumasi &amp; Accra Healthcare</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F5] text-[#BE123C] border border-[#F8B4C8] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#E61964]" />
                <span>Ama Maternal AI Companion</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF7EE] text-[#1C592E] border border-[#C1E6C8] font-medium">
                <Phone className="w-3.5 h-3.5 text-[#2E7D46]" />
                <span>Zero-Data USSD (*920*44#)</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              {/* PRIMARY CTA (Soft blush pink button) */}
              <button
                id="hero-start-ama-button"
                onClick={() => setCurrentView('onboarding')}
                className="py-4 px-7 rounded-2xl bg-[#E61964] hover:bg-[#D01255] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm hover:shadow-md"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>START WITH AMA</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              {/* SECONDARY CTA (White button with subtle fresh green border) */}
              <button
                id="hero-ussd-demo-button"
                onClick={() => setCurrentView('ussd')}
                className="py-4 px-6 rounded-2xl bg-white hover:bg-[#FDF2F5] active:scale-[0.99] text-[#1E232B] font-semibold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all border-2 border-[#C1E6C8] hover:border-[#2E7D46] shadow-2xs"
              >
                <Phone className="w-4 h-4 text-[#2E7D46]" />
                <span>TRY USSD DEMO (*920*44#)</span>
              </button>

              {/* JUDGE TOUR CTA (Subtle blush light pill) */}
              <button
                id="hero-judge-tour-button"
                onClick={startDemoTour}
                className="py-4 px-5 rounded-2xl bg-[#FDF2F5] hover:bg-[#FCE7EC] text-[#BE123C] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors border border-[#F8B4C8]"
              >
                <Play className="w-4 h-4 fill-current text-[#E61964]" />
                <span>JUDGE DEMO TOUR</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CORE INSIGHT & THE 4-STEP LOOP (Predominantly white cards, soft pink and green accents) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#BE123C] bg-[#FDF2F5] px-3 py-1 rounded-full border border-[#F8B4C8]">
            The Central Breakthrough
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E232B] mt-3">
            Earn the savings you don't have yet.
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-2">
            Most maternal finance apps simply tell mothers to save money they don't have. Mama Yie provides an ethical commercial engine to earn preparation funds from day one.
          </p>
        </div>

        {/* The 4-Step Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'EARN',
              desc: 'Akosua receives vetted natural products from local Ghanaian makers (like Numa Organics) and shares referral links with her network or market customers.',
              icon: Sparkles,
              iconColor: 'text-[#E61964]',
              iconBg: 'bg-[#FDF2F5]',
            },
            {
              step: '02',
              title: 'SAVE',
              desc: 'Commissions (GH₵5–7 per sale) are deposited directly into her dedicated Motherhood Fund balance. No cash leaves her pocket.',
              icon: CircleDollarSign,
              iconColor: 'text-[#2E7D46]',
              iconBg: 'bg-[#EDF7EE]',
            },
            {
              step: '03',
              title: 'PREPARE',
              desc: 'Ama calculates her target preparation amount (GH₵450–600) and matches her with 4 local mothers due in the same month for peer accountability.',
              icon: Users,
              iconColor: 'text-[#E61964]',
              iconBg: 'bg-[#FDF2F5]',
            },
            {
              step: '04',
              title: 'ACCESS CARE',
              desc: 'She redeems her accrued fund directly for negotiated, discounted consultations and delivery packages with vetted midwives and clinics.',
              icon: ShieldCheck,
              iconColor: 'text-[#2E7D46]',
              iconBg: 'bg-[#EDF7EE]',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-[#F0EBE9] hover:border-[#F8B4C8] shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs font-bold text-[#BE123C] bg-[#FDF2F5] px-2.5 py-1 rounded-full border border-[#F8B4C8]/50">
                      STEP {card.step}
                    </span>
                    <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1E232B] mb-2">{card.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PRIMARY USER PERSONA: AKOSUA (Clean white card with subtle blush border) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F8B4C8]/60 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BE123C] bg-[#FDF2F5] px-3 py-1 rounded-full border border-[#F8B4C8]">
                Primary User Persona
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E232B] mt-3 mb-3">
                Meet Akosua, 24 — Kejetia Market Trader, Kumasi
              </h2>
              <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                Akosua sells vegetables in Kejetia Market. She is 5 months pregnant with her first child. She has a basic button phone (no smartphone), no bank account, and exactly <strong className="text-[#1E232B]">GH₵0 dedicated savings</strong>.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-6">
                <div className="bg-white p-3 rounded-2xl border border-[#F0EBE9]">
                  <span className="text-[#64748B] block">Age &amp; Trimester</span>
                  <span className="font-bold text-[#1E232B]">24 yrs • 5 Months</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#F0EBE9]">
                  <span className="text-[#64748B] block">Starting Cash</span>
                  <span className="font-mono font-bold text-[#BE123C]">GH₵0 needed</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#F0EBE9]">
                  <span className="text-[#64748B] block">Phone Type</span>
                  <span className="font-bold text-[#2E7D46] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D46]" />
                    Basic USSD
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('earn')}
                  className="px-5 py-3 rounded-xl bg-[#E61964] hover:bg-[#D01255] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <span>Experience Akosua's Earning Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FDF2F5]/50 p-6 rounded-3xl border border-[#F8B4C8]/60 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-[#BE123C] tracking-wider">
                  Akosua's Preparedness Target
                </span>
                <span className="text-[10px] font-bold uppercase bg-[#EDF7EE] text-[#1C592E] px-2 py-0.5 rounded-full border border-[#C1E6C8]">
                  Verified Clinic
                </span>
              </div>
              <div className="text-3xl font-serif font-bold text-[#1E232B] mb-1">
                GH₵450 – GH₵600
              </div>
              <p className="text-xs text-[#64748B] mb-4">
                Estimated delivery and antenatal kit cost at Suntreso Hospital.
              </p>

              <div className="space-y-2 text-xs border-t border-[#F8B4C8]/40 pt-3">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Maternity Pack &amp; Supplies:</span>
                  <span className="font-bold text-[#1E232B]">GH₵180</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Routine Antenatal Labs &amp; Scan:</span>
                  <span className="font-bold text-[#1E232B]">GH₵160</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Emergency Transport Buffer:</span>
                  <span className="font-bold text-[#1E232B]">GH₵90</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI PIPELINE: HOW AMA WORKS (White container, soft pink and green accents) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F0EBE9] shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#BE123C] bg-[#FDF2F5] px-3 py-1 rounded-full border border-[#F8B4C8]">
              The Intelligence Layer
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E232B] mt-3">
              How Ama Works
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Gemini AI models power personalized cost planning, triage, and guidance, while application logic strictly controls financial accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-[#F0EBE9] hover:border-[#F8B4C8] transition-colors">
              <div className="font-mono font-bold text-[#BE123C] mb-1">01. INPUT DATA</div>
              <h4 className="font-bold text-[#1E232B] text-sm mb-1">Profile &amp; Region</h4>
              <p className="text-[#64748B]">Due date, Ashanti/Accra district, hospital facility tier, and baseline savings capacity.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#F0EBE9] hover:border-[#F8B4C8] transition-colors">
              <div className="font-mono font-bold text-[#BE123C] mb-1">02. AI TRIAGE &amp; ESTIMATE</div>
              <h4 className="font-bold text-[#1E232B] text-sm mb-1">Realistic Cost Range</h4>
              <p className="text-[#64748B]">Calculates expected preparation bracket (GH₵450–600) based on verified district data.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#F0EBE9] hover:border-[#F8B4C8] transition-colors">
              <div className="font-mono font-bold text-[#BE123C] mb-1">03. PLAN GENERATION</div>
              <h4 className="font-bold text-[#1E232B] text-sm mb-1">Weekly Target</h4>
              <p className="text-[#64748B]">Breaks remaining weeks into achievable weekly goals (GH₵30/week) linked to partner earning.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#F0EBE9] hover:border-[#F8B4C8] transition-colors">
              <div className="font-mono font-bold text-[#2E7D46] mb-1">04. ONGOING SUPPORT</div>
              <h4 className="font-bold text-[#1E232B] text-sm mb-1">Circle &amp; USSD</h4>
              <p className="text-[#64748B]">Automated reminders, peer support match, and zero-data GSM USSD access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPETITIVE POSITIONING MATRIX */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#BE123C] bg-[#FDF2F5] px-3 py-1 rounded-full border border-[#F8B4C8]">
            Market Differentiation
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E232B] mt-3">
            Why Mama Yie Stands Alone
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-2 italic font-serif">
            “Others educate. Others let you save generically. Mama Yie lets you earn the savings you don't have yet.”
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#F0EBE9] overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-[#F0EBE9] bg-[#FAF8F8]">
                <th className="p-4 font-bold text-[#1E232B]">Capabilities</th>
                <th className="p-4 font-medium text-[#64748B]">Health Messaging Apps</th>
                <th className="p-4 font-medium text-[#64748B]">General Savings Apps</th>
                <th className="p-4 font-bold text-[#BE123C] bg-[#FDF2F5] border-l border-r border-[#F8B4C8]/50">
                  MAMA YIE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE9]">
              <tr>
                <td className="p-4 font-bold text-[#1E232B]">Earn Savings Without Upfront Cash</td>
                <td className="p-4 text-rose-500">✕ No</td>
                <td className="p-4 text-rose-500">✕ No (Needs spare cash)</td>
                <td className="p-4 font-bold text-[#2E7D46] bg-[#FDF2F5]/80 border-l border-r border-[#F8B4C8]/50">
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#2E7D46]" />
                    <span>Yes (Numa Partner)</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#1E232B]">Pregnancy Cost Prediction in Ghana</td>
                <td className="p-4 text-rose-500">✕ Generic tips only</td>
                <td className="p-4 text-rose-500">✕ No pregnancy context</td>
                <td className="p-4 font-bold text-[#2E7D46] bg-[#FDF2F5]/80 border-l border-r border-[#F8B4C8]/50">
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#2E7D46]" />
                    <span>Yes (District benchmark)</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#1E232B]">Discounted Consultations &amp; Care</td>
                <td className="p-4 text-rose-500">✕ No</td>
                <td className="p-4 text-rose-500">✕ No</td>
                <td className="p-4 font-bold text-[#2E7D46] bg-[#FDF2F5]/80 border-l border-r border-[#F8B4C8]/50">
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#2E7D46]" />
                    <span>Yes (Vetted Partners)</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#1E232B]">Basic-Phone / USSD Access (*920*44#)</td>
                <td className="p-4 text-amber-600">SMS broadcasts only</td>
                <td className="p-4 text-rose-500">App only (Smartphone)</td>
                <td className="p-4 font-bold text-[#2E7D46] bg-[#FDF2F5]/80 border-l border-r border-[#F8B4C8]/50">
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#2E7D46]" />
                    <span>Interactive USSD</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#1E232B]">Due-Date Matched Peer Circles</td>
                <td className="p-4 text-rose-500">✕ Generic forum</td>
                <td className="p-4 text-rose-500">✕ No</td>
                <td className="p-4 font-bold text-[#2E7D46] bg-[#FDF2F5]/80 border-l border-r border-[#F8B4C8]/50">
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#2E7D46]" />
                    <span>Safe Support Circles</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. MARKET OPPORTUNITY & REVENUE MODEL (Two white cards with generous spacing) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Opportunity */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F0EBE9] shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#BE123C] bg-[#FDF2F5] px-2.5 py-0.5 rounded-full border border-[#F8B4C8]/50">
              Market Opportunity
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1E232B] mt-2 mb-2">
              National Ghana Scale
            </h3>
            <p className="text-xs text-[#64748B] italic mb-6">
              Directional estimates from the Mama Yie pitch model.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#F0EBE9]">
                <div className="flex justify-between text-xs font-bold text-[#1E232B]">
                  <span>TAM (Total Addressable Market)</span>
                  <span className="font-mono text-[#BE123C]">889K pregnancies / year</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">Total annual pregnancies nationally across Ghana.</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#F0EBE9]">
                <div className="flex justify-between text-xs font-bold text-[#1E232B]">
                  <span>SAM (Serviceable Addressable Market)</span>
                  <span className="font-mono text-[#BE123C]">622K pregnancies / year</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">Expecting mothers in urban and peri-urban informal economies.</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDF7EE] border border-[#C1E6C8]">
                <div className="flex justify-between text-xs font-bold text-[#1C592E]">
                  <span>SOM (Serviceable Obtainable Market)</span>
                  <span className="font-mono text-[#2E7D46]">3K – 15K Year 1–3 Pilot</span>
                </div>
                <div className="text-[11px] text-[#2E7D46]/80 mt-1">Target pilot deployment in Greater Accra and Ashanti Region.</div>
              </div>
            </div>
          </div>

          {/* Revenue Model & Business Logic */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F0EBE9] shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C592E] bg-[#EDF7EE] px-2.5 py-0.5 rounded-full border border-[#C1E6C8]">
              Revenue Model
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1E232B] mt-2 mb-2">
              Freemium &amp; Ecosystem Monetization
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Mama Yie is not a predatory lending business. Revenue is generated ethically.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#F0EBE9]">
                <div className="font-bold text-[#1E232B] text-sm">1. Commercial Partner Referral Commissions</div>
                <div className="text-[#64748B] mt-0.5">8%–15% commission on vetted health &amp; baby product sales.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#F0EBE9]">
                <div className="font-bold text-[#1E232B] text-sm">2. Freemium Core (Free for Basic Access)</div>
                <div className="text-[#64748B] mt-0.5">Bill estimator, USSD reminders, and basic circles are always GH₵0.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FDF2F5] border border-[#F8B4C8]/60">
                <div className="font-bold text-[#BE123C] text-sm">3. Mama Yie Premium (GH₵5–10 / month)</div>
                <div className="text-[#475569] mt-0.5">Dynamic AI risk adjustment, priority clinic vouchers, voice guidance.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#F0EBE9]">
                <div className="font-bold text-[#1E232B] text-sm">4. Partner Care Network B2B Fee</div>
                <div className="text-[#64748B] mt-0.5">Performance vouchers with clinics for reduced no-show rates.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. POSTNATAL EXPANSION ROADMAP (Clean white cards, soft pink and green indicators) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#F8B4C8]/50 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#BE123C] bg-[#FDF2F5] px-3 py-1 rounded-full border border-[#F8B4C8]">
              Postnatal &amp; Growth Roadmap
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E232B] mt-2">
              Beyond Delivery: The Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              Safe motherhood does not end at delivery. We stay with mothers through child wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-white border border-[#F0EBE9] hover:border-[#F8B4C8] transition-colors shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#BE123C] font-mono font-bold">PHASE 1 (Current MVP)</span>
                <span className="text-[10px] font-bold bg-[#EDF7EE] text-[#1C592E] px-2 py-0.5 rounded-full">Active</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#1E232B] mb-2">Preparation &amp; USSD Pilot</h4>
              <p className="text-[#64748B] leading-relaxed">
                Savings planner, bill estimator, Numa Organics partner earn loop, and live USSD simulation across Greater Accra &amp; Ashanti.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#F0EBE9] hover:border-[#F8B4C8] transition-colors shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#BE123C] font-mono font-bold">PHASE 2</span>
                <span className="text-[10px] font-medium bg-[#FDF2F5] text-[#BE123C] px-2 py-0.5 rounded-full">Next</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#1E232B] mb-2">Mobile Money &amp; Care Network</h4>
              <p className="text-[#64748B] leading-relaxed">
                Direct MTN Mobile Money / Telecel Cash deposit rails, expanded verified midwife homes, and institutional care vouchers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#F0EBE9] hover:border-[#F8B4C8] transition-colors shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#BE123C] font-mono font-bold">PHASE 3</span>
                <span className="text-[10px] font-medium bg-[#FAF8F8] text-[#64748B] px-2 py-0.5 rounded-full">Planned</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#1E232B] mb-2">Postnatal Mode</h4>
              <p className="text-[#64748B] leading-relaxed">
                Child vaccine schedules, 6-week postnatal checkup alerts, pediatric nutrition education, and continuing infant financial planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center py-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F8B4C8]/50 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF7EE] text-[#1C592E] border border-[#C1E6C8] text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D46]" />
            <span>Ready for Mothers &amp; Families Across Ghana</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#1E232B] mb-3">
            Safe motherhood, earned and saved.
          </h3>
          <p className="text-sm text-[#64748B] mb-8 max-w-md mx-auto">
            Ama is ready to help Akosua prepare today. Start planning with dignity and without upfront financial strain.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="final-cta-start-ama"
              onClick={() => setCurrentView('ama')}
              className="px-6 py-3.5 rounded-2xl bg-[#E61964] hover:bg-[#D01255] text-white text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>CONTINUE WITH AMA</span>
            </button>
            <button
              id="final-cta-earn-money"
              onClick={() => setCurrentView('earn')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#FDF2F5] border-2 border-[#C1E6C8] hover:border-[#2E7D46] text-[#1E232B] text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-[#2E7D46]" />
              <span>EARN MONEY (NUMA)</span>
            </button>
            <button
              id="final-cta-ussd"
              onClick={() => setCurrentView('ussd')}
              className="px-6 py-3.5 rounded-2xl bg-[#FDF2F5] hover:bg-[#FCE7EC] text-[#BE123C] text-sm font-semibold border border-[#F8B4C8] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Phone className="w-4 h-4 text-[#2E7D46]" />
              <span>TRY USSD (*920*44#)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
