import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';

export const SignatureCollectionEditorial: React.FC = () => {
  const aura = PRODUCTS.find((p) => p.slug === 'aura') || PRODUCTS[0];
  const noir = PRODUCTS.find((p) => p.slug === 'noir') || PRODUCTS[1];
  const eclat = PRODUCTS.find((p) => p.slug === 'eclat') || PRODUCTS[2];

  const [activeFlacon, setActiveFlacon] = useState<'aura' | 'noir' | 'eclat'>('aura');

  const getActiveProduct = () => {
    if (activeFlacon === 'noir') return noir;
    if (activeFlacon === 'eclat') return eclat;
    return aura;
  };

  const current = getActiveProduct();

  return (
    <section
      id="signature-collection-editorial"
      aria-label="The Signature Collection Editorial Spread"
      className="py-24 sm:py-32 bg-[#0A0A0C] border-b border-[#24232C] relative overflow-hidden"
    >
      {/* Editorial Watermark & Architectural Lines */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute -top-12 -left-10 text-[130px] sm:text-[200px] font-serif font-normal text-[#1C1B24]/50 uppercase tracking-[0.2em] leading-none pointer-events-none">
          ELORA
        </span>
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-6 border-b border-[#24232C]">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] uppercase tracking-[0.36em] text-[#A1A1AA] font-sans font-medium">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>EDITORIAL CAMPAIGN · VOL. IV</span>
            </div>
            <h2 className="font-serif text-fluid-h1 text-[#FFFFFF] tracking-[0.05em] uppercase font-normal">
              THE SIGNATURE COLLECTION
            </h2>
          </div>

          <p className="mt-4 lg:mt-0 text-xs sm:text-sm text-[#D4D4D8] font-sans font-light max-w-md leading-relaxed">
            Three foundational expressions of emotion, light, and shadow. Crafted with elevated botanical absolutes and unhurried maceration.
          </p>
        </div>

        {/* Asymmetric Magazine Double-Spread Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT: HERO FEATURED FLACON (Large Stage) */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-3xl bg-[#14141B] border border-[#262633] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Backlight highlight */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#262633] relative z-10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA] font-sans block">
                    FEATURED ESSENCE
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF] uppercase tracking-[0.08em] font-normal mt-1">
                    {current.name}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-sans tracking-[0.16em] uppercase text-[#D4AF37] block font-medium">
                    {current.category}
                  </span>
                  <span className="font-serif italic text-xs text-[#A1A1AA]">
                    25% Haute Extrait
                  </span>
                </div>
              </div>

              {/* Large Bottle Stage with Pedestal and Shadow */}
              <div className="relative aspect-[4/5] max-h-[460px] mx-auto my-6 flex items-center justify-center">
                <Link to={`/products/${current.slug}`} className="group block">
                  <div className="transform group-hover:scale-[1.03] transition-transform duration-700 ease-out">
                    <EloraBottleVisualizer product={current} size="lg" showPedestal={true} />
                  </div>
                </Link>
              </div>

              {/* Editorial Quote & Notes */}
              <div className="pt-6 border-t border-[#262633] grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <p className="font-serif italic text-sm sm:text-base text-[#FAF9F6] leading-relaxed">
                    "{current.editorialQuote || current.tagline}"
                  </p>
                </div>
                <div className="sm:text-right">
                  <Link
                    to={`/products/${current.slug}`}
                    className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.24em] font-sans text-[#D4AF37] hover:text-[#FFFFFF] transition-colors py-2 border-b border-[#D4AF37] hover:border-[#FFFFFF]"
                  >
                    <span>EXPLORE {current.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: TWO OFFSET STAGGERED FLACONS */}
          <div className="lg:col-span-5 space-y-8">
            {/* Flacon Item: AURA */}
            <div
              onClick={() => setActiveFlacon('aura')}
              className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 cursor-pointer border ${
                activeFlacon === 'aura'
                  ? 'bg-[#181822] border-[#D4AF37] shadow-[0_12px_32px_rgba(212,175,55,0.12)]'
                  : 'bg-[#14141B]/80 border-[#262633] hover:bg-[#181822] hover:border-[#D4AF37]/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-sans">
                    I · SOLAR FLORAL
                  </span>
                  <h4 className="font-serif text-2xl text-[#FFFFFF] uppercase tracking-[0.06em]">
                    AURA
                  </h4>
                  <p className="text-xs text-[#A1A1AA] font-sans font-light">
                    Calabrian Bergamot · White Iris · Grasse Jasmine
                  </p>
                </div>
                <div className="w-24 h-28 flex items-center justify-center shrink-0">
                  <EloraBottleVisualizer product={aura} size="sm" showPedestal={false} />
                </div>
              </div>
            </div>

            {/* Flacon Item: NOIR */}
            <div
              onClick={() => setActiveFlacon('noir')}
              className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 cursor-pointer border ${
                activeFlacon === 'noir'
                  ? 'bg-[#181822] border-[#D4AF37] shadow-[0_12px_32px_rgba(212,175,55,0.12)]'
                  : 'bg-[#14141B]/80 border-[#262633] hover:bg-[#181822] hover:border-[#D4AF37]/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-sans">
                    II · SMOKY AMBER
                  </span>
                  <h4 className="font-serif text-2xl text-[#FFFFFF] uppercase tracking-[0.06em]">
                    NOIR
                  </h4>
                  <p className="text-xs text-[#A1A1AA] font-sans font-light">
                    Cardamom Pods · Black Tea · Smoked Labdanum
                  </p>
                </div>
                <div className="w-24 h-28 flex items-center justify-center shrink-0">
                  <EloraBottleVisualizer product={noir} size="sm" showPedestal={false} />
                </div>
              </div>
            </div>

            {/* Flacon Item: ÉCLAT */}
            <div
              onClick={() => setActiveFlacon('eclat')}
              className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 cursor-pointer border ${
                activeFlacon === 'eclat'
                  ? 'bg-[#181822] border-[#D4AF37] shadow-[0_12px_32px_rgba(212,175,55,0.12)]'
                  : 'bg-[#14141B]/80 border-[#262633] hover:bg-[#181822] hover:border-[#D4AF37]/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-sans">
                    III · CITRUS MINERAL
                  </span>
                  <h4 className="font-serif text-2xl text-[#FFFFFF] uppercase tracking-[0.06em]">
                    ÉCLAT
                  </h4>
                  <p className="text-xs text-[#A1A1AA] font-sans font-light">
                    Amalfi Lemon · Sea Mineral Breeze · White Cedar
                  </p>
                </div>
                <div className="w-24 h-28 flex items-center justify-center shrink-0">
                  <EloraBottleVisualizer product={eclat} size="sm" showPedestal={false} />
                </div>
              </div>
            </div>

            {/* Editorial Discovery Link */}
            <div className="pt-2 text-center sm:text-left">
              <Link
                to="/collections/signature"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.24em] font-sans text-[#FAF9F6] hover:text-[#D4AF37] transition-colors"
              >
                <span>View Full Signature Anthology</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
