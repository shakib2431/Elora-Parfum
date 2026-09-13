import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Sparkles,
  X,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Crown,
  ShieldCheck,
  Truck,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Maximize2,
  HelpCircle,
  Clock,
  Droplets,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data/products';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  taskComplexity?: 'fast' | 'general' | 'complex';
}

type TaskMode = 'fast' | 'general' | 'complex';

const STORAGE_KEY = 'elora_concierge_chat_history_v2';

const SUGGESTED_QUERIES = [
  {
    category: 'Consultation',
    icon: Sparkles,
    label: 'Help me choose between NOIR and OUD ÉLITE for evening',
    query: 'Can you compare ELORA NOIR and OUD ÉLITE? Which one is better suited for a formal evening event?',
  },
  {
    category: 'Trial & Returns',
    icon: ShieldCheck,
    label: 'How does the 30-Day Discovery Vial guarantee work?',
    query: 'How does your complimentary 2ml discovery vial and 30-day risk-free return trial work?',
  },
  {
    category: 'Longevity',
    icon: Droplets,
    label: 'What makes 25%-28% Extrait last 14+ hours?',
    query: 'What is the exact concentration of Elora fragrances and how long do they project on skin and fabric?',
  },
  {
    category: 'Shipping',
    icon: Truck,
    label: 'Worldwide delivery & tracking times',
    query: 'What are your shipping destinations, delivery timeframes, and how is the parcel packaged?',
  },
  {
    category: 'Monogramming',
    icon: Crown,
    label: 'Complimentary flacon cap engraving',
    query: 'Do you offer custom engraved initials on the magnetic gold flacon cap, and is there any extra cost?',
  },
];

