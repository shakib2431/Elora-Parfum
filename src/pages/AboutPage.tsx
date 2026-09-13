import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Globe, Shield, Award } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { EloraBottleVisualizer } from '../components/EloraBottleVisualizer';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="about-elora-page" className="bg-[#F5F2EC] text-[#171614] min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 sm:py-28 border-b border-[#D7D1C7] text-center px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.32em] text-[#68645E] font-sans font-medium block">
            Our Heritage & Ethos
          </span>
          <h1 className="font-serif text-fluid-h1 tracking-[0.06em] uppercase font-normal text-[#171614]">
            THE HOUSE OF ELORA
          </h1>
          <div className="w-12 h-[1px] bg-[#A88A5A] mx-auto my-3" />
          <p className="text-base sm:text-lg text-[#68645E] font-serif italic max-w-xl mx-auto leading-relaxed">
            "We do not create fragrances to follow fleeting trends. We formulate olfactory monuments that anchor moments into eternity."
          </p>
        </div>
      </section>

      {/* Main Narrative Section */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A88A5A] font-sans font-semibold">
              The Genesis
            </span>
            <h2 className="font-serif text-fluid-h2 text-[#171614] font-normal leading-tight">
              A Dialogue Between Grasse and the Orient
            </h2>
            <p className="text-xs sm:text-sm text-[#68645E] font-sans leading-relaxed">
              Founded on the belief that modern perfumery has surrendered its soul to industrial mass-production, Elora Parfum was created as an independent house of haute parfumerie. We sought to reconcile two legendary fragrance lineages: the structural balance of French distillation and the spiritual depth of Eastern resins.
            </p>
            <p className="text-xs sm:text-sm text-[#68645E] font-sans leading-relaxed">
              Every formula originates in Grasse, France, where night-blooming jasmine and solar bergamot are gathered at first light, before being harmonized in our atelier with aged wild agarwood and amber reserves.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#D7D1C7] p-8 sm:p-12 shadow-[0_8px_30px_rgba(23,22,20,0.03)] flex items-center justify-center">
            <div className="w-52 h-72 flex items-center justify-center">
              <EloraBottleVisualizer product={PRODUCTS[0]} size="lg" showPedestal={true} />
            </div>
          </div>
        </div>

        {/* 25% Concentration Standard */}
        <div className="bg-[#FAF8F5] border border-[#D7D1C7] p-8 sm:p-14 space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <Droplets className="w-7 h-7 text-[#A88A5A] mx-auto stroke-[1.5]" />
            <h3 className="font-serif text-2xl sm:text-3xl tracking-[0.06em] text-[#171614] uppercase font-normal">
              THE 25% EXTRAIT STANDARD
            </h3>
            <p className="text-xs sm:text-sm text-[#68645E] font-sans leading-relaxed">
              Commercial designer perfumes typically dilute fragrance oils to 10%–14%. Elora Parfum formulates exclusively at 25% pure extractive concentration. This density creates an intimate sillage that evolves gently with body heat and endures past fourteen hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#D7D1C7] text-center">
            <div className="space-y-1">
              <span className="font-serif text-2xl text-[#171614]">56 Days</span>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#68645E] font-sans">
                Cold Maceration Period
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-2xl text-[#171614]">Grasse, FR</span>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#68645E] font-sans">
                Botanical Provenance
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-2xl text-[#171614]">Small Batch</span>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#68645E] font-sans">
                Numbered Reserve Editions
              </p>
            </div>
          </div>
        </div>

        {/* Final Quote & CTA */}
        <div className="text-center space-y-6 pt-4">
          <p className="font-serif text-2xl sm:text-3xl text-[#171614] italic max-w-xl mx-auto">
            "Your fragrance is the invisible garment of your presence."
          </p>
          <div>
            <Link
              to="/collections/shop-all"
              className="inline-block px-10 py-4 bg-[#171614] text-[#F5F2EC] hover:bg-[#2D2B27] text-xs uppercase tracking-[0.24em] font-sans transition-all duration-300"
            >
              Explore The Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
