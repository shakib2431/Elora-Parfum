import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, ArrowRight, Copy, Mail, ShieldCheck, Feather } from 'lucide-react';

interface AtelierInvitationModalProps {
  forceOpen?: boolean;
  onCloseManual?: () => void;
}

export const AtelierInvitationModal: React.FC<AtelierInvitationModalProps> = ({
  forceOpen = false,
  onCloseManual,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedAccord, setSelectedAccord] = useState<string>('Warm Woods & Amber');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // 45-second timer management
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // Check if dismissed before in this session
    const isDismissed = sessionStorage.getItem('elora_atelier_invitation_dismissed_v2');
    const isJoined = localStorage.getItem('elora_atelier_invitation_joined_v2');
    if (isDismissed || isJoined) {
      return;
    }

    // Track start timestamp
    const now = Date.now();
    let startTime = parseInt(sessionStorage.getItem('elora_session_start_time') || '0', 10);
    if (!startTime) {
      startTime = now;
      sessionStorage.setItem('elora_session_start_time', startTime.toString());
    }

    const elapsed = now - startTime;
    const remainingTime = Math.max(0, 45000 - elapsed); // 45 seconds

    const timer = setTimeout(() => {
      // Re-verify it hasn't been dismissed during the wait
      if (!sessionStorage.getItem('elora_atelier_invitation_dismissed_v2')) {
        setIsOpen(true);
      }
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [forceOpen]);

  const handleDismiss = () => {
    sessionStorage.setItem('elora_atelier_invitation_dismissed_v2', 'true');
    setIsOpen(false);
    if (onCloseManual) onCloseManual();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      localStorage.setItem('elora_atelier_invitation_joined_v2', 'true');
      sessionStorage.setItem('elora_atelier_invitation_dismissed_v2', 'true');
    }, 850);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('ATELIER15');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const accords = [
    'Warm Woods & Amber',
    'Sensual White Florals',
    'Solar Citrus & Minerals',
    'Rare Oud & Incense',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="atelier-invitation-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-[#120F0D]/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#1E1915] border border-[#3B332B] hover:border-antique-gold/50 rounded-xl shadow-[0_24px_80px_rgba(0,0,0,0.95)] overflow-hidden z-10 text-warm-ivory"
          >
            {/* Subtle Atelier Gold Spotlight Halo */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-radial from-antique-gold/15 via-transparent to-transparent blur-3xl pointer-events-none" />

            {/* Top Close Button */}
            <button
              onClick={handleDismiss}
              type="button"
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#2A241F] hover:bg-[#382F28] text-champagne/80 hover:text-warm-ivory flex items-center justify-center transition-all border border-[#3B332B] hover:border-antique-gold"
              aria-label="Close invitation"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8 relative z-10">
              {!isSuccess ? (
                <>
                  {/* Header Monogram & Hook */}
                  <div className="text-center space-y-2 mb-6">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2A241F] border border-antique-gold/40 text-antique-gold text-[9px] uppercase tracking-[0.26em] font-sans font-semibold">
                      <Feather className="w-3 h-3 text-antique-gold" />
                      <span>Private Concierge Registry</span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl tracking-[0.14em] uppercase font-normal text-warm-ivory pt-1">
                      INVITATION TO THE ATELIER
                    </h3>

                    <div className="w-12 h-[1px] bg-antique-gold mx-auto mt-2" />

                    <p className="text-xs sm:text-sm text-champagne/80 font-sans font-light leading-relaxed max-w-md mx-auto pt-1">
                      You are cordially invited to enter the private circle of Elora Haute Parfumerie. Register to receive priority allocations on our upcoming Genesis cellar distillations and private salon events.
                    </p>
                  </div>

                  {/* Privilege Highlight Box */}
                  <div className="bg-[#241F1A] border border-[#3B332B] rounded-lg p-4 mb-6 space-y-2 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-[#2D2620] border border-antique-gold text-antique-gold flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-serif uppercase tracking-wider text-warm-ivory">
                          Complimentary 2ml Extraction Vial
                        </h4>
                        <p className="text-[11px] text-champagne/80 leading-relaxed font-sans font-light mt-0.5">
                          Your first consignment will include a complimentary hand-sealed 2ml glass vial of <span className="text-antique-gold font-medium font-serif">Iris Nobile Extrait (32% concentration)</span> prior to public release.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Preferred Scent Category selection */}
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[9.5px] uppercase tracking-[0.2em] text-champagne font-sans font-semibold">
                        Select Your Olfactory Inclination
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {accords.map((accord) => (
                          <button
                            key={accord}
                            type="button"
                            onClick={() => setSelectedAccord(accord)}
                            className={`px-3 py-2 text-[10.5px] rounded-lg font-sans text-left transition-all border ${
                              selectedAccord === accord
                                ? 'bg-[#2A241F] border-antique-gold text-antique-gold font-medium shadow-sm'
                                : 'bg-[#221D18] border-[#3B332B] text-champagne/70 hover:text-warm-ivory hover:border-antique-gold/50'
                            }`}
                          >
                            {accord}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1 text-left">
                      <label
                        htmlFor="atelier-invitation-email"
                        className="block text-[9.5px] uppercase tracking-[0.2em] text-champagne font-sans font-semibold"
                      >
                        Client Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-champagne/50">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="atelier-invitation-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. patron@luxurydomain.com"
                          className="w-full pl-10 pr-4 py-3 bg-deep-espresso border border-[#3B332B] focus:border-antique-gold rounded-lg text-xs sm:text-sm text-warm-ivory placeholder-champagne/40 outline-none transition-colors font-sans"
                        />
                      </div>
                    </div>

                    {/* Submit Action */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-antique-gold hover:bg-champagne text-deep-espresso font-sans font-semibold text-xs uppercase tracking-[0.2em] rounded transition-all shadow-[0_4px_20px_rgba(185,154,98,0.25)] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">SEALING INVITATION...</span>
                      ) : (
                        <>
                          <span>REQUEST ATELIER ADMISSION</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Subtext Dismiss */}
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleDismiss}
                        className="text-[10px] uppercase tracking-[0.2em] text-champagne/60 hover:text-champagne transition-colors font-sans"
                      >
                        Perhaps later · Continue quietly browsing
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Success State */
                <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#2A241F] border border-antique-gold text-antique-gold flex items-center justify-center mx-auto shadow-lg">
                    <Check className="w-6 h-6 stroke-[2]" />
                  </div>

                  <div>
                    <span className="text-[9.5px] uppercase tracking-[0.25em] text-antique-gold font-sans font-semibold">
                      Private Registry Confirmed
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-warm-ivory tracking-[0.14em] uppercase font-normal mt-1">
                      WELCOME TO THE ATELIER
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-champagne/80 font-sans font-light leading-relaxed max-w-sm mx-auto">
                    Your invitation pass has been authenticated. An inaugural 15% private concession has been prepared for your first flacon.
                  </p>

                  {/* Code Card */}
                  <div className="bg-[#241F1A] border border-antique-gold/40 rounded-lg p-4 max-w-xs mx-auto space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-champagne/60 font-sans block">
                      Inaugural Concession Code
                    </span>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-mono text-xl font-semibold tracking-[0.2em] text-antique-gold">
                        ATELIER15
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="p-1.5 rounded bg-[#382F28] hover:bg-[#463B32] text-warm-ivory transition-all"
                        title="Copy Code"
                      >
                        {copiedCode ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-champagne/70 font-sans block">
                      {copiedCode ? 'Copied to clipboard!' : 'Tap to copy for 15% privilege'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="mt-4 px-8 py-3 bg-antique-gold hover:bg-champagne text-deep-espresso font-sans font-semibold text-xs uppercase tracking-[0.2em] rounded transition-all shadow-md"
                  >
                    Enter the House
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
