import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  CreditCard,
  User,
  MapPin,
  Clock,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Send,
  Package,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { Order } from '../types/ecommerce';

export const AdminOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShippingLoading, setIsShippingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Order commission not found');
      const data = await res.json();
      setOrder(data.order);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch order');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, token]);

  const handleCreateShipment = async () => {
    if (!order) return;
    setIsShippingLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/shipments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderNumber: order.order_number }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Shiprocket dispatch failed');

      setFeedback(`Shipment successfully generated! AWB: ${data.shipment.awb_code} via ${data.shipment.courier_name}`);
      await fetchOrder();
    } catch (err: any) {
      setError(err?.message || 'Error generating shipment');
    } finally {
      setIsShippingLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setFeedback(`Order status set to ${newStatus}`);
        fetchOrder();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <RefreshCw className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 space-y-4">
        <Link to="/admin/orders" className="text-xs text-[#D4AF37] inline-flex items-center space-x-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Commissions</span>
        </Link>
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          {error || 'Commission record not found'}
        </div>
      </div>
    );
  }

  const shipment = order.shipments && order.shipments.length > 0 ? order.shipments[0] : null;

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="text-xs text-[#A1A1AA] hover:text-[#D4AF37] inline-flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Commissions</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchOrder}
            className="p-2 border border-[#24232C] bg-[#14141B] text-[#A1A1AA] hover:text-[#FFFFFF] rounded text-xs flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Order Header Card */}
      <div className="bg-[#14141B] border border-[#24232C] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#24232C] pb-6">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="font-mono text-2xl font-semibold text-[#D4AF37]">
                {order.order_number}
              </h1>
              <span
                className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border font-medium ${
                  order.payment_status === 'PAID'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800'
                }`}
              >
                Payment: {order.payment_status}
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border border-[#3A3849] bg-[#1A1924] text-[#E4E4E7]">
                Order: {order.order_status}
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
              Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Quick Shiprocket Action */}
          <div className="flex items-center space-x-3">
            {!shipment ? (
              <button
                onClick={handleCreateShipment}
                disabled={isShippingLoading}
                className="px-5 py-2.5 bg-[#D4AF37] text-[#0A0A0C] text-xs uppercase font-sans font-semibold tracking-wider hover:bg-[#E5C378] transition-colors flex items-center space-x-2 disabled:opacity-50 shadow-md"
              >
                <Truck className="w-4 h-4" />
                <span>{isShippingLoading ? 'Generating AWB...' : 'Create Shipment (Shiprocket)'}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <a
                  href={shipment.tracking_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0C] transition-colors text-xs uppercase tracking-wider font-sans font-medium flex items-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Shiprocket AWB: {shipment.awb_code}</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 3 Column Metadata: Customer, Shipping Address, Payment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Patron Profile */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-sans flex items-center space-x-1.5">
              <User className="w-3 h-3 text-[#D4AF37]" />
              <span>Patron Information</span>
            </span>
            <div className="bg-[#0E0E12] border border-[#24232C] p-3.5 space-y-1 text-xs">
              <div className="font-semibold text-[#FFFFFF]">{order.customer_name}</div>
              <div className="text-[#A1A1AA]">{order.customer_email}</div>
              <div className="font-mono text-[#D4AF37]">{order.customer_phone}</div>
              <div className="pt-2 border-t border-[#1C1B24]">
                <Link
                  to={`/admin/customers/${order.customer_id}`}
                  className="text-[11px] text-[#D4AF37] hover:underline"
                >
                  View Patron Purchase History →
                </Link>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-sans flex items-center space-x-1.5">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span>Delivery Consignment Address</span>
            </span>
            <div className="bg-[#0E0E12] border border-[#24232C] p-3.5 space-y-1 text-xs text-[#A1A1AA]">
              <div className="text-[#FFFFFF]">{order.shipping_address}</div>
              {order.shipping_address_line2 && <div>{order.shipping_address_line2}</div>}
              <div>
                {order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}
              </div>
              <div>{order.shipping_country}</div>
              {order.shipping_landmark && (
                <div className="text-[10px] text-[#71717A] italic">
                  Landmark: {order.shipping_landmark}
                </div>
              )}
            </div>
          </div>

          {/* Payment & Settlement */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-sans flex items-center space-x-1.5">
              <CreditCard className="w-3 h-3 text-[#D4AF37]" />
              <span>Cashfree Settlement</span>
            </span>
            <div className="bg-[#0E0E12] border border-[#24232C] p-3.5 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Status:</span>
                <span className="text-[#FFFFFF] font-medium">{order.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Method:</span>
                <span className="text-[#FFFFFF]">
                  {order.payments?.[0]?.payment_method || 'Online / Cashfree'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Reference:</span>
                <span className="font-mono text-[10px] text-[#D4AF37] truncate max-w-[120px]">
                  {order.cashfree_order_id || 'Captured'}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#1C1B24] pt-1">
                <span className="text-[#A1A1AA]">Total:</span>
                <span className="font-mono text-[#FFFFFF] font-semibold">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Snapshot Table */}
      <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
        <h2 className="font-serif text-lg text-[#FFFFFF]">Flacons in Commission</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-[#A1A1AA] bg-[#0E0E12] border-b border-[#24232C]">
                <th className="py-3 px-4 font-normal">Fragrance</th>
                <th className="py-3 px-4 font-normal">Size</th>
                <th className="py-3 px-4 font-normal">SKU</th>
                <th className="py-3 px-4 font-normal">Unit Price</th>
                <th className="py-3 px-4 font-normal">Qty</th>
                <th className="py-3 px-4 text-right font-normal">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1B24]">
              {order.items?.map((item) => (
                <tr key={item.id} className="hover:bg-[#181722]">
                  <td className="py-3.5 px-4 font-serif text-[#FFFFFF] font-medium">
                    {item.product_name}
                  </td>
                  <td className="py-3.5 px-4 text-[#A1A1AA]">{item.size_ml}</td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-[#71717A]">{item.sku}</td>
                  <td className="py-3.5 px-4 font-mono">₹{item.unit_price.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 font-mono">{item.quantity}</td>
                  <td className="py-3.5 px-4 font-mono text-right text-[#D4AF37] font-medium">
                    ₹{item.total.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Totals */}
        <div className="flex justify-end pt-4 border-t border-[#24232C]">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-[#A1A1AA]">
              <span>Subtotal</span>
              <span className="font-mono text-[#FFFFFF]">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#D4AF37]">
                <span>Privilege Discount</span>
                <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-[#A1A1AA]">
              <span>Express Climate Shipping</span>
              <span className="font-mono text-emerald-400">Complimentary</span>
            </div>
            <div className="flex justify-between text-base font-serif text-[#FFFFFF] pt-2 border-t border-[#24232C]">
              <span>Total Commission</span>
              <span className="font-mono text-[#D4AF37]">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shiprocket Details Card (If Created) */}
      {shipment && (
        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#24232C]">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="font-serif text-lg text-[#FFFFFF]">Shiprocket Consignment Details</h2>
            </div>
            <a
              href={shipment.tracking_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#D4AF37] hover:underline flex items-center space-x-1"
            >
              <span>Live Carrier Tracking</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#0E0E12] p-3 border border-[#24232C]">
              <span className="text-[10px] text-[#A1A1AA] uppercase block mb-1">AWB Code</span>
              <span className="font-mono text-[#D4AF37] font-semibold">{shipment.awb_code}</span>
            </div>
            <div className="bg-[#0E0E12] p-3 border border-[#24232C]">
              <span className="text-[10px] text-[#A1A1AA] uppercase block mb-1">Assigned Courier</span>
              <span className="text-[#FFFFFF]">{shipment.courier_name}</span>
            </div>
            <div className="bg-[#0E0E12] p-3 border border-[#24232C]">
              <span className="text-[10px] text-[#A1A1AA] uppercase block mb-1">Shipment Status</span>
              <span className="text-amber-400">{shipment.status}</span>
            </div>
            <div className="bg-[#0E0E12] p-3 border border-[#24232C]">
              <span className="text-[10px] text-[#A1A1AA] uppercase block mb-1">Estimated Delivery</span>
              <span className="text-[#FFFFFF]">
                {shipment.estimated_delivery_date
                  ? new Date(shipment.estimated_delivery_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                  : '2–3 Business Days'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Atelier Status Controls & Audit History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manual Status Override */}
        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
          <h2 className="font-serif text-lg text-[#FFFFFF]">Manual Status Override</h2>
          <p className="text-xs text-[#A1A1AA]">
            Advance order stage manually through atelier production milestones:
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
              <button
                key={s}
                onClick={() => handleUpdateStatus(s)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-sans border transition-colors ${
                  order.order_status === s
                    ? 'bg-[#D4AF37] text-[#0A0A0C] border-[#D4AF37] font-bold'
                    : 'bg-[#0E0E12] border-[#24232C] text-[#A1A1AA] hover:border-[#3D3B47]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
          <h2 className="font-serif text-lg text-[#FFFFFF]">Commission Audit History</h2>

          <div className="space-y-3">
            {order.history?.map((h) => (
              <div key={h.id} className="flex items-start space-x-3 text-xs">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-[#FFFFFF]">{h.status}</span>
                    <span className="text-[10px] text-[#71717A]">
                      {new Date(h.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA]">{h.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
