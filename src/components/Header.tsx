import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, User, Heart, Sparkles, X, MessageSquare, Lock, Shield, CheckCircle2, Package, ExternalLink, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { MobileMenu } from './MobileMenu';
import { SearchModal } from './SearchModal';
import { ScentProfilerModal } from './ScentProfilerModal';
import { ScentMoodMatcherModal } from './ScentMoodMatcherModal';

export const Header: React.FC<{
  onOpenSearch?: () => void;
  onOpenMobileMenu?: () => void;
}> = ({ onOpenSearch, onOpenMobileMenu }) => {
  const { cartCount, openCart } = useCart();
  const { openFavorites, favoritesCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [patronEmail, setPatronEmail] = useState('');
  const [patronLookupLoading, setPatronLookupLoading] = useState(false);
  const [patronLookupResult, setPatronLookupResult] = useState<{
    isOwner?: boolean;
    email?: string;
    ordersCount?: number;
    orders?: Array<{
      order_number: string;
      created_at: string;
      order_status: string;
      payment_status: string;
      shipping_status: string;
      total: number;
      currency: string;
      items?: Array<{ product_name: string; size_ml: string; quantity: number; total: number }>;
      shipment?: { awb_code: string; courier_name: string; tracking_url?: string; status?: string } | null;
    }>;
  } | null>(null);
  const [patronError, setPatronError] = useState<string | null>(null);

  const handlePatronLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patronEmail.trim()) return;
    setPatronLookupLoading(true);
    setPatronError(null);

    try {
      const res = await fetch('/api/customer/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: patronEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to retrieve patron account records.');
      }
      setPatronLookupResult(data);
    } catch (err: any) {
      setPatronError(err.message || 'Connection error. Please try again.');
    } finally {
      setPatronLookupLoading(false);
    }
  };
  const [isProfilerOpen, setIsProfilerOpen] = useState(false);
  const [isMoodMatcherOpen, setIsMoodMatcherOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Subtle discreet click counter on HAUTE PARFUMERIE
  const [logoClickCount, setLogoClickCount] = useState(0);

  const handleSecretAdminTrigger = (e: React.MouseEvent) => {
    // If alt key is pressed or clicked 3 times in rapid succession, navigate to admin
    if (e.altKey) {
      e.preventDefault();
      e.stopPropagation();
      navigate('/admin/login');
      return;
    }

    const nextCount = logoClickCount + 1;
    if (nextCount >= 3) {
      e.preventDefault();
      e.stopPropagation();
      setLogoClickCount(0);
      navigate('/admin/login');
    } else {
      setLogoClickCount(nextCount);
      setTimeout(() => setLogoClickCount(0), 1500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleOpenQuiz = () => setIsProfilerOpen(true);
    const handleOpenMoodMatcher = () => setIsMoodMatcherOpen(true);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('open-scent-quiz', handleOpenQuiz);
    window.addEventListener('open-mood-matcher', handleOpenMoodMatcher);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('open-scent-quiz', handleOpenQuiz);
      window.removeEventListener('open-mood-matcher', handleOpenMoodMatcher);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSearchClick = () => {
    if (onOpenSearch) onOpenSearch();
    else setIsSearchOpen(true);
  };

  const handleMobileMenuClick = () => {
    if (onOpenMobileMenu) onOpenMobileMenu();
    else setIsMobileMenuOpen(true);
  };

  return (
    <>
      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-deep-espresso/95 backdrop-blur-md border-b border-[#3B332B] shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
            : 'bg-deep-espresso border-b border-[#3B332B]/80'
        }`}
      >
        {/* DESKTOP HEADER (lg and up) */}
        <div className="hidden lg:grid grid-cols-12 items-center max-w-[1360px] mx-auto px-8 h-20">
          {/* LEFT: ELORA PARFUM HAUTE PARFUMERIE lockup */}
          <div className="col-span-3 flex items-center">
            <Link to="/" id="brand-logo-desktop" className="group block focus:outline-none">
              <span className="font-serif text-2xl tracking-[0.28em] text-warm-ivory block leading-none font-medium uppercase group-hover:text-antique-gold transition-colors">
                ELORA
              </span>
              <span className="font-serif text-[11px] tracking-[0.38em] text-champagne block mt-1 leading-none uppercase group-hover:text-warm-ivory transition-colors">
                PARFUM
              </span>
              <span
                onClick={handleSecretAdminTrigger}
                title="Atelier Access"
                className="text-[7.5px] tracking-[0.32em] text-antique-gold block mt-1 leading-none uppercase font-sans font-medium hover:text-warm-ivory transition-colors cursor-pointer"
              >
                HAUTE PARFUMERIE
              </span>
            </Link>
          </div>

          {/* CENTER: Clean editorial text navigation */}
          <nav className="col-span-6 flex items-center justify-center space-x-9 font-sans text-[11px] tracking-[0.22em] uppercase text-warm-ivory">
            <Link
              to="/"
              className={`py-1 relative transition-colors ${
                isActive('/') ? 'text-warm-ivory font-semibold' : 'text-champagne/80 hover:text-warm-ivory'
              }`}
            >
              Home
              {isActive('/') && (
                <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-antique-gold" />
              )}
            </Link>

            <Link
              to="/collections/shop-all"
              className={`py-1 relative transition-colors ${
                isActive('/collections') ? 'text-warm-ivory font-semibold' : 'text-champagne/80 hover:text-warm-ivory'
              }`}
            >
              Shop
              {isActive('/collections') && (
                <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-antique-gold" />
              )}
            </Link>

            <Link
              to="/bundle"
              className={`py-1 relative transition-colors ${
                isActive('/bundle') ? 'text-warm-ivory font-semibold' : 'text-champagne/80 hover:text-warm-ivory'
              }`}
            >
              Collections
              {isActive('/bundle') && (
                <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-antique-gold" />
              )}
            </Link>

            <Link
              to="/pages/about"
              className={`py-1 relative transition-colors ${
                isActive('/pages/about') ? 'text-warm-ivory font-semibold' : 'text-champagne/80 hover:text-warm-ivory'
              }`}
            >
              About
              {isActive('/pages/about') && (
                <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-antique-gold" />
              )}
            </Link>

            <Link
              to="/pages/contact"
              className={`py-1 relative transition-colors ${
                isActive('/pages/contact') ? 'text-warm-ivory font-semibold' : 'text-champagne/80 hover:text-warm-ivory'
              }`}
            >
              Contact
              {isActive('/pages/contact') && (
                <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-antique-gold" />
              )}
            </Link>

            {/* Subtle Private Consultation Trigger */}
            <button
              onClick={() => setIsProfilerOpen(true)}
              className="py-1 text-antique-gold hover:text-warm-ivory transition-colors flex items-center space-x-1.5"
              title="Private Fragrance Consultation"
            >
              <Sparkles className="w-3 h-3 text-antique-gold" />
              <span>Consultation</span>
            </button>
          </nav>

          {/* RIGHT: Search · Account · Cart (simple clean line icons, no pills) */}
          <div className="col-span-3 flex items-center justify-end space-x-6 text-warm-ivory">
            {/* Search */}
            <button
              id="header-search-btn"
              onClick={handleSearchClick}
              className="p-1 text-warm-ivory hover:text-antique-gold transition-colors focus:outline-none"
              aria-label="Search fragrances"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Atelier Concierge Customer Query Chat */}
            <button
              id="header-concierge-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-concierge-chat'))}
              className="p-1 text-warm-ivory hover:text-antique-gold transition-colors relative focus:outline-none"
              aria-label="Chat with Atelier Concierge"
              title="Atelier Concierge Customer Query"
            >
              <MessageSquare className="w-4 h-4 stroke-[1.5]" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-antique-gold" />
            </button>

            {/* Wishlist / Wardrobe */}
            <button
              id="header-favorites-btn"
              onClick={openFavorites}
              className="p-1 text-warm-ivory hover:text-antique-gold transition-colors relative focus:outline-none"
              aria-label={`Private wardrobe with ${favoritesCount} flacons`}
            >
              <Heart className={`w-4 h-4 stroke-[1.5] ${favoritesCount > 0 ? 'fill-antique-gold text-antique-gold' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-2 text-[9px] font-sans font-medium text-antique-gold">
                  ({favoritesCount})
                </span>
              )}
            </button>

            {/* Account */}
            <button
              id="header-account-btn"
              onClick={() => {
                setPatronError(null);
                setPatronLookupResult(null);
                setIsAccountModalOpen(true);
              }}
              className="p-1 text-warm-ivory hover:text-antique-gold transition-colors focus:outline-none"
              aria-label="Patron Account"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Cart with minimal counter */}
            <button
              id="header-cart-btn"
              onClick={openCart}
              className="p-1 text-warm-ivory hover:text-antique-gold transition-colors flex items-center space-x-1.5 focus:outline-none"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              <span className="text-[11px] font-sans tracking-widest uppercase">
                Cart {cartCount > 0 ? `(${cartCount})` : ''}
              </span>
            </button>
          </div>
        </div>

        {/* MOBILE HEADER (lg:hidden) - Exact 64px height */}
        <div className="lg:hidden flex items-center justify-between px-4 h-16 max-w-full">
          {/* LEFT: Hamburger icon */}
          <button
            id="mobile-hamburger-btn"
            onClick={handleMobileMenuClick}
            className="w-11 h-11 -ml-1 text-warm-ivory flex items-center justify-center hover:opacity-70 transition-opacity focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* CENTER: ELORA PARFUM */}
          <Link to="/" className="text-center focus:outline-none">
            <span className="font-serif text-lg tracking-[0.24em] text-warm-ivory uppercase font-medium block leading-tight">
              ELORA PARFUM
            </span>
            <span
              onClick={handleSecretAdminTrigger}
              className="text-[7.5px] tracking-[0.28em] text-antique-gold uppercase font-sans block leading-none hover:text-warm-ivory transition-colors cursor-pointer"
            >
              HAUTE PARFUMERIE
            </span>
          </Link>

          {/* RIGHT: Cart icon */}
          <button
            id="mobile-cart-btn"
            onClick={openCart}
            className="w-11 h-11 -mr-1 text-warm-ivory flex items-center justify-center relative hover:opacity-70 transition-opacity focus:outline-none"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-1.5 text-[9px] font-sans font-bold text-antique-gold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Patron Account Modal */}
      {isAccountModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#120F0D]/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsAccountModalOpen(false)}
        >
          <div
            className="bg-[#221D19] p-8 sm:p-10 max-w-md w-full border border-[#3B332B] shadow-2xl text-center text-warm-ivory relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAccountModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-champagne hover:text-warm-ivory transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[9px] uppercase tracking-[0.28em] text-antique-gold font-sans block mb-2">
              Patron Services
            </span>
            <h3 className="font-serif text-2xl tracking-[0.16em] text-warm-ivory mb-3 uppercase">
              THE ELORA CIRCLE
            </h3>
            <p className="text-xs text-champagne/80 mb-6 leading-relaxed font-sans">
              Sign in to view reserve allocations, order tracking, and custom formulations.
            </p>

            {patronLookupResult ? (
              <div className="space-y-4 text-left">
                {patronLookupResult.isOwner ? (
                  <div className="p-5 bg-[#2A241F] border border-antique-gold/60 text-warm-ivory text-xs font-sans space-y-3">
                    <div className="flex items-center gap-2 text-antique-gold font-serif text-sm tracking-wide">
                      <Shield className="w-4 h-4 text-antique-gold shrink-0" />
                      <span className="font-semibold">MAISON OWNER RECOGNIZED</span>
                    </div>
                    <p className="text-champagne/90 leading-relaxed text-[11px]">
                      Email <span className="text-warm-ivory font-mono font-medium">{patronLookupResult.email}</span> is recognized as the Maison Atelier Administrator with full authority over real orders, inventory, and financial settlements.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountModalOpen(false);
                        navigate('/admin/login');
                      }}
                      className="w-full py-3 bg-antique-gold text-deep-espresso text-xs uppercase tracking-[0.2em] font-sans font-semibold hover:bg-champagne transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Enter Atelier Management Console</span>
                    </button>
                  </div>
                ) : patronLookupResult.orders && patronLookupResult.orders.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-sans border-b border-[#3B332B] pb-2">
                      <span className="text-champagne tracking-wider uppercase text-[10px]">Active Commissions ({patronLookupResult.orders.length})</span>
                      <span className="text-antique-gold text-[10px] uppercase font-mono tracking-wider">{patronLookupResult.email}</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                      {patronLookupResult.orders.map((o) => (
                        <div key={o.order_number} className="p-3 bg-[#1A1613] border border-[#3B332B] text-xs font-sans space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-warm-ivory font-medium tracking-wider">{o.order_number}</span>
                            <span className={`text-[9px] uppercase px-2 py-0.5 tracking-wider font-semibold ${
                              o.payment_status === 'PAID' ? 'bg-[#1C2A1E] text-[#86EFAC] border border-[#22543D]' : 'bg-[#2A241F] text-champagne'
                            }`}>
                              {o.order_status}
                            </span>
                          </div>
                          <div className="text-[11px] text-champagne/80">
                            {o.items && o.items.length > 0
                              ? o.items.map((i) => `${i.quantity}x ${i.product_name} (${i.size_ml})`).join(', ')
                              : 'Bespoke Formulation'}
                          </div>
                          <div className="flex items-center justify-between pt-1 text-[10px] text-champagne/60 border-t border-[#3B332B]/50">
                            <span>₹{o.total?.toLocaleString('en-IN')}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAccountModalOpen(false);
                                navigate(`/order-status?order=${encodeURIComponent(o.order_number)}&email=${encodeURIComponent(patronEmail)}`);
                              }}
                              className="text-antique-gold hover:text-warm-ivory underline uppercase tracking-wider flex items-center gap-1"
                            >
                              <span>Track Consignment</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#1E1915] border border-[#3B332B] text-center space-y-2.5">
                    <p className="text-xs text-champagne leading-relaxed font-sans">
                      No past commissions found under <span className="text-warm-ivory font-mono">{patronLookupResult.email}</span>.
                    </p>
                    <p className="text-[11px] text-champagne/60 leading-relaxed font-sans">
                      Your allocations, bespoke formulation records, and live courier tracking will appear here as soon as your first commission is placed.
                    </p>
                    <Link
                      to="/collection"
                      onClick={() => setIsAccountModalOpen(false)}
                      className="inline-block mt-2 px-5 py-2 text-[10px] uppercase tracking-[0.2em] bg-[#2A241F] border border-antique-gold/40 text-antique-gold hover:bg-antique-gold hover:text-deep-espresso transition-colors font-sans"
                    >
                      Explore Collection
                    </Link>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setPatronLookupResult(null)}
                  className="w-full py-2 text-center text-xs text-champagne/70 hover:text-warm-ivory underline font-sans"
                >
                  Lookup Another Email
                </button>
              </div>
            ) : (
              <form onSubmit={handlePatronLookup} className="space-y-4 mb-6 text-left">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-champagne font-sans mb-1">
                    Patron / Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={patronEmail}
                    onChange={(e) => setPatronEmail(e.target.value)}
                    placeholder="patron@domain.com"
                    className="w-full px-4 py-3 bg-deep-espresso border border-[#3B332B] text-sm outline-none focus:border-antique-gold text-warm-ivory placeholder-champagne/40 font-sans"
                  />
                </div>

                {patronError && (
                  <p className="text-xs text-rose-400 font-sans">{patronError}</p>
                )}

                <button
                  type="submit"
                  disabled={patronLookupLoading}
                  className="w-full min-h-[46px] bg-antique-gold text-deep-espresso py-3 text-xs uppercase tracking-[0.2em] hover:bg-champagne transition-colors font-sans font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {patronLookupLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Record...</span>
                    </>
                  ) : (
                    <span>Request Access Pass / View Orders</span>
                  )}
                </button>
              </form>
            )}

            <div className="flex flex-col items-center space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(false)}
                className="text-xs text-champagne/80 underline hover:text-antique-gold font-sans"
              >
                Return to Boutique
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAccountModalOpen(false);
                  navigate('/admin/login');
                }}
                className="text-[10px] uppercase tracking-[0.24em] text-[#71717A] hover:text-antique-gold transition-colors font-mono pt-3 border-t border-[#3B332B]/50 w-full text-center"
              >
                Maison Atelier Management Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Modals and Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenCart={openCart}
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ScentProfilerModal
        isOpen={isProfilerOpen}
        onClose={() => setIsProfilerOpen(false)}
      />
      <ScentMoodMatcherModal
        isOpen={isMoodMatcherOpen}
        onClose={() => setIsMoodMatcherOpen(false)}
      />
    </>
  );
};
