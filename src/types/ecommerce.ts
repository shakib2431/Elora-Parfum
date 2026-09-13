export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type ShippingStatus =
  | 'PENDING'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURNED'
  | 'CANCELLED';

export interface CustomerAddress {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  landmark?: string;
  is_default?: boolean;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
  addresses: CustomerAddress[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  size_ml: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: 'CASHFREE';
  provider_order_id: string;
  provider_payment_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  payment_response?: any;
  created_at: string;
  updated_at: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  shiprocket_order_id?: string;
  shipment_id?: string;
  awb_code?: string;
  courier_name?: string;
  tracking_url?: string;
  status: ShippingStatus;
  pickup_status?: string;
  delivery_status?: string;
  estimated_delivery_date?: string;
  tracking_data?: any;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string; // e.g. ELR-2026-000001
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipping_landmark?: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  currency: string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  shipping_status: ShippingStatus;
  cashfree_order_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;

  // Joined relations
  items?: OrderItem[];
  payments?: Payment[];
  shipments?: Shipment[];
  history?: OrderStatusHistory[];
}

export interface ProductInventoryVariant {
  id: string;
  size_ml: string; // '30ml', '50ml', '100ml', etc.
  sku: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  sold_quantity: number;
  low_stock_threshold: number;
}

export interface ProductInventoryItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  is_published: boolean;
  is_featured: boolean;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  variants: ProductInventoryVariant[];
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  totalCustomers: number;
  pendingOrdersCount: number;
  paidOrdersCount: number;
  awaitingShipmentCount: number;
  shippedOrdersCount: number;
  deliveredOrdersCount: number;
  recentOrders: Order[];
  recentCustomers: Customer[];
  topProducts: {
    product_name: string;
    units_sold: number;
    revenue: number;
  }[];
  salesOverTime: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}
