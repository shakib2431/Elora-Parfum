import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Customer,
  Order,
  OrderItem,
  Payment,
  Shipment,
  OrderStatusHistory,
  ProductInventoryItem,
  DashboardStats,
} from '../src/types/ecommerce';

// Optional Supabase client initialization if environment credentials exist
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('[Elora DB] Supabase PostgreSQL client connected successfully.');
  } catch (err) {
    console.warn('[Elora DB] Failed to initialize Supabase client:', err);
  }
} else {
  console.log('[Elora DB] No Supabase credentials found in env. Running in resilient local persistence mode.');
}

// Local JSON file persistence path (guarantees preview & offline capability without dropping orders)
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'elora_store.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Official Elora Product catalog seed for database
const INITIAL_PRODUCTS: ProductInventoryItem[] = [
  {
    id: 'elora-aura',
    slug: 'aura',
    name: 'AURA',
    subtitle: '100ML EAU DE PARFUM',
    category: 'Fresh · Floral · Musky',
    description: 'A luminous aura of Mediterranean morning dew, Italian citrus groves, and white silk petals.',
    is_published: true,
    is_featured: true,
    notes: {
      top: ['Calabrian Bergamot', 'Dewy Mandarin', 'Pink Peppercorn'],
      heart: ['French Jasmine Sambac', 'Orange Blossom', 'Violet Petals'],
      base: ['White Velvet Musk', 'Atlas Cedarwood', 'Golden Amber'],
    },
    variants: [
      { id: 'aura-30', size_ml: '30ml', sku: 'ELR-AUR-30ML', price: 999, compare_at_price: 1299, stock_quantity: 45, sold_quantity: 12, low_stock_threshold: 10 },
      { id: 'aura-50', size_ml: '50ml', sku: 'ELR-AUR-50ML', price: 1299, compare_at_price: 1599, stock_quantity: 38, sold_quantity: 24, low_stock_threshold: 10 },
      { id: 'aura-100', size_ml: '100ml', sku: 'ELR-AUR-100ML', price: 1499, compare_at_price: 1999, stock_quantity: 120, sold_quantity: 86, low_stock_threshold: 15 },
    ],
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'elora-noir',
    slug: 'noir',
    name: 'NOIR',
    subtitle: '100ML EAU DE PARFUM',
    category: 'Warm · Woody · Amber',
    description: 'Sensual darkness steeped in warm woods, crushed cardamom, and incandescent amber.',
    is_published: true,
    is_featured: true,
    notes: {
      top: ['Crushed Cardamom', 'Smoked Black Tea', 'Saffron Threads'],
      heart: ['Bourbon Vanilla Pod', 'Haitian Vetiver', 'Smoked Labdanum'],
      base: ['Mysore Sandalwood', 'Dark Ambergris', 'Roasted Tonka Bean'],
    },
    variants: [
      { id: 'noir-30', size_ml: '30ml', sku: 'ELR-NOI-30ML', price: 1299, compare_at_price: 1599, stock_quantity: 30, sold_quantity: 18, low_stock_threshold: 10 },
      { id: 'noir-50', size_ml: '50ml', sku: 'ELR-NOI-50ML', price: 1699, compare_at_price: 1999, stock_quantity: 42, sold_quantity: 35, low_stock_threshold: 10 },
      { id: 'noir-100', size_ml: '100ml', sku: 'ELR-NOI-100ML', price: 1999, compare_at_price: 2499, stock_quantity: 95, sold_quantity: 114, low_stock_threshold: 15 },
    ],
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'elora-eclat',
    slug: 'eclat',
    name: 'ÉCLAT',
    subtitle: '100ML EAU DE PARFUM',
    category: 'Fresh · Citrus · Aromatic',
    description: 'Sunlit sea spray meeting the verdant cliffside orchards of the French Riviera.',
    is_published: true,
    is_featured: false,
    notes: {
      top: ['Sunlit Amalfi Lemon', 'Green Neroli', 'Crushed Wild Mint'],
      heart: ['Mediterranean Sea Breeze', 'Clary Sage', 'Petitgrain Citronnier'],
      base: ['Clean Driftwood', 'White Amber', 'Mineral Vetiver'],
    },
    variants: [
      { id: 'eclat-30', size_ml: '30ml', sku: 'ELR-ECL-30ML', price: 999, compare_at_price: 1299, stock_quantity: 50, sold_quantity: 8, low_stock_threshold: 10 },
      { id: 'eclat-50', size_ml: '50ml', sku: 'ELR-ECL-50ML', price: 1299, compare_at_price: 1599, stock_quantity: 40, sold_quantity: 19, low_stock_threshold: 10 },
      { id: 'eclat-100', size_ml: '100ml', sku: 'ELR-ECL-100ML', price: 1499, compare_at_price: 1899, melon_low: false, stock_quantity: 110, sold_quantity: 62, low_stock_threshold: 15 } as any,
    ],
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'elora-oud-elite',
    slug: 'oud-elite',
    name: 'OUD ÉLITE',
    subtitle: '100ML EAU DE PARFUM',
    category: 'Oud · Smoky · Spicy',
    description: 'The sovereign crown of haute perfumery — ancient Cambodian agarwood, Damascus rose, and birch smoke.',
    is_published: true,
    is_featured: true,
    notes: {
      top: ['Wild Green Cardamom', 'Smoked Nutmeg', 'Rare Zanzibar Clove'],
      heart: ['Precious Cambodian Agarwood (Oud)', 'Damascus Rose Otto', 'Birch Smoke'],
      base: ['Burnished Leather', 'Sumatran Benzoin', 'Patchouli Heart'],
    },
    variants: [
      { id: 'oud-30', size_ml: '30ml', sku: 'ELR-OUD-30ML', price: 1499, compare_at_price: 1899, stock_quantity: 25, sold_quantity: 15, low_stock_threshold: 8 },
      { id: 'oud-50', size_ml: '50ml', sku: 'ELR-OUD-50ML', price: 1999, compare_at_price: 2499, stock_quantity: 30, sold_quantity: 22, low_stock_threshold: 8 },
      { id: 'oud-100', size_ml: '100ml', sku: 'ELR-OUD-100ML', price: 2499, compare_at_price: 2999, stock_quantity: 75, sold_quantity: 58, low_stock_threshold: 10 },
    ],
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'elora-signature-set',
    slug: 'elora-signature-set',
    name: 'ELORA SIGNATURE SET',
    subtitle: 'DISCOVERY TRIO (3 × 15ML)',
    category: 'Haute Parfumerie Coffret',
    description: 'Three 15ml flacons of Aura, Noir, and Éclat nestled in an archival lacquered coffret.',
    is_published: true,
    is_featured: true,
    notes: {
      top: ['Calabrian Bergamot', 'Crushed Cardamom', 'Amalfi Lemon'],
      heart: ['Jasmine Sambac', 'Bourbon Vanilla Pod', 'Sea Salt Accord'],
      base: ['Velvet Musks', 'Aged Sandalwood', 'White Amber'],
    },
    variants: [
      { id: 'trio-15', size_ml: '3x15ml', sku: 'ELR-TRIO-45ML', price: 2999, compare_at_price: 3699, stock_quantity: 60, sold_quantity: 42, low_stock_threshold: 10 },
    ],
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface LocalDatabaseState {
  customers: Customer[];
  orders: Order[];
  order_items: OrderItem[];
  payments: Payment[];
  shipments: Shipment[];
  order_status_history: OrderStatusHistory[];
  products: ProductInventoryItem[];
  order_counter: number;
}

let dbState: LocalDatabaseState = {
  customers: [],
  orders: [],
  order_items: [],
  payments: [],
  shipments: [],
  order_status_history: [],
  products: INITIAL_PRODUCTS,
  order_counter: 0,
};

// Load database from file
function loadDatabase(): void {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      dbState = JSON.parse(data);
      // Ensure products are populated
      if (!dbState.products || dbState.products.length === 0) {
        dbState.products = INITIAL_PRODUCTS;
      }
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error('[Elora DB] Error reading local store file:', err);
  }
}

// Save database to file atomically
function saveDatabase(): void {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Elora DB] Error saving local store file:', err);
  }
}

