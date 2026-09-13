import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  Truck,
  Clock,
  ArrowUpRight,
  Package,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { DashboardStats } from '../types/ecommerce';

export const AdminDashboard: React.FC = () => {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load dashboard metrics');
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37] mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">
            Synchronizing Atelier Metrics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8">
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error || 'Unable to display statistics.'}</span>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      subtext: `Today: ₹${stats.todayRevenue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      accent: 'text-[#D4AF37]',
    },
    {
      label: 'Commissions (Orders)',
      value: stats.totalOrders,
      subtext: `${stats.todayOrders} placed today`,
      icon: ShoppingBag,
      accent: 'text-[#FAF9F6]',
    },
    {
      label: 'Captured Patrons',
      value: stats.totalCustomers,
      subtext: 'Acquired via Guest Checkout',
      icon: Users,
      accent: 'text-[#FAF9F6]',
    },
    {
      label: 'Awaiting Shipment',
      value: stats.awaitingShipmentCount,
      subtext: `${stats.shippedOrdersCount} currently in transit`,
      icon: Truck,
      accent: 'text-amber-400',
    },
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24232C] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans font-medium block">
            Executive Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] tracking-[0.04em] uppercase font-normal">
            ATELIER COMMAND CONSOLE
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStats}
            className="px-3.5 py-2 border border-[#24232C] bg-[#14141B] text-xs text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-[#D4AF37] transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-wider hover:bg-[#E5C378] transition-colors"
          >
            View Commissions
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-[#14141B] border border-[#24232C] p-6 relative overflow-hidden group hover:border-[#3D3B47] transition-colors shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA] font-sans">
                  {kpi.label}
                </span>
                <div className="p-2 bg-[#1C1B24] rounded border border-[#2B2A36]">
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                </div>
              </div>
              <div className={`font-serif text-2xl sm:text-3xl font-light mb-1 ${kpi.accent}`}>
                {kpi.value}
              </div>
              <p className="text-[11px] text-[#A1A1AA] font-sans">{kpi.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Operational Grid: Recent Orders & Top Fragrances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-[#14141B] border border-[#24232C] p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#24232C]">
            <div>
              <h2 className="font-serif text-lg text-[#FFFFFF]">Recent Commissions</h2>
              <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                Latest client orders from guest checkout
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs text-[#D4AF37] hover:underline flex items-center space-x-1 font-sans"
            >
              <span>All Commissions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-xs text-[#71717A] py-8 text-center">
              No orders registered yet. New customer acquisitions will appear here live.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-[#A1A1AA] border-b border-[#24232C]">
                    <th className="pb-3 font-normal">Order #</th>
                    <th className="pb-3 font-normal">Patron</th>
                    <th className="pb-3 font-normal">Total</th>
                    <th className="pb-3 font-normal">Payment</th>
                    <th className="pb-3 font-normal">Shipping</th>
                    <th className="pb-3 text-right font-normal">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1B24]">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#181722] transition-colors">
                      <td className="py-3 font-mono text-[#D4AF37] font-medium">
                        {order.order_number}
                      </td>
                      <td className="py-3">
                        <div className="text-[#FFFFFF] font-medium">{order.customer_name}</div>
                        <div className="text-[10px] text-[#A1A1AA]">{order.shipping_city}</div>
                      </td>
                      <td className="py-3 font-mono text-[#FFFFFF]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                            order.payment_status === 'PAID'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                              : 'bg-amber-950/60 text-amber-300 border-amber-800'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] text-[#A1A1AA]">
                          {order.shipping_status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-[11px] text-[#D4AF37] hover:underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Fragrances & Recent Patrons (1 col) */}
        <div className="space-y-8">
          {/* Top Selling Flacons */}
          <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
            <div className="border-b border-[#24232C] pb-3">
              <h2 className="font-serif text-lg text-[#FFFFFF]">Top Haute Flacons</h2>
              <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                By volume & client preference
              </p>
            </div>

            <div className="space-y-3">
              {stats.topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-[#0E0E12] border border-[#24232C]"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-serif text-[#FFFFFF] block font-medium">
                      {p.product_name}
                    </span>
                    <span className="text-[10px] text-[#A1A1AA]">
                      {p.units_sold} flacons allocated
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#D4AF37]">
                    ₹{p.revenue.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shiprocket Status Banner */}
          <div className="bg-gradient-to-br from-[#181724] to-[#12111A] border border-[#2D2A3C] p-5 space-y-3">
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <Truck className="w-4 h-4" />
              <span className="font-serif text-sm uppercase tracking-wider">
                Shiprocket Dispatch Queue
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              {stats.awaitingShipmentCount} orders are ready for consignment generation and courier handover.
            </p>
            <Link
              to="/admin/shipments"
              className="inline-block text-xs text-[#D4AF37] hover:underline font-semibold"
            >
              Open Shiprocket Dispatch Console →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
