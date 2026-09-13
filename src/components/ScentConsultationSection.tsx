import React, { useState } from 'react';
import { Sparkles, ArrowRight, Compass, HeartHandshake, Award } from 'lucide-react';
import { ScentProfilerModal } from './ScentProfilerModal';

export const ScentConsultationSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        id="scent-consultation-section"
        aria-label="A Private Fragrance Consultation"
        className="py-24 sm:py-32 bg-[#0A0A0C] border-b border-[#24232C] relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1080px] mx-auto px-6 sm:px-10 relative z-10">
          <div className="bg-[#14141B] border border-[#262633] rounded-3xl p-8 sm:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-center relative overflow-hidden">
            
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-6 left-6 text-[8.5px] uppercase tracking-[0.3em] font-sans text-[#A1A1AA] hidden sm:block">
              CONFIDENTIAL · ATELIER DIRECT
            </div>
            <div className="absolute top-6 right-6 text-[8.5px] uppercase tracking-[0.3em] font-sans text-[#A1A1AA] hidden sm:block">
              BESPOKE CURATION
            </div>

            {/* Emblem */}
            <div className="w-14 h-14 rounded-full bg-[#1E1C28] border border-[#D4AF37] mx-auto flex items-center justify-center mb-6 text-[#D4AF37] shadow-sm">
              <Compass className="w-6 h-6 stroke-[1.2] text-[#D4AF37]" />
            </div>

            {/* Eyebrow & Headings */}
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.36em] text-[#A1A1AA] font-sans font-medium block mb-3">
              A PRIVATE FRAGRANCE CONSULTATION
            </span>

            <h2 className="font-serif text-fluid-h2 text-[#FFFFFF] tracking-[0.05em] uppercase font-normal max-w-xl mx-auto">
              FIND YOUR SIGNATURE SCENT
            </h2>

            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto my-5" />

            <p className="text-sm sm:text-base text-[#D4D4D8] font-sans font-light max-w-xl mx-auto leading-relaxed mb-8">
              Every individual possesses a distinct olfactory silhouette. Answer four sensory questions regarding your temperament, preferred ambiance, and skin chemistry to reveal your quintessential Elora flacon.
            </p>

            {/* 3 Steps Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-10 text-left border-y border-[#262633] py-6">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.24em] font-sans text-[#D4AF37] block">
                  STEP 01
                </span>
                <span className="text-xs font-serif text-[#FFFFFF] block uppercase font-medium">
                  Sensory Temperament
                </span>
                <span className="text-[11px] text-[#A1A1AA] font-sans block font-light">
                  Light florals, solar citrus, or smoky woods.
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.24em] font-sans text-[#D4AF37] block">
                  STEP 02
                </span>
                <span className="text-xs font-serif text-[#FFFFFF] block uppercase font-medium">
                  Occasion & Sillage
                </span>
                <span className="text-[11px] text-[#A1A1AA] font-sans block font-light">
                  Daylight discretion or midnight magnetism.
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.24em] font-sans text-[#D4AF37] block">
                  STEP 03
                </span>
                <span className="text-xs font-serif text-[#FFFFFF] block uppercase font-medium">
                  Bespoke Recommendation
                </span>
                <span className="text-[11px] text-[#A1A1AA] font-sans block font-light">
                  Curated pairing with complementary samples.
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                id="begin-consultation-btn"
                className="group inline-flex items-center space-x-3 px-10 py-4 bg-[#D4AF37] text-[#0A0A0C] hover:bg-[#E5C378] text-xs uppercase tracking-[0.26em] font-sans font-semibold transition-all duration-300 shadow-[0_6px_25px_rgba(212,175,55,0.25)]"
              >
                <span>BEGIN CONSULTATION</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0A0A0C] transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#A1A1AA] mt-4">
              COMPLIMENTARY · 2 MINUTES · IMMEDIATE OLFACTORY MATCH
            </p>

          </div>
        </div>
      </section>

      {/* Scent Profiler Modal */}
      <ScentProfilerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
