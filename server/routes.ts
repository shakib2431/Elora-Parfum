import { Router, Request, Response } from 'express';
import {
  findOrCreateCustomer,
  createPendingOrder,
  markOrderPaid,
  createOrUpdateShipment,
  getOrderByNumberAndAuth,
  getAllOrders,
  getOrderByIdOrNumber,
  getAllCustomers,
  getCustomerWithHistory,
  getAllPayments,
  getAllShipments,
  getProducts,
  updateProduct,
  getDashboardStats,
  clearStoreTestData,
  getCustomerOrdersByEmail,
  supabase,
} from './db';
import {
  createCashfreeOrder,
  verifyCashfreePayment,
  verifyCashfreeWebhook,
} from './cashfree';
import {
  createShiprocketShipment,
  trackShiprocketAwb,
} from './shiprocket';
import { sendOrderEmails } from './email';
import { requireAdminAuth, createAdminToken } from './auth';
import { Order } from '../src/types/ecommerce';

export const ecommerceRouter = Router();

// ==============================================================================
// 1. GUEST CHECKOUT (NO LOGIN OR SIGNUP REQUIRED)
// ==============================================================================

/**
 * Creates a guest order and initializes Cashfree payment session
 */
ecommerceRouter.post('/checkout/create-order', async (req: Request, res: Response) => {
  try {
    const { customer, shippingAddress, items, discountAmount, giftWrap } = req.body;

    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return res.status(400).json({
        error: 'Customer full name, email, and phone number are required for guest checkout.',
      });
    }

    if (!shippingAddress?.address_line1 || !shippingAddress?.city || !shippingAddress?.postal_code || !shippingAddress?.state) {
      return res.status(400).json({
        error: 'Complete delivery address including street, city, state, and pincode is required.',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one fragrance flacon must be selected.' });
    }

    // 1. Find or create customer record in database
    const dbCustomer = await findOrCreateCustomer({
      fullName: customer.fullName.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      address: {
        address_line1: shippingAddress.address_line1.trim(),
        address_line2: shippingAddress.address_line2?.trim() || '',
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postal_code: shippingAddress.postal_code.trim(),
        country: shippingAddress.country?.trim() || 'India',
        landmark: shippingAddress.landmark?.trim() || '',
      },
    });

    // 2. Create pending order in database
    const { order, items: createdItems } = await createPendingOrder({
      customer: dbCustomer,
      items,
      shippingAddress,
      discountAmount,
      giftWrap,
    });

    // 3. Initiate Cashfree Payment Session
    const cashfreeRes = await createCashfreeOrder({
      orderNumber: order.order_number,
      amount: order.total,
      currency: 'INR',
      customer: {
        id: dbCustomer.id,
        name: dbCustomer.full_name,
        email: dbCustomer.email,
        phone: dbCustomer.phone,
      },
    });

    return res.status(201).json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
      total: order.total,
      subtotal: order.subtotal,
      customer: {
        id: dbCustomer.id,
        name: dbCustomer.full_name,
        email: dbCustomer.email,
        phone: dbCustomer.phone,
      },
      cashfree: {
        orderId: cashfreeRes.orderId,
        paymentSessionId: cashfreeRes.paymentSessionId,
        isSandboxSimulation: cashfreeRes.isSandboxSimulation,
        amount: cashfreeRes.orderAmount,
        currency: cashfreeRes.currency,
        environment: cashfreeRes.environment,
      },
    });
  } catch (err: any) {
    console.error('[Checkout API] Error creating order:', err);
    return res.status(500).json({ error: err?.message || 'Failed to initialize order commission' });
  }
});

/**
 * Verifies payment with Cashfree and completes order confirmation
 */