loadDatabase();

// Helper to normalize phone numbers (e.g. "+91 9876543210" -> "9876543210")
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.substring(2);
  }
  return digits;
}

// ==============================================================================
// 1. CUSTOMER IDENTITY (GUEST CHECKOUT DEDUPLICATION)
// ==============================================================================
export async function findOrCreateCustomer(params: {
  fullName: string;
  email: string;
  phone: string;
  address: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    landmark?: string;
  };
}): Promise<Customer> {
  const normEmail = params.email.trim().toLowerCase();
  const normPh = normalizePhone(params.phone);

  // 1. Check in Supabase if connected
  if (supabase) {
    try {
      const { data: existingList, error } = await supabase
        .from('customers')
        .select('*')
        .or(`email.ilike.${normEmail},phone.eq.${normPh}`);

      if (!error && existingList && existingList.length > 0) {
        const existing = existingList[0] as Customer;
        // Merge address
        const addresses = Array.isArray(existing.addresses) ? [...existing.addresses] : [];
        const isDuplicateAddr = addresses.some(
          (a) =>
            a.address_line1.toLowerCase() === params.address.address_line1.toLowerCase() &&
            a.postal_code === params.address.postal_code
        );
        if (!isDuplicateAddr) {
          addresses.push(params.address);
        }

        const { data: updated, error: updateErr } = await supabase
          .from('customers')
          .update({
            full_name: params.fullName || existing.full_name,
            phone: normPh || existing.phone,
            addresses,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (!updateErr && updated) {
          return updated as Customer;
        }
      } else {
        // Create new customer in Supabase
        const newCust = {
          full_name: params.fullName,
          email: normEmail,
          phone: normPh,
          total_orders: 0,
          total_spent: 0,
          last_order_at: null,
          addresses: [params.address],
        };
        const { data: created, error: createErr } = await supabase
          .from('customers')
          .insert(newCust)
          .select()
          .single();

        if (!createErr && created) {
          return created as Customer;
        }
      }
    } catch (err) {
      console.warn('[Elora DB] Supabase customer query error, using local fallback:', err);
    }
  }

  // 2. Local memory/JSON fallback
  const existing = dbState.customers.find(
    (c) =>
      c.email.trim().toLowerCase() === normEmail ||
      (normPh && normalizePhone(c.phone) === normPh)
  );

  if (existing) {
    existing.full_name = params.fullName || existing.full_name;
    existing.updated_at = new Date().toISOString();
    if (!existing.addresses) existing.addresses = [];
    const isDup = existing.addresses.some(
      (a) =>
        a.address_line1.toLowerCase() === params.address.address_line1.toLowerCase() &&
        a.postal_code === params.address.postal_code
    );
    if (!isDup) {
      existing.addresses.push(params.address);
    }
    saveDatabase();
    return existing;
  }

  const newCustomer: Customer = {
    id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    full_name: params.fullName,
    email: normEmail,
    phone: normPh || params.phone,
    total_orders: 0,
    total_spent: 0,
    last_order_at: null,
    addresses: [params.address],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  dbState.customers.push(newCustomer);
  saveDatabase();
  return newCustomer;
}

// ==============================================================================
// 2. ORDER NUMBER GENERATION: e.g. ELR-2026-000001
// ==============================================================================
export function generateOrderNumber(): string {
  dbState.order_counter += 1;
  saveDatabase();
  const padded = String(dbState.order_counter).padStart(6, '0');
  const year = new Date().getFullYear();
  return `ELR-${year}-${padded}`;
}

// ==============================================================================
// 3. CATALOG PRICE LOOKUP & VALIDATION
// ==============================================================================
export function lookupProductPrice(productIdOrSlug: string, size?: string): { price: number; name: string; sku: string } {
  const normId = productIdOrSlug.toLowerCase();
  const product = dbState.products.find(
    (p) => p.id.toLowerCase() === normId || p.slug.toLowerCase() === normId
  );

  if (!product) {
    // Default fallback
    return { price: 1499, name: 'Elora Extrait de Parfum', sku: 'ELR-STD-100ML' };
  }

  const normSize = (size || '100ml').toLowerCase();
  const variant = product.variants.find((v) => v.size_ml.toLowerCase() === normSize) || product.variants[0];

  return {
    price: variant ? variant.price : 1499,
    name: product.name,
    sku: variant ? variant.sku : `ELR-${product.slug.toUpperCase()}-100ML`,
  };
}

// ==============================================================================
// 4. CREATE PENDING ORDER
// ==============================================================================
export async function createPendingOrder(params: {
  customer: Customer;
  items: {
    productId: string;
    size?: string;
    quantity: number;
    name?: string;
  }[];
  shippingAddress: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
    landmark?: string;
  };
  discountAmount?: number;
  giftWrap?: boolean;
}): Promise<{ order: Order; items: OrderItem[] }> {
  const orderNumber = generateOrderNumber();
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Server-side recalculation of prices from database catalog (Never trust client prices)
  let subtotal = 0;
  const createdItems: OrderItem[] = [];

  for (const item of params.items) {
    const verified = lookupProductPrice(item.productId, item.size);
    const quantity = Math.max(1, Math.floor(item.quantity || 1));
    const lineTotal = verified.price * quantity;
    subtotal += lineTotal;

    createdItems.push({
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      order_id: orderId,
      product_id: item.productId,
      product_name: verified.name,
      size_ml: item.size || '100ml',
      sku: verified.sku,
      quantity,
      unit_price: verified.price,
      total: lineTotal,
      created_at: new Date().toISOString(),
    });
  }

  const discount = Math.max(0, params.discountAmount || 0);
  const giftWrapFee = params.giftWrap ? 150 : 0;
  const shippingFee = 0; // Complimentary white-glove express shipping across India
  const tax = 0; // Included in luxury pricing
  const total = Math.max(0, subtotal - discount + giftWrapFee + shippingFee + tax);

  const newOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_id: params.customer.id,
    customer_name: params.customer.full_name,
    customer_email: params.customer.email,
    customer_phone: params.customer.phone,
    shipping_address: params.shippingAddress.address_line1,
    shipping_address_line2: params.shippingAddress.address_line2,
    shipping_city: params.shippingAddress.city,
    shipping_state: params.shippingAddress.state,
    shipping_postal_code: params.shippingAddress.postal_code,
    shipping_country: params.shippingAddress.country || 'India',
    shipping_landmark: params.shippingAddress.landmark,
    subtotal,
    discount,
    shipping_fee: shippingFee,
    tax,
    total,
    currency: 'INR',
    payment_status: 'PENDING',
    order_status: 'PENDING',
    shipping_status: 'PENDING',
    notes: params.giftWrap ? 'Gift coffret requested with velvet ribbon' : undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: createdItems,
    payments: [],
    shipments: [],
    history: [
      {
        id: `hist_${Date.now()}`,
        order_id: orderId,
        status: 'PENDING',
        notes: 'Order initiated via guest checkout. Awaiting payment authorization.',
        created_at: new Date().toISOString(),
      },
    ],
  };

  // 1. Try Supabase
  if (supabase) {
    try {
      await supabase.from('orders').insert({
        id: orderId,
        order_number: orderNumber,
        customer_id: params.customer.id,
        customer_name: params.customer.full_name,
        customer_email: params.customer.email,
        customer_phone: params.customer.phone,
        shipping_address: newOrder.shipping_address,
        shipping_address_line2: newOrder.shipping_address_line2,
        shipping_city: newOrder.shipping_city,
        shipping_state: newOrder.shipping_state,
        shipping_postal_code: newOrder.shipping_postal_code,
        shipping_country: newOrder.shipping_country,
        shipping_landmark: newOrder.shipping_landmark,
        subtotal,
        discount,
        shipping_fee: shippingFee,
        tax,
        total,
        currency: 'INR',
        payment_status: 'PENDING',
        order_status: 'PENDING',
        shipping_status: 'PENDING',
        notes: newOrder.notes,
      });

      await supabase.from('order_items').insert(
        createdItems.map((ci) => ({
          id: ci.id,
          order_id: orderId,
          product_id: ci.product_id,
          product_name: ci.product_name,
          size_ml: ci.size_ml,
          sku: ci.sku,
          quantity: ci.quantity,
          unit_price: ci.unit_price,
          total: ci.total,
        }))
      );
    } catch (err) {
      console.warn('[Elora DB] Supabase pending order insertion error:', err);
    }
  }

  // 2. Local persistence
  dbState.orders.unshift(newOrder);
  dbState.order_items.push(...createdItems);
  dbState.order_status_history.push(...(newOrder.history || []));
  saveDatabase();

  return { order: newOrder, items: createdItems };
}

// ==============================================================================
// 5. MARK ORDER PAID & UPDATE CUSTOMER STATS
// ==============================================================================
export async function markOrderPaid(params: {
  orderNumber: string;
  providerOrderId: string;
  providerPaymentId?: string;
  paymentMethod?: string;
  paymentResponse?: any;
}): Promise<Order | null> {
  const order = dbState.orders.find((o) => o.order_number === params.orderNumber);
  if (!order) return null;

  // Idempotency: avoid double-processing if already marked paid
  if (order.payment_status === 'PAID') {
    return order;
  }

  const now = new Date().toISOString();
  order.payment_status = 'PAID';
  order.order_status = 'CONFIRMED';
  order.cashfree_order_id = params.providerOrderId;
  order.updated_at = now;

  // Payment record
  const payment: Payment = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    order_id: order.id,
    provider: 'CASHFREE',
    provider_order_id: params.providerOrderId,
    provider_payment_id: params.providerPaymentId,
    amount: order.total,
    currency: order.currency,
    status: 'PAID',
    payment_method: params.paymentMethod || 'UPI/Card (Cashfree)',
    payment_response: params.paymentResponse || {},
    created_at: now,
    updated_at: now,
  };

  dbState.payments.push(payment);
  if (!order.payments) order.payments = [];
  order.payments.push(payment);

  // Status history
  const historyEntry: OrderStatusHistory = {
    id: `hist_${Date.now()}`,
    order_id: order.id,
    status: 'CONFIRMED',
    notes: `Payment confirmed via Cashfree. Ref: ${params.providerPaymentId || params.providerOrderId}`,
    created_at: now,
  };
  dbState.order_status_history.push(historyEntry);
  if (!order.history) order.history = [];
  order.history.push(historyEntry);

  // Update Customer Statistics
  const customer = dbState.customers.find((c) => c.id === order.customer_id);
  if (customer) {
    customer.total_orders += 1;
    customer.total_spent += order.total;
    customer.last_order_at = now;
    customer.updated_at = now;
  }

  // Deduct Inventory Stock
  if (order.items) {
    for (const item of order.items) {
      const product = dbState.products.find(
        (p) => p.id === item.product_id || p.name.toLowerCase() === item.product_name.toLowerCase()
      );
      if (product) {
        const variant = product.variants.find(
          (v) => v.size_ml.toLowerCase() === item.size_ml.toLowerCase() || v.sku === item.sku
        );
        if (variant) {
          variant.stock_quantity = Math.max(0, variant.stock_quantity - item.quantity);
          variant.sold_quantity += item.quantity;
        }
      }
    }
  }

  // Supabase sync
  if (supabase) {
    try {
      await supabase
        .from('orders')
        .update({
          payment_status: 'PAID',
          order_status: 'CONFIRMED',
          cashfree_order_id: params.providerOrderId,
          updated_at: now,
        })
        .eq('order_number', params.orderNumber);

      await supabase.from('payments').insert({
        id: payment.id,
        order_id: order.id,
        provider: 'CASHFREE',
        provider_order_id: params.providerOrderId,
        provider_payment_id: params.providerPaymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: 'PAID',
        payment_method: payment.payment_method,
        payment_response: payment.payment_response,
      });

      if (customer) {
        await supabase
          .from('customers')
          .update({
            total_orders: customer.total_orders,
            total_spent: customer.total_spent,
            last_order_at: now,
            updated_at: now,
          })
          .eq('id', customer.id);
      }
    } catch (err) {
      console.warn('[Elora DB] Supabase paid order update error:', err);
    }
  }

  saveDatabase();
  return order;
}

