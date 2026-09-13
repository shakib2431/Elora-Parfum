import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Plus,
  ArrowRight,
  ShoppingBag,
  Zap,
  Check,
  Flame,
  Info,
  Sliders,
} from 'lucide-react';
import { Product, LayeringPairing } from '../types';
import { PRODUCTS } from '../data/products';
import { LAYERING_PAIRINGS } from '../data/layeringData';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';
import { useCart } from '../context/CartContext';
import { useOneClickBuy } from '../context/OneClickBuyContext';

interface LayeringGuideProps {
  currentProduct: Product;
}

export const LayeringGuide: React.FC<LayeringGuideProps> = ({ currentProduct }) => {
  const { addToCart, openCart } = useCart();
  const { openOneClickBuy } = useOneClickBuy();

  // Find complementary pairings that include this fragrance
  const availablePairings = LAYERING_PAIRINGS.filter(
    (p) => p.flacon1Slug === currentProduct.slug || p.flacon2Slug === currentProduct.slug
  );

  // If this product is the discovery set or has no pairings, show pairings with Aura
  const effectivePairings = availablePairings.length > 0 ? availablePairings : LAYERING_PAIRINGS;

  const [selectedPairing, setSelectedPairing] = useState<LayeringPairing>(effectivePairings[0]);
  const [activeTier, setActiveTier] = useState<'all' | 'top' | 'heart' | 'base'>('all');
  const [isDuoAdded, setIsDuoAdded] = useState(false);

  // Determine partner product
  const partnerSlug =
    selectedPairing.flacon1Slug === currentProduct.slug
      ? selectedPairing.flacon2Slug
      : selectedPairing.flacon1Slug;

  const partnerProduct =
    PRODUCTS.find((p) => p.slug === partnerSlug) ||
    PRODUCTS.find((p) => p.slug !== currentProduct.slug) ||
    PRODUCTS[1];

  // Pricing calculation
  const totalRegularPrice = currentProduct.price + partnerProduct.price;
  const duoDiscount = Math.round(totalRegularPrice * 0.15);
  const duoPrice = totalRegularPrice - duoDiscount;

  const handleAddDuoToBag = () => {
    addToCart(currentProduct, 1);
    addToCart(partnerProduct, 1);
    setIsDuoAdded(true);
    setTimeout(() => {
      setIsDuoAdded(false);
      openCart();
    }, 600);
  };

  const handleOneClickDuo = () => {
    openOneClickBuy(
      currentProduct,
      1,
      partnerProduct,
      true,
      selectedPairing.title
    );
  };

  return (
    <section id="layering-guide-module" className="py-16 sm:py-24 bg-[#0E0A16] border-b border-white/10 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Module Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-rose-300 text-xs uppercase tracking-[0.2em] font-sans font-semibold">
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>The Art of Haute Parfumerie</span>
          </div>
          <h2 className="font-serif text-fluid-h2 font-normal text-white">
            Interactive Layering Guide
          </h2>
          <p className="text-sm sm:text-base text-purple-200/70 font-sans leading-relaxed">
            Discover bespoke olfactory chemistry. Our high-concentration extraits are formulated with molecular synergy, allowing you to synthesize custom accords found nowhere else.
          </p>
        </div>

        {/* Pairings Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          <span className="text-[11px] uppercase tracking-widest text-purple-300/60 font-sans font-semibold mr-1">
            Curated Duets:
          </span>
          {effectivePairings.map((pairing) => {
            const isSelected = selectedPairing.id === pairing.id;
            const otherSlug =
              pairing.flacon1Slug === currentProduct.slug ? pairing.flacon2Slug : pairing.flacon1Slug;
            const otherProd = PRODUCTS.find((p) => p.slug === otherSlug);

            return (
              <button
                key={pairing.id}
                type="button"
                onClick={() => setSelectedPairing(pairing)}
                className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-sans font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400/20 via-purple-500/20 to-rose-400/20 border-amber-400/80 text-white shadow-lg ring-1 ring-amber-400/30'
                    : 'bg-[#160F24] border-white/15 text-purple-200/70 hover:text-white hover:border-white/30'
                }`}
              >
                <span>{pairing.title}</span>
                <span className="text-[10px] text-amber-300 font-normal">
                  ({currentProduct.name} + {otherProd?.name || 'Partner'})
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Flacon Fusion Stage (5 cols) */}
          <div className="lg:col-span-5 bg-[#140E20] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl overflow-hidden">
            {/* Vibe Tag & Harmony Score */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                {selectedPairing.vibe}
              </span>
              <div className="flex items-center space-x-1.5 text-xs font-sans font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedPairing.harmonyScore}% Harmony Score</span>
              </div>
            </div>

            {/* Visual Flacons Merging */}
            <div className="py-6 flex items-center justify-center relative">
              {/* Bottle 1 */}
              <div className="flex flex-col items-center transform -rotate-3 transition-transform hover:rotate-0 duration-300 relative z-10">
                <div className="w-28 h-40 sm:w-32 sm:h-44 flex items-center justify-center scale-90">
                  <EloraBottleVisualizer product={currentProduct} size="sm" showPedestal={false} />
                </div>
                <span className="font-serif text-xs font-semibold text-white mt-1">
                  {currentProduct.name}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-purple-300/60 font-sans">
                  Base Foundation
                </span>
              </div>

              {/* Connecting Chemical Fusion Icon */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 via-rose-300 to-purple-400 text-[#120E1A] flex items-center justify-center shadow-xl z-20 mx-[-8px] border-2 border-[#140E20] animate-pulse">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>

              {/* Bottle 2 */}
              <div className="flex flex-col items-center transform rotate-3 transition-transform hover:rotate-0 duration-300 relative z-10">
                <div className="w-28 h-40 sm:w-32 sm:h-44 flex items-center justify-center scale-90">
                  <EloraBottleVisualizer product={partnerProduct} size="sm" showPedestal={false} />
                </div>
                <span className="font-serif text-xs font-semibold text-white mt-1">
                  {partnerProduct.name}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-purple-300/60 font-sans">
                  Complementary Veil
                </span>
              </div>
            </div>

            {/* Ratio & Tip Badge */}
            <div className="mt-6 p-4 rounded-2xl bg-[#1B132B] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-purple-300/70 font-semibold uppercase tracking-wider text-[10px]">
                  Master Perfumer's Ratio:
                </span>
                <span className="font-bold text-amber-300 text-xs">{selectedPairing.recommendedRatio}</span>
              </div>
              <p className="text-[11px] text-purple-200/80 font-sans leading-relaxed italic">
                "{selectedPairing.perfumerTip}"
              </p>
            </div>

            {/* Quick Duo Purchase Bar */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-purple-300/60 font-sans block">
                    Layering Duo Special (15% Off)
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="font-sans text-xl font-bold text-white">
                      ₹{duoPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="font-sans text-xs text-purple-300/50 line-through">
                      ₹{totalRegularPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-emerald-400 bg-emerald-500/15 px-2 py-1 rounded-full border border-emerald-500/30">
                  Save ₹{duoDiscount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="add-layering-duo-btn"
                  onClick={handleAddDuoToBag}
                  className="min-h-[46px] py-2.5 px-4 bg-white text-[#120E1A] font-sans font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/95 transition-all flex items-center justify-center space-x-1.5 shadow-lg"
                >
                  {isDuoAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Duo to Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="one-click-layering-duo-btn"
                  onClick={handleOneClickDuo}
                  className="min-h-[46px] py-2.5 px-4 bg-gradient-to-r from-amber-400 to-rose-400 text-[#120E1A] font-sans font-bold text-xs uppercase tracking-wider rounded-full hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 shadow-xl"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>1-Click Buy Duo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Notes Fusion Anatomy (7 cols) */}
          <div className="lg:col-span-7 bg-[#140E20] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-rose-300">
                Olfactory Synthesis Result
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mt-1">
                "{selectedPairing.title}" Accord
              </h3>
              <p className="text-xs sm:text-sm text-purple-200/80 font-sans mt-2 leading-relaxed">
                {selectedPairing.olfactorySymphony}
              </p>
            </div>

            {/* Note Pyramids Filter Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] uppercase tracking-wider text-purple-300/70 font-sans font-semibold">
                Fused Note Architecture:
              </span>
              <div className="flex items-center space-x-1 bg-[#1A1228] p-1 rounded-xl border border-white/10">
                {(['all', 'top', 'heart', 'base'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setActiveTier(tier)}
                    className={`px-3 py-1 rounded-lg text-[10px] uppercase font-sans font-bold tracking-wider transition-all ${
                      activeTier === tier
                        ? 'bg-white text-[#120E1A] shadow-md'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Note Tier Cards */}
            <div className="space-y-4">
              {/* TOP NOTES COLLISION */}
              {(activeTier === 'all' || activeTier === 'top') && (
                <div className="p-4 rounded-2xl bg-[#1A1228] border border-amber-400/20 hover:border-amber-400/40 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-xs uppercase tracking-wider font-sans font-bold text-amber-300">
                        Top Note Collision · The Initial 15 Minutes
                      </span>
                    </div>
                    <span className="text-[10px] font-sans text-purple-300/60 uppercase">
                      Luminous Volatility
                    </span>
                  </div>
                  <p className="text-xs text-purple-200/70 font-sans">
                    Initial sparkling interaction between sparkling citrus, delicate spices, and aromatic vapors.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedPairing.fusedTopNotes.map((note, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs font-sans font-semibold"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* HEART NOTES HARMONY */}
              {(activeTier === 'all' || activeTier === 'heart') && (
                <div className="p-4 rounded-2xl bg-[#1A1228] border border-rose-400/20 hover:border-rose-400/40 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                      <span className="text-xs uppercase tracking-wider font-sans font-bold text-rose-300">
                        Heart Note Symphony · Hours 1 to 6
                      </span>
                    </div>
                    <span className="text-[10px] font-sans text-purple-300/60 uppercase">
                      Core Sillage
                    </span>
                  </div>
                  <p className="text-xs text-purple-200/70 font-sans">
                    The core identity where rare florals, aged resins, and deep gourmand notes interlock.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedPairing.fusedHeartNotes.map((note, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-rose-400/10 border border-rose-400/30 text-rose-200 text-xs font-sans font-semibold"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* BASE NOTES RESONANCE */}
              {(activeTier === 'all' || activeTier === 'base') && (
                <div className="p-4 rounded-2xl bg-[#1A1228] border border-purple-400/20 hover:border-purple-400/40 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                      <span className="text-xs uppercase tracking-wider font-sans font-bold text-purple-300">
                        Base Note Anchor · Hours 6 to 16+
                      </span>
                    </div>
                    <span className="text-[10px] font-sans text-purple-300/60 uppercase">
                      Enduring Drydown
                    </span>
                  </div>
                  <p className="text-xs text-purple-200/70 font-sans">
                    The long-lasting foundation of precious woods, ambergris, and velvet musks warmed by skin heat.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedPairing.fusedBaseNotes.map((note, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-purple-400/10 border border-purple-400/30 text-purple-200 text-xs font-sans font-semibold"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Molecular Compatibility Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-[#1A1228] border border-white/10 text-center">
                <span className="text-[9px] uppercase tracking-wider text-purple-300/70 font-sans block">
                  Longevity
                </span>
                <span className="font-serif text-base sm:text-lg font-bold text-white">16+ Hours</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#1A1228] border border-white/10 text-center">
                <span className="text-[9px] uppercase tracking-wider text-purple-300/70 font-sans block">
                  Diffusion Trail
                </span>
                <span className="font-serif text-base sm:text-lg font-bold text-white">Magnetic Aura</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#1A1228] border border-white/10 text-center">
                <span className="text-[9px] uppercase tracking-wider text-purple-300/70 font-sans block">
                  Concentration
                </span>
                <span className="font-serif text-base sm:text-lg font-bold text-amber-300">25% Extrait</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