ecommerceRouter.post('/checkout/verify-payment', async (req: Request, res: Response) => {
  try {
    const { orderNumber, cashfreeOrderId, providerPaymentId, paymentMethod } = req.body;

    if (!orderNumber || !cashfreeOrderId) {
      return res.status(400).json({ error: 'orderNumber and cashfreeOrderId are required' });
    }

    // Verify directly with Cashfree
    const verification = await verifyCashfreePayment(cashfreeOrderId);

    if (!verification.isPaid) {
      return res.status(400).json({
        success: false,
        error: `Payment authorization not completed. Status: ${verification.status}`,
        details: verification,
      });
    }

    // Mark order as paid in database and update customer records
    const updatedOrder = await markOrderPaid({
      orderNumber,
      providerOrderId: cashfreeOrderId,
      providerPaymentId: providerPaymentId || verification.paymentId,
      paymentMethod: paymentMethod || verification.paymentMethod,
      paymentResponse: verification.rawResponse,
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Trigger async email notifications (resilient, non-blocking)
    sendOrderEmails({ order: updatedOrder }).catch((err) => {
      console.warn('[Email Notification] Background dispatch error:', err);
    });

    return res.json({
      success: true,
      order: updatedOrder,
      message: 'Payment verified and commission confirmed.',
    });
  } catch (err: any) {
    console.error('[Checkout API] Error verifying payment:', err);
    return res.status(500).json({ error: err?.message || 'Payment verification failed' });
  }
});

/**
 * Cashfree Webhook endpoint
 */
ecommerceRouter.post('/webhooks/cashfree', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;
    const rawBody = JSON.stringify(req.body);

    const isValid = verifyCashfreeWebhook(rawBody, signature, timestamp);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body;
    const orderData = event?.data?.order;
    const paymentData = event?.data?.payment;

    if (orderData?.order_id && (orderData?.order_status === 'PAID' || paymentData?.payment_status === 'SUCCESS')) {
      const orderNumber = orderData.order_tags?.order_number || orderData.order_id.split('_')[0];
      await markOrderPaid({
        orderNumber,
        providerOrderId: orderData.order_id,
        providerPaymentId: paymentData?.cf_payment_id ? String(paymentData.cf_payment_id) : undefined,
        paymentMethod: paymentData?.payment_group,
        paymentResponse: event,
      });
    }

    return res.json({ status: 'received' });
  } catch (err: any) {
    console.error('[Cashfree Webhook] Handler error:', err);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
});

// ==============================================================================
// 2. CUSTOMER ORDER TRACKING (PUBLIC - GUEST ACCESS WITH AUTHENTICATION CHECK)
// ==============================================================================

/**
 * Securely track order by Order Number AND (Email OR Phone).
 * Prevents unauthorized snooping of order numbers.
 */
ecommerceRouter.post('/orders/track', async (req: Request, res: Response) => {
  try {
    const { orderNumber, emailOrPhone } = req.body;

    if (!orderNumber || !emailOrPhone) {
      return res.status(400).json({
        error: 'Please provide both your Order Number (e.g. ELR-2026-000001) and your registered Email or Phone Number.',
      });
    }

    const order = getOrderByNumberAndAuth(orderNumber, emailOrPhone);

    if (!order) {
      return res.status(404).json({
        error: 'No commission found matching this order number and contact detail. Please verify your entries.',
      });
    }

    // Return sanitized tracking payload
    return res.json({
      success: true,
      order: {
        order_number: order.order_number,
        created_at: order.created_at,
        order_status: order.order_status,
        payment_status: order.payment_status,
        shipping_status: order.shipping_status,
        total: order.total,
        currency: order.currency,
        customer_name: order.customer_name,
        shipping_city: order.shipping_city,
        shipping_state: order.shipping_state,
        shipping_postal_code: order.shipping_postal_code,
        items: (order.items || []).map((i) => ({
          product_name: i.product_name,
          size_ml: i.size_ml,
          quantity: i.quantity,
          unit_price: i.unit_price,
          total: i.total,
        })),
        shipment: order.shipments && order.shipments.length > 0 ? {
          awb_code: order.shipments[0].awb_code,
          courier_name: order.shipments[0].courier_name,
          tracking_url: order.shipments[0].tracking_url,
          status: order.shipments[0].status,
          estimated_delivery_date: order.shipments[0].estimated_delivery_date,
        } : null,
        history: order.history || [],
      },
    });
  } catch (err: any) {
    console.error('[Track Order API] Error:', err);
    return res.status(500).json({ error: 'An error occurred while tracking your order.' });
  }
});

/**
 * Patron/Customer Lookup by email: retrieves patron commissions and detects Maison Owner
 */
ecommerceRouter.post('/customer/lookup', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const ownerEmails = [
      (process.env.ADMIN_EMAIL || 'owner@eloraparfum.com').toLowerCase(),
      'khanshakib0000@gmail.com',
      'owner@eloraparfum.com',
      'admin@eloraparfum.com',
    ];

    const isOwner = ownerEmails.includes(cleanEmail);
    const orders = getCustomerOrdersByEmail(cleanEmail);

    return res.json({
      success: true,
      isOwner,
      email: cleanEmail,
      ordersCount: orders.length,
      orders: orders.map((o) => ({
        order_number: o.order_number,
        created_at: o.created_at,
        order_status: o.order_status,
        payment_status: o.payment_status,
        shipping_status: o.shipping_status,
        total: o.total,
        currency: o.currency,
        items: (o.items || []).map((i) => ({
          product_name: i.product_name,
          size_ml: i.size_ml,
          quantity: i.quantity,
          total: i.total,
        })),
        shipment: o.shipments && o.shipments.length > 0 ? {
          awb_code: o.shipments[0].awb_code,
          courier_name: o.shipments[0].courier_name,
          tracking_url: o.shipments[0].tracking_url,
          status: o.shipments[0].status,
        } : null,
      })),
    });
  } catch (err: any) {
    console.error('[Customer Lookup API] Error:', err);
    return res.status(500).json({ error: 'Failed to look up patron records.' });
  }
});

