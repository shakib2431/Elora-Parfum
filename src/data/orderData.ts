import { OrderRecord } from '../types';

const STORAGE_KEY = 'elora_stored_orders_v1';

export const SAMPLE_ORDERS: OrderRecord[] = [
  {
    orderNumber: 'ELO-98421',
    placedAt: 'September 10, 2026 · 14:22 IST',
    clientName: 'Elena Vance',
    clientEmail: 'elena.vance@elora-atelier.com',
    clientPhone: '+91 98201 44820',
    shippingAddress: 'Penthouse 14, Residence Villa Serene, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    items: [
      {
        productId: 'elora-noir',
        name: 'NOIR',
        subtitle: 'Warm · Woody · Amber',
        size: '100ml Extrait de Parfum',
        price: 1599,
        quantity: 1,
        slug: 'noir',
        category: 'Warm · Woody · Amber',
      },
      {
        productId: 'elora-eclat',
        name: 'ÉCLAT',
        subtitle: 'Fresh · Citrus · Aromatic',
        size: '100ml Extrait de Parfum',
        price: 1499,
        quantity: 1,
        slug: 'eclat',
        category: 'Fresh · Citrus · Aromatic',
      },
    ],
    subtotal: 3098,
    discount: 464, // 15% duo layering discount
    giftWrap: true,
    giftWrapFee: 250,
    giftMessage: 'Pour Elena — celebrating timeless nocturnal elegance and sunlit days.',
    total: 2884,
    paymentMethod: 'Visa Infinite Luxury (•••• 8819)',
    status: 'in_transit',
    statusLabel: 'In Transit via Climate-Controlled White-Glove Air',
    estimatedDelivery: 'Tomorrow, September 12 by 11:30 AM',
    carrier: 'Sequioa Luxury Logistics / Blue Dart Air Special Handling',
    trackingNumber: 'SLL-88392-IND',
    temperatureControlled: true,
    tamperSealNumber: 'SEAL-GRS-8839-GOLD',
    isVip: true,
    checkpoints: [
      {
        title: 'Order Confirmed & Allocated',
        location: 'Elora Private Client Concierge, Grasse & Mumbai',
        timestamp: 'Sep 10, 2026 · 14:22 IST',
        description: 'VIP Gold allocation authenticated. Flacons reserved from Genesis Batch 001.',
        completed: true,
      },
      {
        title: 'Artisanal Compounding & Maturation',
        location: 'Haute Parfumerie Atelier, Grasse, France',
        timestamp: 'Sep 10, 2026 · 16:45 IST',
        description: '25% concentrated oil formulation hand-inspected under cleanroom conditions.',
        completed: true,
      },
      {
        title: 'Flacon Polishing & Custom Wax Seal',
        location: 'Finishing Atelier, Grasse',
        timestamp: 'Sep 10, 2026 · 19:30 IST',
        description: 'Solid zamak cap affixed. Stamped with crimson Elora wax seal #247/500.',
        completed: true,
      },
      {
        title: 'Dispatched to Climate-Controlled Cargo',
        location: 'Nice Côte d’Azur International Airport (NCE)',
        timestamp: 'Sep 11, 2026 · 02:15 IST',
        description: 'Loaded into insulated 18°C temperature-guarded diplomatic freight containers.',
        completed: true,
      },
      {
        title: 'Arrived at Domestic Air Hub',
        location: 'Chhatrapati Shivaji Maharaj Airport (BOM), Mumbai',
        timestamp: 'Sep 11, 2026 · 10:40 IST',
        description: 'Customs cleared with diplomatic priority pass. Transferred to luxury ground courier.',
        completed: true,
        current: true,
      },
      {
        title: 'Out for White-Glove Hand Delivery',
        location: 'Bandra West Logistics Depot, Mumbai',
        timestamp: 'Sep 12, 2026 · Expected 09:30 IST',
        description: 'Dispatched in uniformed courier vehicle with physical identity verification.',
        completed: false,
      },
      {
        title: 'Delivered & Personal Handover',
        location: 'Residence Villa Serene, Bandra West',
        timestamp: 'Sep 12, 2026 · Expected 11:30 IST',
        description: 'Package accepted with recipient counter-signature.',
        completed: false,
      },
    ],
  },
  {
    orderNumber: 'ELO-10492',
    placedAt: 'September 11, 2026 · 08:15 IST',
    clientName: 'Aarav Singhania',
    clientEmail: 'aarav.singhania@heritage-holdings.in',
    clientPhone: '+91 99100 23419',
    shippingAddress: '42 Jor Bagh, Central Heritage District',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110003',
    items: [
      {
        productId: 'elora-oud-elite',
        name: 'OUD ÉLITE',
        subtitle: 'Oud · Smoky · Spicy',
        size: '100ml Extrait de Parfum',
        price: 1799,
        quantity: 1,
        slug: 'oud-elite',
        category: 'Oud · Smoky · Spicy',
      },
    ],
    subtotal: 1799,
    discount: 0,
    giftWrap: true,
    giftWrapFee: 250,
    giftMessage: 'To distinguished milestones and enduring presence.',
    total: 2049,
    paymentMethod: 'American Express Centurion (•••• 1002)',
    status: 'dispatched',
    statusLabel: 'Dispatched from Grasse Atelier',
    estimatedDelivery: 'September 13, 2026 by 16:00 IST',
    carrier: 'Sequioa Luxury Logistics Express',
    trackingNumber: 'SLL-44910-DEL',
    temperatureControlled: true,
    tamperSealNumber: 'SEAL-GRS-9912-GOLD',
    isVip: true,
    checkpoints: [
      {
        title: 'Order Confirmed & Allocation Reserved',
        location: 'Elora Private Client Concierge',
        timestamp: 'Sep 11, 2026 · 08:15 IST',
        description: 'Single harvest Cambodian Agarwood allocation verified.',
        completed: true,
      },
      {
        title: 'Compounding & Silk Coffret Assembly',
        location: 'Haute Parfumerie Atelier, Grasse',
        timestamp: 'Sep 11, 2026 · 11:00 IST',
        description: 'Finished with 24k gold leaf lettering and placed into velvet-lined presentation box.',
        completed: true,
      },
      {
        title: 'Handed to Dedicated Luxury Courier',
        location: 'Paris Charles de Gaulle Air Terminal',
        timestamp: 'Sep 11, 2026 · 14:30 IST',
        description: 'Flight manifest logged for direct air transit to Indira Gandhi International Airport.',
        completed: true,
        current: true,
      },
      {
        title: 'Domestic Air Transit',
        location: 'In Flight to New Delhi',
        timestamp: 'Sep 12, 2026 · Expected 06:00 IST',
        description: 'Scheduled arrival at Delhi Air Cargo Terminal.',
        completed: false,
      },
      {
        title: 'Delivered',
        location: 'Jor Bagh, New Delhi',
        timestamp: 'Sep 13, 2026 · Expected 16:00 IST',
        description: 'Final delivery handover.',
        completed: false,
      },
    ],
  },
  {
    orderNumber: 'ELO-55210',
    placedAt: 'September 07, 2026 · 11:00 IST',
    clientName: 'Meera Kapoor',
    clientEmail: 'meera.kapoor@atelier-design.com',
    clientPhone: '+91 98450 71822',
    shippingAddress: '18 Lavelle Road, Richmond Town',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    items: [
      {
        productId: 'elora-aura',
        name: 'AURA',
        subtitle: 'Fresh · Floral · Musky',
        size: '100ml Extrait de Parfum',
        price: 1499,
        quantity: 2,
        slug: 'aura',
        category: 'Fresh · Floral · Musky',
      },
    ],
    subtotal: 2998,
    discount: 300,
    giftWrap: false,
    giftWrapFee: 0,
    total: 2698,
    paymentMethod: 'UPI Instant Concierge (meera@okhdfcbank)',
    status: 'delivered',
    statusLabel: 'Delivered to Recipient',
    estimatedDelivery: 'Delivered on Sep 09, 2026 at 15:42 IST',
    carrier: 'Sequioa Luxury Logistics Express',
    trackingNumber: 'SLL-11029-BLR',
    temperatureControlled: true,
    tamperSealNumber: 'SEAL-GRS-3341-GOLD',
    isVip: false,
    checkpoints: [
      {
        title: 'Order Confirmed',
        location: 'Elora Concierge',
        timestamp: 'Sep 07, 2026 · 11:00 IST',
        description: 'Order placed and authenticated.',
        completed: true,
      },
      {
        title: 'Artisanal Preparation & Bottling',
        location: 'Grasse Atelier',
        timestamp: 'Sep 07, 2026 · 15:20 IST',
        description: 'Bottled and wax sealed.',
        completed: true,
      },
      {
        title: 'Dispatched via Air Courier',
        location: 'Paris CDG -> Bengaluru Kempegowda',
        timestamp: 'Sep 08, 2026 · 04:10 IST',
        description: 'Priority flight transit completed.',
        completed: true,
      },
      {
        title: 'Out for Handover Delivery',
        location: 'Bengaluru Central Depot',
        timestamp: 'Sep 09, 2026 · 11:30 IST',
        description: 'Assigned to courier officer.',
        completed: true,
      },
      {
        title: 'Delivered to Recipient',
        location: 'Lavelle Road, Bengaluru',
        timestamp: 'Sep 09, 2026 · 15:42 IST',
        description: 'Delivered and signed by Meera Kapoor. Packaging seal intact.',
        completed: true,
        current: true,
      },
    ],
  },
];

export function getAllSavedOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    }
    const parsed: OrderRecord[] = JSON.parse(raw);
    return parsed;
  } catch (e) {
    return SAMPLE_ORDERS;
  }
}

export function getOrderByNumber(orderNum: string): OrderRecord | null {
  if (!orderNum) return null;
  const clean = orderNum.trim().toUpperCase();
  const all = getAllSavedOrders();
  const found = all.find(
    (o) => o.orderNumber.toUpperCase() === clean || o.trackingNumber.toUpperCase() === clean
  );
  if (found) return found;

  // Fallback matching partial or lowercase
  const partial = all.find((o) => o.orderNumber.toUpperCase().includes(clean));
  if (partial) return partial;

  return null;
}

export function saveOrder(order: OrderRecord): void {
  try {
    const all = getAllSavedOrders();
    const existingIndex = all.findIndex((o) => o.orderNumber === order.orderNumber);
    if (existingIndex >= 0) {
      all[existingIndex] = order;
    } else {
      all.unshift(order);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }
}
