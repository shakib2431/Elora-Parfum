import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  ShieldCheck,
  Compass,
  Volume2,
  Droplets,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data/products';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';

interface HeroSlideData {
  id: string;
  slug: string;
  headlineMain: string;
  headlineAccent: string;
  commissionCode: string;
  concentration: string;
  curatorNote: string;
  spotlightGradients: {
    primary: string;
    secondary: string;
    floor: string;
    ambient: string;
  };
}

const HERO_SLIDES: HeroSlideData[] = [
  {
    id: 'elora-noir',
    slug: 'noir',
    headlineMain: 'THE ART',
    headlineAccent: 'OF PRESENCE',
    commissionCode: 'COMMISSION N° 001 · NOIR EXTRAIT',
    concentration: '25% Pure Extrait De Parfum',
    curatorNote:
      'Smoked Bourbon vanilla and aged Haitian vetiver ignited by cardamom embers. A magnetic nocturnal sillage that lingers in rooms long after you have departed.',
    spotlightGradients: {
      primary: 'rgba(212, 175, 55, 0.24)',
      secondary: 'rgba(180, 83, 9, 0.14)',
      floor: 'rgba(212, 175, 55, 0.20)',
      ambient: 'rgba(74, 42, 24, 0.15)',
    },
  },
  {
    id: 'elora-aura',
    slug: 'aura',
    headlineMain: 'THE RADIANCE',
    headlineAccent: 'OF DAWN',
    commissionCode: 'COMMISSION N° 002 · AURA EXTRAIT',
    concentration: '25% Pure Extrait De Parfum',
    curatorNote:
      'Calabrian bergamot infused with night-blooming Grasse jasmine and celestial velvet musks. An intimate, sun-drenched aura that embraces the skin like liquid silk.',
    spotlightGradients: {
      primary: 'rgba(245, 222, 179, 0.28)',
      secondary: 'rgba(212, 175, 55, 0.18)',
      floor: 'rgba(236, 209, 153, 0.22)',
      ambient: 'rgba(201, 169, 110, 0.16)',
    },
  },
  {
    id: 'elora-eclat',
    slug: 'eclat',
    headlineMain: 'CRYSTALLINE',
    headlineAccent: 'SERENITY',
    commissionCode: 'COMMISSION N° 003 · ÉCLAT EXTRAIT',
    concentration: '25% Pure Extrait De Parfum',
    curatorNote:
      'Sun-drenched Amalfi citrus and crushed wild mint swept over marine driftwood and white amber. Crystalline oceanic clarity sculpted for elevated daytime presence.',
    spotlightGradients: {
      primary: 'rgba(168, 214, 199, 0.25)',
      secondary: 'rgba(126, 189, 169, 0.15)',
      floor: 'rgba(142, 212, 192, 0.20)',
      ambient: 'rgba(82, 130, 113, 0.14)',
    },
  },
  {
    id: 'elora-oud-elite',
    slug: 'oud-elite',
    headlineMain: 'THE IMPERIAL',
    headlineAccent: 'MYSTIQUE',
    commissionCode: 'COMMISSION N° 004 · OUD ÉLITE',
    concentration: '28% Imperial Reserve Extrait',
    curatorNote:
      'Aged Cambodian agarwood and crimson Damascus rose suspended in birch smoke and burnished leather. The sovereign crown of haute parfumerie—ancient, regal, and unapologetic.',
    spotlightGradients: {
      primary: 'rgba(186, 142, 72, 0.26)',
      secondary: 'rgba(92, 49, 24, 0.20)',
      floor: 'rgba(212, 175, 55, 0.22)',
      ambient: 'rgba(58, 31, 16, 0.22)',
    },
  },
  {
    id: 'elora-signature-set',
    slug: 'elora-signature-set',
    headlineMain: 'THE ARCHIVE',
    headlineAccent: 'COFFRET',
    commissionCode: 'COMMISSION N° 005 · DISCOVERY TRIO',
    concentration: '3 × 15ml Extrait Flacons',
    curatorNote:
      'The definitive trinity of Elora Haute Parfumerie: Aura, Noir, and Éclat presented in an architectural, velvet-lined lacquered keepsake showcase.',
    spotlightGradients: {
      primary: 'rgba(212, 175, 55, 0.26)',
      secondary: 'rgba(245, 230, 185, 0.16)',
      floor: 'rgba(212, 175, 55, 0.25)',
      ambient: 'rgba(140, 115, 81, 0.15)',
    },
  },
];

const AUTOPLAY_DURATION = 6500; // 6.5s per slide

