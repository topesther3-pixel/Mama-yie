import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, Bot, User as UserIcon, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ama';
  text: string;
  time: string;
}

export const AmaScreen: React.FC = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ama',
      text: `Akwaaba, ${user.name}! Wo ho te sɛn? I am here to help you prepare for your delivery at ${user.facility || 'Suntreso Hospital'}. What's on your mind today?`,
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ama/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userProfile: user,
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const amaMsg: ChatMessage = {
        id: `ama_${Date.now()}`,
        sender: 'ama',
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, amaMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ama_err_${Date.now()}`,
        sender: 'ama',
        text: `Akosua, delivery preparation at Suntreso Hospital typically costs between GH₵300 and GH₵600. Remember you can earn directly toward this goal by sharing your Numa referral code ${user.referralCode}! Always consult your midwife for clinical concerns.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'What should I pack for Suntreso Hospital?',
    'How do I earn with my referral code?',
    'How much is delivery in Kumasi?',
  ];

  return (
    <div id="ama-chat-screen" className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-md mx-auto w-full bg-[#FAF7F2]">
      {/* Top Bar */}
      <div className="bg-white px-4 py-3 border-b border-[#E8DFC8] flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#E8824A] flex items-center justify-center text-white shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-base text-[#281C16]">Ama</h2>
          <p className="text-[11px] text-[#1E5E3A] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Maternal Companion • Online</span>
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                msg.sender === 'user' ? 'bg-[#9C4221] text-white' : 'bg-[#FAF1E4] text-[#9C4221] border border-[#E8DFC8]'
              }`}
            >
              {msg.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#9C4221] text-white rounded-tr-xs shadow-xs'
                  : 'bg-white text-[#281C16] border border-[#E8DFC8] rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              <div
                className={`text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-white/75' : 'text-[#8C7A6D]'
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#8C7A6D] bg-white p-3 rounded-2xl border border-[#E8DFC8] w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#E8824A] animate-spin" />
            <span>Ama is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length < 3 && (
        <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-white border border-[#E8DFC8] px-3 py-1.5 rounded-full text-[#5C4A3E] whitespace-nowrap hover:bg-[#FAF1E4] transition-colors cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Medical Mini-Disclaimer */}
      <div className="px-4 py-1 text-[10px] text-[#8C7A6D] text-center bg-[#FAF1E4]/50 border-t border-[#E8DFC8]/50">
        Ama provides health planning, not medical diagnosis. In an emergency, visit Suntreso Hospital immediately.
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-[#E8DFC8]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Ama about delivery, savings, or health..."
            className="flex-1 bg-[#FAF7F2] border border-[#E8DFC8] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#281C16] outline-none focus:border-[#E8824A] focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-[#9C4221] hover:bg-[#853416] disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