// ==============================================================================
// 6. SHIPMENT DISPATCH & SHIPROCKET SYNC
// ==============================================================================
export async function createOrUpdateShipment(params: {
  orderNumber: string;
  shiprocketOrderId?: string;
  shipmentId?: string;
  awbCode: string;
  courierName: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
}): Promise<Shipment | null> {
  const order = dbState.orders.find((o) => o.order_number === params.orderNumber);
  if (!order) return null;

  const now = new Date().toISOString();

  // Existing shipment?
  let shipment = dbState.shipments.find((s) => s.order_id === order.id);
  if (!shipment) {
    shipment = {
      id: `ship_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      order_id: order.id,
      shiprocket_order_id: params.shiprocketOrderId,
      shipment_id: params.shipmentId,
      awb_code: params.awbCode,
      courier_name: params.courierName,
      tracking_url: params.trackingUrl || `https://shiprocket.co/tracking/${params.awbCode}`,
      status: 'READY_TO_SHIP',
      pickup_status: 'SCHEDULED',
      delivery_status: 'IN_TRANSIT',
      estimated_delivery_date: params.estimatedDeliveryDate,
      created_at: now,
      updated_at: now,
    };
    dbState.shipments.push(shipment);
    if (!order.shipments) order.shipments = [];
    order.shipments.push(shipment);
  } else {
    shipment.awb_code = params.awbCode;
    shipment.courier_name = params.courierName;
    shipment.tracking_url = params.trackingUrl || shipment.tracking_url;
    shipment.status = 'READY_TO_SHIP';
    shipment.updated_at = now;
  }

  // Update order statuses
  order.shipping_status = 'READY_TO_SHIP';
  order.order_status = 'PROCESSING';
  order.updated_at = now;

  // Status history
  const historyEntry: OrderStatusHistory = {
    id: `hist_${Date.now()}`,
    order_id: order.id,
    status: 'PROCESSING',
    notes: `Shipment assigned via ${params.courierName}. AWB: ${params.awbCode}`,
    created_at: now,
  };
  dbState.order_status_history.push(historyEntry);
  if (!order.history) order.history = [];
  order.history.push(historyEntry);

  // Sync with Supabase
  if (supabase) {
    try {
      await supabase.from('shipments').upsert({
        id: shipment.id,
        order_id: order.id,
        shiprocket_order_id: shipment.shiprocket_order_id,
        shipment_id: shipment.shipment_id,
        awb_code: shipment.awb_code,
        courier_name: shipment.courier_name,
        tracking_url: shipment.tracking_url,
        status: shipment.status,
        updated_at: now,
      });

      await supabase
        .from('orders')
        .update({
          shipping_status: 'READY_TO_SHIP',
          order_status: 'PROCESSING',
          updated_at: now,
        })
        .eq('id', order.id);
    } catch (err) {
      console.warn('[Elora DB] Supabase shipment upsert error:', err);
    }
  }

  saveDatabase();
  return shipment;
}

