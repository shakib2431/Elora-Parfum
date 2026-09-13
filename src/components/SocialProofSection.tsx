import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export const SocialProofSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        'Noir is quite simply intoxicating. I wore it to an evening gala in Paris, and three strangers paused to ask for the name of the house. The sillage endures gracefully until the following morning.',
      author: 'Éléonore de Montmirail',
      city: 'Paris',
      flacon: 'NOIR · 100ML EXTRAIT',
      rating: 5,
    },
    {
      id: 2,
      quote:
        'Aura feels like walking through sun-warmed linen, crisp citrus groves, and blooming white iris. It is intimate, clean, yet remarkably persistent without being overpowering.',
      author: 'Marcus Vance',
      city: 'London',
      flacon: 'AURA · 100ML EXTRAIT',
      rating: 5,
    },
    {
      id: 3,
      quote:
        'The weighty architectural glass, the brushed brass cap, and the pure 25% oil concentration—everything feels like high jewellery. Oud Élite is the finest oud in my collection.',
      author: 'Aarav Singhania',
      city: 'Mumbai',
      flacon: 'OUD ÉLITE · 100ML EXTRAIT',
      rating: 5,
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const current = testimonials[activeIdx];

  const prev = () => setActiveIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const next = () => setActiveIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

  return (
    <section
      id="elora-experience-reviews"
      aria-label="The Elora Experience Patron Reviews"
      className="py-24 sm:py-32 bg-[#0A0A0C] border-b border-[#24232C] relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.36em] text-[#A1A1AA] font-sans font-medium block">
            PATRON TESTIMONIALS
          </span>
          <h2 className="font-serif text-fluid-h2 text-[#FFFFFF] tracking-[0.06em] uppercase font-normal">
            THE ELORA EXPERIENCE
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto pt-2" />
        </div>

        {/* Featured Editorial Testimonial Card */}
        <div className="max-w-3xl mx-auto bg-[#14141B] border border-[#262633] rounded-3xl p-8 sm:p-14 shadow-[0_16px_40px_rgba(0,0,0,0.7)] text-center relative">
          
          {/* Subtle 5-Star Rating */}
          <div className="flex items-center justify-center space-x-1 mb-6">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
            ))}
          </div>

          {/* Large Quotation */}
          <blockquote className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-[#FAF9F6] leading-relaxed mb-8">
            "{current.quote}"
          </blockquote>

          {/* Patron Details */}
          <div className="space-y-1">
            <cite className="not-italic font-sans text-xs uppercase tracking-[0.24em] text-[#FFFFFF] font-semibold block">
              {current.author}
            </cite>
            <span className="text-[11px] font-sans text-[#A1A1AA] tracking-[0.14em] uppercase block">
              {current.city} · Verified Patron
            </span>
            <span className="inline-block text-[9.5px] uppercase tracking-[0.2em] font-sans text-[#D4AF37] pt-1">
              Acquired {current.flacon}
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#262633]">
            <button
              type="button"
              onClick={prev}
              className="p-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIdx === idx ? 'w-6 bg-[#D4AF37]' : 'bg-[#262633] hover:bg-[#A1A1AA]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="p-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