export const CustomerQueryConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskMode, setTaskMode] = useState<TaskMode>('general');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'welcome-0',
        role: 'model',
        text: "Bonjour and welcome to Maison Elora Parfum. I am your Senior Atelier Concierge and Master Olfactory Advisor.\n\nWhether you desire an intimate scent consultation, wish to inquire about our 25% pure Extrait de Parfum longevity, need guidance on our complimentary 30-day Discovery Vial trial, or require assistance with orders and global delivery—I am at your service.\n\nHow may I assist your inquiry today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash',
        taskComplexity: 'general',
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync messages to localStorage for persistence across pages and reloads
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Smooth scroll to bottom of thread on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto focus input when opened on non-touch devices
      if (window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen, messages]);

  // Global event listener to trigger concierge with optional query
  useEffect(() => {
    const handleOpenConcierge = (e: CustomEvent<{ query?: string; mode?: TaskMode }>) => {
      setIsOpen(true);
      if (e.detail?.mode) setTaskMode(e.detail.mode);
      if (e.detail?.query) {
        setInputQuery(e.detail.query);
        setTimeout(() => handleSendMessage(e.detail.query, e.detail.mode || taskMode), 100);
      }
    };

    window.addEventListener('open-concierge-chat' as any, handleOpenConcierge);
    return () => {
      window.removeEventListener('open-concierge-chat' as any, handleOpenConcierge);
    };
  }, [taskMode]);

  const handleSendMessage = async (customText?: string, overrideMode?: TaskMode) => {
    const textToSend = (customText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const currentMode = overrideMode || taskMode;
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      taskComplexity: currentMode,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Send conversation history to the server-side Gemini endpoint
      const payload = {
        messages: newMessages.map((m) => ({
          role: m.role,
          text: m.text,
        })),
        taskComplexity: currentMode,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      const conciergeMsg: ChatMessage = {
        id: `concierge-${Date.now()}`,
        role: 'model',
        text: data.reply || "I am honored to assist you. Please let me know if you need further guidance with your selection.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || (currentMode === 'fast' ? 'gemini-3.1-flash-lite' : currentMode === 'complex' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash'),
        taskComplexity: currentMode,
      };

      setMessages((prev) => [...prev, conciergeMsg]);
    } catch (error: any) {
      console.error('Customer query concierge error:', error);
      // Fallback response so the user is never left without assistance
      const fallbackMsg: ChatMessage = {
        id: `concierge-${Date.now()}`,
        role: 'model',
        text: "Thank you for contacting Maison Elora. Our boutique customer service is dedicated to ensuring an effortless experience. If your inquiry concerns order tracking or returns, every 100ml flacon features our complimentary 30-day discovery trial with pre-paid return couriers. How may I further assist your query today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash (local assist)',
        taskComplexity: currentMode,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Reset conversation history with Atelier Concierge?')) {
      const initialWelcome: ChatMessage = {
        id: 'welcome-reset',
        role: 'model',
        text: "A fresh salon session has been prepared. I am your Senior Atelier Concierge. How may I assist you with fragrances, shipping, returns, or order guidance today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash',
        taskComplexity: 'general',
      };
      setMessages([initialWelcome]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to extract product mentions to display clickable recommendation chips
  const extractProductsInText = (text: string) => {
    const matched = [];
    const lower = text.toLowerCase();
    for (const prod of PRODUCTS) {
      if (lower.includes(prod.name.toLowerCase()) || lower.includes(prod.slug.toLowerCase())) {
        matched.push(prod);
      }
    }
    return matched;
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. FLOATING CONCIERGE LAUNCHER BUTTON (Bottom Right)         */}
      {/* ============================================================ */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              id="concierge-launcher-btn"
              onClick={() => setIsOpen(true)}
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 10 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative flex items-center space-x-3 px-4 sm:px-5 py-3.5 bg-[#14141B]/95 hover:bg-[#1A1A24] text-[#FFFFFF] border border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
              aria-label="Open Elora Atelier Concierge for customer inquiries"
            >
              {/* Subtle gold halo glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37]/30 to-[#B8972E]/10 rounded-full blur-sm group-hover:blur-md transition-all opacity-70 group-hover:opacity-100 -z-10" />

              {/* Atelier Crest Icon with pulse ping */}
              <div className="relative w-8 h-8 rounded-full bg-[#0A0A0C] border border-[#D4AF37] flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#D4AF37] ring-2 ring-[#0A0A0C] animate-pulse" />
              </div>

              {/* Editorial typography label */}
              <div className="text-left pr-1">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[9.5px] uppercase tracking-[0.26em] text-[#D4AF37] font-sans font-bold">
                    ATELIER CONCIERGE
                  </span>
                  <span className="text-[8px] px-1 py-0.2 bg-[#D4AF37]/20 text-[#D4AF37] rounded font-mono">
                    AI
                  </span>
                </div>
                <span className="text-xs text-[#FAF9F6] font-serif tracking-[0.06em] block">
                  Customer Query & Scent Sommelier
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ============================================================ */}
      {/* 2. DOCKABLE CHAT WINDOW & SCROLLABLE THREAD                   */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="concierge-chat-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Elora Atelier Concierge Customer Query Interface"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed z-50 bg-[#0E0E14] border border-[#2B2A36] rounded-xl shadow-[0_24px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden backdrop-blur-xl ${
              isExpanded
                ? 'inset-3 sm:inset-6 md:inset-10 max-w-5xl mx-auto'
                : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[88vh]'
            }`}
          >
            {/* Header: Identity, Model Selector & Actions */}
            <div className="px-4 sm:px-5 py-3.5 bg-[#14141B] border-b border-[#24232C] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative w-9 h-9 rounded-full bg-[#0A0A0C] border border-[#D4AF37] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#14141B]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-sm tracking-[0.14em] text-[#FFFFFF] uppercase font-semibold">
                      ELORA CONCIERGE
                    </h3>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] px-1.5 py-0.5 bg-[#D4AF37]/15 rounded border border-[#D4AF37]/30">
                      PARIS · GRASSE
                    </span>
                  </div>
                  <p className="text-[10px] text-[#A1A1AA] font-sans tracking-wide">
                    Live Olfactory Sommelier & Customer Queries
                  </p>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center space-x-1.5 text-[#A1A1AA]">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="p-1.5 hover:text-[#D4AF37] hover:bg-[#1F1F2B] rounded transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Collapse window' : 'Expand window'}
                  aria-label={isExpanded ? 'Collapse window' : 'Expand window'}
                  className="p-1.5 hover:text-[#FFFFFF] hover:bg-[#1F1F2B] rounded transition-colors hidden sm:block"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Concierge"
                  aria-label="Close Concierge"
                  className="p-1.5 hover:text-[#FFFFFF] hover:bg-[#1F1F2B] rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Model / Task Intelligence Selector Bar */}
            <div className="px-4 py-2 bg-[#0A0A0C]/90 border-b border-[#24232C] flex items-center justify-between text-[10px] uppercase font-sans tracking-[0.15em]">
              <span className="text-[#71717A] flex items-center space-x-1">
                <HelpCircle className="w-3 h-3 text-[#D4AF37]" />
                <span>TASK MODE:</span>
              </span>

              <div className="flex items-center space-x-1 bg-[#14141B] p-0.5 rounded border border-[#2B2A36]">
                <button
                  type="button"
                  onClick={() => setTaskMode('fast')}
                  title="Uses gemini-3.1-flash-lite for rapid shipping & policy answers"
                  className={`px-2 py-1 rounded transition-all flex items-center space-x-1 ${
                    taskMode === 'fast'
                      ? 'bg-[#24232C] text-[#D4AF37] font-semibold'
                      : 'text-[#71717A] hover:text-[#D4D4D8]'
                  }`}
                >
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  <span>Express (Lite)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTaskMode('general')}
                  title="Uses gemini-3.5-flash for general customer queries & consultations"
                  className={`px-2 py-1 rounded transition-all flex items-center space-x-1 ${
                    taskMode === 'general'
                      ? 'bg-[#24232C] text-[#D4AF37] font-semibold'
                      : 'text-[#71717A] hover:text-[#D4D4D8]'
                  }`}
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                  <span>Maison (General)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTaskMode('complex')}
                  title="Uses gemini-3.1-pro-preview for complex bespoke olfactory formulation & chemistry"
                  className={`px-2 py-1 rounded transition-all flex items-center space-x-1 ${
                    taskMode === 'complex'
                      ? 'bg-[#24232C] text-[#D4AF37] font-semibold'
                      : 'text-[#71717A] hover:text-[#D4D4D8]'
                  }`}
                >
                  <Crown className="w-2.5 h-2.5 text-amber-300" />
                  <span>Bespoke (Pro)</span>
                </button>
              </div>
            </div>

            {/* Quick Inquiry Suggested Chips */}
            <div className="px-4 py-2 bg-[#101017] border-b border-[#24232C] overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#71717A] shrink-0 font-medium">
                QUICK TOPICS:
              </span>
              {SUGGESTED_QUERIES.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.query)}
                    className="shrink-0 px-2.5 py-1 bg-[#161622] hover:bg-[#202030] border border-[#2B2A36] hover:border-[#D4AF37] rounded text-[10px] text-[#A1A1AA] hover:text-[#FFFFFF] transition-all flex items-center space-x-1.5 whitespace-nowrap"
                  >
                    <IconComp className="w-3 h-3 text-[#D4AF37]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Message History Thread */}
            <div
              id="concierge-message-thread"
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-xs sm:text-sm bg-gradient-to-b from-[#0E0E14] to-[#0A0A0C]"
            >
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const mentionedProducts = !isUser ? extractProductsInText(msg.text) : [];

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    {/* Role Stamp & Timestamp */}
                    <div className="flex items-center space-x-2 mb-1 px-1 text-[9.5px] uppercase tracking-[0.2em] text-[#71717A]">
                      <span>{isUser ? 'YOU (PATRON)' : 'ELORA ATELIER'}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && (
                        <>
                          <span>·</span>
                          <span className="text-[#D4AF37] font-mono">{msg.modelUsed}</span>
                        </>
                      )}
                    </div>

                    {/* Bubble Content */}
                    <div
                      className={`relative group max-w-[88%] sm:max-w-[82%] rounded-xl p-3.5 sm:p-4 leading-relaxed tracking-wide ${
                        isUser
                          ? 'bg-[#1C1C26] text-[#FFFFFF] border border-[#333142] rounded-tr-none shadow-md'
                          : 'bg-[#121218] text-[#D4D4D8] border border-[#24232C] rounded-tl-none shadow-lg'
                      }`}
                    >
                      {/* Copy reply button */}
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="absolute top-2.5 right-2.5 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[#20202C] text-[#A1A1AA] hover:text-[#FFFFFF] transition-all"
                        title="Copy message"
                        aria-label="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      {/* Text formatting: paragraphs and markdown bold */}
                      <div className="whitespace-pre-wrap space-y-2 pr-4">
                        {msg.text.split('\n\n').map((paragraph, pIdx) => {
                          // Simple bold parser for **text**
                          const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={pIdx}>
                              {parts.map((part, partIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return (
                                    <strong
                                      key={partIdx}
                                      className="text-[#D4AF37] font-medium font-serif"
                                    >
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>

                      {/* Interactive Flacon Chips if perfumes are referenced */}
                      {mentionedProducts.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-[#24232C] flex flex-wrap gap-2">
                          <span className="w-full text-[9px] uppercase tracking-[0.24em] text-[#D4AF37] font-semibold block">
                            DISCOVER REFERENCED FLACONS:
                          </span>
                          {mentionedProducts.map((prod) => (
                            <Link
                              key={prod.id}
                              to={`/products/${prod.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="px-2.5 py-1 bg-[#1A1A24] hover:bg-[#242432] border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded text-[10px] text-[#FFFFFF] font-sans flex items-center space-x-1.5 transition-all group/chip"
                            >
                              <span className="font-serif text-[#D4AF37] font-medium uppercase">
                                {prod.name}
                              </span>
                              <span className="text-[#A1A1AA]">· ₹{prod.price.toLocaleString('en-IN')}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-[#D4AF37] opacity-60 group-hover/chip:opacity-100" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Live typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3 text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-[#121218] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                  </div>
                  <div className="p-3 bg-[#121218] border border-[#24232C] rounded-xl rounded-tl-none flex items-center space-x-2">
                    <span className="text-xs text-[#A1A1AA] font-sans tracking-wide">
                      Maison Concierge is formulating an olfactory response
                    </span>
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input & Dispatch Console */}
            <div className="p-3 sm:p-4 bg-[#14141B] border-t border-[#24232C] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-end space-x-2"
              >
                <div className="relative flex-1">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about perfumes, notes, order tracking, returns, shipping..."
                    className="w-full px-4 py-3 bg-[#0A0A0C] border border-[#2B2A36] focus:border-[#D4AF37] rounded-lg text-xs sm:text-sm text-[#FFFFFF] placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] resize-none transition-colors max-h-32"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  id="concierge-send-btn"
                  aria-label="Send customer inquiry"
                  className="px-4 py-3 bg-[#D4AF37] hover:bg-[#E5C358] disabled:bg-[#2B2A36] disabled:text-[#71717A] text-[#0A0A0C] font-semibold rounded-lg text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(212,175,55,0.2)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-[#71717A] font-sans">
                <span className="flex items-center space-x-1">
                  <Clock className="w-2.5 h-2.5 text-[#D4AF37]" />
                  <span>DISPATCH WITHIN 24H · 30-DAY TRIAL</span>
                </span>
                <span>PRESS ENTER TO SEND ↵</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