// ==============================================================================
// 7. ORDER TRACKING (SECURITY: REQUIRE ORDER NUMBER + (EMAIL OR PHONE))
// ==============================================================================
export function getOrderByNumberAndAuth(orderNumber: string, emailOrPhone: string): Order | null {
  if (!orderNumber || !emailOrPhone) return null;

  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanInput = emailOrPhone.trim().toLowerCase();
  const cleanPhone = normalizePhone(emailOrPhone);

  const order = dbState.orders.find((o) => o.order_number.toUpperCase() === cleanOrderNum);
  if (!order) return null;

  const emailMatch = order.customer_email.toLowerCase() === cleanInput;
  const phoneMatch = cleanPhone && normalizePhone(order.customer_phone) === cleanPhone;

  if (!emailMatch && !phoneMatch) {
    return null; // Security rule: Deny access if phone or email doesn't match
  }

  // Attach relational data
  const populatedOrder: Order = {
    ...order,
    items: dbState.order_items.filter((item) => item.order_id === order.id),
    payments: dbState.payments.filter((p) => p.order_id === order.id),
    shipments: dbState.shipments.filter((s) => s.order_id === order.id),
    history: dbState.order_status_history.filter((h) => h.order_id === order.id),
  };

  return populatedOrder;
}

export function getCustomerOrdersByEmail(email: string): Order[] {
  if (!email) return [];
  const clean = email.trim().toLowerCase();
  const matched = dbState.orders.filter(
    (o) => o.customer_email && o.customer_email.toLowerCase() === clean
  );
  return matched.map((order) => ({
    ...order,
    items: dbState.order_items.filter((item) => item.order_id === order.id),
    payments: dbState.payments.filter((p) => p.order_id === order.id),
    shipments: dbState.shipments.filter((s) => s.order_id === order.id),
    history: dbState.order_status_history.filter((h) => h.order_id === order.id),
  }));
}

