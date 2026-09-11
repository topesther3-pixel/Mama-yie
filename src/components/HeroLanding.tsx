import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  CircleDollarSign,
  HeartHandshake,
  Users,
  Compass,
  Play,
  Leaf,
  Layers,
  Award,
} from 'lucide-react';
import { motion } from 'motion/react';

export const HeroLanding: React.FC = () => {
  const { setCurrentView, startDemoTour, user } = useApp();

  return (
    <div className="space-y-16 py-6 pb-20">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#281C16] text-[#FAF7F2] rounded-[36px] p-8 sm:p-14 lg:p-16 border border-[#E8DFC8]/30 shadow-xl relative overflow-hidden">
          {/* Subtle warm decorative glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#E8824A]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#2D6A4F]/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF1E4] text-[#9C4221] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#E8824A] animate-pulse"></span>
              Mama Yie: Twi for Safe Motherhood
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight mb-6">
              NO MOTHER SHOULD WALK INTO MOTHERHOOD UNPREPARED.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-[#D9CAB6] leading-relaxed mb-10 max-w-2xl font-light">
              Mama Yie helps expecting mothers predict costs, earn toward their savings goal, prepare for delivery, and access trusted care — without needing spare cash to start.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => setCurrentView('onboarding')}
                className="py-4 px-7 rounded-2xl bg-[#E8824A] hover:bg-[#D46E35] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg hover:scale-102"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>START WITH AMA</span>
              </button>

              <button
                onClick={() => setCurrentView('ussd')}
                className="py-4 px-6 rounded-2xl bg-[#3D291F] hover:bg-[#4E3528] text-[#FAF7F2] font-semibold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-colors border border-[#FAF1E4]/20"
              >
                <Phone className="w-4 h-4 text-[#E8824A]" />
                <span>TRY USSD DEMO (*920*44#)</span>
              </button>

              <button
                onClick={startDemoTour}
                className="py-4 px-5 rounded-2xl bg-[#FAF1E4] hover:bg-[#F3E6D3] text-[#9C4221] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors border border-[#E8DFC8]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>JUDGE DEMO TOUR</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CORE INSIGHT & THE LOOP */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-3 py-1 rounded-full border border-[#E8DFC8]">
            The Central Breakthrough
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#281C16] mt-3">
            Earn the savings you don't have yet.
          </h2>
          <p className="text-sm sm:text-base text-[#5C4A3E] mt-2">
            Most maternal finance apps simply tell mothers to save money they don't have. Mama Yie provides an ethical commercial engine to earn preparation funds from day one.
          </p>
        </div>

        {/* The 4-Step Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'EARN',
              desc: 'Akosua receives vetted natural products from local makers (like Numa Organics) and shares referral links with her network or market customers.',
              icon: Sparkles,
              color: 'text-[#E8824A]',
            },
            {
              step: '02',
              title: 'SAVE',
              desc: 'Commissions (GH₵5–7 per sale) are deposited directly into her dedicated Motherhood Fund balance. No cash leaves her pocket.',
              icon: CircleDollarSign,
              color: 'text-[#2D6A4F]',
            },
            {
              step: '03',
              title: 'PREPARE',
              desc: 'Ama calculates her target preparation amount (GH₵450–600) and matches her with 4 local mothers due in the same month for peer accountability.',
              icon: Users,
              color: 'text-[#9C4221]',
            },
            {
              step: '04',
              title: 'ACCESS CARE',
              desc: 'She redeems her accrued fund directly for negotiated, discounted consultations and delivery packages with vetted midwives and clinics.',
              icon: ShieldCheck,
              color: 'text-[#2D6A4F]',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-[#E8DFC8] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs font-bold text-[#7A695C] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E8DFC8]">
                      STEP {card.step}
                    </span>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#281C16] mb-2">{card.title}</h3>
                  <p className="text-xs text-[#5C4A3E] leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PRIMARY USER PERSONA: AKOSUA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF1E4] rounded-3xl p-8 sm:p-10 border border-[#E8DFC8]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-white px-3 py-1 rounded-full border border-[#E8DFC8]">
                Primary User Persona
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#281C16] mt-3 mb-3">
                Meet Akosua, 24 — Kejetia Market Trader, Kumasi
              </h2>
              <p className="text-sm text-[#5C4A3E] leading-relaxed mb-6">
                Akosua sells vegetables in Kejetia Market. She is 5 months pregnant with her first child. She has a basic button phone (no smartphone), no bank account, and exactly <strong>GH₵0 dedicated savings</strong>.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-6">
                <div className="bg-white p-3 rounded-2xl border border-[#E8DFC8]">
                  <span className="text-[#7A695C] block">Age &amp; Trimester</span>
                  <span className="font-bold text-[#281C16]">24 yrs • 5 Months</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#E8DFC8]">
                  <span className="text-[#7A695C] block">Starting Cash</span>
                  <span className="font-mono font-bold text-[#9C4221]">GH₵0</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#E8DFC8]">
                  <span className="text-[#7A695C] block">Phone Type</span>
                  <span className="font-bold text-[#281C16]">Basic Phone (USSD)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('earn')}
                  className="px-5 py-3 rounded-xl bg-[#281C16] text-white text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-[#3D291F] transition-colors"
                >
                  <span>Experience Akosua's Earning Journey</span>
                  <ArrowRight className="w-4 h-4 text-[#E8824A]" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
              <div className="text-xs uppercase font-bold text-[#7A695C] tracking-wider mb-2">
                Akosua's Preparedness Target
              </div>
              <div className="text-3xl font-serif font-bold text-[#281C16] mb-1">
                GH₵450 – GH₵600
              </div>
              <p className="text-xs text-[#7A695C] mb-4">
                Estimated delivery and antenatal kit cost at Suntreso Hospital.
              </p>

              <div className="space-y-2 text-xs border-t border-[#E8DFC8] pt-3">
                <div className="flex justify-between">
                  <span className="text-[#7A695C]">Maternity Pack &amp; Supplies:</span>
                  <span className="font-bold">GH₵180</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A695C]">Routine Antenatal Labs &amp; Scan:</span>
                  <span className="font-bold">GH₵160</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A695C]">Emergency Transport Buffer:</span>
                  <span className="font-bold">GH₵90</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI PIPELINE: HOW AMA WORKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DFC8] shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-3 py-1 rounded-full border border-[#E8DFC8]">
              The Intelligence Layer
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#281C16] mt-3">
              How Ama Works
            </h2>
            <p className="text-sm text-[#5C4A3E] mt-2">
              Gemini AI models power personalized cost planning, triage, and guidance, while application logic strictly controls financial accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
              <div className="font-mono font-bold text-[#9C4221] mb-1">01. INPUT DATA</div>
              <h4 className="font-bold text-[#281C16] text-sm mb-1">Profile &amp; Region</h4>
              <p className="text-[#7A695C]">Due date, Ashanti/Accra district, hospital facility tier, and baseline savings capacity.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
              <div className="font-mono font-bold text-[#9C4221] mb-1">02. AI TRIAGE &amp; ESTIMATE</div>
              <h4 className="font-bold text-[#281C16] text-sm mb-1">Realistic Cost Range</h4>
              <p className="text-[#7A695C]">Calculates expected preparation bracket (GH₵450–600) based on verified district data.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
              <div className="font-mono font-bold text-[#9C4221] mb-1">03. PLAN GENERATION</div>
              <h4 className="font-bold text-[#281C16] text-sm mb-1">Weekly Target</h4>
              <p className="text-[#7A695C]">Breaks remaining weeks into achievable weekly goals (GH₵30/week) linked to partner earning.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
              <div className="font-mono font-bold text-[#9C4221] mb-1">04. ONGOING SUPPORT</div>
              <h4 className="font-bold text-[#281C16] text-sm mb-1">Circle &amp; USSD</h4>
              <p className="text-[#7A695C]">Automated reminders, peer support match, and zero-data GSM USSD access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPETITIVE POSITIONING MATRIX */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-3 py-1 rounded-full border border-[#E8DFC8]">
            Market Differentiation
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#281C16] mt-3">
            Why Mama Yie Stands Alone
          </h2>
          <p className="text-sm text-[#5C4A3E] mt-2 italic font-serif">
            “Others educate. Others let you save generically. Mama Yie lets you earn the savings you don't have yet.”
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8DFC8] overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E8DFC8] bg-[#FAF7F2]">
                <th className="p-4 font-bold text-[#281C16]">Capabilities</th>
                <th className="p-4 font-medium text-[#7A695C]">Health Messaging Apps</th>
                <th className="p-4 font-medium text-[#7A695C]">General Savings Apps</th>
                <th className="p-4 font-bold text-[#9C4221] bg-[#FAF1E4]">MAMA YIE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8]/60">
              <tr>
                <td className="p-4 font-bold text-[#281C16]">Earn Savings Without Upfront Cash</td>
                <td className="p-4 text-red-500">✕ No</td>
                <td className="p-4 text-red-500">✕ No (Needs spare cash)</td>
                <td className="p-4 font-bold text-[#2D6A4F] bg-[#FAF1E4]">✓ Yes (Numa Partner)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#281C16]">Pregnancy Cost Prediction in Ghana</td>
                <td className="p-4 text-red-500">✕ Generic tips only</td>
                <td className="p-4 text-red-500">✕ No pregnancy context</td>
                <td className="p-4 font-bold text-[#2D6A4F] bg-[#FAF1E4]">✓ Yes (District benchmark)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#281C16]">Discounted Consultations &amp; Care</td>
                <td className="p-4 text-red-500">✕ No</td>
                <td className="p-4 text-red-500">✕ No</td>
                <td className="p-4 font-bold text-[#2D6A4F] bg-[#FAF1E4]">✓ Yes (Vetted Partners)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#281C16]">Basic-Phone / USSD Access (*920*44#)</td>
                <td className="p-4 text-amber-600">SMS broadcasts only</td>
                <td className="p-4 text-red-500">App only (Smartphone)</td>
                <td className="p-4 font-bold text-[#2D6A4F] bg-[#FAF1E4]">✓ Interactive USSD</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#281C16]">Due-Date Matched Peer Circles</td>
                <td className="p-4 text-red-500">✕ Generic forum</td>
                <td className="p-4 text-red-500">✕ No</td>
                <td className="p-4 font-bold text-[#2D6A4F] bg-[#FAF1E4]">✓ Safe Support Circles</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. MARKET OPPORTUNITY & BUSINESS MODEL */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Opportunity */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-2.5 py-0.5 rounded-full">
              Market Opportunity
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#281C16] mt-2 mb-2">
              National Ghana Scale
            </h3>
            <p className="text-xs text-[#7A695C] italic mb-6">
              Directional estimates from the Mama Yie pitch model.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="flex justify-between text-xs font-bold text-[#281C16]">
                  <span>TAM (Total Addressable Market)</span>
                  <span className="font-mono text-[#9C4221]">889K pregnancies / year</span>
                </div>
                <div className="text-[11px] text-[#7A695C] mt-1">Total annual pregnancies nationally across Ghana.</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="flex justify-between text-xs font-bold text-[#281C16]">
                  <span>SAM (Serviceable Addressable Market)</span>
                  <span className="font-mono text-[#9C4221]">622K pregnancies / year</span>
                </div>
                <div className="text-[11px] text-[#7A695C] mt-1">Expecting mothers in urban and peri-urban informal economies.</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="flex justify-between text-xs font-bold text-[#281C16]">
                  <span>SOM (Serviceable Obtainable Market)</span>
                  <span className="font-mono text-[#2D6A4F]">3K – 15K Year 1–3 Pilot</span>
                </div>
                <div className="text-[11px] text-[#7A695C] mt-1">Target pilot deployment in Greater Accra and Ashanti Region.</div>
              </div>
            </div>
          </div>

          {/* Revenue Model & Business Logic */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EAF5EF] px-2.5 py-0.5 rounded-full">
              Revenue Model
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#281C16] mt-2 mb-2">
              Freemium &amp; Ecosystem Monetization
            </h3>
            <p className="text-xs text-[#7A695C] mb-6">
              Mama Yie is not a predatory lending business. Revenue is generated ethically.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="font-bold text-[#281C16] text-sm">1. Commercial Partner Referral Commissions</div>
                <div className="text-[#5C4A3E] mt-0.5">8%–15% commission on vetted health &amp; baby product sales.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="font-bold text-[#281C16] text-sm">2. Freemium Core (Free for Basic Access)</div>
                <div className="text-[#5C4A3E] mt-0.5">Bill estimator, USSD reminders, and basic circles are always GH₵0.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="font-bold text-[#281C16] text-sm">3. Mama Yie Premium (GH₵5–10 / month)</div>
                <div className="text-[#5C4A3E] mt-0.5">Dynamic AI risk adjustment, priority clinic vouchers, voice guidance.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="font-bold text-[#281C16] text-sm">4. Partner Care Network B2B Fee</div>
                <div className="text-[#5C4A3E] mt-0.5">Performance vouchers with clinics for reduced no-show rates.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. POSTNATAL EXPANSION ROADMAP */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#281C16] text-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#E8DFC8]/30">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8824A] bg-white/10 px-3 py-1 rounded-full">
              Postnatal &amp; Growth Roadmap
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold mt-2">
              Beyond Delivery: The Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-[#D9CAB6] mt-2">
              Safe motherhood does not end at delivery. We stay with mothers through child wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-[#3D291F] border border-[#FAF1E4]/10">
              <span className="text-[#E8824A] font-mono font-bold block mb-1">PHASE 1 (Current MVP)</span>
              <h4 className="font-serif text-base font-bold text-white mb-2">Preparation &amp; USSD Pilot</h4>
              <p className="text-[#D9CAB6] leading-relaxed">
                Savings planner, bill estimator, Numa Organics partner earn loop, and live USSD simulation across Greater Accra &amp; Ashanti.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#3D291F] border border-[#FAF1E4]/10">
              <span className="text-[#E8824A] font-mono font-bold block mb-1">PHASE 2</span>
              <h4 className="font-serif text-base font-bold text-white mb-2">Mobile Money &amp; Care Network</h4>
              <p className="text-[#D9CAB6] leading-relaxed">
                Direct MTN Mobile Money / Vodafone Cash deposit rails, expanded verified midwife homes, and institutional care vouchers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#3D291F] border border-[#FAF1E4]/10">
              <span className="text-[#E8824A] font-mono font-bold block mb-1">PHASE 3</span>
              <h4 className="font-serif text-base font-bold text-white mb-2">Postnatal Mode</h4>
              <p className="text-[#D9CAB6] leading-relaxed">
                Child vaccine schedules, 6-week postnatal checkup alerts, pediatric nutrition education, and continuing infant financial planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center py-6">
        <h3 className="font-serif text-3xl font-bold text-[#281C16] mb-3">
          Safe motherhood, earned and saved.
        </h3>
        <p className="text-sm text-[#5C4A3E] mb-6">
          Ama is ready to help Akosua prepare today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setCurrentView('ama')}
            className="px-6 py-3 rounded-2xl bg-[#281C16] hover:bg-[#3D291F] text-white text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#E8824A]" />
            <span>CONTINUE WITH AMA</span>
          </button>
          <button
            onClick={() => setCurrentView('earn')}
            className="px-6 py-3 rounded-2xl bg-[#2D6A4F] hover:bg-[#23533E] text-white text-sm font-bold flex items-center gap-2 cursor-pointer"
          >
            <span>EARN MONEY (NUMA)</span>
          </button>
          <button
            onClick={() => setCurrentView('ussd')}
            className="px-6 py-3 rounded-2xl bg-[#FAF1E4] hover:bg-[#F3E6D3] text-[#9C4221] text-sm font-bold border border-[#E8DFC8] flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>TRY USSD (*920*44#)</span>
          </button>
        </div>
      </section>
    </div>
  );
};
