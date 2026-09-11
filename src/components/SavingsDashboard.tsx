import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CircleDollarSign, TrendingUp, Calendar, ShieldCheck, ArrowRight, PlusCircle, Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const SavingsDashboard: React.FC = () => {
  const { user, transactions, setCurrentView, updateUserProfile } = useApp();
  const [depositAmount, setDepositAmount] = useState<string>('30');
  const [isDepositing, setIsDepositing] = useState(false);

  const target = user.targetPreparationAmount;
  const current = user.currentSavings;
  const remaining = Math.max(0, target - current);
  const progressPercent = Math.min(100, Math.round((current / target) * 100));

  // Compute breakdown from transactions ledger
  const referralEarningsTotal = transactions
    .filter((t) => t.type === 'REFERRAL_EARNING' || t.type === 'PARTNER_COMMISSION')
    .reduce((acc, t) => acc + t.amount, 0);

  const personalDepositsTotal = transactions
    .filter((t) => t.type === 'PERSONAL_DEPOSIT')
    .reduce((acc, t) => acc + t.amount, 0);

  const handleSimulateMoMoDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsDepositing(true);
    setTimeout(() => {
      setIsDepositing(false);
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      updateUserProfile({
        currentSavings: user.currentSavings + amount,
      });

      // Clear input
      setDepositAmount('30');
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page Title & Persona State */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C4221] bg-[#FAF1E4] px-2.5 py-0.5 rounded-full border border-[#E8DFC8]">
              Akosua's Motherhood Fund
            </span>
            <span className="text-xs text-[#7A695C]">• Due March 2027</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#281C16]">
            Savings &amp; Preparedness Fund
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('earn')}
            className="px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#23533E] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Earn More (Numa Partner)</span>
          </button>
          <button
            onClick={() => setCurrentView('care')}
            className="px-4 py-2.5 rounded-xl bg-[#281C16] hover:bg-[#3D291F] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Use for Care</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E8824A]" />
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Main Big Fund Card */}
        <div className="md:col-span-2 bg-[#281C16] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#E8DFC8]/30 shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-mono uppercase text-[#D9CAB6] tracking-wider">
                Current Motherhood Balance
              </div>
              <div className="text-4xl sm:text-5xl font-serif font-bold text-[#E8824A] mt-1">
                GH₵{current}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-[#D9CAB6]">Target Goal</div>
              <div className="text-xl font-serif font-bold text-white mt-1">
                GH₵{target}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mt-6">
            <div className="flex justify-between text-xs font-medium text-[#D9CAB6]">
              <span>Progress to Safe Delivery Fund</span>
              <span className="font-bold text-[#E8824A]">{progressPercent}% Completed</span>
            </div>
            <div className="w-full h-3.5 bg-white/15 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(4, progressPercent)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#E8824A] to-[#F59E0B] rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
            <div>
              <span className="text-[#A8988B] block">Remaining Amount</span>
              <span className="font-mono font-bold text-white text-sm">GH₵{remaining}</span>
            </div>
            <div>
              <span className="text-[#A8988B] block">Weekly Target</span>
              <span className="font-mono font-bold text-white text-sm">GH₵{user.weeklyTarget}/week</span>
            </div>
            <div>
              <span className="text-[#A8988B] block">Readiness ETA</span>
              <span className="font-semibold text-emerald-400">On Track for March</span>
            </div>
          </div>
        </div>

        {/* Breakdown of Sources Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#281C16] mb-4">
              Fund Sources
            </h3>

            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-[#EAF5EF] border border-[#2D6A4F]/20">
                <div className="flex justify-between text-xs font-bold text-[#2D6A4F] mb-1">
                  <span>Referral Earnings</span>
                  <span>GH₵{referralEarningsTotal || current}</span>
                </div>
                <div className="text-[11px] text-[#5C4A3E]">
                  Earned without cash via Numa Organics
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8]">
                <div className="flex justify-between text-xs font-bold text-[#5C4A3E] mb-1">
                  <span>Personal MoMo Deposits</span>
                  <span>GH₵{personalDepositsTotal}</span>
                </div>
                <div className="text-[11px] text-[#7A695C]">
                  Direct cash deposits (optional)
                </div>
              </div>
            </div>
          </div>

          {/* Quick Simulated Personal Deposit for judges */}
          <div className="mt-4 pt-4 border-t border-[#E8DFC8]">
            <div className="text-[11px] font-bold text-[#7A695C] mb-2 uppercase">
              Simulate Cash Deposit (Optional)
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-2 text-xs font-bold text-[#7A695C]">GH₵</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full pl-9 pr-2 py-1.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] font-mono font-bold"
                />
              </div>
              <button
                onClick={handleSimulateMoMoDeposit}
                disabled={isDepositing}
                className="px-3 py-1.5 rounded-xl bg-[#281C16] hover:bg-[#3D291F] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                {isDepositing ? 'Adding...' : '+ Deposit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction & Activity Ledger */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#281C16]">Activity Ledger</h3>
            <p className="text-xs text-[#7A695C]">All earnings and contributions are auditable in real-time</p>
          </div>
          <span className="text-xs font-mono text-[#7A695C] bg-[#FAF7F2] px-2.5 py-1 rounded-full">
            {transactions.length} Records
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF7F2] rounded-2xl border border-dashed border-[#E8DFC8]">
            <CircleDollarSign className="w-10 h-10 text-[#7A695C] mx-auto mb-2 opacity-50" />
            <h4 className="font-serif text-base font-bold text-[#281C16]">No Transactions Yet</h4>
            <p className="text-xs text-[#7A695C] max-w-sm mx-auto mt-1 mb-4">
              Akosua has GH₵0 starting savings. Click below to share Numa Organics products and earn your first commission!
            </p>
            <button
              onClick={() => setCurrentView('earn')}
              className="px-4 py-2 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold cursor-pointer"
            >
              Start Earning Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      tx.type === 'REFERRAL_EARNING' || tx.type === 'PARTNER_COMMISSION'
                        ? 'bg-[#EAF5EF] text-[#2D6A4F]'
                        : tx.type === 'CARE_REDEMPTION'
                        ? 'bg-[#FAF1E4] text-[#9C4221]'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {tx.type === 'REFERRAL_EARNING' || tx.type === 'PARTNER_COMMISSION' ? '✨' : tx.type === 'CARE_REDEMPTION' ? '🏥' : '💵'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#281C16]">{tx.description}</div>
                    <div className="text-[11px] text-[#7A695C] flex items-center gap-2 mt-0.5">
                      <span>Source: {tx.source}</span>
                      <span>•</span>
                      <span>{tx.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-base font-mono font-bold ${
                      tx.amount > 0 ? 'text-[#2D6A4F]' : 'text-[#9C4221]'
                    }`}
                  >
                    {tx.amount > 0 ? `+GH₵${tx.amount}` : `-GH₵${Math.abs(tx.amount)}`}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#2D6A4F] bg-[#EAF5EF] px-1.5 py-0.5 rounded-full">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