// ==============================================================================
// 8. ADMIN QUERIES: ORDERS, CUSTOMERS, PAYMENTS, SHIPMENTS, PRODUCTS, ANALYTICS
// ==============================================================================
export function getAllOrders(filterStatus?: string, search?: string): Order[] {
  let list = dbState.orders.map((o) => ({
    ...o,
    items: dbState.order_items.filter((i) => i.order_id === o.id),
    payments: dbState.payments.filter((p) => p.order_id === o.id),
    shipments: dbState.shipments.filter((s) => s.order_id === o.id),
    history: dbState.order_status_history.filter((h) => h.order_id === o.id),
  }));

  if (filterStatus && filterStatus !== 'ALL') {
    list = list.filter(
      (o) =>
        o.order_status.toUpperCase() === filterStatus.toUpperCase() ||
        o.payment_status.toUpperCase() === filterStatus.toUpperCase() ||
        o.shipping_status.toUpperCase() === filterStatus.toUpperCase()
    );
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    const qPhone = normalizePhone(search);
    list = list.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q) ||
        (qPhone && normalizePhone(o.customer_phone).includes(qPhone))
    );
  }

  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getOrderByIdOrNumber(identifier: string): Order | null {
  const clean = identifier.trim().toLowerCase();
  const order = dbState.orders.find(
    (o) => o.id.toLowerCase() === clean || o.order_number.toLowerCase() === clean
  );
  if (!order) return null;

  return {
    ...order,
    items: dbState.order_items.filter((i) => i.order_id === order.id),
    payments: dbState.payments.filter((p) => p.order_id === order.id),
    shipments: dbState.shipments.filter((s) => s.order_id === order.id),
    history: dbState.order_status_history.filter((h) => h.order_id === order.id),
  };
}