export const Hero: React.FC = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: 72, y: 46 });
  const [direction, setDirection] = useState<1 | -1>(1);
  const heroRef = useRef<HTMLElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSlide = HERO_SLIDES[currentSlideIdx];
  const activeProduct =
    PRODUCTS.find((p) => p.slug === activeSlide.slug) || PRODUCTS[1];

  const goToNextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const goToPrevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = (idx: number) => {
    setDirection(idx > currentSlideIdx ? 1 : -1);
    setCurrentSlideIdx(idx);
  };

  // Autoplay timer with auto-advance
  useEffect(() => {
    if (!isPlaying) return;

    progressTimerRef.current = setInterval(() => {
      goToNextSlide();
    }, AUTOPLAY_DURATION);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, goToNextSlide, currentSlideIdx]);

  // Subtle slow-panning parallax effect on scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for accessible slide control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNextSlide();
      if (e.key === 'ArrowLeft') goToPrevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  // Dynamic subtle spotlight tracking on mouse movement over the hero section
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;

    // Constrain spotlight center to right-half area around the bottle
    const targetX = 70 + (normX - 0.7) * 10;
    const targetY = 46 + (normY - 0.5) * 12;
    setSpotlightPos({
      x: Math.max(62, Math.min(80, targetX)),
      y: Math.max(34, Math.min(58, targetY)),
    });
  };

  const handleMouseLeave = () => {
    setSpotlightPos({ x: 72, y: 46 });
  };

  // Parallax translation distances for layered optical depth (subtle, non-colliding)
  const bottleParallaxY = -Math.min(20, scrollY * 0.05);
  const backgroundParallaxY = Math.min(40, scrollY * 0.04);

  const gradients = activeSlide.spotlightGradients;

  return (
    <section
      ref={heroRef}
      id="homepage-hero"
      aria-label="Elora Haute Parfumerie Hero Presentation"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] lg:min-h-[920px] bg-deep-espresso text-warm-ivory overflow-hidden border-b border-[#3B332B] flex flex-col justify-between"
    >
      {/* ============================================================ */}
      {/* 1. DYNAMIC RADIAL SPOTLIGHT BACKGROUND USING CSS GRADIENTS   */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out will-change-transform select-none"
        style={{
          transform: `translate3d(0, ${backgroundParallaxY}px, 0)`,
          background: `
            radial-gradient(ellipse 700px 800px at ${spotlightPos.x}% ${spotlightPos.y}%, ${gradients.primary} 0%, ${gradients.secondary} 36%, rgba(18, 18, 25, 0.6) 65%, transparent 85%),
            radial-gradient(circle 420px at ${spotlightPos.x - 3}% ${spotlightPos.y - 6}%, rgba(255, 248, 230, 0.15) 0%, ${gradients.secondary} 48%, transparent 72%),
            radial-gradient(ellipse 950px 380px at 74% 92%, ${gradients.floor} 0%, rgba(185, 154, 98, 0.03) 50%, transparent 75%),
            radial-gradient(circle 550px at 16% 20%, ${gradients.ambient} 0%, transparent 65%)
          `,
        }}
      />

      {/* Editorial Architectural Ambient Grid Lines */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 bottom-0 left-[6%] xl:left-[8%] w-[1px] bg-[#3B332B]/40 hidden lg:block" />
        <div className="absolute top-0 bottom-0 left-[40%] xl:left-[42%] w-[1px] bg-[#3B332B]/30 hidden xl:block" />
        <div className="absolute top-0 bottom-0 right-[6%] xl:right-[8%] w-[1px] bg-[#3B332B]/40 hidden lg:block" />
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-deep-espresso via-deep-espresso/70 to-transparent" />
      </div>

      {/* Main Campaign Framing Container */}
      <div className="flex-1 flex items-center max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-14 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[640px]">
          
          {/* ============================================================ */}
          {/* 2. ASYMMETRICAL TOP-LEFT EDITORIAL GRID COMPOSITION          */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-8 text-left relative z-20">
            
            {/* ELORA PARFUM Logo & Atelier Accreditation */}
            <div className="space-y-2.5">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-[1.5px] bg-antique-gold" />
                <span className="font-serif text-sm uppercase tracking-[0.45em] text-antique-gold font-semibold">
                  ELORA PARFUM
                </span>
                <span className="text-champagne/40">·</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-champagne/80 font-sans">
                  PARIS & GRASSE
                </span>
              </div>
              <p className="text-[9.5px] uppercase tracking-[0.34em] text-champagne/60 font-sans pl-11">
                HAUTE PARFUMERIE · PRIVATE ARCHIVE 2026
              </p>
            </div>

            {/* Synchronized Animated Headline & Commission Stamp */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#241F1A]/90 border border-[#3B332B] rounded-full text-[9px] uppercase tracking-[0.26em] text-antique-gold">
                  <span className="w-1.5 h-1.5 rounded-full bg-antique-gold animate-pulse" />
                  <span>{activeSlide.commissionCode}</span>
                </div>

                <h1 className="font-serif text-[clamp(2.75rem,5.2vw,5.5rem)] leading-[0.98] uppercase tracking-[0.04em] text-warm-ivory font-normal select-none">
                  {activeSlide.headlineMain} <br />
                  <span className="italic font-normal text-antique-gold font-serif tracking-[0.02em]">
                    {activeSlide.headlineAccent}
                  </span>
                </h1>

                <div className="flex items-center space-x-3 pt-1">
                  <span className="w-10 h-[1px] bg-antique-gold/80" />
                  <span className="text-[10.5px] uppercase tracking-[0.28em] font-sans text-champagne">
                    {activeSlide.concentration}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-champagne/80 font-sans font-light leading-relaxed max-w-md tracking-wide pt-2">
                  {activeSlide.curatorNote}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons & Navigation Controls */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to={`/products/${activeProduct.slug}`}
                id="hero-primary-cta"
                className="group px-8 py-4 bg-antique-gold text-deep-espresso hover:bg-champagne text-xs uppercase tracking-[0.24em] font-sans font-bold transition-all duration-300 shadow-[0_6px_30px_rgba(185,154,98,0.25)] flex items-center justify-center space-x-2.5"
              >
                <span>ACQUIRE {activeProduct.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-deep-espresso transform group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/collections/shop-all"
                className="px-6 py-4 bg-[#241F1A]/90 hover:bg-[#302923] text-warm-ivory hover:text-antique-gold text-xs uppercase tracking-[0.22em] font-sans transition-all duration-300 border border-[#3B332B] hover:border-antique-gold text-center backdrop-blur-sm"
              >
                Explore Full Archive →
              </Link>
            </div>

            {/* Editorial Slide Navigation & Progress Bar */}
            <div className="pt-6 border-t border-[#3B332B]/80 space-y-4">
              
              {/* Progress & Slide Counter Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-serif text-lg text-antique-gold font-medium">
                    0{currentSlideIdx + 1}
                  </span>
                  <span className="text-xs text-champagne/60 uppercase font-sans tracking-widest">
                    / 0{HERO_SLIDES.length}
                  </span>
                  <span className="text-xs text-champagne/40">·</span>
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-warm-ivory font-medium">
                    ELORA {activeProduct.name}
                  </span>
                </div>

                {/* Slideshow Control Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                    className="w-8 h-8 rounded-full border border-[#3B332B] bg-[#241F1A] hover:border-antique-gold text-champagne/80 hover:text-warm-ivory flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={goToPrevSlide}
                    aria-label="Previous fragrance slide"
                    className="w-8 h-8 rounded-full border border-[#3B332B] bg-[#241F1A] hover:border-antique-gold text-champagne/80 hover:text-warm-ivory flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={goToNextSlide}
                    aria-label="Next fragrance slide"
                    className="w-8 h-8 rounded-full border border-[#3B332B] bg-[#241F1A] hover:border-antique-gold text-champagne/80 hover:text-warm-ivory flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Animated Progress Timeline */}
              <div className="w-full h-[2px] bg-[#2A241F] relative overflow-hidden rounded-full">
                <motion.div
                  key={`${currentSlideIdx}-${isPlaying}`}
                  initial={{ width: '0%' }}
                  animate={{ width: isPlaying ? '100%' : '0%' }}
                  transition={{ duration: AUTOPLAY_DURATION / 1000, ease: 'linear' }}
                  className="absolute top-0 bottom-0 left-0 bg-antique-gold"
                />
              </div>

              {/* Flacon Quick-Jump Selector Tabs */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                {HERO_SLIDES.map((slide, idx) => {
                  const prod = PRODUCTS.find((p) => p.slug === slide.slug);
                  const isSelected = currentSlideIdx === idx;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] font-sans border transition-all duration-300 rounded-sm cursor-pointer ${
                        isSelected
                          ? 'bg-[#2A241F] border-antique-gold text-antique-gold font-semibold shadow-[0_0_12px_rgba(185,154,98,0.2)]'
                          : 'bg-[#1E1915]/60 border-[#3B332B] text-champagne/60 hover:text-warm-ivory hover:border-champagne/50'
                      }`}
                    >
                      <span className="text-champagne/80 mr-1">0{idx + 1}</span>
                      <span>{prod?.name || slide.slug}</span>
                    </button>
                  );
                })}
              </div>

            </div>

          </div>

          {/* ============================================================ */}
          {/* 3. HERO SLIDE OBJECT ON RIGHT: AUTHENTIC ELORA FLACON        */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 xl:col-span-7 flex items-center justify-center lg:justify-end relative">
            
            {/* Parallax Container: Subtle, non-colliding */}
            <div
              className="relative w-full max-w-[500px] xl:max-w-[560px] will-change-transform"
              style={{
                transform: `translate3d(0, ${bottleParallaxY}px, 0)`,
                transition: 'transform 0.15s cubic-bezier(0, 0, 0.2, 1)',
              }}
            >
              {/* Architectural Glass Showcase Shadow Base */}
              <div className="relative rounded-2xl p-5 sm:p-8 bg-gradient-to-b from-[#241F1A]/95 via-[#1E1915]/95 to-deep-espresso/98 border border-[#3B332B] shadow-[0_30px_90px_rgba(0,0,0,0.9)] backdrop-blur-md overflow-hidden group">
                
                {/* Secondary Internal Radial Spotlight Aura */}
                <div
                  className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-88 h-88 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
                  style={{ backgroundColor: gradients.primary }}
                />
                <div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 h-20 rounded-full blur-xl pointer-events-none transition-all duration-1000"
                  style={{ backgroundColor: gradients.floor }}
                />

                {/* Top Atelier Metadata Seal with Integrated Quality Emblem */}
                <div className="flex items-center justify-between border-b border-[#3B332B] pb-3 mb-4 text-[9.5px] uppercase tracking-[0.28em] font-sans text-champagne/80">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-antique-gold" />
                    <span className="text-antique-gold font-semibold">ELORA FLACON STUDIO</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-champagne/90">
                    <ShieldCheck className="w-3.5 h-3.5 text-antique-gold shrink-0" />
                    <span className="text-[8.5px] uppercase tracking-[0.22em] font-sans">100% Bespoke Flacon</span>
                  </div>
                </div>

                {/* The Slide Hero Object: Bespoke EloraBottleVisualizer with Transition */}
                <div className="relative min-h-[460px] sm:min-h-[520px] w-full flex items-center justify-center overflow-hidden rounded-lg bg-deep-espresso/80">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProduct.id}
                      initial={{ opacity: 0, scale: 0.94, x: direction * 40 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.94, x: direction * -40 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2 sm:p-4"
                    >
                      {/* Authentic Bespoke ELORA PARFUM Bottle Visualizer */}
                      <EloraBottleVisualizer
                        product={activeProduct}
                        size="hero"
                        showPedestal={true}
                        interactive={true}
                      />

                      {/* Gold Foil Plaque Tagline Overlay */}
                      <div className="w-full max-w-sm mt-3 px-4 py-2.5 bg-deep-espresso/90 backdrop-blur-md border border-[#3B332B] rounded-sm flex items-center justify-between">
                        <div className="truncate pr-2">
                          <span className="text-[8.5px] uppercase tracking-[0.3em] text-antique-gold font-sans block">
                            {activeProduct.category}
                          </span>
                          <span className="font-serif text-sm tracking-[0.08em] text-warm-ivory uppercase truncate">
                            ELORA {activeProduct.name} · {activeProduct.size}
                          </span>
                        </div>
                        <span className="text-sm font-serif text-antique-gold shrink-0 font-medium">
                          ₹{activeProduct.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Left and Right Slide Click Zones on the Image Container */}
                  <button
                    type="button"
                    onClick={goToPrevSlide}
                    aria-label="Previous flacon slide"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-deep-espresso/80 backdrop-blur-md border border-[#3B332B] text-champagne/80 hover:text-warm-ivory hover:border-antique-gold flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextSlide}
                    aria-label="Next flacon slide"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-deep-espresso/80 backdrop-blur-md border border-[#3B332B] text-champagne/80 hover:text-warm-ivory hover:border-antique-gold flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Accords & Olfactory Teaser Bar */}
                <div className="mt-4 pt-3.5 border-t border-[#3B332B] flex items-center justify-between text-[9.5px] uppercase tracking-[0.24em] font-sans text-champagne/80">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-antique-gold font-medium">NOTES:</span>
                    <span className="text-warm-ivory truncate">
                      {activeProduct.notes.top[0]} · {activeProduct.notes.heart[0]} · {activeProduct.notes.base[0]}
                    </span>
                  </div>
                  <Link
                    to={`/products/${activeProduct.slug}`}
                    className="shrink-0 text-antique-gold hover:text-champagne flex items-center space-x-1 pl-2 transition-colors font-medium"
                  >
                    <span>VIEW DETAILS</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Editorial Bottom Coordinates Bar in Normal Layout Flow */}
      <div className="w-full border-t border-[#3B332B]/50 bg-deep-espresso/80 backdrop-blur-sm relative z-20 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-3 flex items-center justify-between text-[9px] uppercase tracking-[0.32em] font-sans text-champagne/60">
          <span>LAT: 43.6603° N (GRASSE) · LON: 6.9248° E</span>
          <span>ATELIER ELORA · HAUTE PARFUMERIE ARCHIVE 2026</span>
          <span className="flex items-center space-x-1.5">
            <span>USE ARROWS OR SWIPE TO ADVANCE ARCHIVE</span>
            <span className="text-antique-gold">↓</span>
          </span>
        </div>
      </div>
    </section>
  );
};
