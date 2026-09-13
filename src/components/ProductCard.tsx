import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Check, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const isFav = isFavorite(product.id) || isFavorite(product.slug);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div
      id={`product-card-${product.slug}`}
      className="group bg-[#14141B] border border-[#262633] flex flex-col justify-between transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_16px_40px_rgba(0,0,0,0.7)] select-none relative"
    >
      {/* Product Flacon Stage */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-gradient-to-b from-[#181722] via-[#121219] to-[#0D0D12] p-4 sm:p-6 flex items-center justify-center overflow-hidden border-b border-[#262633]">
        {/* Wishlist Icon */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors focus:outline-none"
          aria-label={isFav ? `Remove ${product.name} from private wardrobe` : `Save ${product.name} to private wardrobe`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.5] ${isFav ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
        </button>

        {/* Flacon Visualizer with gentle hover zoom */}
        <Link
          to={`/products/${product.slug}`}
          className="w-full h-full flex items-center justify-center relative z-10"
        >
          <div className="transform group-hover:scale-[1.03] transition-transform duration-700 ease-out">
            <EloraBottleVisualizer product={product} size="md" showPedestal={true} />
          </div>
        </Link>

        {/* Subtle hover quick action button on desktop */}
        <div className="absolute bottom-3 inset-x-3 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2.5 bg-[#D4AF37] text-[#0A0A0C] text-[10px] uppercase tracking-[0.22em] font-sans font-semibold hover:bg-[#E5C378] transition-colors flex items-center justify-center space-x-1.5 shadow-lg"
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 text-[#0A0A0C]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 text-[#0A0A0C]" />
                <span>Quick Add · ₹{product.price.toLocaleString('en-IN')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Minimalist Editorial Information */}
      <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow bg-[#14141B] text-center space-y-3">
        <div className="space-y-1">
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-serif text-lg sm:text-2xl tracking-[0.08em] text-[#FFFFFF] group-hover:text-[#D4AF37] transition-colors font-normal uppercase">
              {product.name}
            </h3>
          </Link>

          <p className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.28em] text-[#A1A1AA]">
            EAU DE PARFUM
          </p>

          <p className="text-[10px] sm:text-xs font-sans text-[#D4D4D8] tracking-[0.14em] uppercase pt-0.5">
            {product.category.replace(/·/g, '·')}
          </p>
        </div>

        <div className="pt-2 border-t border-[#262633] flex items-center justify-between">
          <span className="font-sans text-xs sm:text-sm font-medium tracking-[0.06em] text-[#D4AF37]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          <Link
            to={`/products/${product.slug}`}
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans text-[#FAF9F6] hover:text-[#D4AF37] flex items-center space-x-1 transition-colors"
          >
            <span>DISCOVER</span>
            <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
          </Link>
        </div>

        {/* Mobile Quick Add Row */}
        <div className="sm:hidden pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2 text-[9px] uppercase tracking-[0.2em] font-sans transition-colors border ${
              isAdded
                ? 'bg-[#D4AF37] text-[#0A0A0C] border-[#D4AF37] font-semibold'
                : 'bg-transparent text-[#FAF9F6] border-[#262633] active:bg-[#D4AF37] active:text-[#0A0A0C]'
            }`}
          >
            {isAdded ? 'Added' : '+ Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  );
};
