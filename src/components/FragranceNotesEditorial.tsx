import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export const FragranceNotesEditorial: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState<string>('aura');
  const currentProduct = PRODUCTS.find((p) => p.slug === selectedSlug) || PRODUCTS[0];

  return (
    <section
      id="fragrance-notes-editorial"
      aria-label="Olfactory Architecture & Fragrance Notes"
      className="py-24 sm:py-32 bg-[#0A0A0C] border-b border-[#24232C] relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] uppercase tracking-[0.36em] text-[#A1A1AA] font-sans font-medium">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>OLFACTORY ARCHITECTURE</span>
          </div>

          <h2 className="font-serif text-fluid-h2 text-[#FFFFFF] tracking-[0.06em] uppercase font-normal">
            THE ANATOMY OF SCENT
          </h2>

          <p className="text-xs sm:text-sm text-[#D4D4D8] font-sans font-light max-w-md mx-auto leading-relaxed">
            Every Elora formulation unfolds across three deliberate temporal chapters on warm skin.
          </p>

          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto pt-2" />

          {/* Fragrance Selector Tabs */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {PRODUCTS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedSlug(p.slug)}
                className={`text-xs uppercase tracking-[0.22em] font-serif py-1 px-3 transition-all duration-300 relative ${
                  selectedSlug === p.slug
                    ? 'text-[#D4AF37] font-semibold border-b-2 border-[#D4AF37]'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Pyramid Cards / Three Temporal Stages */}
        <div className="space-y-8 sm:space-y-10 max-w-3xl mx-auto">
          
          {/* 1. TOP NOTES */}
          <div className="bg-[#14141B] border border-[#262633] p-8 sm:p-10 rounded-2xl transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)] text-center relative">
            <span className="text-[9px] uppercase tracking-[0.32em] text-[#D4AF37] font-sans block mb-2 font-medium">
              CHAPTER I · 0 TO 30 MINUTES
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] uppercase tracking-[0.1em] font-normal mb-4">
              TOP NOTES
            </h3>
            <p className="font-serif text-lg sm:text-xl text-[#FAF9F6] tracking-[0.06em] uppercase leading-relaxed max-w-xl mx-auto">
              {currentProduct.notes.top.join('  ·  ')}
            </p>
            <span className="text-[11px] text-[#A1A1AA] font-sans block mt-3 font-light italic">
              The luminous initial awakening, distilled to evaporate with brilliance.
            </span>
          </div>

          {/* Subtle connecting divider */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-[1px] bg-[#262633]" />
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <div className="w-12 h-[1px] bg-[#262633]" />
          </div>

          {/* 2. HEART NOTES */}
          <div className="bg-[#14141B] border border-[#262633] p-8 sm:p-10 rounded-2xl transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)] text-center relative">
            <span className="text-[9px] uppercase tracking-[0.32em] text-[#D4AF37] font-sans block mb-2 font-medium">
              CHAPTER II · 1 TO 6 HOURS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] uppercase tracking-[0.1em] font-normal mb-4">
              HEART NOTES
            </h3>
            <p className="font-serif text-lg sm:text-xl text-[#FAF9F6] tracking-[0.06em] uppercase leading-relaxed max-w-xl mx-auto">
              {currentProduct.notes.heart.join('  ·  ')}
            </p>
            <span className="text-[11px] text-[#A1A1AA] font-sans block mt-3 font-light italic">
              The signature soul of the fragrance, projecting your presence into the room.
            </span>
          </div>

          {/* Subtle connecting divider */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-[1px] bg-[#262633]" />
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <div className="w-12 h-[1px] bg-[#262633]" />
          </div>

          {/* 3. BASE NOTES */}
          <div className="bg-[#14141B] border border-[#262633] p-8 sm:p-10 rounded-2xl transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)] text-center relative">
            <span className="text-[9px] uppercase tracking-[0.32em] text-[#D4AF37] font-sans block mb-2 font-medium">
              CHAPTER III · 8 TO 16+ HOURS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] uppercase tracking-[0.1em] font-normal mb-4">
              BASE NOTES
            </h3>
            <p className="font-serif text-lg sm:text-xl text-[#FAF9F6] tracking-[0.06em] uppercase leading-relaxed max-w-xl mx-auto">
              {currentProduct.notes.base.join('  ·  ')}
            </p>
            <span className="text-[11px] text-[#A1A1AA] font-sans block mt-3 font-light italic">
              Heavy woods, golden resins, and amber that anchor to skin and fabric forever.
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
