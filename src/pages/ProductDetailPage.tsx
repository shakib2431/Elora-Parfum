import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Check,
  ArrowRight,
  Wind,
  Droplet,
  Flame,
  Star,
  Shield,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { PRODUCTS, FAQS } from '../data/products';
import { Product } from '../types';
import { EloraBottleVisualizer } from '../components/EloraBottleVisualizer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';

type TabKey = 'pyramid' | 'story' | 'ritual' | 'reviews';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, openCart } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const isFav = isFavorite(product.id) || isFavorite(product.slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('100ml');
  const [activeGalleryView, setActiveGalleryView] = useState<'flacon' | 'coffret' | 'pyramid'>('flacon');
  const [activeTab, setActiveTab] = useState<TabKey>('pyramid');
  const [isAdding, setIsAdding] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const notesSectionRef = useRef<HTMLDivElement>(null);

  // Price calculation based on size
  const currentPrice = selectedSize === '50ml' ? Math.round(product.price * 0.65) : product.price;
  const currentCompareAtPrice = product.compareAtPrice
    ? selectedSize === '50ml'
      ? Math.round(product.compareAtPrice * 0.65)
      : product.compareAtPrice
    : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setSelectedSize('100ml');
    setActiveGalleryView('flacon');
    setActiveTab('pyramid');
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 480);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1400);
  };

  const handleScrollToNotes = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab('pyramid');
    notesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  // Editorial reviews data
  const sampleReviews = [
    {
      author: 'Alistair V.',
      city: 'Mumbai',
      date: 'May 2026',
      rating: 5,
      comment:
        'Remarkable depth and restraint. The opening bergamot is sparkling without harshness, and the dry-down lingers softly on cashmere for over twelve hours.',
    },
    {
      author: 'Dr. Clara M.',
      city: 'Bengaluru',
      date: 'April 2026',
      rating: 5,
      comment:
        'A masterclass in quiet luxury. The architectural flacon is weighted and stunning on the vanity, but the formulation itself is where the true prestige lies.',
    },
    {
      author: 'Rohit S.',
      city: 'New Delhi',
      date: 'March 2026',
      rating: 5,
      comment:
        'Subtle, intimate sillage that invites people closer rather than announcing itself across a room. Easily my new signature.',
    },
  ];

  return (
    <div id="product-detail-page" className="bg-[#0A0A0C] text-[#FAF9F6] min-h-screen">
      {/* Editorial Breadcrumb */}
      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 py-4 border-b border-[#24232C] text-[11px] font-sans text-[#A1A1AA] flex items-center space-x-2">
        <Link to="/" className="hover:text-[#FFFFFF] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/collections/shop-all" className="hover:text-[#FFFFFF] transition-colors">
          Haute Parfumerie
        </Link>
        <span>/</span>
        <span className="text-[#D4AF37] uppercase tracking-wider">{product.name}</span>
      </div>

      {/* Main PDP 2-Column Luxury Layout */}
      <section className="py-12 sm:py-20 border-b border-[#24232C]">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* ================= LEFT COLUMN: LARGE DOMINANT FLACON & GALLERY ================= */}
            <div className="lg:col-span-7 space-y-5">
              {/* Primary Studio Visualizer Stage */}
              <div className="relative aspect-[4/5] bg-[#0E0E12] border border-[#24232C] flex items-center justify-center p-8 sm:p-12 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                {/* Soft ambient studio backdrop */}
                <div className="absolute inset-0 bg-radial from-[#14141B]/80 via-[#0E0E12] to-transparent pointer-events-none" />

                {/* Subtle Luxury Watermark */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA] font-sans font-medium">
                    ORIGINAL ELORA FLACON
                  </span>
                </div>

                {/* Wishlist Trigger */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-6 right-6 z-20 p-2 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors focus:outline-none"
                  aria-label={isFav ? 'Remove from private wardrobe' : 'Save to private wardrobe'}
                  title={isFav ? 'Saved in Private Wardrobe' : 'Save to Private Wardrobe'}
                >
                  <Heart
                    className={`w-5 h-5 stroke-[1.5] ${
                      isFav ? 'fill-[#D4AF37] text-[#D4AF37]' : ''
                    }`}
                  />
                </button>

                {/* Active View Render */}
                {activeGalleryView === 'flacon' ? (
                  <div className="w-full h-full flex items-center justify-center relative z-10 transition-transform duration-700 hover:scale-[1.02]">
                    <EloraBottleVisualizer product={product} size="xl" showPedestal={true} />
                  </div>
                ) : activeGalleryView === 'coffret' ? (
                  <div className="text-center p-8 space-y-6 relative z-10 max-w-md mx-auto">
                    <div className="w-48 h-56 mx-auto flex items-center justify-center">
                      <EloraBottleVisualizer product={product} size="lg" showPedestal={true} />
                    </div>
                    <div className="p-6 bg-[#14141B] border border-[#24232C] space-y-2">
                      <h4 className="font-serif text-lg tracking-[0.08em] uppercase text-[#FFFFFF]">
                        Atelier Coffret
                      </h4>
                      <p className="text-xs text-[#D4D4D8] font-sans leading-relaxed">
                        Hand-assembled presentation box bound in textured paper with gold-foil embossing and an embossed brass seal.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full p-8 text-center space-y-6 relative z-10 max-w-lg mx-auto">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA] font-sans block">
                      Architectural Pyramid
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.06em] text-[#FFFFFF]">
                      {product.name}
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-left">
                      <div className="p-4 bg-[#14141B] border border-[#24232C]">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
                          Top
                        </span>
                        <p className="font-serif text-xs text-[#FFFFFF]">
                          {product.notes.top.join(', ')}
                        </p>
                      </div>
                      <div className="p-4 bg-[#14141B] border border-[#24232C]">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
                          Heart
                        </span>
                        <p className="font-serif text-xs text-[#FFFFFF]">
                          {product.notes.heart.join(', ')}
                        </p>
                      </div>
                      <div className="p-4 bg-[#14141B] border border-[#24232C]">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
                          Base
                        </span>
                        <p className="font-serif text-xs text-[#FFFFFF]">
                          {product.notes.base.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveGalleryView('flacon')}
                  className={`w-20 h-24 bg-[#14141B] border p-2 flex items-center justify-center transition-all ${
                    activeGalleryView === 'flacon'
                      ? 'border-[#D4AF37]'
                      : 'border-[#24232C] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-12 h-16">
                    <EloraBottleVisualizer product={product} size="sm" showPedestal={false} />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveGalleryView('coffret')}
                  className={`px-6 h-24 bg-[#14141B] border flex flex-col items-center justify-center text-center transition-all ${
                    activeGalleryView === 'coffret'
                      ? 'border-[#D4AF37]'
                      : 'border-[#24232C] opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#FFFFFF]">
                    Coffret
                  </span>
                  <span className="text-[9px] text-[#A1A1AA] font-sans mt-0.5">Presentation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveGalleryView('pyramid')}
                  className={`px-6 h-24 bg-[#14141B] border flex flex-col items-center justify-center text-center transition-all ${
                    activeGalleryView === 'pyramid'
                      ? 'border-[#D4AF37]'
                      : 'border-[#24232C] opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#FFFFFF]">
                    Pyramid
                  </span>
                  <span className="text-[9px] text-[#A1A1AA] font-sans mt-0.5">Olfactory Notes</span>
                </button>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: EDITORIAL PRODUCT SPECS & CTAs ================= */}
            <div className="lg:col-span-5 space-y-7">
              {/* Brand & Title */}
              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA] font-sans font-medium block">
                  ELORA PARFUM
                </span>

                <h1 className="font-serif text-fluid-h1 tracking-[0.04em] text-[#FFFFFF] uppercase font-normal leading-[1.1]">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-3 pt-1">
                  <span className="text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-sans">
                    {product.category}
                  </span>
                  <span className="text-[#24232C]">·</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-sans">
                    25% Extrait de Parfum
                  </span>
                </div>

                <p className="font-serif italic text-base text-[#D4D4D8] pt-2 leading-relaxed">
                  "{product.tagline || product.editorialQuote}"
                </p>
              </div>

              {/* Price */}
              <div className="py-4 border-t border-b border-[#24232C] flex items-baseline space-x-3">
                <span className="font-sans text-2xl sm:text-3xl font-normal text-[#D4AF37]">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentCompareAtPrice && (
                  <span className="font-sans text-sm text-[#71717A] line-through">
                    ₹{currentCompareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA] font-sans ml-auto">
                  Taxes Included · Complimentary Courier
                </span>
              </div>

              {/* Size Selector [ 50ml ] [ 100ml ] */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline text-xs font-sans">
                  <span className="uppercase tracking-[0.2em] text-[#A1A1AA]">Flacon Volume</span>
                  <span className="text-[#FFFFFF] font-medium">{selectedSize} Extrait</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSize('50ml')}
                    className={`py-3.5 px-4 text-center text-xs uppercase tracking-[0.2em] font-sans transition-all ${
                      selectedSize === '50ml'
                        ? 'bg-[#D4AF37] text-[#0A0A0C] border border-[#D4AF37] font-semibold shadow-md'
                        : 'bg-[#14141B] text-[#FFFFFF] border border-[#24232C] hover:border-[#D4AF37]'
                    }`}
                  >
                    50ml Flacon
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSize('100ml')}
                    className={`py-3.5 px-4 text-center text-xs uppercase tracking-[0.2em] font-sans transition-all ${
                      selectedSize === '100ml'
                        ? 'bg-[#D4AF37] text-[#0A0A0C] border border-[#D4AF37] font-semibold shadow-md'
                        : 'bg-[#14141B] text-[#FFFFFF] border border-[#24232C] hover:border-[#D4AF37]'
                    }`}
                  >
                    100ml Signature
                  </button>
                </div>
              </div>

              {/* Quantity Selector & Primary Actions */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] font-sans">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-[#24232C] bg-[#14141B]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-[#FAF9F6] hover:bg-[#24232C] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                    <span className="px-5 text-xs font-sans text-[#FFFFFF]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-[#FAF9F6] hover:bg-[#24232C] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                  </div>
                </div>

                {/* Primary CTA [ ADD TO BAG ] */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    id="pdp-add-to-bag"
                    className={`w-full py-4 text-xs uppercase tracking-[0.25em] font-sans transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isAdding
                        ? 'bg-[#D4AF37] text-[#0A0A0C] font-semibold'
                        : 'bg-[#D4AF37] text-[#0A0A0C] font-semibold hover:bg-[#E5C378] shadow-[0_4px_20px_rgba(212,175,55,0.25)]'
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4 text-[#0A0A0C]" />
                        <span>Commission Confirmed · Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                        <span>Add To Bag · ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>

                  {/* Secondary Link: Discover Scent Notes */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={handleScrollToNotes}
                      className="text-xs uppercase tracking-[0.2em] font-sans text-[#A1A1AA] hover:text-[#FFFFFF] border-b border-[#24232C] pb-0.5 transition-colors"
                    >
                      Discover Scent Notes ↓
                    </button>
                  </div>
                </div>
              </div>

              {/* Quiet Luxury Trust Badges */}
              <div className="p-5 bg-[#14141B] border border-[#24232C] space-y-2.5 text-xs font-sans text-[#A1A1AA]">
                <div className="flex items-center space-x-2.5 text-[#FFFFFF]">
                  <Shield className="w-4 h-4 text-[#D4AF37] stroke-[1.5]" />
                  <span className="font-medium uppercase tracking-[0.1em] text-[11px]">
                    Atelier Guarantee & Complimentary Sample
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed pl-6 text-[#D4D4D8]">
                  Every 100ml order includes a matching 2ml discovery vial. Test the scent on skin before breaking the wax seal of the full flacon.
                </p>
                <div className="pt-2 border-t border-[#24232C]">
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent('open-concierge-chat', {
                          detail: {
                            query: `Can you describe the personality, longevity, and olfactory notes of ELORA ${product.name}?`,
                            mode: 'general',
                          },
                        })
                      )
                    }
                    className="w-full text-left text-[11px] text-[#D4AF37] hover:text-[#FFFFFF] transition-colors flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Inquire with Atelier Concierge regarding {product.name} →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BELOW THE FOLD: CLEAN TABBED PRESENTATION ================= */}
      <section ref={notesSectionRef} id="pdp-tabs-section" className="py-20 sm:py-28 border-b border-[#24232C]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          {/* Minimal Tab Switcher */}
          <div className="flex items-center justify-center border-b border-[#24232C] mb-14 overflow-x-auto no-scrollbar gap-8 sm:gap-12">
            {[
              { key: 'pyramid', label: 'Olfactory Pyramid' },
              { key: 'story', label: 'The Story Behind The Scent' },
              { key: 'ritual', label: 'How To Wear' },
              { key: 'reviews', label: 'Patron Reviews' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`py-4 text-xs uppercase tracking-[0.24em] font-sans transition-colors relative whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-[#D4AF37] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37]" />
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: OLFACTORY PYRAMID */}
          {activeTab === 'pyramid' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA] font-sans font-medium block">
                  Evolution of Sillage
                </span>
                <h3 className="font-serif text-3xl tracking-[0.06em] uppercase text-[#FFFFFF]">
                  THE PYRAMID STRUCTURE
                </h3>
                <p className="text-xs text-[#D4D4D8] font-sans">
                  Formulated at 25% oil concentration for a sustained, seamless transition from initial evaporation to deep drydown.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Top Notes */}
                <div className="bg-[#14141B] border border-[#24232C] p-8 text-center space-y-4">
                  <div className="w-10 h-10 border border-[#24232C] rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                    <Wind className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans block">
                    Initial 15 Minutes
                  </span>
                  <h4 className="font-serif text-xl tracking-[0.06em] uppercase text-[#FFFFFF]">
                    Top Notes
                  </h4>
                  <div className="w-8 h-[1px] bg-[#24232C] mx-auto" />
                  <ul className="space-y-2 text-sm text-[#FFFFFF] font-serif">
                    {product.notes.top.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-[#A1A1AA] font-sans pt-2">
                    The immediate sparkling aura upon skin contact.
                  </p>
                </div>

                {/* Heart Notes */}
                <div className="bg-[#14141B] border border-[#D4AF37]/60 p-8 text-center space-y-4 shadow-[0_4px_24px_rgba(212,175,55,0.08)]">
                  <div className="w-10 h-10 border border-[#D4AF37] rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                    <Droplet className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans block">
                    Hours 2 Through 6
                  </span>
                  <h4 className="font-serif text-xl tracking-[0.06em] uppercase text-[#FFFFFF]">
                    Heart Notes
                  </h4>
                  <div className="w-8 h-[1px] bg-[#D4AF37] mx-auto" />
                  <ul className="space-y-2 text-sm text-[#FFFFFF] font-serif font-medium">
                    {product.notes.heart.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-[#A1A1AA] font-sans pt-2">
                    The emotional personality and core radiant identity.
                  </p>
                </div>

                {/* Base Notes */}
                <div className="bg-[#14141B] border border-[#24232C] p-8 text-center space-y-4">
                  <div className="w-10 h-10 border border-[#24232C] rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                    <Flame className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans block">
                    Hours 6 Through 14+
                  </span>
                  <h4 className="font-serif text-xl tracking-[0.06em] uppercase text-[#FFFFFF]">
                    Base Notes
                  </h4>
                  <div className="w-8 h-[1px] bg-[#24232C] mx-auto" />
                  <ul className="space-y-2 text-sm text-[#FFFFFF] font-serif">
                    {product.notes.base.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-[#A1A1AA] font-sans pt-2">
                    The intimate memory anchoring to skin and textiles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THE STORY BEHIND THE SCENT */}
          {activeTab === 'story' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA] font-sans font-medium block">
                  Atelier Provenance
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl tracking-[0.06em] uppercase text-[#FFFFFF]">
                  THE CREATION OF {product.name}
                </h3>
              </div>

              <div className="p-8 bg-[#14141B] border border-[#24232C] space-y-4">
                <p className="font-serif italic text-lg sm:text-xl text-[#FFFFFF] leading-relaxed">
                  "{product.editorialQuote || product.tagline}"
                </p>
                <div className="w-10 h-[1px] bg-[#D4AF37]" />
                <p className="text-xs sm:text-sm text-[#D4D4D8] font-sans leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans text-[#D4D4D8]">
                <div className="p-6 bg-[#14141B] border border-[#24232C] space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] block">
                    Botanical Terroir
                  </span>
                  <p className="leading-relaxed">
                    Sourced directly from certified growers in Grasse, Calabria, and Southeast Asia. Harvested at peak dawn hours to preserve volatile aromatic esters.
                  </p>
                </div>
                <div className="p-6 bg-[#14141B] border border-[#24232C] space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] block">
                    Eight-Week Maceration
                  </span>
                  <p className="leading-relaxed">
                    Aged in temperature-controlled amber tanks for 56 days to allow natural resins and florals to marry before cold filtering and hand bottling.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOW TO WEAR */}
          {activeTab === 'ritual' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA] font-sans font-medium block">
                  Application Ritual
                </span>
                <h3 className="font-serif text-3xl tracking-[0.06em] uppercase text-[#FFFFFF]">
                  HOW TO WEAR
                </h3>
                <p className="text-xs text-[#D4D4D8] font-sans">
                  Honoring the concentration and delicate top accords of high-grade parfum.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: '01',
                    title: 'Mist from 15–20 cm',
                    desc: 'Hold the atomizer at distance to cast a delicate, microscopic halo across skin and collarbones.',
                  },
                  {
                    step: '02',
                    title: 'Target Pulse Points',
                    desc: 'Apply where pulse warmth radiates: base of throat, inner wrists, and behind the earlobes.',
                  },
                  {
                    step: '03',
                    title: 'Allow Natural Drydown',
                    desc: 'Let the alcohol evaporate undisturbed for 60 seconds so the botanical top notes open gracefully.',
                  },
                  {
                    step: '04',
                    title: 'Never Rub Wrists',
                    desc: 'Frictional heat shears delicate floral molecules and accelerates evaporation prematurely.',
                  },
                ].map((item) => (
                  <div key={item.step} className="p-6 bg-[#14141B] border border-[#24232C] space-y-3">
                    <span className="font-serif text-2xl text-[#D4AF37] block">
                      {item.step}
                    </span>
                    <h4 className="font-serif text-base tracking-[0.06em] uppercase text-[#FFFFFF]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#D4D4D8] font-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA] font-sans font-medium block">
                  Verified Impressions
                </span>
                <h3 className="font-serif text-3xl tracking-[0.06em] uppercase text-[#FFFFFF]">
                  PATRON PERSPECTIVES
                </h3>
              </div>

              <div className="space-y-6">
                {sampleReviews.map((r, idx) => (
                  <div key={idx} className="p-8 bg-[#14141B] border border-[#24232C] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-serif text-base text-[#FFFFFF] block">
                          {r.author}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-sans">
                          {r.city} · {r.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#D4AF37]">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#D4D4D8] font-sans leading-relaxed pt-1">
                      "{r.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* COMPLEMENTARY FLACONS (YOU MAY ALSO LIKE) */}
      <section className="py-20 sm:py-28 bg-[#0A0A0C] border-b border-[#24232C]">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA] font-sans font-medium block">
              Curated Harmonies
            </span>
            <h2 className="font-serif text-fluid-h2 text-[#FFFFFF] tracking-[0.06em] uppercase font-normal">
              YOU MAY ALSO LIKE
            </h2>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* STICKY BOTTOM BAR FOR MOBILE */}
      {showStickyBar && (
        <div
          id="mobile-pdp-sticky-bar"
          className="fixed bottom-0 inset-x-0 z-40 bg-[#0E0E12]/95 backdrop-blur-md border-t border-[#24232C] px-6 py-3 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.7)] lg:hidden pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        >
          <div className="min-w-0 pr-4">
            <h4 className="font-serif text-sm text-[#FFFFFF] truncate font-medium">
              {product.name}
            </h4>
            <p className="text-xs font-sans text-[#D4AF37]">
              ₹{(currentPrice * quantity).toLocaleString('en-IN')} · {selectedSize}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="px-6 py-3 bg-[#D4AF37] text-[#0A0A0C] text-[10px] uppercase tracking-[0.2em] font-sans font-semibold shrink-0 hover:bg-[#E5C378] transition-colors shadow-md"
          >
            {isAdding ? 'Added' : 'Add to Bag'}
          </button>
        </div>
      )}
    </div>
  );
};
