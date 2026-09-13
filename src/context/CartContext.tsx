import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number, selectedSize?: string, bundleConfig?: CartItem['bundleConfig']) => void;
  removeFromCart: (productId: string, bundleTitle?: string) => void;
  updateQuantity: (productId: string, quantity: number, bundleTitle?: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string;
  promoError: string;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
  giftMessage: string;
  setGiftMessage: (msg: string) => void;
  isGiftOrder: boolean;
  setIsGiftOrder: (val: boolean) => void;
  isGiftWrapSelected: boolean;
  setIsGiftWrapSelected: (val: boolean) => void;
  giftWrapFee: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'elora_parfum_cart_v1';
const PROMO_STORAGE_KEY = 'elora_parfum_promo_v1';
const GIFT_MSG_STORAGE_KEY = 'elora_parfum_gift_msg_v1';
const GIFT_ORDER_STORAGE_KEY = 'elora_parfum_gift_order_v1';
const GIFT_WRAP_STORAGE_KEY = 'elora_parfum_gift_wrap_v1';
export const PREMIUM_GIFT_WRAP_FEE = 250;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [giftMessage, setGiftMessageState] = useState<string>(() => {
    try {
      return localStorage.getItem(GIFT_MSG_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [isGiftOrder, setIsGiftOrderState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GIFT_ORDER_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isGiftWrapSelected, setIsGiftWrapSelectedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GIFT_WRAP_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const setGiftMessage = (msg: string) => {
    setGiftMessageState(msg);
    try {
      if (msg) {
        localStorage.setItem(GIFT_MSG_STORAGE_KEY, msg);
      } else {
        localStorage.removeItem(GIFT_MSG_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setIsGiftOrder = (val: boolean) => {
    setIsGiftOrderState(val);
    try {
      localStorage.setItem(GIFT_ORDER_STORAGE_KEY, String(val));
    } catch (e) {
      console.error(e);
    }
  };

  const setIsGiftWrapSelected = (val: boolean) => {
    setIsGiftWrapSelectedState(val);
    try {
      localStorage.setItem(GIFT_WRAP_STORAGE_KEY, String(val));
    } catch (e) {
      console.error(e);
    }
  };

  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, appliedPromo);
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save promo to localStorage', e);
    }
  }, [appliedPromo]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedSize?: string,
    bundleConfig?: CartItem['bundleConfig']
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => {
        if (bundleConfig && item.bundleConfig) {
          return item.bundleConfig.title === bundleConfig.title;
        }
        return item.product.id === product.id && item.selectedSize === (selectedSize || product.size);
      });

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: selectedSize || product.size,
          bundleConfig,
        },
      ];
    });

    showToast(`Added ${bundleConfig ? bundleConfig.title : product.name} to your cart`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, bundleTitle?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (bundleTitle && item.bundleConfig) {
          return item.bundleConfig.title !== bundleTitle;
        }
        return item.product.id !== productId;
      })
    );
  };

  const updateQuantity = (productId: string, quantity: number, bundleTitle?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, bundleTitle);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        const matches = bundleTitle && item.bundleConfig
          ? item.bundleConfig.title === bundleTitle
          : item.product.id === productId;
        return matches ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Discount calculation
  let discountRate = 0;
  if (appliedPromo === 'ELORA10') {
    discountRate = 0.10;
  } else if (appliedPromo === 'BUNDLE15' || appliedPromo === 'WELCOME15' || appliedPromo === 'EARLY500') {
    discountRate = 0.15;
  } else if (appliedPromo === 'PRIVILEGE20') {
    discountRate = 0.20;
  }

  const discount = Math.round(subtotal * discountRate);
  const giftWrapFee = isGiftWrapSelected ? PREMIUM_GIFT_WRAP_FEE : 0;
  const total = Math.max(0, subtotal - discount) + giftWrapFee;

  const applyPromoCode = (code: string): boolean => {
    const sanitized = code.trim().toUpperCase();
    if (
      sanitized === 'ELORA10' ||
      sanitized === 'BUNDLE15' ||
      sanitized === 'WELCOME15' ||
      sanitized === 'PRIVILEGE20' ||
      sanitized === 'EARLY500'
    ) {
      setAppliedPromo(sanitized);
      setPromoError('');
      showToast(
        sanitized === 'EARLY500'
          ? 'Early Launch Privilege EARLY500 applied: 15% OFF Batch 001!'
          : `Offer ${sanitized} applied successfully!`
      );
      return true;
    }
    setPromoError('Invalid offer code. Try "EARLY500" or "ELORA10"');
    return false;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discount,
        total,
        promoCode,
        promoError,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        notification,
        setNotification,
        giftMessage,
        setGiftMessage,
        isGiftOrder,
        setIsGiftOrder,
        isGiftWrapSelected,
        setIsGiftWrapSelected,
        giftWrapFee,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
