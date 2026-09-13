import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, RefreshCw, Eye, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { Order } from '../types/ecommerce';

export const AdminOrders: React.FC = () => {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== 'ALL') q.set('status', statusFilter);
      if (search.trim()) q.set('search', search.trim());

      const res = await fetch(`/api/admin/orders?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load commissions');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err?.message || 'Error loading orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const statusTabs = ['ALL', 'CONFIRMED', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24232C] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans font-medium block">
            Atelier Commissions Registry
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] tracking-[0.04em] uppercase font-normal">
            CUSTOMER ORDERS
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto px-3.5 py-2 border border-[#24232C] bg-[#14141B] text-xs text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-[#D4AF37] transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#14141B] border border-[#24232C] p-4 space-y-4">
        {/* Status Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-sans whitespace-nowrap transition-colors border ${
                statusFilter === tab
                  ? 'bg-[#D4AF37] text-[#0A0A0C] border-[#D4AF37] font-semibold'
                  : 'bg-[#0A0A0C] text-[#A1A1AA] border-[#24232C] hover:border-[#3D3B47]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by Order # (e.g. ELR-2026-000001), patron name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0C] border border-[#24232C] text-xs text-[#FFFFFF] focus:border-[#D4AF37] outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1C1B24] border border-[#2B2A36] text-xs text-[#FFFFFF] hover:border-[#D4AF37] transition-colors font-sans"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-[#14141B] border border-[#24232C] shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#A1A1AA] flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
            <span>Loading commissions...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-400 text-xs">{error}</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-[#2E2D3B] mx-auto" />
            <p className="text-xs text-[#A1A1AA]">No matching orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-[#A1A1AA] bg-[#0E0E12] border-b border-[#24232C]">
                  <th className="py-3.5 px-4 font-normal">Order #</th>
                  <th className="py-3.5 px-4 font-normal">Date</th>
                  <th className="py-3.5 px-4 font-normal">Patron Details</th>
                  <th className="py-3.5 px-4 font-normal">Consignment</th>
                  <th className="py-3.5 px-4 font-normal">Total</th>
                  <th className="py-3.5 px-4 font-normal">Payment</th>
                  <th className="py-3.5 px-4 font-normal">Shipping</th>
                  <th className="py-3.5 px-4 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1B24]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#181722] transition-colors">
                    <td className="py-4 px-4 font-mono font-medium text-[#D4AF37]">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-4 text-[#A1A1AA] text-[11px]">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#FFFFFF]">{order.customer_name}</div>
                      <div className="text-[10px] text-[#A1A1AA]">{order.customer_email}</div>
                      <div className="text-[10px] text-[#71717A] font-mono">{order.customer_phone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[11px] text-[#FFFFFF]">
                        {order.items?.map((i) => `${i.product_name} (${i.size_ml}) × ${i.quantity}`).join(', ') || 'Fragrance Flacon'}
                      </div>
                      <div className="text-[10px] text-[#71717A]">
                        {order.shipping_city}, {order.shipping_state}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[#FFFFFF] font-medium">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border font-medium ${
                          order.payment_status === 'PAID'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950/60 text-amber-300 border-amber-800'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block font-medium">
                        {order.shipping_status}
                      </span>
                      {order.shipments?.[0]?.courier_name && (
                        <span className="text-[9px] text-[#71717A]">
                          {order.shipments[0].courier_name}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#1C1B24] border border-[#2B2A36] text-[#D4AF37] hover:border-[#D4AF37] transition-colors rounded text-[11px]"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
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
