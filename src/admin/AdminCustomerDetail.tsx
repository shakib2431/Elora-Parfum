import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  ShoppingBag,
  CreditCard,
  MapPin,
  Clock,
  RefreshCw,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { Customer, Order } from '../types/ecommerce';

export const AdminCustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAdminAuth();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Patron record not found');
      const data = await res.json();
      setCustomer(data.customer);
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err?.message || 'Error loading patron');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <RefreshCw className="w-5 h-5 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-8 space-y-4">
        <Link to="/admin/customers" className="text-xs text-[#D4AF37] inline-flex items-center space-x-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Patrons</span>
        </Link>
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          {error || 'Patron record not found'}
        </div>
      </div>
    );
  }

  const aov = customer.total_orders > 0 ? Math.round(customer.total_spent / customer.total_orders) : 0;

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/admin/customers"
          className="text-xs text-[#A1A1AA] hover:text-[#D4AF37] inline-flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Patrons</span>
        </Link>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-[#14141B] border border-[#24232C] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24232C] pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full border border-[#D4AF37]/40 bg-[#1A1924] flex items-center justify-center text-[#D4AF37] font-serif text-xl font-bold">
              {customer.full_name?.charAt(0) || 'P'}
            </div>
            <div>
              <h1 className="font-serif text-2xl text-[#FFFFFF]">{customer.full_name}</h1>
              <div className="flex items-center space-x-4 text-xs text-[#A1A1AA] mt-1">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-[#D4AF37]" />
                  <span>{customer.email}</span>
                </span>
                <span className="flex items-center space-x-1 font-mono text-[#D4AF37]">
                  <Phone className="w-3 h-3" />
                  <span>{customer.phone}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block">
              Patron Since
            </span>
            <span className="text-xs text-[#FFFFFF]">
              {new Date(customer.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* 3 Metric cards: LTV, Orders, AOV */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0E0E12] border border-[#24232C] p-4">
            <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block mb-1">
              Lifetime Value (LTV)
            </span>
            <span className="font-serif text-2xl text-[#D4AF37]">
              ₹{customer.total_spent.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-[#0E0E12] border border-[#24232C] p-4">
            <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block mb-1">
              Total Commissions
            </span>
            <span className="font-serif text-2xl text-[#FFFFFF]">{customer.total_orders}</span>
          </div>

          <div className="bg-[#0E0E12] border border-[#24232C] p-4">
            <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block mb-1">
              Average Order Value (AOV)
            </span>
            <span className="font-serif text-2xl text-[#FFFFFF]">
              ₹{aov.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Commissions History Table */}
      <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
        <h2 className="font-serif text-lg text-[#FFFFFF]">Commissions History</h2>

        {orders.length === 0 ? (
          <p className="text-xs text-[#71717A] py-4">No completed orders found for this patron.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-[#A1A1AA] bg-[#0E0E12] border-b border-[#24232C]">
                  <th className="py-3 px-4 font-normal">Order #</th>
                  <th className="py-3 px-4 font-normal">Date</th>
                  <th className="py-3 px-4 font-normal">Items</th>
                  <th className="py-3 px-4 font-normal">Total</th>
                  <th className="py-3 px-4 font-normal">Payment</th>
                  <th className="py-3 px-4 font-normal">Shipping</th>
                  <th className="py-3 px-4 text-right font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1B24]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#181722]">
                    <td className="py-3.5 px-4 font-mono font-medium text-[#D4AF37]">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-[#FFFFFF]">
                      {order.items?.map((i) => `${i.product_name} (${i.size_ml}) × ${i.quantity}`).join(', ') || 'Flacons'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#FFFFFF]">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-800 bg-emerald-950/60 text-emerald-300">
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA] uppercase text-[10px]">
                      {order.shipping_status}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-[11px] text-[#D4AF37] hover:underline"
                      >
                        View Order →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
