import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';

export const FavoritesOverlay: React.FC = () => {
  const {
    isFavoritesOverlayOpen,
    closeFavorites,
    favoriteProducts,
    removeFromFavorites,
    clearFavorites,
  } = useWishlist();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFavoritesOverlayOpen) {
        closeFavorites();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFavoritesOverlayOpen, closeFavorites]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isFavoritesOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFavoritesOverlayOpen]);

  if (!isFavoritesOverlayOpen) return null;

  const handleAddSingleToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleAddAllToCart = () => {
    favoriteProducts.forEach((product) => {
      addToCart(product, 1);
    });
    closeFavorites();
  };

  const totalValue = favoriteProducts.reduce((sum, item) => sum + item.price, 0);

  return (
    <div
      id="favorites-overlay-backdrop"
      className="fixed inset-0 z-50 bg-[#08060D]/85 backdrop-blur-md transition-opacity duration-300 flex justify-end"
      onClick={closeFavorites}
    >
      <div
        id="favorites-overlay-drawer"
        className="w-full sm:max-w-md md:max-w-lg bg-[#140E1F] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-right duration-300 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-[#191325] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-400/30">
              <Heart className="w-4 h-4 fill-rose-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-lg font-bold tracking-wide text-white uppercase">
                  Private Wardrobe
                </h3>
                {favoriteProducts.length > 0 && (
                  <span className="text-[10px] uppercase font-sans font-bold bg-white/10 px-2 py-0.5 rounded-full text-rose-300 border border-white/10">
                    {favoriteProducts.length} {favoriteProducts.length === 1 ? 'Flacon' : 'Flacons'}
                  </span>
                )}
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-purple-300/70 font-sans">
                Curated Favorites & Wishlist
              </p>
            </div>
          </div>

          <button
            id="close-favorites-overlay-btn"
            onClick={closeFavorites}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-purple-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close favorites overlay"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {favoriteProducts.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-[#1F172E] border border-white/15 flex items-center justify-center text-rose-300/60 mb-2">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-medium text-white">
                Your Wardrobe is Empty
              </h4>
              <p className="text-xs sm:text-sm text-purple-200/70 max-w-xs font-sans leading-relaxed">
                You have not saved any flacons yet. Tap the heart icon on any perfume to curate your personal scent rotation.
              </p>
              <div className="pt-2">
                <Link
                  to="/collections/shop-all"
                  onClick={closeFavorites}
                  className="inline-flex items-center space-x-2 bg-white text-[#120E1A] px-6 py-3 rounded-full text-xs font-sans font-bold tracking-[0.2em] uppercase hover:bg-white/90 transition-all shadow-xl"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Discover Flacons</span>
                </Link>
              </div>
            </div>
          ) : (
            /* List of Favorited Perfumes */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-purple-300/70 font-sans font-semibold">
                  Saved Perfumes
                </span>
                <button
                  onClick={clearFavorites}
                  className="text-[10px] uppercase tracking-wider text-purple-300/60 hover:text-rose-300 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {favoriteProducts.map((product) => {
                const isJustAdded = addedId === product.id;
                return (
                  <div
                    key={product.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#191325] border border-white/10 hover:border-purple-400/40 transition-all flex items-center gap-3 sm:gap-4 group relative"
                  >
                    {/* Flacon Visualizer Thumbnail */}
                    <Link
                      to={`/products/${product.slug}`}
                      onClick={closeFavorites}
                      className="w-16 h-20 sm:w-20 sm:h-24 bg-gradient-to-b from-[#241A35] to-[#140E20] rounded-xl border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative"
                    >
                      <div className="scale-75 sm:scale-80 transform group-hover:scale-90 transition-transform">
                        <EloraBottleVisualizer product={product} size="sm" showPedestal={false} />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[8.5px] uppercase tracking-widest text-rose-300 font-sans truncate font-semibold">
                        {product.category}
                      </p>
                      <Link
                        to={`/products/${product.slug}`}
                        onClick={closeFavorites}
                        className="font-serif text-base sm:text-lg font-semibold text-white group-hover:text-rose-200 transition-colors block truncate"
                      >
                        {product.name}
                      </Link>
                      <p className="text-[10px] text-purple-200/60 font-sans truncate">
                        {product.size} · 25% Extrait
                      </p>

                      <div className="flex items-center space-x-2 mt-1.5">
                        <span className="font-sans text-sm font-bold text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.compareAtPrice && (
                          <span className="font-sans text-xs text-purple-300/50 line-through">
                            ₹{product.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Add to Bag & Remove */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeFromFavorites(product.id)}
                        className="p-2 text-purple-300/60 hover:text-rose-400 hover:bg-white/5 rounded-full transition-colors"
                        title="Remove from favorites"
                        aria-label={`Remove ${product.name} from favorites`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleAddSingleToCart(product, e)}
                        className={`min-h-[36px] px-3 sm:px-4 py-1.5 rounded-full text-xs font-sans font-semibold tracking-wider uppercase flex items-center space-x-1.5 transition-all shadow-md ${
                          isJustAdded
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-[#120E1A] hover:bg-white/95'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-[#120E1A]" />
                            <span className="hidden xs:inline">Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Bar if items exist */}
        {favoriteProducts.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-white/10 bg-[#0E0A16] space-y-3">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-purple-300/80">Total Wardrobe Value:</span>
              <span className="text-base font-bold text-white">
                ₹{totalValue.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleAddAllToCart}
              className="w-full min-h-[48px] py-3.5 bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 text-[#120E1A] font-sans font-bold text-xs uppercase tracking-[0.25em] rounded-full hover:opacity-95 transition-all flex items-center justify-center space-x-2 shadow-xl"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Bag</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
