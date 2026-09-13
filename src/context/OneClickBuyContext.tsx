import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

export interface RegisteredClientProfile {
  name: string;
  tier: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: string;
  savedCards: string[];
}

export interface OneClickCheckoutItem {
  product: Product;
  quantity: number;
  partnerProduct?: Product;
  isDuo?: boolean;
  duoTitle?: string;
  customPrice?: number;
}

interface OneClickBuyContextType {
  isOneClickModalOpen: boolean;
  activeItem: OneClickCheckoutItem | null;
  isRegisteredUser: boolean;
  clientProfile: RegisteredClientProfile;
  openOneClickBuy: (
    product: Product,
    quantity?: number,
    partnerProduct?: Product,
    isDuo?: boolean,
    duoTitle?: string
  ) => void;
  closeOneClickBuy: () => void;
  toggleRegisteredStatus: () => void;
  updateClientProfile: (partial: Partial<RegisteredClientProfile>) => void;
}

const DEFAULT_CLIENT_PROFILE: RegisteredClientProfile = {
  name: 'Elena Vance',
  tier: 'Elora Private Concierge Member #8824',
  email: 'elena.vance@elora-atelier.com',
  phone: '+91 98201 44820',
  shippingAddress: 'Penthouse 14, Residence Villa Serene, Bandra West',
  city: 'Mumbai',
  state: 'Maharashtra',
  postalCode: '400050',
  paymentMethod: 'Visa Infinite Luxury (•••• 8819)',
  savedCards: ['Visa Infinite Luxury (•••• 8819)', 'Mastercard World Elite (•••• 3042)', 'Instant UPI Concierge (elena@okhdfcbank)'],
};

const OneClickBuyContext = createContext<OneClickBuyContextType | undefined>(undefined);

export const OneClickBuyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOneClickModalOpen, setIsOneClickModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<OneClickCheckoutItem | null>(null);
  const [isRegisteredUser, setIsRegisteredUser] = useState(true);
  const [clientProfile, setClientProfile] = useState<RegisteredClientProfile>(() => {
    const saved = localStorage.getItem('elora_vip_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CLIENT_PROFILE;
      }
    }
    return DEFAULT_CLIENT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('elora_vip_profile', JSON.stringify(clientProfile));
  }, [clientProfile]);

  const openOneClickBuy = (
    product: Product,
    quantity = 1,
    partnerProduct?: Product,
    isDuo = false,
    duoTitle?: string
  ) => {
    setActiveItem({
      product,
      quantity,
      partnerProduct,
      isDuo,
      duoTitle,
    });
    setIsOneClickModalOpen(true);
  };

  const closeOneClickBuy = () => {
    setIsOneClickModalOpen(false);
    setActiveItem(null);
  };

  const toggleRegisteredStatus = () => {
    setIsRegisteredUser((prev) => !prev);
  };

  const updateClientProfile = (partial: Partial<RegisteredClientProfile>) => {
    setClientProfile((prev) => ({ ...prev, ...partial }));
  };

  return (
    <OneClickBuyContext.Provider
      value={{
        isOneClickModalOpen,
        activeItem,
        isRegisteredUser,
        clientProfile,
        openOneClickBuy,
        closeOneClickBuy,
        toggleRegisteredStatus,
        updateClientProfile,
      }}
    >
      {children}
    </OneClickBuyContext.Provider>
  );
};

export const useOneClickBuy = (): OneClickBuyContextType => {
  const context = useContext(OneClickBuyContext);
  if (!context) {
    throw new Error('useOneClickBuy must be used within a OneClickBuyProvider');
  }
  return context;
};
