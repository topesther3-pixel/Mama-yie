import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Delete, RotateCcw, Send, Signal, Battery, Smartphone, Check, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

type UssdScreen =
  | 'idle'
  | 'mainMenu'
  | 'amaPrompt1'
  | 'amaPrompt2'
  | 'amaConfirmed'
  | 'checkSavings'
  | 'deliveryCost'
  | 'savingsPlan'
  | 'earnMoney'
  | 'earnSmsSent'
  | 'supportCircle'
  | 'carePartners'
  | 'smsInbox';

export const UssdSimulator: React.FC = () => {
  const { user, supportCircle, simulateReferralPurchase, partners, resetToDefaultDemo } = useApp();
  const [dialString, setDialString] = useState('*920*44#');
  const [screen, setScreen] = useState<UssdScreen>('idle');
  const [inputVal, setInputVal] = useState('');
  const [smsList, setSmsList] = useState<string[]>([
    'Welcome to Mama Yie! Your referral code is AKOSUA-NUMA. Dial *920*44# anytime to check your fund.',
  ]);

  const handleDial = () => {
    if (dialString.includes('*920*44#') || dialString.includes('*') || dialString.length > 3) {
      setScreen('mainMenu');
      setInputVal('');
    }
  };

  const handleKeyPress = (num: string) => {
    if (screen === 'idle') {
      setDialString((prev) => prev + num);
    } else {
      setInputVal((prev) => prev + num);
    }
  };

  const handleClear = () => {
    if (screen === 'idle') {
      setDialString((prev) => prev.slice(0, -1));
    } else {
      setInputVal((prev) => prev.slice(0, -1));
    }
  };

  const handleSendUssd = () => {
    const choice = inputVal.trim();
    setInputVal('');

    if (screen === 'mainMenu') {
      switch (choice) {
        case '1':
          setScreen('amaPrompt1');
          break;
        case '2':
          setScreen('checkSavings');
          break;
        case '3':
          setScreen('deliveryCost');
          break;
        case '4':
          setScreen('savingsPlan');
          break;
        case '5':
          setScreen('earnMoney');
          break;
        case '6':
          setScreen('supportCircle');
          break;
        case '7':
          setScreen('carePartners');
          break;
        default:
          break;
      }
    } else if (screen === 'amaPrompt1') {
      setScreen('amaPrompt2');
    } else if (screen === 'amaPrompt2') {
      if (choice === '1') {
        setScreen('amaConfirmed');
      } else {
        setScreen('mainMenu');
      }
    } else if (screen === 'amaConfirmed') {
      if (choice === '1') setScreen('supportCircle');
      else if (choice === '2') setScreen('checkSavings');
      else if (choice === '3') setScreen('earnMoney');
      else setScreen('mainMenu');
    } else if (screen === 'earnMoney') {
      if (choice === '1') {
        // Send SMS with referral code
        setSmsList((prev) => [
          `Mama Yie Referral: Share code ${user.referralCode} for Numa Organics Shea Butter (GH₵55). You earn GH₵5 per order. Link: numaorganics.shop?ref=${user.referralCode}`,
          ...prev,
        ]);
        setScreen('earnSmsSent');
      } else if (choice === '2') {
        // Simulate earning from basic phone!
        if (partners[0]?.products[0]) {
          simulateReferralPurchase(partners[0].products[0], 'Customer via USSD Link');
          setSmsList((prev) => [
            `MAMA YIE ALERT: Congratulations Akosua! You earned GH₵5 from Numa Organics referral. New fund balance: GH₵${user.currentSavings + 5}.`,
            ...prev,
          ]);
        }
        setScreen('checkSavings');
      } else {
        setScreen('mainMenu');
      }
    } else {
      // Return to main menu
      setScreen('mainMenu');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner explaining the Basic Phone Principle */}
      <div className="bg-[#281C16] text-[#FAF7F2] p-6 rounded-3xl mb-8 border border-[#E8DFC8]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8824A] text-white text-xs font-bold uppercase tracking-wider mb-2">
              <Phone className="w-3.5 h-3.5" />
              Inclusive Technology • No Smartphone Required
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              USSD Basic-Phone Simulation (*920*44#)
            </h2>
            <p className="text-sm text-[#D9CAB6] max-w-2xl mt-1">
              In Ghana and across Sub-Saharan Africa, over 40% of expecting mothers in informal markets rely on feature phones (yam phones). Mama Yie gives Akosua full access to Ama, cost estimation, earning SMS links, savings tracking, and circles without a smartphone, mobile app, or bank account.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setScreen('mainMenu');
                setDialString('*920*44#');
              }}
              className="px-4 py-2 rounded-xl bg-[#FAF1E4] text-[#9C4221] text-xs font-bold hover:bg-white transition-colors cursor-pointer"
            >
              Quick Dial *920*44#
            </button>
            <button
              onClick={() => setScreen('smsInbox')}
              className="px-4 py-2 rounded-xl bg-[#3D291F] text-[#FAF7F2] text-xs font-medium hover:bg-[#4E3528] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#E8824A]" />
              <span>SMS Inbox ({smsList.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* The Realistic Feature Phone Body */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-[340px] sm:w-[360px] bg-[#1F1916] rounded-[48px] p-5 shadow-2xl border-4 border-[#3D291F] relative">
            {/* Phone Speaker */}
            <div className="w-16 h-2 bg-[#3D291F] rounded-full mx-auto mb-3"></div>

            {/* Screen Bezel & LCD */}
            <div className="bg-[#121212] p-4 rounded-3xl border-2 border-[#2D221C] shadow-inner mb-5">
              {/* LCD Status Bar */}
              <div className="flex justify-between items-center text-[10px] font-mono text-[#4E7D63] border-b border-[#4E7D63]/30 pb-1 mb-2">
                <span className="flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  <span>MTN GH</span>
                </span>
                <span className="font-bold">MAMA YIE USSD</span>
                <span className="flex items-center gap-1">
                  <span>100%</span>
                  <Battery className="w-3 h-3" />
                </span>
              </div>

              {/* LCD Screen Display */}
              <div className="bg-[#9CB39A] text-[#142318] font-mono p-3 rounded-xl min-h-[220px] max-h-[260px] flex flex-col justify-between text-xs shadow-inner leading-relaxed select-none overflow-y-auto">
                {screen === 'idle' && (
                  <div className="flex flex-col items-center justify-center h-full my-auto text-center py-6">
                    <div className="text-[11px] font-bold tracking-wider text-[#142318]/70 mb-1">MTN-GH READY</div>
                    <div className="text-xl font-bold tracking-widest my-2 bg-[#8CA48B] px-3 py-1 rounded">
                      {dialString || 'Type number'}
                    </div>
                    <div className="text-[10px] text-[#142318]/80 mt-2">
                      Press DIAL or green button to open Mama Yie
                    </div>
                  </div>
                )}

                {screen === 'mainMenu' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      MAMA YIE (*920*44#)
                    </div>
                    <div className="text-[11px] space-y-0.5">
                      <div>1. Talk to Ama</div>
                      <div>2. Check Savings Fund</div>
                      <div>3. Delivery Cost Estimator</div>
                      <div>4. Weekly Savings Plan</div>
                      <div>5. Earn Money (Numa)</div>
                      <div>6. Support Circle</div>
                      <div>7. Care Partners</div>
                    </div>
                    <div className="mt-2 text-[10px] text-[#142318]/70">Enter 1-7 &amp; Send</div>
                  </div>
                )}

                {screen === 'amaPrompt1' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      AMA AI COMPANION
                    </div>
                    <p className="text-[11px] mb-2">
                      Hi Akosua! I'm Ama. When is your baby due? (e.g. March 2027)
                    </p>
                    <div className="text-[10px] text-[#142318]/70">Press 1 for March 2027</div>
                  </div>
                )}

                {screen === 'amaPrompt2' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      ESTIMATED PREPARATION
                    </div>
                    <p className="text-[11px] mb-1">
                      Delivery cost at Suntreso: GH₵450–600.
                    </p>
                    <p className="text-[11px] font-bold mb-2">
                      Save GH₵30/week for 16 wks?
                    </p>
                    <div className="text-[11px]">
                      <div>1. YES, start plan</div>
                      <div>2. NO, I have no money</div>
                    </div>
                  </div>
                )}

                {screen === 'amaConfirmed' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      PLAN CREATED!
                    </div>
                    <p className="text-[11px] mb-1">
                      You are matched with 4 mothers due March in Kumasi!
                    </p>
                    <div className="text-[11px] space-y-0.5 mt-2">
                      <div>1. View Support Circle</div>
                      <div>2. Check Savings</div>
                      <div>3. Earn Money (No cash needed)</div>
                      <div>4. Main Menu</div>
                    </div>
                  </div>
                )}

                {screen === 'checkSavings' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      AKOSUA'S FUND BALANCE
                    </div>
                    <div className="text-sm font-bold my-1">
                      Current: GH₵{user.currentSavings}
                    </div>
                    <div className="text-[11px] space-y-0.5">
                      <div>Target: GH₵{user.targetPreparationAmount}</div>
                      <div>Remaining: GH₵{Math.max(0, user.targetPreparationAmount - user.currentSavings)}</div>
                      <div>Weekly Target: GH₵{user.weeklyTarget}</div>
                    </div>
                    <div className="mt-2 text-[10px] border-t border-[#142318]/30 pt-1">
                      Reply 1 for Main Menu, 2 to Earn
                    </div>
                  </div>
                )}

                {screen === 'deliveryCost' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      PREPARATION ESTIMATE
                    </div>
                    <p className="text-[11px] mb-1">
                      Facility: Suntreso Polyclinic
                    </p>
                    <div className="text-[11px] space-y-0.5">
                      <div>Range: GH₵450 – GH₵600</div>
                      <div>• Maternity Kit: GH₵180</div>
                      <div>• Routine Labs/Scan: GH₵160</div>
                      <div>• Emergency Buffer: GH₵90</div>
                    </div>
                    <div className="mt-2 text-[10px]">Reply 0 for Main Menu</div>
                  </div>
                )}

                {screen === 'savingsPlan' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      WEEKLY SAVINGS PLAN
                    </div>
                    <p className="text-[11px]">
                      Target: GH₵600 by March 2027.
                    </p>
                    <p className="text-[11px] font-bold mt-1">
                      Save GH₵30/week.
                    </p>
                    <p className="text-[10px] mt-1">
                      Don't have spare cash? Earn via Numa Organics referrals!
                    </p>
                    <div className="mt-2 text-[10px]">Reply 5 to Earn Money</div>
                  </div>
                )}

                {screen === 'earnMoney' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      EARN YOUR SAVINGS
                    </div>
                    <p className="text-[10px] mb-1">
                      Share Numa Organics Shea Butter (GH₵55). Earn GH₵5 per order.
                    </p>
                    <div className="text-[11px] space-y-0.5">
                      <div>1. Send my referral link via SMS</div>
                      <div>2. Simulate referral sale (+GH₵5)</div>
                      <div>3. Back to Main Menu</div>
                    </div>
                  </div>
                )}

                {screen === 'earnSmsSent' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      SMS SENT TO PHONE!
                    </div>
                    <p className="text-[11px] mb-2">
                      Check your SMS inbox. Forward your code <strong>{user.referralCode}</strong> to family &amp; customers to earn GH₵5 per bottle.
                    </p>
                    <div className="text-[10px]">Reply 0 for Main Menu</div>
                  </div>
                )}

                {screen === 'supportCircle' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      KUMASI CIRCLE (MARCH)
                    </div>
                    <p className="text-[11px]">
                      Members: 4 expecting mothers
                    </p>
                    <div className="text-[11px] font-bold my-1">
                      Group Fund: GH₵{supportCircle.collectiveSavings}
                    </div>
                    <p className="text-[10px] italic">
                      "Almost there, ladies! I reached my weekly target!" - Abena
                    </p>
                    <div className="mt-2 text-[10px]">Reply 0 for Main Menu</div>
                  </div>
                )}

                {screen === 'carePartners' && (
                  <div>
                    <div className="font-bold border-b border-[#142318]/30 pb-1 mb-1">
                      VETTED CARE PARTNERS
                    </div>
                    <div className="text-[10px] space-y-1">
                      <div>1. Sister Afia Midwife (GH₵280)</div>
                      <div>2. Suntreso Maternity Wing</div>
                      <div>3. Adum 2D Ultrasound (GH₵160)</div>
                    </div>
                    <p className="text-[10px] mt-1">Eligible services payable with fund!</p>
                  </div>
                )}

                {/* Input Prompt inside screen */}
                {screen !== 'idle' && (
                  <div className="mt-2 pt-1 border-t border-[#142318]/30 flex items-center justify-between text-[11px]">
                    <span>Option: [{inputVal || '_'}]</span>
                    <button
                      onClick={handleSendUssd}
                      className="bg-[#142318] text-[#9CB39A] px-2 py-0.5 rounded text-[10px] font-bold"
                    >
                      SEND
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation / Call Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4 px-2">
              <button
                onClick={handleDial}
                className="py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="Dial"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={handleSendUssd}
                className="py-2.5 rounded-xl bg-[#281C16] hover:bg-[#3D291F] text-[#FAF7F2] font-bold text-xs flex items-center justify-center border border-[#4E3528] cursor-pointer"
                title="Send Input"
              >
                <Send className="w-4 h-4 text-[#E8824A]" />
              </button>
              <button
                onClick={() => {
                  setScreen('idle');
                  setInputVal('');
                  setDialString('*920*44#');
                }}
                className="py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="End / Hang Up"
              >
                END
              </button>
            </div>

            {/* 12-Key Number Pad */}
            <div className="grid grid-cols-3 gap-2 px-2 pb-2 font-mono">
              {[
                { n: '1', sub: '' },
                { n: '2', sub: 'ABC' },
                { n: '3', sub: 'DEF' },
                { n: '4', sub: 'GHI' },
                { n: '5', sub: 'JKL' },
                { n: '6', sub: 'MNO' },
                { n: '7', sub: 'PQRS' },
                { n: '8', sub: 'TUV' },
                { n: '9', sub: 'WXYZ' },
                { n: '*', sub: '' },
                { n: '0', sub: '+' },
                { n: '#', sub: '' },
              ].map((key) => (
                <button
                  key={key.n}
                  onClick={() => handleKeyPress(key.n)}
                  className="bg-[#2D221C] hover:bg-[#3D291F] active:bg-[#4E3528] text-white p-3 rounded-2xl flex flex-col items-center justify-center border border-[#3D291F] shadow-sm cursor-pointer transition-transform active:scale-95"
                >
                  <span className="text-base font-bold leading-none">{key.n}</span>
                  {key.sub && <span className="text-[8px] text-[#A8988B] leading-none mt-0.5">{key.sub}</span>}
                </button>
              ))}
            </div>

            {/* Clear Button */}
            <div className="flex justify-center mt-2">
              <button
                onClick={handleClear}
                className="text-xs text-[#A8988B] hover:text-white flex items-center gap-1 py-1 px-3 cursor-pointer"
              >
                <Delete className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Information & Guide for Judges */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#281C16] mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E8824A]" />
              Why USSD is Mama Yie's Secret Weapon
            </h3>
            <p className="text-sm text-[#5C4A3E] leading-relaxed mb-4">
              Most health-tech and fintech startups fail in Africa because they assume every mother has an iPhone or high-end Android, constant 4G data, and a bank card.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="w-6 h-6 rounded-full bg-[#EAF5EF] text-[#2D6A4F] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-[#281C16]">Works with Zero Mobile Data</div>
                  <div className="text-xs text-[#7A695C]">USSD runs on basic GSM signaling. It functions even with GH₵0 data balance.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="w-6 h-6 rounded-full bg-[#EAF5EF] text-[#2D6A4F] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-[#281C16]">SMS Push for Earning Links</div>
                  <div className="text-xs text-[#7A695C]">Akosua receives her referral links via SMS, which she can forward or share with market customers.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="w-6 h-6 rounded-full bg-[#EAF5EF] text-[#2D6A4F] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-[#281C16]">No Bank Account Required</div>
                  <div className="text-xs text-[#7A695C]">All accounting is tied to her phone number in the Mama Yie ledger, ready for local Mobile Money.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive SMS Inbox Display */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-bold text-[#281C16] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#9C4221]" />
                Akosua's Basic Phone SMS Messages
              </h3>
              <span className="text-xs font-mono text-[#7A695C] bg-[#FAF7F2] px-2 py-0.5 rounded">
                Sender: MAMA-YIE
              </span>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {smsList.map((sms, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#FAF7F2] border-l-3 border-[#9C4221] text-xs text-[#281C16] font-mono leading-relaxed"
                >
                  {sms}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
