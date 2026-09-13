import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Heart, ShieldCheck, Send, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { WhatsAppChannelSection } from './WhatsAppChannelSection';

export const SupportCircleView: React.FC = () => {
  const { supportCircle, addSupportCircleMessage, submitPost, user } = useApp();
  const [newMsg, setNewMsg] = useState('');

  const collectiveProgress = Math.min(
    100,
    Math.round((supportCircle.collectiveSavings / supportCircle.collectiveTarget) * 100)
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMsg.trim();
    if (!text) return;
    setNewMsg('');
    try {
      await submitPost(text);
    } catch (err) {
      addSupportCircleMessage(text);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Circle Banner */}
      <div className="bg-[#1E232B] text-white p-6 sm:p-8 rounded-3xl mb-8 border border-[#F0EBE9]/20 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#FDF2F5] text-[#E61964] px-3 py-0.5 rounded-full border border-[#F8B4C8]">
                Peer Support Circle
              </span>
              <span className="text-xs text-[#94A3B8]">Due: {supportCircle.dueMonth}</span>
            </div>
            <h1 className="font-serif text-3xl font-bold">{supportCircle.name}</h1>
            <p className="text-xs text-[#CBD5E1] mt-1 max-w-xl">
              Mothers preparing together across Kumasi and Ashanti. Collective strength, shared accountability, and zero shame.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/15 min-w-[240px]">
            <div className="text-xs text-[#94A3B8]">Collective Preparedness Fund</div>
            <div className="text-2xl font-serif font-bold text-white my-1">
              GH₵{supportCircle.collectiveSavings}
            </div>
            <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-[#E61964] to-[#2E7D46] rounded-full"
                style={{ width: `${collectiveProgress}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-1.5 flex justify-between">
              <span>Goal: GH₵{supportCircle.collectiveTarget}</span>
              <span className="text-[#4ADE80] font-semibold">{collectiveProgress}% Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Members Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#F0EBE9] shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#1E232B] mb-4 flex items-center justify-between">
              <span>Circle Members (4)</span>
              <span className="text-xs font-sans text-[#64748B] bg-[#FAF8F8] px-2 py-0.5 rounded-full border border-[#F0EBE9]">
                Kumasi Hub
              </span>
            </h3>

            <div className="space-y-3">
              {supportCircle.members.map((member) => (
                <div
                  key={member.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    member.isDemoUser
                      ? 'bg-[#FDF2F5] border-[#F8B4C8]'
                      : 'bg-[#FAF8F8] border-[#F0EBE9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        member.isDemoUser
                          ? 'bg-[#E61964] text-white'
                          : 'bg-white text-[#1E232B] border border-[#F0EBE9]'
                      }`}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1E232B] flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {member.isDemoUser && (
                          <span className="text-[9px] font-bold text-[#E61964] uppercase">You</span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {member.location} • Month {member.pregnancyMonth}
                      </div>
                    </div>
                  </div>

                  {member.weeklyTargetReached ? (
                    <span className="text-[10px] font-bold text-[#1C592E] bg-[#EDF7EE] border border-[#BAE3C2] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#2E7D46]" />
                      Target Met
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#64748B] bg-white px-2 py-0.5 rounded-full border border-[#F0EBE9]">
                      Preparing
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#EDF7EE] border border-[#BAE3C2] text-xs text-[#1C592E]">
            <div className="flex items-center gap-2 font-bold text-[#2E7D46] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Dignity &amp; Privacy First</span>
            </div>
            <p>
              Private health records, medical issues, and exact personal savings balances are never broadcast to circle members. Only general milestones and collective encouragement are shared.
            </p>
          </div>

          {/* Mama Yie on WhatsApp Channel */}
          <WhatsAppChannelSection showDetailsToggle={false} />
        </div>

        {/* Message Wall Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#F0EBE9] shadow-xs flex flex-col h-[560px]">
          <div className="p-5 border-b border-[#F0EBE9] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E232B]">Circle Encouragement Wall</h3>
              <p className="text-xs text-[#64748B]">Safe sisterhood, peer support &amp; weekly motivation</p>
            </div>
            <Heart className="w-5 h-5 text-[#E61964]" />
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
            {supportCircle.messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-2xl bg-[#FAF8F8] border border-[#F0EBE9] text-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-[#E61964]">{msg.senderName}</span>
                  <span className="text-[10px] text-[#64748B]">{msg.timestamp}</span>
                </div>
                <p className="text-xs text-[#1E232B] leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Post Message Form */}
          <div className="p-4 border-t border-[#F0EBE9] bg-[#FAF8F8]">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Share encouragement or celebrate reaching your target..."
                className="flex-1 p-3 rounded-xl bg-white border border-[#F0EBE9] text-xs text-[#1E232B] focus:outline-none focus:border-[#E61964]"
              />
              <button
                type="submit"
                disabled={!newMsg.trim()}
                className="px-4 py-3 rounded-xl bg-[#E61964] hover:bg-[#D01255] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
