import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Gift, Tag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    total,
    cartCount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    giftMessage,
    setGiftMessage,
    isGiftOrder,
    setIsGiftOrder,
    isGiftWrapSelected,
    setIsGiftWrapSelected,
    giftWrapFee,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isGiftSectionOpen, setIsGiftSectionOpen] = useState(!!giftMessage || isGiftOrder);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = applyPromoCode(inputCode);
    if (ok) {
      setPromoMessage({ type: 'success', text: `Offer code ${inputCode.toUpperCase()} activated.` });
      setInputCode('');
    } else {
      setPromoMessage({ type: 'error', text: 'Invalid code. Use ELORA10 for 10% off.' });
    }
  };

  return (
    <>
      <div
        id="cart-drawer-backdrop"
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      >
        <div
          id="cart-drawer"
          className="fixed inset-y-0 right-0 h-full w-full sm:max-w-md bg-[#0E0E12] border-l border-[#24232C] shadow-2xl z-50 flex flex-col justify-between text-[#FAF9F6] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Cart Header */}
          <div className="px-6 py-5 border-b border-[#24232C] bg-[#14141B] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37] stroke-[1.5]" />
              <h2 className="font-serif text-lg tracking-[0.06em] text-[#FFFFFF] uppercase font-normal">
                Your Selection
              </h2>
              {cartCount > 0 && (
                <span className="text-[11px] font-sans text-[#A1A1AA] tracking-widest uppercase">
                  ({cartCount})
                </span>
              )}
            </div>
            <button
              id="cart-close-btn"
              onClick={closeCart}
              className="p-2 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Complimentary Discovery Vial Banner */}
          <div className="bg-[#101016] px-6 py-2.5 border-b border-[#24232C] flex items-center space-x-2 text-xs text-[#A1A1AA]">
            <Gift className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
            <span className="truncate">
              Complimentary 2ml discovery vial included with each flacon.
            </span>
          </div>

          {/* Cart Item List / Empty State */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div id="cart-empty-state" className="text-center py-20 space-y-4">
                <div className="w-12 h-12 rounded-full border border-[#24232C] flex items-center justify-center mx-auto text-[#A1A1AA]">
                  <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-2xl text-[#FFFFFF]">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto leading-relaxed font-sans">
                  Discover our timeless 25% Extrait de Parfum flacons or compose a private duet bundle.
                </p>
                <div className="pt-4">
                  <button
                    onClick={closeCart}
                    className="bg-[#D4AF37] text-[#0A0A0C] text-xs uppercase tracking-[0.24em] px-8 py-3.5 font-sans font-semibold hover:bg-[#E5C378] transition-colors shadow-md"
                  >
                    Explore Extraits
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="divide-y divide-[#24232C]">
                  {cart.map((item, index) => {
                    const isBundle = !!item.bundleConfig;
                    const itemTitle = isBundle ? item.bundleConfig!.title : item.product.name;
                    const itemSubtitle = isBundle
                      ? item.bundleConfig!.fragrances.join(' + ')
                      : `${item.selectedSize || item.product.size} · ${item.product.type}`;

                    return (
                      <div
                        key={`${item.product.id}-${index}`}
                        className="py-5 flex items-center space-x-4"
                      >
                        {/* Bottle Thumbnail */}
                        <div className="w-16 h-20 bg-[#14141B] border border-[#24232C] p-1 flex-shrink-0 flex items-center justify-center">
                          <EloraBottleVisualizer product={item.product} size="sm" showPedestal={false} />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-serif text-base text-[#FFFFFF] truncate">
                                {itemTitle}
                              </h4>
                              <p className="text-[11px] text-[#A1A1AA] font-sans tracking-wide mt-0.5 truncate">
                                {itemSubtitle}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.bundleConfig?.title)}
                              className="text-[#A1A1AA] hover:text-red-400 p-1 transition-colors"
                              aria-label={`Remove ${itemTitle} from cart`}
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-[#24232C] bg-[#14141B]">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1,
                                    item.bundleConfig?.title
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3 stroke-[1.5]" />
                              </button>
                              <span className="px-2 text-xs font-sans text-[#FFFFFF]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1,
                                    item.bundleConfig?.title
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3 stroke-[1.5]" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span className="font-sans text-xs font-semibold text-[#FFFFFF]">
                                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                              {item.product.compareAtPrice && !isBundle && (
                                <span className="block text-[10px] text-[#A1A1AA] line-through">
                                  ₹{(item.product.compareAtPrice * item.quantity).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Signature Gift Wrap Service */}
                <div className="mt-6 p-4 bg-[#14141B] border border-[#24232C]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 pr-2">
                      <Gift className="w-4 h-4 text-[#D4AF37]" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-serif uppercase text-[#FFFFFF] tracking-wider">
                            Signature Gift Coffret
                          </span>
                          <span className="text-[10px] font-sans text-[#D4AF37]">
                            +₹{giftWrapFee || 250}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A1A1AA] font-sans">
                          Wax seal, velvet ribbon & handwritten card
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={isGiftWrapSelected}
                      onClick={() => setIsGiftWrapSelected(!isGiftWrapSelected)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                        isGiftWrapSelected ? 'bg-[#D4AF37]' : 'bg-[#24232C]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0A0A0C] shadow transition duration-200 ${
                          isGiftWrapSelected ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Handwritten Gift Note Section */}
                <div className="mt-3 p-4 bg-[#14141B] border border-[#24232C]">
                  <button
                    type="button"
                    onClick={() => setIsGiftSectionOpen(!isGiftSectionOpen)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div>
                      <span className="text-xs font-serif uppercase text-[#FFFFFF] tracking-wider block">
                        Complimentary Gift Note
                      </span>
                      <p className="text-[11px] text-[#A1A1AA] font-sans mt-0.5">
                        {giftMessage.trim() ? 'Personalized message included' : 'Add an embossed calligraphy card'}
                      </p>
                    </div>
                    <span className="text-xs text-[#D4AF37] font-sans uppercase tracking-wider underline">
                      {isGiftSectionOpen ? 'Close' : giftMessage.trim() ? 'Edit' : '+ Add'}
                    </span>
                  </button>

                  {isGiftSectionOpen && (
                    <div className="mt-3 pt-3 border-t border-[#24232C] space-y-2">
                      <textarea
                        rows={3}
                        maxLength={250}
                        value={giftMessage}
                        onChange={(e) => {
                          setGiftMessage(e.target.value);
                          if (!isGiftOrder) setIsGiftOrder(true);
                        }}
                        placeholder="Write your personal note..."
                        className="w-full p-3 bg-[#0A0A0C] border border-[#24232C] text-xs text-[#FFFFFF] placeholder-[#A1A1AA]/50 outline-none focus:border-[#D4AF37] font-sans resize-none leading-relaxed"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="px-6 py-5 border-t border-[#24232C] bg-[#14141B] space-y-4">
              {/* Offer Code */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-[#0A0A0C] px-3.5 py-2 border border-[#24232C] text-xs">
                    <div className="flex items-center space-x-1.5 text-[#FFFFFF]">
                      <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Code <strong className="text-[#D4AF37]">{appliedPromo}</strong> applied</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-[11px] uppercase tracking-wider text-[#A1A1AA] hover:text-[#FFFFFF]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#A1A1AA]" />
                      <input
                        type="text"
                        placeholder="Privilege Code (try ELORA10)"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-[#0A0A0C] border border-[#24232C] text-xs text-[#FFFFFF] placeholder-[#A1A1AA]/60 outline-none focus:border-[#D4AF37] font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#24232C] text-[#FAF9F6] font-sans text-xs uppercase tracking-wider hover:bg-[#32313E] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {promoMessage && (
                  <p
                    className={`text-[11px] mt-1 ${
                      promoMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-[#A1A1AA] font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#FFFFFF]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>Privilege Savings</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {isGiftWrapSelected && (
                  <div className="flex justify-between text-[#A1A1AA]">
                    <span>Signature Gift Coffret</span>
                    <span className="text-[#FFFFFF]">+₹{giftWrapFee.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insulated Express Transit</span>
                  <span className="text-[#D4AF37] font-medium">COMPLIMENTARY</span>
                </div>
                <div className="pt-2 border-t border-[#24232C] flex justify-between font-serif text-lg text-[#FFFFFF]">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="space-y-2 pt-1">
                <button
                  id="cart-checkout-btn"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-[#D4AF37] text-[#0A0A0C] py-4 text-xs uppercase tracking-[0.24em] font-sans font-semibold hover:bg-[#E5C378] transition-colors flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
};
