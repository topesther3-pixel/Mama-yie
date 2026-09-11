import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { Sparkles, Send, Bot, User, AlertTriangle, ShieldCheck, Heart, ArrowRight, RefreshCw, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

const SUGGESTED_QUESTIONS = [
  'How much should I prepare for delivery?',
  "I don't have money to save. How can I earn?",
  'How much should I save every week?',
  'Show me healthcare partners in Kumasi',
  'Can I use Mama Yie without a smartphone?',
  'What happens if I miss a week of saving?',
];

export const AmaChat: React.FC = () => {
  const { user, setCurrentView, setActiveProductForShare, partners } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_initial_1',
      sender: 'ama',
      text: `Akwaaba, Akosua! I am Ama, your maternal companion. I see you are 5 months pregnant and planning for delivery at ${user.facility || 'Suntreso Hospital'}.\n\nRemember: motherhood shouldn't come as a financial surprise. Even if you start with GH₵0 savings today, we will prepare step-by-step together. How can I assist you right now?`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Estimate Delivery Costs', actionKey: 'estimate' },
        { label: 'How to Earn Savings', actionKey: 'earn' },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ama/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: messages.slice(-4),
          userProfile: user,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'I am here with you. Let us prepare for your safe delivery step-by-step.';

      const amaReply: ChatMessage = {
        id: `ama_${Date.now()}`,
        sender: 'ama',
        text: replyText,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, amaReply]);
    } catch (err) {
      // Graceful maternal fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `ama_fallback_${Date.now()}`,
          sender: 'ama',
          text: `Akwaaba, Akosua. You don't need spare cash to start saving with Mama Yie. Through our vetted partner Numa Organics, you can share botanical belly care products and earn GH₵5–7 commission straight into your motherhood fund.\n\n*Ama provides planning and general information. She is not a substitute for a qualified healthcare professional.*`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionKey: string) => {
    if (actionKey === 'earn') {
      setCurrentView('earn');
    } else if (actionKey === 'estimate') {
      handleSendMessage('How much should I prepare for delivery at Suntreso Hospital?');
    } else if (actionKey === 'circle') {
      setCurrentView('circles');
    }
  };

  const simulateTwiVoice = () => {
    if (isAudioPlaying) return;
    setIsAudioPlaying(true);
    // Visual speech simulation
    setTimeout(() => {
      setIsAudioPlaying(false);
    }, 3500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-[#281C16] text-[#FAF7F2] p-6 rounded-3xl mb-6 shadow-md border border-[#E8DFC8]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9C4221] to-[#E8824A] flex items-center justify-center text-white text-2xl shadow-inner font-serif">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold">Ama</h1>
                <span className="text-[11px] font-bold bg-[#FAF1E4] text-[#9C4221] px-2 py-0.5 rounded-full">
                  Maternal AI Companion
                </span>
              </div>
              <p className="text-xs text-[#D9CAB6] mt-0.5">
                Powered by Google Gemini • Culturally attuned for Ghanaian mothers • Twi &amp; English
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={simulateTwiVoice}
              disabled={isAudioPlaying}
              className="px-3 py-1.5 rounded-xl bg-[#FAF1E4]/10 hover:bg-[#FAF1E4]/20 text-[#FAF7F2] text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors border border-[#FAF1E4]/20"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isAudioPlaying ? 'text-[#E8824A] animate-pulse' : ''}`} />
              <span>{isAudioPlaying ? 'Voice Playing...' : 'Voice Sample'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Medical Disclaimer Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF1E4] border border-[#E8DFC8] text-xs text-[#5C4A3E] mb-6">
        <ShieldCheck className="w-5 h-5 text-[#9C4221] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#281C16]">Important Medical Safety Note:</strong> Ama provides preparation planning, cost estimates, and general maternal guidance. She is <strong>not a doctor or midwife</strong> and cannot diagnose, prescribe medication, or replace clinical care. In any medical emergency, please visit your nearest hospital immediately.
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden flex flex-col h-[560px]">
        {/* Messages List */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.sender === 'ama'
                    ? 'bg-gradient-to-br from-[#9C4221] to-[#E8824A] text-white'
                    : 'bg-[#281C16] text-[#FAF7F2]'
                }`}
              >
                {msg.sender === 'ama' ? <Bot className="w-5 h-5" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'ama'
                      ? 'bg-[#FAF7F2] text-[#281C16] border border-[#E8DFC8]'
                      : 'bg-[#281C16] text-white'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act.actionKey)}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF1E4] hover:bg-[#F3E6D3] text-[#9C4221] border border-[#E8DFC8] cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF1E4] flex items-center justify-center text-[#9C4221]">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] text-xs text-[#7A695C] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E8824A] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#E8824A] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#E8824A] animate-bounce [animation-delay:0.4s]"></span>
                <span>Ama is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Prompts Carousel */}
        <div className="p-3 bg-[#FAF7F2] border-t border-[#E8DFC8]/60 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] font-bold text-[#7A695C] whitespace-nowrap px-1">Ask Ama:</span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-3 py-1 rounded-full bg-white hover:bg-[#FAF1E4] hover:text-[#9C4221] text-[#5C4A3E] border border-[#E8DFC8] whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-[#E8DFC8]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Ama about delivery preparation, earning, savings, or partners..."
              className="flex-1 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-sm text-[#281C16] focus:outline-none focus:border-[#E8824A] focus:ring-1 focus:ring-[#E8824A]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-3 rounded-xl bg-[#281C16] hover:bg-[#3D291F] disabled:opacity-50 text-white cursor-pointer transition-colors shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4 text-[#E8824A]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
