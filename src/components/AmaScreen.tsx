import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, Mic, User as UserIcon, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ama';
  text: string;
  time: string;
}

const renderFormattedText = (content: string) => {
  return content.split('\n').map((line, lineIdx) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
    const cleanLine = isBullet ? trimmed.replace(/^[\*\-]\s+/, '') : line;

    const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);
    const formattedParts = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-bold text-[#1E232B]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <li key={lineIdx} className="ml-4 list-disc text-xs sm:text-sm my-0.5 leading-relaxed">
          {formattedParts}
        </li>
      );
    }

    if (!trimmed) {
      return <div key={lineIdx} className="h-1.5" />;
    }

    return (
      <p key={lineIdx} className="text-xs sm:text-sm my-0.5 leading-relaxed">
        {formattedParts}
      </p>
    );
  });
};

export const AmaScreen: React.FC = () => {
  const { user, openHospitalLocator } = useApp();
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
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Adjust scroll when mobile virtual keyboard opens
  useEffect(() => {
    const handleViewportResize = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
      window.visualViewport.addEventListener('scroll', handleViewportResize);
    }
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
        window.visualViewport.removeEventListener('scroll', handleViewportResize);
      }
    };
  }, []);

  const handleInputFocus = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  // Real Speech-to-Text handler using Web Speech API
  const startVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Voice input is not supported in this browser. Please type your message.');
      setTimeout(() => setSpeechError(null), 4500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-GH'; // Culturally attuned for Ghana English & terms

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setSpeechError('Microphone permission was denied. Please allow microphone access to use voice.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Voice input error: ${event.error}`);
        }
        setTimeout(() => setSpeechError(null), 4500);
      };

      recognition.onend = () => {
        setIsListening(false);
        inputRef.current?.focus();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to initialize speech recognition:', err);
      setIsListening(false);
      setSpeechError('Could not start voice input. Please type your message.');
      setTimeout(() => setSpeechError(null), 4500);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    // Stop voice listening if in progress
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) {
      setInputMessage('');
    }
    setIsLoading(true);

    try {
      const res = await fetch('/api/ama/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userProfile: user,
          history: messages.slice(-4).map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const amaMsg: ChatMessage = {
        id: `ama_${Date.now()}`,
        sender: 'ama',
        text: data.reply || 'I am here with you. Let us prepare for your safe delivery step-by-step.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, amaMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ama_err_${Date.now()}`,
        sender: 'ama',
        text: `Akosua, delivery preparation at ${user.facility || 'Suntreso Hospital'} typically costs between GH₵300 and GH₵600. Remember you can earn directly toward this goal by sharing your Numa referral code ${user.referralCode}! Always consult your midwife for clinical concerns.\n\n*Ama provides planning and general information. She is not a substitute for a qualified healthcare professional.*`,
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
    'Can I use Mama Yie on a basic phone?',
  ];

  return (
    <div
      id="ama-chat-screen"
      className="flex flex-col h-[calc(100dvh-4rem)] max-w-md mx-auto w-full bg-[#FAF8F8] overflow-hidden"
    >
      {/* 1. AI Companion Header */}
      <div className="bg-white px-4 py-3 border-b border-[#F0EBE9] flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E61964] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base text-[#1E232B]">Ama</h2>
              <span className="text-[10px] bg-[#EDF7EE] text-[#1C592E] font-semibold px-2 py-0.5 rounded-full border border-[#BAE3C2]">
                AI Maternal Companion
              </span>
            </div>
            <p className="text-[11px] text-[#2E7D46] font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D46] animate-pulse" />
              <span>Online • Cultural Twi &amp; English Guidance</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Conversation / Messages Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                msg.sender === 'user' ? 'bg-[#1E232B] text-white' : 'bg-[#FDF2F5] text-[#E61964] border border-[#F8B4C8]'
              }`}
            >
              {msg.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[84%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#E61964] text-white rounded-tr-xs shadow-xs'
                  : 'bg-white text-[#1E232B] border border-[#F0EBE9] rounded-tl-xs shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? (
                <div className="whitespace-pre-wrap">{msg.text}</div>
              ) : (
                <div className="text-xs sm:text-sm text-[#1E232B] space-y-1">
                  {renderFormattedText(msg.text)}
                </div>
              )}
              <div
                className={`text-[9px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-white/75' : 'text-[#94A3B8]'
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* Typing / Thinking Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 bg-[#FDF2F5] text-[#E61964] border border-[#F8B4C8]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white text-[#64748B] border border-[#F0EBE9] rounded-2xl rounded-tl-xs px-4 py-3 text-xs sm:text-sm shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E61964] animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-[#E61964] animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-[#E61964] animate-bounce [animation-delay:300ms]" />
              <span className="text-xs font-medium text-[#64748B] ml-1">Ama is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Container: 3. Suggested Prompts -> 4. Message Composer -> 5. Disclaimer */}
      <div className="shrink-0 bg-white border-t border-[#F0EBE9] z-20">
        {/* 3. Suggested Prompts (horizontal scrolling row) */}
        <div className="px-3 py-2 flex gap-1.5 overflow-x-auto no-scrollbar bg-[#FAF8F8] border-b border-[#F0EBE9]/60">
          <button
            type="button"
            onClick={openHospitalLocator}
            className="text-[11px] bg-[#FDF2F5] border border-[#F8B4C8] px-3 py-1.5 rounded-full text-[#E61964] font-bold whitespace-nowrap hover:bg-[#FCE7F0] transition-colors cursor-pointer shrink-0"
          >
            🏥 Find Hospital Near Me
          </button>
          {sampleQuestions.map((q, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-white border border-[#F0EBE9] px-3 py-1.5 rounded-full text-[#1E232B] whitespace-nowrap hover:bg-[#FAF8F8] hover:border-[#E61964]/40 transition-colors cursor-pointer shrink-0 shadow-2xs active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Live Speech Recognition Banner */}
        {isListening && (
          <div className="px-4 py-1.5 bg-[#FDF2F5] border-b border-[#F8B4C8] text-xs text-[#BE123C] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E61964] animate-ping" />
              <span className="font-medium">Listening... speak in English or Twi</span>
            </div>
            <button
              type="button"
              onClick={startVoiceInput}
              className="text-[11px] font-bold text-[#E61964] underline hover:opacity-80 cursor-pointer"
            >
              Done Speaking
            </button>
          </div>
        )}

        {/* Speech Error Banner */}
        {speechError && (
          <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>{speechError}</span>
          </div>
        )}

        {/* 4. REAL CHAT MESSAGE COMPOSER: [ Type a message...   🎤 ] [ ➤ ] */}
        <div className="p-3 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Input field with microphone button inside on the right */}
            <div className="relative flex-1 flex items-center bg-[#FAF8F8] border border-[#F0EBE9] focus-within:border-[#E61964] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#E61964]/15 rounded-2xl transition-all shadow-2xs">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Type a message..."
                disabled={isLoading}
                autoComplete="off"
                className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-[#1E232B] placeholder-[#94A3B8] outline-none pr-10"
                id="ama-chat-text-input"
              />
              <button
                type="button"
                onClick={startVoiceInput}
                title={isListening ? 'Stop voice listening' : 'Voice input (Speak to Ama)'}
                className={`absolute right-2 p-1.5 rounded-full transition-colors cursor-pointer ${
                  isListening
                    ? 'bg-[#FDF2F5] text-[#E61964] ring-2 ring-[#E61964]/40 animate-pulse'
                    : 'text-[#64748B] hover:text-[#E61964] hover:bg-[#FDF2F5]'
                }`}
                id="ama-chat-voice-btn"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Send button [ ➤ ] */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              title="Send message"
              className="w-11 h-11 rounded-2xl bg-[#E61964] hover:bg-[#D01255] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 text-white flex items-center justify-center shrink-0 transition-all shadow-xs cursor-pointer"
              id="ama-chat-send-btn"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>

        {/* 5. Medical Safety Disclaimer */}
        <div className="px-4 pb-2 pt-1 text-[10px] text-[#64748B] text-center bg-white border-t border-[#F0EBE9]/40">
          Ama provides health planning, not medical diagnosis. In an emergency, visit Suntreso Hospital immediately.
        </div>
      </div>
    </div>
  );
};
