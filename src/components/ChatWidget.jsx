import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, Send, X, RotateCcw, Sparkles, MessageCircle, Phone, ArrowRight, Loader2 } from 'lucide-react';
import useSettingsStore from '../store/settingsStore';

export default function ChatWidget() {
  const location = useLocation();
  const { phone } = useSettingsStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('citytourcabs_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: 'welcome-msg',
        sender: 'bot',
        text: "Namaste! 🙏 Welcome to **City Tour Cabs**.\n\nI'm your AI Travel Assistant. How can I help you today?\n• 🚖 Mumbai Darshan & Local Sightseeing\n• ⛰️ Lonavala, Alibaug, Shirdi & Jyotirlinga\n• 🚘 Cabs selection (Dzire, Ertiga, Crysta)\n• 💰 Instant fare quote & booking",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    let sid = sessionStorage.getItem('citytourcabs_chat_sid');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('citytourcabs_chat_sid', sid);
    }
    return sid;
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Persist messages in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('citytourcabs_chat_history', JSON.stringify(messages));
    } catch (_) {}
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Hide on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build history payload for AI context
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "I'm having trouble answering right now. Please call our booking manager directly at +91 " + (phone || '7021001921');

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-err-' + Date.now(),
          sender: 'bot',
          text: "Sorry, I had a brief network glitch. You can call us directly at **+91 " + (phone || '7021001921') + "** or chat with us on WhatsApp for instant confirmation!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const defaultMsg = [
      {
        id: 'welcome-msg-reset',
        sender: 'bot',
        text: "Namaste! 🙏 Chat has been reset. How can I help you plan your travel today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(defaultMsg);
    localStorage.removeItem('citytourcabs_chat_history');
  };

  const quickQuestions = [
    '🚖 Mumbai Darshan Tour',
    '⛰️ Lonavala Trip Rates',
    '🛕 Shirdi & Ashtavinayak',
    '🚘 Dzire vs Ertiga vs Innova',
    '📞 Talk to booking manager',
  ];

  // Helper to render markdown-like text (bold, bullet points)
  const renderFormattedText = (content) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold formatter: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 my-0.5">
            {formattedParts.slice(1)}
          </li>
        );
      }

      return (
        <p key={idx} className={line.trim() === '' ? 'h-2' : 'my-0.5'}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* 1. Floating Round Trigger Button ("Kone me gol sa button") */}
      <div className="fixed bottom-22 right-5 sm:bottom-24 sm:right-6 z-40 flex items-center gap-2">
        {/* Helper invitation pill on desktop */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-xs transition transform hover:scale-105 cursor-pointer border border-slate-700/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chat with AI</span>
          </button>
        )}

        {/* Round Floating Bot Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ${
            isOpen
              ? 'bg-slate-800 text-white ring-4 ring-slate-800/30 rotate-90'
              : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-orange-600 text-white shadow-orange-500/40 ring-4 ring-orange-500/20'
          }`}
          aria-label={isOpen ? 'Close AI Chat' : 'Open AI Chat'}
          title="Chat with AI Assistant"
        >
          {/* Subtle glowing pulse when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-orange-500/30 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <Bot className="w-7 h-7 text-white" />
              {/* Online Green Indicator Dot */}
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </>
          )}
        </button>
      </div>

      {/* 2. Interactive Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] h-[540px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-3.5 px-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white tracking-tight">City Tour AI</h3>
                  <span className="text-[10px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.2 rounded">
                    Bot
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Instant Booking & Info
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition cursor-pointer"
                title="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition cursor-pointer"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/80 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-orange-600/10 text-orange-600 border border-orange-200 shrink-0 flex items-center justify-center mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs break-words text-[13px] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  <div>{renderFormattedText(msg.text)}</div>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-orange-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-orange-600/10 text-orange-600 border border-orange-200 shrink-0 flex items-center justify-center mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-slate-500 shadow-xs flex items-center gap-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600" />
                  <span>City Tour AI is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions (Shown when idle) */}
          {!isLoading && (
            <div className="px-3 py-2 bg-white/95 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="shrink-0 text-[11px] font-medium bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-2.5 px-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about cabs, packages, fares..."
                disabled={isLoading}
                className="flex-1 py-2 px-3 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="w-8.5 h-8.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center transition shadow-sm disabled:opacity-40 cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Call / WhatsApp footer link */}
            <div className="flex items-center justify-between pt-2 px-1 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Powered by City Tour AI</span>
              </span>
              <a
                href={`tel:+91${phone || '7021001921'}`}
                className="font-semibold text-orange-600 hover:underline flex items-center gap-0.5"
              >
                <Phone className="w-2.5 h-2.5" />
                <span>Call +91 {phone || '7021001921'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
