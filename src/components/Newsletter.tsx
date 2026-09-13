import React, { useState } from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsJoined(true);
  };

  return (
    <section
      id="the-elora-circle"
      aria-label="The Elora Circle Newsletter"
      className="py-24 sm:py-32 bg-[#0A0A0C] text-[#FAF9F6] border-t border-b border-[#24232C] relative overflow-hidden"
    >
      {/* Subtle ambient warm lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-r from-[#945827]/15 via-[#D4AF37]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 text-center space-y-6 relative z-10">
        <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] uppercase tracking-[0.38em] text-[#D4AF37] font-sans font-medium">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>PRIVATE CORRESPONDENCE</span>
        </div>

        <h2 className="font-serif text-fluid-h2 tracking-[0.06em] uppercase font-normal text-[#FFFFFF]">
          THE ELORA CIRCLE
        </h2>

        <p className="font-serif italic text-lg sm:text-xl text-[#D4AF37]">
          Enter the world of Elora.
        </p>

        <p className="text-xs sm:text-sm text-[#D4D4D8] font-sans font-light leading-relaxed max-w-lg mx-auto">
          Receive confidential notices on new flacon releases, private atelier allocations, and olfactory essays by master perfumers.
        </p>

        {isJoined ? (
          <div className="p-8 bg-[#14141B] border border-[#D4AF37]/40 text-center space-y-3 rounded-2xl shadow-xl">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
              <Check className="w-5 h-5 stroke-[1.5]" />
            </div>
            <p className="font-serif text-2xl tracking-wide uppercase text-[#FFFFFF]">
              Welcome to the Circle
            </p>
            <p className="text-xs text-[#D4D4D8] font-sans">
              Your invitation has been dispatched. Use courtesy privilege code <strong className="text-[#D4AF37]">ELORA10</strong> on your commission.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3.5 bg-[#14141B] border border-[#262633] text-xs text-[#FAF9F6] placeholder-[#A1A1AA] outline-none focus:border-[#D4AF37] font-sans transition-colors rounded-sm"
              />
              <button
                type="submit"
                className="group px-7 py-3.5 bg-[#D4AF37] text-[#0A0A0C] hover:bg-[#E5C378] text-[11px] uppercase tracking-[0.24em] font-sans transition-all duration-300 font-semibold shrink-0 flex items-center justify-center space-x-2 rounded-sm shadow-md"
              >
                <span>JOIN THE CIRCLE</span>
                <ArrowRight className="w-3 h-3 text-[#0A0A0C] transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-[10px] text-[#A1A1AA] font-sans tracking-wide">
              We honor your discretion. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
