import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onOpenCart }) => {
  const { openFavorites, favoritesCount } = useWishlist();
  if (!isOpen) return null;

  const menuItems = [
    { label: 'SHOP', path: '/collections/shop-all' },
    { label: 'COLLECTIONS', path: '/collections' },
    { label: 'BESTSELLERS', path: '/collections/bestsellers' },
    { label: 'ABOUT ELORA', path: '/pages/about' },
    { label: 'CONTACT', path: '/pages/contact' },
  ];

  return (
    <div
      id="mobile-menu-backdrop"
      className="fixed inset-0 z-50 bg-[#171614]/70 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        id="mobile-menu-drawer"
        className="fixed top-0 left-0 bottom-0 w-full sm:w-[420px] bg-[#F5F2EC] border-r border-[#D7D1C7] flex flex-col justify-between shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-left duration-300 text-[#171614]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div>
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#D7D1C7]">
            <Link to="/" onClick={onClose} className="block">
              <span className="font-serif text-lg tracking-[0.24em] font-medium text-[#171614] uppercase">
                ELORA PARFUM
              </span>
            </Link>
            <button
              id="mobile-menu-close-btn"
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center text-[#171614] hover:opacity-60 transition-opacity"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Large Editorial Nav Links */}
          <nav className="px-6 py-10">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.label} className="border-b border-[#D7D1C7]/60 pb-3">
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="group flex items-center justify-between font-serif text-2xl sm:text-3xl tracking-[0.1em] text-[#171614] hover:text-[#A88A5A] transition-colors uppercase"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#A88A5A] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Secondary Utility Links */}
            <div className="mt-10 pt-6 space-y-3 font-sans text-xs uppercase tracking-[0.2em] text-[#68645E]">
              <div>
                <Link
                  to="/bundle"
                  onClick={onClose}
                  className="block py-1 hover:text-[#171614] transition-colors"
                >
                  Custom Bundle Atelier
                </Link>
              </div>
              <div>
                <Link
                  to="/journal"
                  onClick={onClose}
                  className="block py-1 hover:text-[#171614] transition-colors"
                >
                  Olfactory Journal
                </Link>
              </div>
              <div>
                <Link
                  to="/order-status"
                  onClick={onClose}
                  className="block py-1 hover:text-[#171614] transition-colors"
                >
                  Order Status & Tracking
                </Link>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('open-concierge-chat'));
                  }}
                  className="py-1 text-[#A88A5A] hover:text-[#171614] transition-colors flex items-center space-x-2 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-[#A88A5A] animate-pulse" />
                  <span>Chat With Atelier Concierge</span>
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openFavorites();
                  }}
                  className="py-1 hover:text-[#171614] transition-colors flex items-center space-x-2"
                >
                  <Heart className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Private Wardrobe {favoritesCount > 0 ? `(${favoritesCount})` : ''}</span>
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Drawer Bottom Information */}
        <div className="p-6 border-t border-[#D7D1C7] bg-[#E9E4DB]/50">
          <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#68645E] mb-2">
            Haute Parfumerie
          </p>
          <p className="text-xs text-[#171614] font-serif italic">
            "Fragrance crafted to become part of your identity."
          </p>
          <div className="mt-4 flex items-center justify-between text-[11px] font-sans text-[#68645E]">
            <span>Maison Elora</span>
            <span>Worldwide Reserve</span>
          </div>
        </div>
      </div>
    </div>
  );
};
