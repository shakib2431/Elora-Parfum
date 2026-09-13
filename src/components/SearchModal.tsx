import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.notes.top.some((n) => n.toLowerCase().includes(q)) ||
          p.notes.heart.some((n) => n.toLowerCase().includes(q)) ||
          p.notes.base.some((n) => n.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#08060D]/80 backdrop-blur-md flex flex-col justify-start pt-3 sm:pt-20 px-3 sm:px-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        id="search-modal-content"
        className="w-full max-w-2xl mx-auto bg-[#120E1A] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-6 py-3.5 sm:py-5 border-b border-white/10 bg-[#191325]">
          <Search className="w-5 h-5 text-rose-300 mr-2.5 sm:mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search fragrances, notes (e.g. Amber, Oud)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white font-sans text-base outline-none placeholder-purple-300/40"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-2 text-purple-300/70 hover:text-white mr-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-[75vh] sm:max-h-[65vh] overflow-y-auto p-4 sm:p-6 bg-[#120E1A]">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-purple-300/70 mb-4 font-sans font-medium">
                Featured Fragrances
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {PRODUCTS.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.slug}`}
                    onClick={onClose}
                    className="group block p-3.5 bg-[#191325] border border-white/10 hover:border-purple-400/40 rounded-2xl transition-all text-center"
                  >
                    <div className="w-16 h-20 mx-auto mb-2">
                      <EloraBottleVisualizer product={item} size="sm" showPedestal={false} />
                    </div>
                    <span className="block font-serif text-sm tracking-wider font-semibold text-white truncate">
                      {item.name}
                    </span>
                    <span className="block text-[11px] text-purple-300/70 tracking-wider mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-300/70 mb-3 font-sans font-medium">
                  Popular Olfactory Notes
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Bergamot', 'Oud', 'White Musk', 'Amber', 'Bourbon Vanilla', 'Sandalwood'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="text-xs bg-white/10 px-3.5 py-1.5 border border-white/15 rounded-full text-purple-200 hover:border-purple-400 hover:text-white hover:bg-white/20 transition-all"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-300/70 font-sans">
                Found {filtered.length} {filtered.length === 1 ? 'fragrance' : 'fragrances'}
              </p>
              <div className="divide-y divide-white/10">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center py-3.5 px-3 hover:bg-white/5 rounded-xl transition-colors group"
                  >
                    <div className="w-14 h-16 flex-shrink-0 mr-4">
                      <EloraBottleVisualizer product={product} size="sm" showPedestal={false} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-baseline justify-between">
                        <h4 className="font-serif text-lg tracking-wider text-white group-hover:text-rose-300 transition-colors">
                          {product.name}
                        </h4>
                        <span className="font-sans text-sm font-medium text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs text-purple-300/70 tracking-wide mt-0.5">
                        {product.category} · {product.size}
                      </p>
                      <p className="text-[11px] text-purple-200/50 mt-1 line-clamp-1 italic font-serif">
                        "{product.tagline}"
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-rose-300 ml-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-serif text-xl text-white mb-2">No fragrances found</p>
              <p className="text-sm text-purple-200/70 max-w-sm mx-auto mb-6">
                We couldn't find any results matching "{query}". Explore our core haute collection.
              </p>
              <Link
                to="/collections/shop-all"
                onClick={onClose}
                className="inline-block text-xs uppercase tracking-[0.22em] bg-white text-[#120E1A] font-semibold px-8 py-3.5 rounded-full hover:bg-white/90 shadow-lg transition-all"
              >
                View Complete Collection
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
