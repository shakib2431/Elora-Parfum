import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  X,
  ArrowRight,
  Flame,
  Check,
  Copy,
  Gift,
  Award,
  ShieldCheck,
  ChevronRight,
  Droplets,
  Crown,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';

interface EarlyLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const STORAGE_KEY = 'elora_early_launch_dismissed_v2';
const TOTAL_ALLOCATION = 500;
const CLAIMED_COUNT = 418;
const REMAINING_COUNT = TOTAL_ALLOCATION - CLAIMED_COUNT; // 82

export const EarlyLaunchModal: React.FC<EarlyLaunchModalProps> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const navigate = useNavigate();
  const { applyPromoCode } = useCart();
  const [copied, setCopied] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [selectedFragranceIndex, setSelectedFragranceIndex] = useState(0);

  // Focusable inaugural 3 perfumes
  const launchProducts = PRODUCTS.slice(0, 3);
  const currentProduct = launchProducts[selectedFragranceIndex] || launchProducts[0];

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('EARLY500');
    setCopied(true);
    applyPromoCode('EARLY500');
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDismiss = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch (err) {
        console.error(err);
      }
    }
    onClose();
  };

  const handleClaimNow = () => {
    applyPromoCode('EARLY500');
    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch (err) {
        console.error(err);
      }
    }
    onClose();
    navigate('/collections/shop-all');
  };

  const handleSelectProduct = (slug: string) => {
    applyPromoCode('EARLY500');
    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch (err) {
        console.error(err);
      }
    }
    onClose();
    navigate(`/products/${slug}`);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dontShowAgain]);

  // Global custom event listener so any button or link can trigger the modal
  useEffect(() => {
    const handleOpenEvent = () => {
      onOpen();
    };
    window.addEventListener('open-early-launch-modal', handleOpenEvent);
    return () => window.removeEventListener('open-early-launch-modal', handleOpenEvent);
  }, [onOpen]);

  return (
    <>
      {/* =========================================================================
          1. FLOATING RE-OPEN BADGE (Quiet Luxury Noir & Gold Pill)
         ========================================================================= */}
      {!isOpen && (
        <button
          type="button"
          id="early-launch-reopen-btn"
          onClick={onOpen}
          className="fixed bottom-6 left-6 z-40 bg-[#221D19]/95 hover:bg-[#2C241E] border border-antique-gold/50 hover:border-antique-gold text-warm-ivory rounded-full pl-4 pr-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md flex items-center gap-3 text-xs font-sans transition-all duration-300 group hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
          aria-label="View Genesis Batch 001 Allocation Status"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-antique-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-antique-gold" />
          </span>
          <span className="font-semibold text-antique-gold tracking-[0.2em] uppercase text-[10px]">
            GENESIS BATCH 001
          </span>
          <span className="text-champagne/60 text-[11px]">·</span>
          <span className="text-champagne/90 font-serif tracking-wide text-xs">
            <strong className="text-warm-ivory font-medium">{REMAINING_COUNT}</strong> of {TOTAL_ALLOCATION} Flacons Remain
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-antique-gold group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* =========================================================================
          2. EARLY LAUNCH MODAL OVERLAY (Haute Parfumerie Editorial Theme)
         ========================================================================= */}
      {isOpen && (
        <div
          id="early-launch-backdrop"
          className="fixed inset-0 z-50 bg-[#120F0D]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
          onClick={handleDismiss}
        >
          <div
            id="early-launch-dialog"
            className="w-full max-w-2xl max-h-[90vh] flex flex-col my-auto bg-[#1E1915] border border-[#3B332B] hover:border-antique-gold/50 rounded-xl shadow-[0_24px_80px_rgba(0,0,0,0.95)] text-warm-ivory relative overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="early-launch-title"
          >
            {/* Subtle Atelier Gold Spotlight Halo */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[220px] bg-radial from-antique-gold/15 via-transparent to-transparent blur-3xl pointer-events-none" />

            {/* Top Close Button */}
            <button
              type="button"
              id="early-launch-close-btn"
              onClick={handleDismiss}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-8 h-8 rounded-full bg-[#2A241F] hover:bg-[#382F28] border border-[#3B332B] hover:border-antique-gold flex items-center justify-center text-champagne/80 hover:text-warm-ivory transition-all cursor-pointer"
              aria-label="Close Early Launch Announcement"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto px-5 sm:px-8 pt-7 pb-6 space-y-6">
              {/* Header Status & Brand Mark */}
              <div className="text-center space-y-2.5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A241F] border border-antique-gold/40 text-antique-gold text-[9.5px] sm:text-[10px] font-sans font-semibold tracking-[0.26em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-antique-gold animate-pulse" />
                  <span>INAUGURAL RELEASE · GENESIS BATCH 001</span>
                </div>

                <h2
                  id="early-launch-title"
                  className="font-serif text-2xl sm:text-3xl lg:text-4xl text-warm-ivory font-normal tracking-[0.12em] uppercase"
                >
                  STRICTLY FIRST 500 PERFUMES
                </h2>

                <div className="w-12 h-[1px] bg-antique-gold mx-auto" />

                <p className="text-xs sm:text-sm text-champagne/80 font-sans max-w-lg mx-auto leading-relaxed font-light">
                  Welcome to the official debut of <strong className="text-warm-ivory font-medium">Elora Haute Parfumerie</strong>.
                  To safeguard an uncompromising 25% pure oil concentration, our inaugural allocation is strictly limited
                  to 500 individually numbered flacons.
                </p>
              </div>

              {/* =================================================================
                  ALLOCATION PROGRESS BAR (Quiet Luxury Minimalist Meter)
                 ================================================================= */}
              <div className="bg-[#241F1A] border border-[#3B332B] rounded-lg p-4 sm:p-5 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-antique-gold text-xs font-sans tracking-[0.18em] uppercase font-semibold">
                    <Crown className="w-3.5 h-3.5 text-antique-gold" />
                    <span>INAUGURAL BATCH ALLOCATION</span>
                  </div>
                  <div className="text-xs font-sans text-warm-ivory">
                    <span className="text-antique-gold font-semibold text-sm">{CLAIMED_COUNT}</span>
                    <span className="text-champagne/60"> / {TOTAL_ALLOCATION} Claimed</span>
                    <span className="ml-2 font-medium text-warm-ivory bg-antique-gold/15 px-2 py-0.5 rounded border border-antique-gold/30 text-[11px]">
                      {REMAINING_COUNT} Flacons Remain
                    </span>
                  </div>
                </div>

                {/* Refined Gold Leaf Progress Bar */}
                <div className="w-full h-2 bg-deep-espresso rounded-full border border-[#3B332B] overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#9A7D45] via-antique-gold to-champagne rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(185,154,98,0.4)]"
                    style={{ width: `${(CLAIMED_COUNT / TOTAL_ALLOCATION) * 100}%` }}
                  />
                </div>

                {/* Sub-metrics */}
                <div className="flex items-center justify-between mt-3 text-[10px] sm:text-[11px] font-sans text-champagne/60">
                  <span className="flex items-center gap-1.5 text-champagne/80">
                    <Sparkles className="w-3 h-3 text-antique-gold" />
                    83.6% of Genesis Batch 001 allocated
                  </span>
                  <span className="text-antique-gold font-medium tracking-wider uppercase">
                    18 connoisseurs currently in allocation queue
                  </span>
                </div>
              </div>

              {/* =================================================================
                  THE ARTISANAL WAIT TIME EXPLANATION
                 ================================================================= */}
              <div className="bg-[#221D18] border border-[#3B332B] rounded-lg p-4 sm:p-5 space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#2D2620] border border-antique-gold/40 flex items-center justify-center shrink-0 text-antique-gold mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base text-warm-ivory tracking-[0.06em] font-normal uppercase">
                      Why is there a wait time for Batch 001?
                    </h3>
                    <p className="text-xs text-champagne/80 font-sans leading-relaxed font-light">
                      Elora flacons are never mass-manufactured. Each creation is formulated with an
                      ultra-potent <strong className="text-warm-ivory font-medium">25% pure Extrait de Parfum concentration</strong> and
                      undergoes an unhurried 60-day cold maceration in Grasse and Kannauj.
                      Genesis Batch orders receive priority bottling, handwritten numbered archival cards, and expedited courier dispatch.
                    </p>
                  </div>
                </div>

                {/* Dispatch Cadence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-sans">
                  <div className="p-3 bg-[#2A241F] border border-[#3B332B] rounded flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-antique-gold shrink-0 animate-pulse" />
                    <div>
                      <div className="text-[9.5px] uppercase tracking-[0.2em] text-champagne/60">
                        Genesis Dispatch Window
                      </div>
                      <div className="text-warm-ivory font-medium font-serif text-sm">
                        Departs in 5–7 Business Days
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#2A241F] border border-[#3B332B] rounded flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-champagne/40 shrink-0" />
                    <div>
                      <div className="text-[9.5px] uppercase tracking-[0.2em] text-champagne/60">
                        Next Batch 002 Distillation
                      </div>
                      <div className="text-champagne/80 text-xs font-sans">
                        Opens following final Batch 001 claim
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================================
                  INAUGURAL BATCH PRIVILEGES (Clean 3-Column Luxury Cards)
                 ================================================================= */}
              <div className="space-y-2">
                <div className="text-[9.5px] uppercase tracking-[0.26em] text-antique-gold font-sans font-semibold">
                  PRIVILEGES CONFERRED ON INAUGURAL PATRONS:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 bg-[#241F1A] border border-[#3B332B] rounded text-center space-y-1">
                    <Award className="w-4 h-4 text-antique-gold mx-auto" />
                    <div className="font-serif text-xs text-warm-ivory uppercase tracking-wide">
                      Numbered Certificate
                    </div>
                    <div className="text-[10px] text-champagne/70 font-sans">
                      Hand-stamped #001 to #500
                    </div>
                  </div>

                  <div className="p-3 bg-[#241F1A] border border-[#3B332B] rounded text-center space-y-1">
                    <Gift className="w-4 h-4 text-antique-gold mx-auto" />
                    <div className="font-serif text-xs text-warm-ivory uppercase tracking-wide">
                      Complimentary 2ml Vial
                    </div>
                    <div className="text-[10px] text-champagne/70 font-sans">
                      Test on skin prior to opening
                    </div>
                  </div>

                  <div className="p-3 bg-[#241F1A] border border-[#3B332B] rounded text-center space-y-1">
                    <ShieldCheck className="w-4 h-4 text-antique-gold mx-auto" />
                    <div className="font-serif text-xs text-warm-ivory uppercase tracking-wide">
                      30-Day Guarantee
                    </div>
                    <div className="text-[10px] text-champagne/70 font-sans">
                      Complimentary returns & exchange
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================================
                  VOUCHER CODE BAR
                 ================================================================= */}
              <div className="p-3.5 bg-[#241F1A] border border-antique-gold/35 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <div className="text-[9px] uppercase tracking-[0.24em] text-antique-gold font-sans font-semibold">
                    INAUGURAL ACQUISITION PRIVILEGE
                  </div>
                  <div className="text-xs text-warm-ivory font-sans pt-0.5">
                    Receive <strong className="text-antique-gold font-serif text-sm">15% OFF</strong> your first Genesis Batch flacon
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs tracking-wider bg-deep-espresso text-antique-gold px-3 py-1.5 rounded border border-antique-gold/40 font-semibold">
                    EARLY500
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded bg-warm-ivory text-deep-espresso hover:bg-champagne text-[10.5px] font-sans uppercase tracking-[0.14em] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'APPLIED' : 'APPLY CODE'}</span>
                  </button>
                </div>
              </div>

              {/* Inaugural Trio Flacon Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10.5px] font-sans text-champagne/70">
                  <span className="uppercase tracking-[0.2em]">Select an inaugural flacon:</span>
                  <span className="text-antique-gold font-serif">₹1,499 – ₹1,999</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {launchProducts.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedFragranceIndex(idx);
                        handleSelectProduct(p.slug);
                      }}
                      className={`p-3 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                        selectedFragranceIndex === idx
                          ? 'bg-[#2A241F] border-antique-gold shadow-lg shadow-black/40'
                          : 'bg-[#221D18] border-[#3B332B] hover:border-antique-gold/50'
                      }`}
                    >
                      <div className="w-10 h-14 mx-auto mb-2">
                        <EloraBottleVisualizer product={p} size="sm" showPedestal={false} />
                      </div>
                      <div className="text-[11px] font-serif uppercase tracking-wide text-warm-ivory text-center truncate font-medium">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-antique-gold text-center font-sans mt-0.5">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ===================================================================
                MODAL ACTIONS FOOTER (Consistent Editorial Actions)
               =================================================================== */}
            <div className="p-4 sm:p-5 border-t border-[#3B332B] bg-[#1A1612] flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              {/* Remember preference checkbox */}
              <label className="flex items-center gap-2 text-[11px] text-champagne/80 hover:text-warm-ivory cursor-pointer select-none font-sans transition-colors">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded border-[#3B332B] bg-deep-espresso text-antique-gold focus:ring-0 w-3.5 h-3.5 accent-antique-gold"
                />
                <span>Do not display this launch briefing again</span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-1/2 sm:w-auto px-4 py-3 text-xs font-sans uppercase tracking-[0.2em] text-champagne/80 hover:text-warm-ivory transition-colors cursor-pointer text-center"
                >
                  Browse First
                </button>

                <button
                  type="button"
                  id="early-launch-claim-btn"
                  onClick={handleClaimNow}
                  className="w-1/2 sm:w-auto bg-antique-gold hover:bg-champagne text-deep-espresso px-6 py-3 rounded text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all shadow-[0_4px_20px_rgba(185,154,98,0.25)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Claim Batch 001</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
