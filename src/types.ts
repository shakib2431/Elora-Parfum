export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string; // e.g. "Fresh · Floral · Musky"
  size: string; // "100ml" or "4 x 20ml"
  type: string; // "Eau de Parfum"
  price: number; // in INR e.g. 1499
  compareAtPrice?: number; // e.g. 1999
  tagline: string;
  description: string;
  editorialQuote: string;
  notes: FragranceNotes;
  accords: string[];
  intensity: number; // 1 to 5
  longevity: string; // "10 - 12 Hours"
  projection: string; // "Moderate to Intimate"
  gender: string; // "Unisex"
  occasion: string; // "Evening & Signature Occasions"
  bottleTheme: {
    liquidGradient: [string, string];
    capFinish: 'gold' | 'black' | 'silver' | 'brass';
    accentColor: string;
    glassTint: string;
    labelBg: string;
    labelText: string;
  };
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  bundleConfig?: {
    title: string;
    fragrances: string[];
  };
}

export interface BundleOption {
  bottleCount: 2 | 3 | 4;
  title: string;
  discountPercentage: number;
  fixedPrice: number;
  originalPrice: number;
}

export interface MoodMatchResult {
  moodTitle: string;
  vibeKeywords: string[];
  colorPaletteAnalysis: string;
  recommendedFragranceSlug: string;
  recommendedFragranceName: string;
  matchConfidence: number;
  poeticRationale: string;
  applicationRitual: string;
}

export interface LayeringPairing {
  id: string;
  title: string;
  flacon1Slug: string;
  flacon2Slug: string;
  vibe: string;
  harmonyScore: number;
  fusedTopNotes: string[];
  fusedHeartNotes: string[];
  fusedBaseNotes: string[];
  olfactorySymphony: string;
  perfumerTip: string;
  recommendedRatio: string;
}

export type OrderStatusStep =
  | 'confirmed'
  | 'compounding'
  | 'bottled'
  | 'dispatched'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

export interface OrderItemRecord {
  productId: string;
  name: string;
  subtitle: string;
  size: string;
  price: number;
  quantity: number;
  slug: string;
  category?: string;
}

export interface OrderCheckpoint {
  title: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderRecord {
  orderNumber: string;
  placedAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  shippingAddress: string;
  city: string;
  state: string;
  postalCode: string;
  items: OrderItemRecord[];
  subtotal: number;
  discount: number;
  giftWrap: boolean;
  giftWrapFee: number;
  giftMessage?: string;
  total: number;
  paymentMethod: string;
  status: OrderStatusStep;
  statusLabel: string;
  estimatedDelivery: string;
  carrier: string;
  trackingNumber: string;
  temperatureControlled: boolean;
  tamperSealNumber: string;
  checkpoints: OrderCheckpoint[];
  isVip?: boolean;
}

export interface WearTestMetrics {
  hoursLongevity: number; // e.g. 14
  sillage: 'skin_scent' | 'intimate' | 'moderate' | 'radiant' | 'sovereign';
  weatherTested: string; // e.g. "Autumn Rain 19°C", "Crisp Evening", "Sunlit Afternoon"
  occasions: string[]; // e.g. ["Executive Gala", "Intimate Dinner"]
  openingImpression: string;
  drydownEvolution: string;
  layeringPairingTested?: string;
  verdictQuote: string;
}

export interface OlfactoryJournalEntry {
  id: string;
  fragranceId: string;
  fragranceSlug: string;
  fragranceName: string;
  concentration: string; // e.g. "25% Extrait de Parfum"
  rating: number; // 1 to 5 stars
  recordedAt: string;
  purchasedDate: string;
  batchNumber: string;
  wearTest: WearTestMetrics;
  personalReflections: string;
  favoredLayeringCombination?: string;
  authorName: string;
  authorPatronId: string;
}

export interface PriveRewardItem {
  id: string;
  title: string;
  editionSubtitle: string;
  category: string;
  size: string;
  concentration: string;
  pointsRequired: number;
  availableQuantity: number;
  description: string;
  notes: string[];
  rarityBadge: string;
  flaconColor: string;
}

export interface PriveTransaction {
  id: string;
  date: string;
  description: string;
  pointsChange: number;
  type: 'earned' | 'redeemed';
}

