import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Thermometer,
  MapPin,
  Mail,
  Copy,
  Check,
  ArrowRight,
  FileText,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { OrderRecord } from '../types';
import { getOrderByNumber, SAMPLE_ORDERS, getAllSavedOrders } from '../data/orderData';
import { OrderEmailPreviewModal } from '../components/OrderEmailPreviewModal';
import { EloraBottleVisualizer } from '../components/EloraBottleVisualizer';
import { PRODUCTS } from '../data/products';

export const OrderStatusPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrderQuery = searchParams.get('order') || '';
  const initialContactQuery = searchParams.get('contact') || '';

  const [orderQuery, setOrderQuery] = useState(initialOrderQuery);
  const [contactQuery, setContactQuery] = useState(initialContactQuery);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const performTrackingLookup = async (orderNum: string, contact: string) => {
    if (!orderNum.trim() || !contact.trim()) {
      setErrorMessage('Please provide BOTH your Order Number AND your registered Phone Number or Email Address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. First attempt backend API lookup
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderNum.trim(),
          emailOrPhone: contact.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.order) {
        setActiveOrder({
          orderNumber: data.order.order_number,
          clientName: data.order.customer_name,
          placedAt: new Date(data.order.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          status: data.order.order_status.toLowerCase(),
          statusLabel: `${data.order.order_status} · ${data.order.payment_status}`,
          total: data.order.total,
          subtotal: data.order.subtotal || data.order.total,
          carrier: data.order.shipment?.courier_name || 'BlueDart Express Air (Shiprocket)',
          trackingNumber: data.order.shipment?.awb_code || 'Pending Assignment',
          trackingUrl: data.order.shipment?.tracking_url,
          estimatedDelivery: data.order.shipment?.estimated_delivery_date
            ? new Date(data.order.shipment.estimated_delivery_date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
              })
            : '2–4 Business Days',
          shippingAddress: data.order.shipping_address_line1 || `${data.order.shipping_city}, ${data.order.shipping_state}`,
          city: data.order.shipping_city,
          state: data.order.shipping_state,
          postalCode: data.order.shipping_postal_code,
          tamperSealNumber: `SEAL-GRS-${Math.floor(1000 + Math.random() * 9000)}-GOLD`,
          items: data.order.items.map((i: any) => ({
            name: i.product_name,
            size: i.size_ml,
            quantity: i.quantity,
            price: i.unit_price,
          })),
          checkpoints: [
            {
              title: 'Order Verified & Authorized',
              location: 'Elora Order Desk',
              timestamp: 'Completed',
              description: 'Guest order verified. Payment logged via Cashfree PG.',
              completed: true,
            },
            {
              title: 'Artisanal Compounding & Inspection',
              location: 'Haute Parfumerie Atelier, Grasse',
              timestamp: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(data.order.order_status) ? 'Completed' : 'In Progress',
              description: '25% concentrated oil formulation hand-inspected under cleanroom conditions.',
              completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(data.order.order_status),
              current: data.order.order_status === 'PLACED' || data.order.order_status === 'PAID',
            },
            {
              title: 'Courier Handover & Domestic Transit',
              location: data.order.shipment?.courier_name || 'BlueDart Express Air',
              timestamp: ['SHIPPED', 'DELIVERED'].includes(data.order.order_status) ? 'In Transit' : 'Pending Handover',
              description: data.order.shipment?.awb_code ? `AWB: ${data.order.shipment.awb_code} (Insulated packaging)` : 'Scheduled for climate-guarded dispatch.',
              completed: ['SHIPPED', 'DELIVERED'].includes(data.order.order_status),
              current: data.order.order_status === 'SHIPPED',
            },
            {
              title: 'White-Glove Delivery Handover',
              location: `${data.order.shipping_city}, ${data.order.shipping_state}`,
              timestamp: data.order.order_status === 'DELIVERED' ? 'Delivered' : 'Expected 2–4 Business Days',
              description: 'Direct doorstep delivery with signature verification.',
              completed: data.order.order_status === 'DELIVERED',
              current: data.order.order_status === 'OUT_FOR_DELIVERY',
            },
          ],
          history: data.order.history || [],
        });
        setSearchParams({ order: orderNum.trim().toUpperCase(), contact: contact.trim() });
        setIsLoading(false);
        return;
      }

      // 2. Fallback to local saved orders if phone or email matches
      const local = getOrderByNumber(orderNum.trim());
      if (
        local &&
        (local.clientEmail?.toLowerCase() === contact.trim().toLowerCase() ||
          local.clientPhone?.replace(/\D/g, '') === contact.trim().replace(/\D/g, ''))
      ) {
        setActiveOrder(local);
        setIsLoading(false);
        return;
      }

      setErrorMessage(
        data.error ||
          'No commission found matching this order number and contact detail. Please verify your entries.'
      );
      setActiveOrder(null);
    } catch (err: any) {
      setErrorMessage('Network error while querying logistics database. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderQuery && initialContactQuery) {
      performTrackingLookup(initialOrderQuery, initialContactQuery);
    }
  }, [initialOrderQuery, initialContactQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performTrackingLookup(orderQuery, contactQuery);
  };

  const handleCopyTracking = () => {
    if (!activeOrder) return;
    navigator.clipboard.writeText(activeOrder.trackingNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const allOrders = getAllSavedOrders();

  return (
    <div className="min-h-screen bg-[#0A0A0C] py-16 sm:py-24 text-[#FFFFFF]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* EDITORIAL HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.32em] text-[#D4AF37] font-sans font-medium block">
            Atelier Logistics Protocol
          </span>
          <h1 className="font-serif text-fluid-h1 text-[#FFFFFF] tracking-[0.06em] uppercase font-normal">
            ORDER STATUS
          </h1>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#A1A1AA] font-sans font-light leading-relaxed">
            Follow the climate-guarded voyage of your bespoke extrait flacons from our formulation reserve to your private residence.
          </p>
        </div>

        {/* SEARCH & ORDER DUAL VERIFICATION INPUT */}
        <div className="max-w-2xl mx-auto mb-14 space-y-4">
          <form
            onSubmit={handleSearch}
            className="bg-[#14141B] border border-[#2B2A36] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] focus-within:border-[#D4AF37] transition-colors space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA] mb-1.5 font-sans font-medium">
                  Order Number *
                </label>
                <div className="relative flex items-center">
                  <Package className="w-3.5 h-3.5 absolute left-3 text-[#71717A]" />
                  <input
                    id="order-number-input"
                    type="text"
                    required
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    placeholder="e.g. ELR-2026-000001"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0A0A0C] border border-[#24232C] text-xs text-[#FFFFFF] placeholder-[#71717A] outline-none font-sans focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA] mb-1.5 font-sans font-medium">
                  Phone Number or Email *
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-3.5 h-3.5 absolute left-3 text-[#71717A]" />
                  <input
                    id="order-contact-input"
                    type="text"
                    required
                    value={contactQuery}
                    onChange={(e) => setContactQuery(e.target.value)}
                    placeholder="e.g. 9820011223 or email"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0A0A0C] border border-[#24232C] text-xs text-[#FFFFFF] placeholder-[#71717A] outline-none font-sans focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1C1B24]">
              <div className="flex items-center space-x-1.5 text-[10px] text-[#A1A1AA]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Patron Privacy Guard: Both fields required to access consignment records</span>
              </div>

              <button
                id="order-tracking-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#D4AF37] text-[#0A0A0C] font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#F3E5AB] transition-colors shrink-0 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Track Consignment'}
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
              <span className="font-semibold">Notice:</span>
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* ORDER DETAILS & TIMELINE */}
        {activeOrder ? (
          <div className="space-y-8">
            {/* TOP SUMMARY BANNER */}
            <div className="p-8 bg-[#0E0E12] border border-[#24232C] shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-sans font-semibold">
                      {activeOrder.statusLabel}
                    </span>
                    {activeOrder.isVip && (
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#A1A1AA] font-sans">
                        · VIP Allocation
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-fluid-h2 text-[#FFFFFF] tracking-[0.04em]">
                    Order #{activeOrder.orderNumber}
                  </h2>
                  <p className="text-xs text-[#A1A1AA] font-sans">
                    Placed on {activeOrder.placedAt} for <strong>{activeOrder.clientName}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(true)}
                    className="px-4 py-2.5 bg-[#14141B] hover:bg-[#1C1C24] border border-[#24232C] hover:border-[#D4AF37] text-xs font-sans text-[#FFFFFF] flex items-center space-x-2 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>View Confirmation Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyTracking}
                    className="px-4 py-2.5 bg-[#14141B] hover:bg-[#1C1C24] border border-[#24232C] hover:border-[#D4AF37] text-xs font-sans text-[#FFFFFF] flex items-center space-x-2 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>AWB Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#A1A1AA]" />
                        <span>AWB: {activeOrder.trackingNumber}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SPECIFICATION METRICS BAR */}
              <div className="mt-8 pt-6 border-t border-[#24232C] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
                <div className="p-4 bg-[#14141B] border border-[#24232C] space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block">
                    Estimated Arrival
                  </span>
                  <span className="font-medium text-[#FFFFFF]">{activeOrder.estimatedDelivery}</span>
                </div>

                <div className="p-4 bg-[#14141B] border border-[#24232C] space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block">
                    Express Carrier
                  </span>
                  <span className="font-medium text-[#FFFFFF] truncate block" title={activeOrder.carrier}>
                    {activeOrder.carrier}
                  </span>
                </div>

                <div className="p-4 bg-[#14141B] border border-[#24232C] space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block">
                    Climate Guard
                  </span>
                  <span className="font-medium text-[#D4AF37]">18°C Controlled Ambient</span>
                </div>

                <div className="p-4 bg-[#14141B] border border-[#24232C] space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block">
                    Security Seal
                  </span>
                  <span className="font-medium text-[#D4AF37] font-mono text-[11px]">
                    {activeOrder.tamperSealNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* TIMELINE SECTION */}
            <div className="p-8 bg-[#0E0E12] border border-[#24232C] shadow-[0_8px_30px_rgba(0,0,0,0.4)] space-y-6">
              <div className="border-b border-[#24232C] pb-4">
                <h3 className="font-serif text-2xl text-[#FFFFFF] tracking-[0.04em]">
                  Shipment Journey & Verification
                </h3>
                <p className="text-xs text-[#A1A1AA] font-sans mt-0.5">
                  Consignment transit verification and atelier dispatch milestones
                </p>
              </div>

              {/* TIMELINE MILESTONES */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-[1px] before:bg-[#24232C]">
                {activeOrder.checkpoints.map((cp, idx) => (
                  <div key={idx} className="relative">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        cp.completed
                          ? cp.current
                            ? 'bg-[#D4AF37] text-[#0A0A0C] border-[#D4AF37]'
                            : 'bg-[#14141B] text-[#D4AF37] border-[#D4AF37]'
                          : 'bg-[#0E0E12] border-[#24232C] text-transparent'
                      }`}
                    >
                      {cp.completed ? (
                        <Check className="w-3 h-3 stroke-[2]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#24232C]" />
                      )}
                    </div>

                    {/* Checkpoint Card */}
                    <div className="p-5 bg-[#14141B] border border-[#24232C]">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-serif text-base text-[#FFFFFF]">
                            {cp.title}
                          </h4>
                          {cp.current && (
                            <span className="text-[9px] uppercase font-sans font-medium text-[#D4AF37]">
                              · In Progress
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-sans text-[#A1A1AA]">{cp.timestamp}</span>
                      </div>

                      <div className="flex items-center space-x-1.5 text-xs text-[#A1A1AA] font-sans mb-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
                        <span>{cp.location}</span>
                      </div>

                      <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed">
                        {cp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ORDER ITEMS & RECIPIENT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Flacons List */}
              <div className="lg:col-span-2 p-8 bg-[#0E0E12] border border-[#24232C] space-y-5">
                <h3 className="font-serif text-2xl text-[#FFFFFF] border-b border-[#24232C] pb-3">
                  Allocated Fragrances ({activeOrder.items.length})
                </h3>

                <div className="space-y-4">
                  {activeOrder.items.map((item, idx) => {
                    const matchedProduct = PRODUCTS.find((p) => p.slug === item.slug);
                    return (
                      <div
                        key={idx}
                        className="p-4 bg-[#14141B] border border-[#24232C] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center space-x-4 min-w-0">
                          <div className="w-14 h-16 bg-[#0A0A0C] border border-[#24232C] flex items-center justify-center shrink-0">
                            {matchedProduct ? (
                              <div className="scale-75">
                                <EloraBottleVisualizer product={matchedProduct} size="sm" showPedestal={false} />
                              </div>
                            ) : (
                              <Package className="w-5 h-5 text-[#A1A1AA]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-sans tracking-widest text-[#D4AF37] block">
                              {item.category || '25% Extrait'}
                            </span>
                            <h4 className="font-serif text-base text-[#FFFFFF] truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[#A1A1AA] font-sans">
                              {item.size} · Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-sans text-sm font-medium text-[#D4AF37] block">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal */}
                <div className="pt-4 border-t border-[#24232C] space-y-2 text-xs font-sans text-[#A1A1AA]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#FFFFFF]">₹{activeOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pan-India Climate Courier</span>
                    <span className="text-[#D4AF37]">COMPLIMENTARY</span>
                  </div>
                  <div className="pt-3 border-t border-[#24232C] flex justify-between font-serif text-xl text-[#FFFFFF]">
                    <span>Total Settled</span>
                    <span className="text-[#D4AF37]">₹{activeOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Recipient */}
              <div className="space-y-6">
                <div className="p-8 bg-[#0E0E12] border border-[#24232C] space-y-3 text-xs font-sans">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                    Delivery Destination
                  </span>
                  <div className="space-y-1 text-[#FFFFFF]">
                    <p className="font-serif text-base">{activeOrder.clientName}</p>
                    <p className="text-[#A1A1AA]">{activeOrder.shippingAddress}</p>
                    <p className="text-[#A1A1AA]">
                      {activeOrder.city}, {activeOrder.state} {activeOrder.postalCode}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#24232C]">
                    <span className="text-[10px] uppercase text-[#A1A1AA] block mb-1">
                      Payment Protocol
                    </span>
                    <span className="text-[#FFFFFF] font-medium">{activeOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Consignment Concierge Inquiry Banner */}
            <div className="p-6 bg-[#14141B] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#0A0A0C] border border-[#D4AF37] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#FFFFFF]">
                    Require assistance with consignment #{activeOrder.orderNumber}?
                  </h4>
                  <p className="text-xs text-[#A1A1AA] font-sans">
                    Our Atelier Concierge is available to assist with redirection, transit questions, or sampling returns.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('open-concierge-chat', {
                      detail: {
                        query: `Hello, I am inquiring regarding consignment order #${activeOrder.orderNumber} for ${activeOrder.clientName}. What is its current delivery status?`,
                        mode: 'fast',
                      },
                    })
                  )
                }
                className="px-5 py-3 bg-[#D4AF37] hover:bg-[#E5C358] text-[#0A0A0C] font-semibold text-xs uppercase tracking-[0.16em] transition-all flex items-center space-x-2 shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Inquire With Concierge</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <OrderEmailPreviewModal
        order={activeOrder}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
};