// ==============================================================================
// 3. ADMIN AUTHENTICATION (OWNER ONLY)
// ==============================================================================

/**
 * Owner/Admin Login
 */
ecommerceRouter.post('/admin/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth if connected
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!error && data.session) {
          return res.json({
            success: true,
            token: data.session.access_token,
            user: {
              id: data.user.id,
              email: data.user.email,
              role: 'OWNER',
            },
          });
        }
      } catch (err) {
        // Fall back to configured admin credentials
      }
    }

    // 2. Configured owner credentials
    const validEmails = [
      (process.env.ADMIN_EMAIL || 'owner@eloraparfum.com').toLowerCase(),
      'khanshakib0000@gmail.com',
      'owner@eloraparfum.com',
      'admin@eloraparfum.com',
      'admin',
      'elora_admin',
    ];
    const expectedPass = process.env.ADMIN_PASSWORD || 'elora2026!';

    if (validEmails.includes(cleanEmail) && password === expectedPass) {
      const token = createAdminToken(cleanEmail);
      return res.json({
        success: true,
        token,
        user: {
          id: 'admin_owner',
          email: cleanEmail,
          role: 'OWNER',
        },
      });
    }

    return res.status(401).json({ error: 'Invalid administrative credentials.' });
  } catch (err: any) {
    console.error('[Admin Login] Error:', err);
    return res.status(500).json({ error: 'Authentication service failure.' });
  }
});

ecommerceRouter.get('/admin/auth/me', requireAdminAuth, (req: Request, res: Response) => {
  return res.json({
    authenticated: true,
    email: (req as any).adminEmail || 'owner@eloraparfum.com',
    role: 'OWNER',
  });
});

// ==============================================================================
// 4. ADMIN PROTECTED DATA & MANAGEMENT ENDPOINTS
// ==============================================================================

/**
 * Dashboard Aggregated KPI Metrics
 */
ecommerceRouter.get('/admin/dashboard', requireAdminAuth, (_req: Request, res: Response) => {
  const stats = getDashboardStats();
  return res.json(stats);
});

/**
 * Orders Management
 */
ecommerceRouter.get('/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
  const status = req.query.status as string;
  const search = req.query.search as string;
  const orders = getAllOrders(status, search);
  return res.json({ orders, total: orders.length });
});

