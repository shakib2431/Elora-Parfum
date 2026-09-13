import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PriveRewardItem, PriveTransaction } from '../types';
import { PRIVE_LIMITED_EDITIONS, PRIVE_TIERS } from '../data/priveData';

interface PriveLoyaltyContextType {
  points: number;
  tierName: string;
  nextTierPointsNeeded: number;
  tierProgressPercent: number;
  transactions: PriveTransaction[];
  redeemedRewardIds: string[];
  isPriveModalOpen: boolean;
  selectedRewardForRedeem: PriveRewardItem | null;
  addPoints: (amount: number, description?: string) => void;
  redeemReward: (reward: PriveRewardItem) => { success: boolean; voucherCode?: string; message: string };
  openPriveModal: (reward?: PriveRewardItem) => void;
  closePriveModal: () => void;
  rewards: PriveRewardItem[];
}

const STORAGE_POINTS_KEY = 'elora_prive_points_v1';
const STORAGE_TRANSACTIONS_KEY = 'elora_prive_transactions_v1';
const STORAGE_REDEEMED_KEY = 'elora_prive_redeemed_v1';

const INITIAL_TRANSACTIONS: PriveTransaction[] = [
  {
    id: 'tx-1',
    date: '02 Aug 2026',
    description: 'Purchase: NOIR Extrait 100ml flacon allocation',
    pointsChange: 200,
    type: 'earned',
  },
  {
    id: 'tx-2',
    date: '15 Jul 2026',
    description: 'Purchase: AURA Extrait 100ml flacon allocation',
    pointsChange: 150,
    type: 'earned',
  },
  {
    id: 'tx-3',
    date: '20 Aug 2026',
    description: 'Purchase: OUD ÉLITE Extrait 100ml flacon allocation',
    pointsChange: 250,
    type: 'earned',
  },
  {
    id: 'tx-welcome',
    date: '01 Jul 2026',
    description: 'Genesis Atelier Patron Welcome Privilege',
    pointsChange: 850,
    type: 'earned',
  },
];

const PriveLoyaltyContext = createContext<PriveLoyaltyContextType | undefined>(undefined);

export const PriveLoyaltyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POINTS_KEY);
      return saved ? parseInt(saved, 10) : 1450;
    } catch {
      return 1450;
    }
  });

  const [transactions, setTransactions] = useState<PriveTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRANSACTIONS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [redeemedRewardIds, setRedeemedRewardIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REDEEMED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isPriveModalOpen, setIsPriveModalOpen] = useState(false);
  const [selectedRewardForRedeem, setSelectedRewardForRedeem] = useState<PriveRewardItem | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_POINTS_KEY, points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REDEEMED_KEY, JSON.stringify(redeemedRewardIds));
  }, [redeemedRewardIds]);

  // Determine current tier
  let tierName = 'Atelier Circle';
  let nextTierPointsNeeded = 1000 - points;
  let tierProgressPercent = Math.min(100, Math.max(0, (points / 1000) * 100));

  if (points >= 2500) {
    tierName = 'Obsidian Reserve';
    nextTierPointsNeeded = 0;
    tierProgressPercent = 100;
  } else if (points >= 1000) {
    tierName = 'Amber Concierge';
    nextTierPointsNeeded = 2500 - points;
    tierProgressPercent = Math.min(100, Math.max(0, ((points - 1000) / 1500) * 100));
  }

  const addPoints = (amount: number, description = 'Atelier Flacon Purchase') => {
    if (amount <= 0) return;
    setPoints((prev) => prev + amount);
    const newTx: PriveTransaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      description,
      pointsChange: amount,
      type: 'earned',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const redeemReward = (reward: PriveRewardItem) => {
    if (points < reward.pointsRequired) {
      return {
        success: false,
        message: `Insufficient Privé points. You require ${reward.pointsRequired - points} more points to claim this private reserve flacon.`,
      };
    }

    const voucherCode = `PRIVE-${reward.id.replace('prive-', '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setPoints((prev) => prev - reward.pointsRequired);
    setRedeemedRewardIds((prev) => [...prev, reward.id]);

    const newTx: PriveTransaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      description: `Redeemed: ${reward.title} (${reward.size})`,
      pointsChange: -reward.pointsRequired,
      type: 'redeemed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      voucherCode,
      message: `Congratulations. Your private allocation certificate for ${reward.title} has been authorized. Flacon dispatched under seal ${voucherCode}.`,
    };
  };

  const openPriveModal = (reward?: PriveRewardItem) => {
    if (reward) setSelectedRewardForRedeem(reward);
    setIsPriveModalOpen(true);
  };

  const closePriveModal = () => {
    setIsPriveModalOpen(false);
    setSelectedRewardForRedeem(null);
  };

  return (
    <PriveLoyaltyContext.Provider
      value={{
        points,
        tierName,
        nextTierPointsNeeded,
        tierProgressPercent,
        transactions,
        redeemedRewardIds,
        isPriveModalOpen,
        selectedRewardForRedeem,
        addPoints,
        redeemReward,
        openPriveModal,
        closePriveModal,
        rewards: PRIVE_LIMITED_EDITIONS,
      }}
    >
      {children}
    </PriveLoyaltyContext.Provider>
  );
};

export const usePriveLoyalty = (): PriveLoyaltyContextType => {
  const context = useContext(PriveLoyaltyContext);
  if (!context) {
    throw new Error('usePriveLoyalty must be used within a PriveLoyaltyProvider');
  }
  return context;
};
