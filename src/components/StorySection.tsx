import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';

export const StorySection: React.FC = () => {
  const storyProduct = PRODUCTS[0]; // Aura - Luminous floral flacon

  return (
    <section
      id="house-of-elora-story"
      aria-label="The House of Elora Story and Manifesto"
      className="py-24 sm:py-36 bg-[#0A0A0C] text-[#FAF9F6] border-b border-[#24232C] relative overflow-hidden"
    >
      {/* Editorial Watermark */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <span className="absolute -bottom-16 right-4 text-[140px] sm:text-[220px] font-serif font-normal text-[#1C1A24]/30 uppercase tracking-[0.2em] leading-none">
          ATELIER
        </span>
      </div>

      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: ARTISTIC PERFUME / BOTANICAL ATELIER STAGE */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-3xl bg-gradient-to-b from-[#181722] via-[#121219] to-[#0D0D12] border border-[#2B2A36] shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-8 flex items-center justify-center overflow-hidden">
              {/* Warm Botanical Halo */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-2xl pointer-events-none" />
              <div className="absolute bottom-4 inset-x-8 h-24 bg-gradient-to-t from-[#D4AF37]/20 to-transparent blur-xl pointer-events-none" />

              {/* Central Flacon on Pedestal */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <EloraBottleVisualizer product={storyProduct} size="lg" showPedestal={true} />
              </div>

              {/* Atelier Caption Seal */}
              <div className="absolute top-6 left-6 flex items-center space-x-2 text-[9px] uppercase tracking-[0.3em] font-sans text-[#A1A1AA]">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>ATELIER GRASSE · FLACON RESERVE</span>
              </div>

              <div className="absolute bottom-6 inset-x-6 flex items-center justify-between text-[9px] uppercase tracking-[0.24em] font-sans text-[#A1A1AA] border-t border-[#24232C] pt-3">
                <span>HAND-POURED ARCHITECTURAL FLACON</span>
                <span className="text-[#D4AF37]">EST. 2024</span>
              </div>
            </div>
          </div>

          {/* RIGHT: SPLIT EDITORIAL TYPOGRAPHY */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.34em] text-[#A1A1AA] font-sans font-medium block">
                HAUTE PARFUMERIE PHILOSOPHY
              </span>

              <h2 className="font-serif text-fluid-h2 text-[#FFFFFF] tracking-[0.06em] uppercase font-normal">
                THE HOUSE OF ELORA
              </h2>
            </div>

            {/* The 3 Core Serif Statements */}
            <div className="space-y-2.5 py-3 border-y border-[#24232C]">
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FFFFFF] tracking-[0.04em] uppercase font-normal leading-tight">
                FRAGRANCE IS MEMORY.
              </p>
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#D4AF37] tracking-[0.04em] uppercase font-normal leading-tight italic">
                FRAGRANCE IS PRESENCE.
              </p>
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FFFFFF] tracking-[0.04em] uppercase font-normal leading-tight">
                FRAGRANCE IS IDENTITY.
              </p>
            </div>

            {/* Narrative Paragraph */}
            <p className="text-sm sm:text-base text-[#D4D4D8] font-sans font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
              In an era of disposable synthetic trends, Elora honors the classical mastery of haute parfumerie. We steep wild botanicals, noble resins, and cold-pressed absolutes for eight unhurried weeks, formulating at an elevated 25% pure perfume oil concentration so each flacon leaves an indelible personal signature.
            </p>

            {/* 4 Atelier Pillars */}
            <div className="grid grid-cols-2 gap-6 pt-2 text-left">
              <div className="space-y-1 border-l border-[#D4AF37] pl-3.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#FAF9F6] font-semibold block">
                  25% EXTRAIT RATIO
                </span>
                <span className="text-xs text-[#A1A1AA] font-sans font-light block">
                  Lasting sillage across 14 to 16+ hours.
                </span>
              </div>

              <div className="space-y-1 border-l border-[#D4AF37] pl-3.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#FAF9F6] font-semibold block">
                  ETHICAL BOTANICALS
                </span>
                <span className="text-xs text-[#A1A1AA] font-sans font-light block">
                  Grasse harvests & wild-foraged agarwood.
                </span>
              </div>
            </div>

            {/* Read Manifesto Link */}
            <div className="pt-2">
              <Link
                to="/pages/about"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.24em] font-sans text-[#FAF9F6] hover:text-[#D4AF37] py-2 border-b border-[#D4AF37] hover:border-[#FAF9F6] transition-colors"
              >
                <span>READ THE ATELIER MANIFESTO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