ecommerceRouter.get('/admin/orders/:id', requireAdminAuth, (req: Request, res: Response) => {
  const order = getOrderByIdOrNumber(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json({ order });
});

/**
 * Update Order Status
 */
ecommerceRouter.post('/admin/orders/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  const { status, notes } = req.body;
  const order = getOrderByIdOrNumber(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.order_status = status;
  order.updated_at = new Date().toISOString();
  if (!order.history) order.history = [];
  order.history.push({
    id: `hist_${Date.now()}`,
    order_id: order.id,
    status,
    notes: notes || `Order status updated to ${status} by atelier management`,
    created_at: new Date().toISOString(),
  });

  return res.json({ success: true, order });
});

/**
 * Customers Captured From Guest Checkout
 */
ecommerceRouter.get('/admin/customers', requireAdminAuth, (req: Request, res: Response) => {
  const search = req.query.search as string;
  const customers = getAllCustomers(search);
  return res.json({ customers, total: customers.length });
});

ecommerceRouter.get('/admin/customers/:id', requireAdminAuth, (req: Request, res: Response) => {
  const data = getCustomerWithHistory(req.params.id);
  if (!data) {
    return res.status(404).json({ error: 'Customer record not found' });
  }
  return res.json(data);
});

/**
 * Cashfree Payments Log
 */
ecommerceRouter.get('/admin/payments', requireAdminAuth, (_req: Request, res: Response) => {
  const payments = getAllPayments();
  return res.json({ payments, total: payments.length });
});

/**
 * Shipments & Shiprocket Dispatch
 */
ecommerceRouter.get('/admin/shipments', requireAdminAuth, (_req: Request, res: Response) => {
  const shipments = getAllShipments();
  return res.json({ shipments, total: shipments.length });
});

/**
 * Admin Action: Create Shipment via Shiprocket
 */
ecommerceRouter.post('/admin/shipments/create', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.body;
    if (!orderNumber) {
      return res.status(400).json({ error: 'orderNumber is required' });
    }

    const order = getOrderByIdOrNumber(orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Call Shiprocket integration
    const shiprocketResult = await createShiprocketShipment({
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      address: order.shipping_address,
      addressLine2: order.shipping_address_line2,
      city: order.shipping_city,
      state: order.shipping_state,
      postalCode: order.shipping_postal_code,
      country: order.shipping_country,
      items: (order.items || []).map((i) => ({
        product_name: i.product_name,
        sku: i.sku,
        quantity: i.quantity,
        unit_price: i.unit_price,
      })),
      totalAmount: order.total,
    });

    if (!shiprocketResult.success) {
      return res.status(500).json({
        error: shiprocketResult.error || 'Failed to generate shipment in Shiprocket',
      });
    }

    // Store shipment record and update order
    const shipment = await createOrUpdateShipment({
      orderNumber: order.order_number,
      shiprocketOrderId: shiprocketResult.shiprocketOrderId,
      shipmentId: shiprocketResult.shipmentId,
      awbCode: shiprocketResult.awbCode,
      courierName: shiprocketResult.courierName,
      trackingUrl: shiprocketResult.trackingUrl,
      estimatedDeliveryDate: shiprocketResult.estimatedDeliveryDate,
    });

    return res.json({
      success: true,
      shipment,
      shiprocket: shiprocketResult,
      message: `Shipment assigned via ${shiprocketResult.courierName}. AWB: ${shiprocketResult.awbCode}`,
    });
  } catch (err: any) {
    console.error('[Shipment Create API] Error:', err);
    return res.status(500).json({ error: err?.message || 'Error generating shipment' });
  }
});

/**
 * Refresh Shiprocket tracking
 */
ecommerceRouter.get('/admin/shipments/track/:awb', requireAdminAuth, async (req: Request, res: Response) => {
  const result = await trackShiprocketAwb(req.params.awb);
  return res.json(result);
});

/**
 * Products & Inventory
 */
ecommerceRouter.get('/admin/products', requireAdminAuth, (_req: Request, res: Response) => {
  const products = getProducts();
  return res.json({ products });
});

ecommerceRouter.put('/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ success: true, product: updated });
});

ecommerceRouter.get('/admin/inventory', requireAdminAuth, (_req: Request, res: Response) => {
  const products = getProducts();
  const inventoryList: any[] = [];
  let lowStockCount = 0;

  for (const p of products) {
    for (const v of p.variants) {
      const isLow = v.stock_quantity <= v.low_stock_threshold;
      if (isLow) lowStockCount += 1;
      inventoryList.push({
        productId: p.id,
        productName: p.name,
        size: v.size_ml,
        sku: v.sku,
        price: v.price,
        stock: v.stock_quantity,
        sold: v.sold_quantity,
        threshold: v.low_stock_threshold,
        isLowStock: isLow,
      });
    }
  }

  return res.json({
    inventory: inventoryList,
    lowStockCount,
    totalSkus: inventoryList.length,
  });
});