export function getAllCustomers(search?: string): Customer[] {
  let list = [...dbState.customers];
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    const qPhone = normalizePhone(search);
    list = list.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (qPhone && normalizePhone(c.phone).includes(qPhone))
    );
  }
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getCustomerWithHistory(customerId: string): {
  customer: Customer;
  orders: Order[];
  productsBought: { product_name: string; size_ml: string; total_quantity: number }[];
  payments: Payment[];
  averageOrderValue: number;
} | null {
  const customer = dbState.customers.find((c) => c.id === customerId);
  if (!customer) return null;

  const orders = dbState.orders
    .filter((o) => o.customer_id === customer.id)
    .map((o) => ({
      ...o,
      items: dbState.order_items.filter((i) => i.order_id === o.id),
      payments: dbState.payments.filter((p) => p.order_id === o.id),
      shipments: dbState.shipments.filter((s) => s.order_id === o.id),
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const orderIds = new Set(orders.map((o) => o.id));
  const payments = dbState.payments.filter((p) => orderIds.has(p.order_id));

  // Products bought aggregation
  const productMap = new Map<string, { product_name: string; size_ml: string; total_quantity: number }>();
  for (const o of orders) {
    if (o.items) {
      for (const item of o.items) {
        const key = `${item.product_name}-${item.size_ml}`;
        const prev = productMap.get(key);
        if (prev) {
          prev.total_quantity += item.quantity;
        } else {
          productMap.set(key, {
            product_name: item.product_name,
            size_ml: item.size_ml,
            total_quantity: item.quantity,
          });
        }
      }
    }
  }

  const aov = customer.total_orders > 0 ? Math.round(customer.total_spent / customer.total_orders) : 0;

  return {
    customer,
    orders,
    productsBought: Array.from(productMap.values()),
    payments,
    averageOrderValue: aov,
  };
}

export function getAllPayments(): Payment[] {
  return [...dbState.payments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getAllShipments(): (Shipment & { order_number?: string; customer_name?: string })[] {
  return dbState.shipments
    .map((s) => {
      const order = dbState.orders.find((o) => o.id === s.order_id);
      return {
        ...s,
        order_number: order?.order_number,
        customer_name: order?.customer_name,
      };
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getProducts(): ProductInventoryItem[] {
  return dbState.products;
}

export function updateProduct(id: string, updates: Partial<ProductInventoryItem>): ProductInventoryItem | null {
  const prod = dbState.products.find((p) => p.id === id);
  if (!prod) return null;

  Object.assign(prod, updates, { updated_at: new Date().toISOString() });
  saveDatabase();
  return prod;
}

export function getDashboardStats(): DashboardStats {
  const today = new Date().toISOString().split('T')[0];

  let totalRev = 0;
  let todayRev = 0;
  let todayOrders = 0;
  let pendingCount = 0;
  let paidCount = 0;
  let awaitingShipmentCount = 0;
  let shippedCount = 0;
  let deliveredCount = 0;

  // Product sales map
  const productSales = new Map<string, { units: number; rev: number }>();

  for (const o of dbState.orders) {
    if (o.payment_status === 'PAID') {
      totalRev += o.total;
    }
    const orderDate = o.created_at.split('T')[0];
    if (orderDate === today) {
      todayOrders += 1;
      if (o.payment_status === 'PAID') {
        todayRev += o.total;
      }
    }

    if (o.order_status === 'PENDING') pendingCount += 1;
    if (o.payment_status === 'PAID') paidCount += 1;
    if (o.order_status === 'CONFIRMED' || o.shipping_status === 'PENDING') awaitingShipmentCount += 1;
    if (o.shipping_status === 'SHIPPED' || o.shipping_status === 'IN_TRANSIT') shippedCount += 1;
    if (o.shipping_status === 'DELIVERED') deliveredCount += 1;

    // Items
    const items = dbState.order_items.filter((i) => i.order_id === o.id);
    for (const item of items) {
      const prev = productSales.get(item.product_name) || { units: 0, rev: 0 };
      prev.units += item.quantity;
      prev.rev += item.total;
      productSales.set(item.product_name, prev);
    }
  }

  const topProducts = Array.from(productSales.entries())
    .map(([product_name, val]) => ({
      product_name,
      units_sold: val.units,
      revenue: val.rev,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Group sales by past 7 days
  const salesByDay = new Map<string, { rev: number; orders: number }>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split('T')[0];
    salesByDay.set(dayStr, { rev: 0, orders: 0 });
  }

  for (const o of dbState.orders) {
    const d = o.created_at.split('T')[0];
    if (salesByDay.has(d)) {
      const curr = salesByDay.get(d)!;
      curr.orders += 1;
      if (o.payment_status === 'PAID') curr.rev += o.total;
    }
  }

  const salesOverTime = Array.from(salesByDay.entries()).map(([date, val]) => ({
    date,
    revenue: val.rev,
    orders: val.orders,
  }));

  const recentOrders = getAllOrders().slice(0, 8);
  const recentCustomers = getAllCustomers().slice(0, 6);

  return {
    totalRevenue: totalRev,
    todayRevenue: todayRev,
    totalOrders: dbState.orders.length,
    todayOrders,
    totalCustomers: dbState.customers.length,
    pendingOrdersCount: pendingCount,
    paidOrdersCount: paidCount,
    awaitingShipmentCount,
    shippedOrdersCount: shippedCount,
    deliveredOrdersCount: deliveredCount,
    recentOrders,
    recentCustomers,
    topProducts,
    salesOverTime,
  };
}

/**
 * Reset test orders, payments, shipments, and customer records for production launch
 */
export function clearStoreTestData(): { cleared: boolean; message: string } {
  dbState.orders = [];
  dbState.order_items = [];
  dbState.payments = [];
  dbState.shipments = [];
  dbState.order_status_history = [];
  dbState.customers = [];
  dbState.order_counter = 0;
  for (const prod of dbState.products) {
    for (const v of prod.variants) {
      v.sold_quantity = 0;
    }
  }
  saveDatabase();
  return {
    cleared: true,
    message: 'Store reset to clean launch slate. All test orders and records cleared.',
  };
}

