import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';
import { useCart } from '../context/CartContext';

export const FeaturedFragranceNoir: React.FC = () => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const noirProduct = PRODUCTS.find((p) => p.slug === 'noir') || PRODUCTS[1];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(noirProduct, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <section
      id="featured-fragrance-noir"
      aria-label="Meet Noir - The Scent of Midnight"
      className="relative py-24 sm:py-36 bg-[#0A0A0C] text-[#FAF9F6] overflow-hidden border-b border-[#24232C]"
    >
      {/* Cinematic Night Atmospheric Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Deep amber furnace spotlight behind bottle */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#945827]/25 via-[#D4AF37]/15 to-transparent blur-3xl opacity-75" />
        {/* Smoldering ember glow at top left */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        {/* Subtle radial floor spotlight */}
        <div className="absolute bottom-0 right-10 w-[600px] h-[200px] rounded-full bg-[#D4AF37]/10 blur-2xl" />
        {/* Architectural lines in dark mode */}
        <div className="absolute inset-y-0 left-[10%] w-[1px] bg-[#24232C]/80 hidden lg:block" />
        <div className="absolute inset-y-0 right-[10%] w-[1px] bg-[#24232C]/80 hidden lg:block" />
      </div>

      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: EDITORIAL COPY & EMOTIONAL IMPACT */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] uppercase tracking-[0.38em] text-[#D4AF37] font-sans font-medium">
                <span className="w-6 h-[1px] bg-[#D4AF37]" />
                <span>HAUTE PARFUMERIE · NOCTURNE</span>
              </div>

              <h2 className="font-serif text-fluid-h1 tracking-[0.06em] text-[#FFFFFF] uppercase font-normal leading-[1.08]">
                MEET NOIR <br />
                <span className="italic text-[#D4AF37] font-normal">THE SCENT OF</span> <br />
                MIDNIGHT.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#D4D4D8] font-sans leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
              A nocturnal symphony of wild black cardamom, smoked lapsang tea, and molten amber resin. Conceived for intimate hours, black tie affairs, and lingering presence in dark velvet rooms.
            </p>

            {/* Olfactory Accord Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 pb-2 text-left border-y border-[#24232C] py-5">
              <div>
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#A1A1AA] block font-sans">
                  TOP
                </span>
                <span className="text-xs sm:text-sm font-serif text-[#FFFFFF] block mt-0.5">
                  Smoked Cardamom
                </span>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#A1A1AA] block font-sans">
                  HEART
                </span>
                <span className="text-xs sm:text-sm font-serif text-[#FFFFFF] block mt-0.5">
                  Black Ambergris
                </span>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#A1A1AA] block font-sans">
                  BASE
                </span>
                <span className="text-xs sm:text-sm font-serif text-[#FFFFFF] block mt-0.5">
                  Mysore Sandalwood
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to={`/products/${noirProduct.slug}`}
                id="discover-noir-cta"
                className="group w-full sm:w-auto px-9 py-4 bg-[#D4AF37] text-[#0A0A0C] hover:bg-[#E5C378] text-xs uppercase tracking-[0.24em] font-sans transition-all duration-300 shadow-[0_6px_24px_rgba(212,175,55,0.25)] flex items-center justify-center space-x-2 font-semibold"
              >
                <span>DISCOVER NOIR</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0A0A0C] transform group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-8 py-4 bg-[#14141B] text-[#FFFFFF] hover:bg-[#1E1E28] text-xs uppercase tracking-[0.22em] font-sans transition-colors duration-300 border border-[#262633] flex items-center justify-center space-x-2"
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Acquire Flacon · ₹{noirProduct.price.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center lg:justify-start space-x-4 text-[10px] uppercase tracking-[0.26em] text-[#A1A1AA] font-sans">
              <span>LONGEVITY: 16+ HOURS</span>
              <span>·</span>
              <span>PROJECTION: BOLD & MAGNETIC</span>
            </div>
          </div>

          {/* RIGHT: LARGE DARK NOIR FLACON */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-full max-w-[480px] lg:max-w-[520px] aspect-[4/5] flex items-center justify-center">
              {/* Velvet Backstage Chamber */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#14141B] via-[#101016] to-[#0A0A0C] border border-[#D4AF37]/30 shadow-[0_30px_90px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
                {/* Overhead warm golden rim highlight */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#D4AF37]/20 blur-3xl pointer-events-none" />
                {/* Floor glow caustic */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-16 rounded-full bg-[#D4AF37]/20 blur-xl pointer-events-none" />

                {/* The Large Dark Noir Bottle */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-6 transform transition-transform duration-700 ease-out hover:scale-[1.03]">
                  <EloraBottleVisualizer
                    product={noirProduct}
                    size="hero"
                    showPedestal={true}
                  />
                </div>

                {/* Subdued Gold Corner Seals */}
                <div className="absolute top-6 left-6 text-[9px] uppercase tracking-[0.3em] font-sans text-[#D4AF37]/80">
                  NO. 02 · NOIR
                </div>
                <div className="absolute bottom-6 right-6 text-[9px] uppercase tracking-[0.3em] font-sans text-[#D4AF37]/80">
                  100ML · 25% CONCENTRATION
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