/**
 * Analytics: Pulls real store performance directly from Supabase (or datastore)
 */
ecommerceRouter.get('/admin/analytics', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    let orders: Order[] = [];
    let isLiveSupabase = false;

    // 1. Attempt to query Supabase directly if client exists
    if (supabase) {
      try {
        const { data: supaOrders, error: ordersError } = await supabase
          .from('orders')
          .select('*, order_items(*), payments(*)');

        if (!ordersError && supaOrders && Array.isArray(supaOrders)) {
          isLiveSupabase = true;
          orders = supaOrders.map((o: any) => ({
            id: o.id,
            order_number: o.order_number,
            customer_id: o.customer_id || '',
            customer_name: o.customer_name,
            customer_email: o.customer_email,
            customer_phone: o.customer_phone,
            shipping_address: o.shipping_address,
            shipping_city: o.shipping_city,
            shipping_state: o.shipping_state,
            shipping_postal_code: o.shipping_postal_code,
            shipping_country: o.shipping_country || 'India',
            subtotal: Number(o.subtotal) || 0,
            discount: Number(o.discount) || 0,
            shipping_fee: Number(o.shipping_fee) || 0,
            tax: Number(o.tax) || 0,
            total: Number(o.total) || 0,
            currency: o.currency || 'INR',
            order_status: o.order_status || 'PENDING',
            payment_status: o.payment_status || 'PENDING',
            shipping_status: o.shipping_status || 'PENDING',
            created_at: o.created_at,
            updated_at: o.updated_at || o.created_at,
            items: (o.order_items || []).map((i: any) => ({
              id: i.id,
              order_id: i.order_id,
              product_id: i.product_id,
              product_name: i.product_name,
              sku: i.sku,
              size_ml: i.size_ml,
              unit_price: Number(i.unit_price) || 0,
              quantity: Number(i.quantity) || 1,
              total: Number(i.total) || 0,
            })),
            payments: (o.payments || []).map((p: any) => ({
              id: p.id,
              order_id: p.order_id,
              payment_method: p.payment_method || 'CASHFREE',
              amount: Number(p.amount) || 0,
              currency: p.currency || 'INR',
              status: p.status || 'PENDING',
              created_at: p.created_at,
            })),
          }));
        }
      } catch (e) {
        console.warn('[Admin Analytics] Supabase query fallback:', e);
      }
    }

    // Fall back to synchronized in-memory database store
    if (!isLiveSupabase) {
      orders = getAllOrders();
    }

    const customers = getAllCustomers();
    const repeatCustomers = customers.filter((c) => c.total_orders > 1).length;
    const repeatRate = customers.length > 0 ? Math.round((repeatCustomers / customers.length) * 100) : 0;

    let totalRevenue = 0;
    let paidOrdersCount = 0;
    let pendingOrdersCount = 0;
    let deliveredOrdersCount = 0;

    const productSalesMap = new Map<string, { units: number; revenue: number }>();
    const citySalesMap = new Map<string, { city: string; state: string; orders: number; revenue: number }>();
    const paymentMethodsMap = new Map<string, { count: number; revenue: number }>();

    // Past 7 days timeline
    const past7Days = new Map<string, { date: string; displayDate: string; revenue: number; orders: number; units: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      past7Days.set(isoDate, { date: isoDate, displayDate, revenue: 0, orders: 0, units: 0 });
    }

    for (const order of orders) {
      const isPaid = order.payment_status === 'PAID';
      if (isPaid) {
        totalRevenue += order.total;
        paidOrdersCount += 1;
      } else {
        pendingOrdersCount += 1;
      }

      if (order.shipping_status === 'DELIVERED') {
        deliveredOrdersCount += 1;
      }

      // Group timeline
      const orderDateStr = order.created_at ? order.created_at.split('T')[0] : '';
      if (past7Days.has(orderDateStr)) {
        const bucket = past7Days.get(orderDateStr)!;
        bucket.orders += 1;
        if (isPaid) bucket.revenue += order.total;
        if (order.items) {
          bucket.units += order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        }
      }

      // Group items
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          const name = item.product_name || 'Bespoke Flacon';
          const existing = productSalesMap.get(name) || { units: 0, revenue: 0 };
          existing.units += item.quantity || 1;
          if (isPaid) existing.revenue += item.total || 0;
          productSalesMap.set(name, existing);
        }
      }

      // Group geography
      const city = order.shipping_city ? order.shipping_city.trim() : 'Unspecified';
      const state = order.shipping_state ? order.shipping_state.trim() : 'India';
      const cityKey = `${city.toLowerCase()}_${state.toLowerCase()}`;
      const cityData = citySalesMap.get(cityKey) || { city, state, orders: 0, revenue: 0 };
      cityData.orders += 1;
      if (isPaid) cityData.revenue += order.total;
      citySalesMap.set(cityKey, cityData);

      // Payment method
      const method = (order.payments && order.payments[0]?.payment_method) || (isPaid ? 'CASHFREE_UPI' : 'PENDING');
      const pmData = paymentMethodsMap.get(method) || { count: 0, revenue: 0 };
      pmData.count += 1;
      if (isPaid) pmData.revenue += order.total;
      paymentMethodsMap.set(method, pmData);
    }

    const averageOrderValue = paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0;

    // Format top products
    const topProducts = Array.from(productSalesMap.entries())
      .map(([name, data]) => ({
        product_name: name,
        units_sold: data.units,
        revenue: data.revenue,
        percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Format geographic distribution
    const geographicBreakdown = Array.from(citySalesMap.values())
      .map((c) => ({
        city: c.city,
        state: c.state,
        orders: c.orders,
        revenue: c.revenue,
        share: orders.length > 0 ? `${Math.round((c.orders / orders.length) * 100)}%` : '0%',
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 6);

    // Format payment breakdown
    const paymentMethods = Array.from(paymentMethodsMap.entries()).map(([method, data]) => ({
      method,
      count: data.count,
      revenue: data.revenue,
      share: orders.length > 0 ? `${Math.round((data.count / orders.length) * 100)}%` : '0%',
    }));

    const salesOverTime = Array.from(past7Days.values());

    return res.json({
      success: true,
      isLiveSupabase,
      source: isLiveSupabase ? 'Supabase Cloud Database' : 'Atelier Production Datastore',
      totalRevenue,
      totalOrders: orders.length,
      paidOrdersCount,
      pendingOrdersCount,
      deliveredOrdersCount,
      totalCustomers: customers.length,
      averageOrderValue,
      repeatCustomerRate: `${repeatRate}%`,
      salesOverTime,
      topProducts,
      geographicBreakdown,
      paymentMethods,
    });
  } catch (err: any) {
    console.error('[Admin Analytics API] Error:', err);
    return res.status(500).json({ error: 'Failed to generate store analytics.' });
  }
});

/**
 * Settings & Integrations Health Check
 */
ecommerceRouter.get('/admin/settings', requireAdminAuth, (_req: Request, res: Response) => {
  const hasSupabase = Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
  const hasCashfree = Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
  const hasShiprocket = Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
  const cashfreeEnv = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';

  return res.json({
    integrations: {
      supabase: {
        configured: hasSupabase,
        url: process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.substring(0, 18)}...` : 'Not configured (using local persistent store)',
      },
      cashfree: {
        configured: hasCashfree,
        environment: cashfreeEnv,
        appId: process.env.CASHFREE_APP_ID ? `${process.env.CASHFREE_APP_ID.substring(0, 6)}...` : 'Using test simulation mode',
      },
      shiprocket: {
        configured: hasShiprocket,
        email: process.env.SHIPROCKET_EMAIL || 'Using test simulation mode',
      },
      email: {
        ownerEmail: process.env.OWNER_EMAIL || process.env.ADMIN_EMAIL || 'owner@eloraparfum.com',
      },
    },
    version: '2.4.0-production',
  });
});

/**
 * Reset test orders, customers, and payments to start clean for public production launch
 */
ecommerceRouter.post('/admin/reset-test-data', requireAdminAuth, (_req: Request, res: Response) => {
  const result = clearStoreTestData();
  return res.json({
    success: true,
    message: result.message,
  });
});

