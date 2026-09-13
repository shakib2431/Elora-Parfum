import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  RefreshCw,
  MapPin,
  Sparkles,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Database,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAdminAuth } from './AdminAuthContext';
import { supabaseClient } from '../services/supabaseClient';

interface SalesDataPoint {
  date: string;
  displayDate: string;
  revenue: number;
  orders: number;
  units: number;
}

interface ProductSalesData {
  product_name: string;
  units_sold: number;
  revenue: number;
  percentage: number;
}

interface GeoData {
  city: string;
  state: string;
  orders: number;
  revenue: number;
  share: string;
}

interface AnalyticsState {
  totalRevenue: number;
  totalOrders: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  deliveredOrdersCount: number;
  totalCustomers: number;
  averageOrderValue: number;
  repeatCustomerRate: string;
  salesOverTime: SalesDataPoint[];
  topProducts: ProductSalesData[];
  geographicBreakdown: GeoData[];
  paymentMethods: Array<{ method: string; count: number; revenue: number; share: string }>;
  dataSource: string;
  isLiveSupabase: boolean;
}

const GOLD_PALETTE = ['#D4AF37', '#E5C378', '#B99A62', '#997D45', '#7D6433', '#5E4922'];

export const AdminAnalytics: React.FC = () => {
  const { token, isSupabaseConnected } = useAdminAuth();
  const [analytics, setAnalytics] = useState<AnalyticsState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders'>('revenue');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchRealData = async () => {
    setIsRefreshing(true);
    setFetchError(null);

    try {
      let supaDirectSuccess = false;

      // 1. If client Supabase is connected, attempt to pull real orders directly from Supabase
      if (supabaseClient) {
        try {
          const { data: supaOrders, error: supaErr } = await supabaseClient
            .from('orders')
            .select('*, order_items(*), payments(*)');

          if (!supaErr && supaOrders) {
            supaDirectSuccess = true;
            processRealOrders(supaOrders, 'Supabase Direct Client', true);
            setIsLoading(false);
            setIsRefreshing(false);
            return;
          }
        } catch (e) {
          console.warn('[AdminAnalytics] Direct Supabase query failed, falling back to server API', e);
        }
      }

      // 2. Fetch from backend API which is synced with Supabase on the server
      const res = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to load analytics: ${res.statusText}`);
      }

      const data = await res.json();
      setAnalytics({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        paidOrdersCount: data.paidOrdersCount || 0,
        pendingOrdersCount: data.pendingOrdersCount || 0,
        deliveredOrdersCount: data.deliveredOrdersCount || 0,
        totalCustomers: data.totalCustomers || 0,
        averageOrderValue: data.averageOrderValue || 0,
        repeatCustomerRate: data.repeatCustomerRate || '0%',
        salesOverTime: data.salesOverTime || [],
        topProducts: data.topProducts || [],
        geographicBreakdown: data.geographicBreakdown || [],
        paymentMethods: data.paymentMethods || [],
        dataSource: data.source || (data.isLiveSupabase ? 'Supabase Cloud Database' : 'Atelier Production Datastore'),
        isLiveSupabase: Boolean(data.isLiveSupabase),
      });
    } catch (err: any) {
      console.error('[AdminAnalytics] Fetch error:', err);
      setFetchError(err.message || 'Error pulling live analytics from database.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const processRealOrders = (orders: any[], sourceName: string, isLive: boolean) => {
    let totalRev = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let deliveredCount = 0;

    const productSalesMap = new Map<string, { units: number; revenue: number }>();
    const citySalesMap = new Map<string, { city: string; state: string; orders: number; revenue: number }>();
    const paymentMethodsMap = new Map<string, { count: number; revenue: number }>();

    // 7 days bucket
    const past7 = new Map<string, SalesDataPoint>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      past7.set(iso, { date: iso, displayDate, revenue: 0, orders: 0, units: 0 });
    }

    for (const o of orders) {
      const isPaid = o.payment_status === 'PAID';
      const orderTotal = Number(o.total) || 0;

      if (isPaid) {
        totalRev += orderTotal;
        paidCount += 1;
      } else {
        pendingCount += 1;
      }

      if (o.shipping_status === 'DELIVERED') {
        deliveredCount += 1;
      }

      // Group timeline
      const orderDateStr = o.created_at ? o.created_at.split('T')[0] : '';
      if (past7.has(orderDateStr)) {
        const bucket = past7.get(orderDateStr)!;
        bucket.orders += 1;
        if (isPaid) bucket.revenue += orderTotal;
        if (o.order_items) {
          bucket.units += o.order_items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        }
      }

      // Group product items
      const items = o.order_items || o.items || [];
      for (const item of items) {
        const name = item.product_name || 'Bespoke Formulation';
        const curr = productSalesMap.get(name) || { units: 0, revenue: 0 };
        curr.units += Number(item.quantity) || 1;
        if (isPaid) curr.revenue += Number(item.total) || 0;
        productSalesMap.set(name, curr);
      }

      // Group geography
      const city = (o.shipping_city || 'Unspecified').trim();
      const state = (o.shipping_state || 'India').trim();
      const key = `${city.toLowerCase()}_${state.toLowerCase()}`;
      const cData = citySalesMap.get(key) || { city, state, orders: 0, revenue: 0 };
      cData.orders += 1;
      if (isPaid) cData.revenue += orderTotal;
      citySalesMap.set(key, cData);

      // Payment method
      const pMethod = (o.payments && o.payments[0]?.payment_method) || (isPaid ? 'CASHFREE_UPI' : 'PENDING');
      const pmData = paymentMethodsMap.get(pMethod) || { count: 0, revenue: 0 };
      pmData.count += 1;
      if (isPaid) pmData.revenue += orderTotal;
      paymentMethodsMap.set(pMethod, pmData);
    }

    const aov = paidCount > 0 ? Math.round(totalRev / paidCount) : 0;

    const topProducts = Array.from(productSalesMap.entries())
      .map(([name, data]) => ({
        product_name: name,
        units_sold: data.units,
        revenue: data.revenue,
        percentage: totalRev > 0 ? Math.round((data.revenue / totalRev) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

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

    const paymentMethods = Array.from(paymentMethodsMap.entries()).map(([method, data]) => ({
      method,
      count: data.count,
      revenue: data.revenue,
      share: orders.length > 0 ? `${Math.round((data.count / orders.length) * 100)}%` : '0%',
    }));

    setAnalytics({
      totalRevenue: totalRev,
      totalOrders: orders.length,
      paidOrdersCount: paidCount,
      pendingOrdersCount: pendingCount,
      deliveredOrdersCount: deliveredCount,
      totalCustomers: new Set(orders.map((o) => o.customer_email)).size,
      averageOrderValue: aov,
      repeatCustomerRate: '0%',
      salesOverTime: Array.from(past7.values()),
      topProducts,
      geographicBreakdown,
      paymentMethods,
      dataSource: sourceName,
      isLiveSupabase: isLive,
    });
  };

  useEffect(() => {
    fetchRealData();
  }, [token]);

  // Custom luxury tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as SalesDataPoint;
      return (
        <div className="bg-[#14141B] border border-[#D4AF37]/50 p-3 shadow-2xl rounded-none text-left min-w-[160px]">
          <p className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#A1A1AA] mb-1">
            {data.displayDate || label}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-xs font-serif">
              <span className="text-[#FAF9F6]">Revenue:</span>
              <span className="text-[#D4AF37] font-mono font-medium">
                ₹{data.revenue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs font-serif">
              <span className="text-[#FAF9F6]">Orders Placed:</span>
              <span className="text-warm-ivory font-mono">{data.orders}</span>
            </div>
            {data.units > 0 && (
              <div className="flex items-center justify-between gap-4 text-[11px] font-sans text-[#A1A1AA]">
                <span>Flacons:</span>
                <span>{data.units} units</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-8 sm:p-12 min-h-[60vh] flex flex-col items-center justify-center text-[#FAF9F6] space-y-4">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-xs uppercase tracking-[0.26em] text-[#D4AF37]">
          Querying Live Supabase Store Records...
        </p>
      </div>
    );
  }

  const hasRealSales = analytics && analytics.totalRevenue > 0;
  const hasRealOrders = analytics && analytics.totalOrders > 0;

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto text-[#FAF9F6]">
      {/* Top Header & Data Source Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24232C] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37] font-sans font-medium">
              Real-Time Atelier Intelligence
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase tracking-wider font-mono border rounded-none bg-[#1A1A24] border-[#3B3A4A] text-[#86EFAC]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE UNMOCKED DATA</span>
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] tracking-[0.04em] uppercase font-normal mt-1">
            SALES OVERVIEW & STORE PERFORMANCE
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1 flex items-center gap-2">
            <span>Aggregated directly from database tables</span>
            <span>•</span>
            <span className="text-[#D4AF37] font-mono text-[11px]">
              {analytics?.dataSource || 'Supabase Synchronized Store'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRealData}
            disabled={isRefreshing}
            className="px-4 py-2 bg-[#14141B] border border-[#2B2A36] text-[#FAF9F6] hover:border-[#D4AF37] text-xs font-sans tracking-[0.16em] uppercase flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Records'}</span>
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="p-4 bg-[#2A1616] border border-rose-800 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{fetchError}</span>
        </div>
      )}

      {/* KPI Cards (Computed strictly from live database) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-2">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase tracking-wider">Gross Realized Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="font-serif text-3xl text-[#D4AF37]">
            ₹{analytics?.totalRevenue.toLocaleString('en-IN') || 0}
          </div>
          <p className="text-[11px] text-[#A1A1AA]">
            {analytics?.paidOrdersCount || 0} settled transactions via Cashfree Gateway / UPI
          </p>
        </div>

        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-2">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase tracking-wider">Total Commissions</span>
            <ShoppingBag className="w-4 h-4 text-[#FAF9F6]" />
          </div>
          <div className="font-serif text-3xl text-[#FAF9F6]">
            {analytics?.totalOrders || 0}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA]">
            <span className="text-emerald-400 font-mono">{analytics?.paidOrdersCount || 0} Paid</span>
            <span>•</span>
            <span className="text-amber-400 font-mono">{analytics?.pendingOrdersCount || 0} Pending</span>
          </div>
        </div>

        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-2">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase tracking-wider">Average Order Value (AOV)</span>
            <Layers className="w-4 h-4 text-[#FAF9F6]" />
          </div>
          <div className="font-serif text-3xl text-[#FAF9F6]">
            ₹{analytics?.averageOrderValue.toLocaleString('en-IN') || 0}
          </div>
          <p className="text-[11px] text-[#A1A1AA]">
            Net revenue per paid patron allocation
          </p>
        </div>

        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-2">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="text-[10px] uppercase tracking-wider">Database Source</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-serif text-lg text-emerald-300 truncate">
            {analytics?.isLiveSupabase ? 'Supabase Active' : 'Atelier Datastore'}
          </div>
          <p className="text-[11px] text-[#A1A1AA] truncate">
            {analytics?.totalCustomers || 0} distinct patrons logged
          </p>
        </div>
      </div>

      {/* Main Interactive Recharts Sales Overview Chart */}
      <div className="bg-[#14141B] border border-[#24232C] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24232C] pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans font-medium">
              Temporal Trajectory
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#FFFFFF] tracking-[0.02em] uppercase">
              SALES VELOCITY (PAST 7 DAYS)
            </h2>
          </div>

          {/* Metric Selector Toggle */}
          <div className="flex items-center gap-2 bg-[#0A0A0C] p-1 border border-[#2B2A36]">
            <button
              type="button"
              onClick={() => setActiveMetric('revenue')}
              className={`px-3 py-1.5 text-xs uppercase tracking-[0.14em] font-sans transition-colors ${
                activeMetric === 'revenue'
                  ? 'bg-[#D4AF37] text-[#0A0A0C] font-semibold'
                  : 'text-[#A1A1AA] hover:text-[#FAF9F6]'
              }`}
            >
              Revenue (₹)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('orders')}
              className={`px-3 py-1.5 text-xs uppercase tracking-[0.14em] font-sans transition-colors ${
                activeMetric === 'orders'
                  ? 'bg-[#D4AF37] text-[#0A0A0C] font-semibold'
                  : 'text-[#A1A1AA] hover:text-[#FAF9F6]'
              }`}
            >
              Commissions Placed
            </button>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="w-full h-[320px] pt-4">
          {analytics && analytics.salesOverTime && analytics.salesOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics.salesOverTime}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="goldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="blueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#24232C" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#24232C' }}
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#24232C' }}
                  tickFormatter={(val) =>
                    activeMetric === 'revenue'
                      ? val >= 1000
                        ? `₹${(val / 1000).toFixed(0)}k`
                        : `₹${val}`
                      : `${val}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                {activeMetric === 'revenue' ? (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Gross Revenue"
                    stroke="#D4AF37"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#goldAreaGradient)"
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="orders"
                    name="Orders Count"
                    stroke="#93C5FD"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#blueAreaGradient)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 border border-dashed border-[#2B2A36]">
              <Calendar className="w-8 h-8 text-[#A1A1AA] stroke-1" />
              <p className="font-serif text-sm text-[#FAF9F6]">No Order Timeline Recorded Yet</p>
              <p className="text-xs text-[#A1A1AA] max-w-sm">
                Once customers place commissions in the boutique, your 7-day sales curve will plot dynamically.
              </p>
            </div>
          )}
        </div>

        {/* Real Status Note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#A1A1AA] pt-4 border-t border-[#24232C] gap-2">
          <span>
            {hasRealOrders
              ? `Displaying ${analytics.totalOrders} total verified orders with active fulfillment pipeline.`
              : 'Production Store Mode: Standing by for Genesis launch transactions.'}
          </span>
          <span className="font-mono text-[#D4AF37]">Timezone: Asia/Kolkata (IST)</span>
        </div>
      </div>

      {/* Dual Breakdowns: Product Allocation & Real Geographic Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real Product Sales Allocation */}
        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#24232C]">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="font-serif text-lg text-[#FFFFFF]">Fragrance Allocation Performance</h2>
            </div>
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-mono">
              From Order Items
            </span>
          </div>

          {analytics && analytics.topProducts && analytics.topProducts.length > 0 ? (
            <div className="space-y-4">
              {analytics.topProducts.map((p, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#FAF9F6] font-medium">{p.product_name}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-[#A1A1AA] text-[11px]">{p.units_sold} flacons</span>
                      <span className="text-[#D4AF37] font-mono font-medium">
                        ₹{p.revenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-[#0A0A0C] overflow-hidden rounded-none">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B99A62] transition-all duration-500"
                      style={{
                        width: `${Math.max(p.percentage, 8)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 border border-dashed border-[#2B2A36]">
              <Sparkles className="w-6 h-6 text-[#A1A1AA] mx-auto stroke-1" />
              <p className="font-serif text-sm text-[#FAF9F6]">No Fragrance Commissions Yet</p>
              <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto">
                Product sales shares are computed from real customer flacon selections in live checkout.
              </p>
            </div>
          )}
        </div>

        {/* Real Geographic Patron Concentration */}
        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#24232C]">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="font-serif text-lg text-[#FFFFFF]">Geographic Patron Concentration</h2>
            </div>
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-mono">
              From Shipping Consignments
            </span>
          </div>

          {analytics && analytics.geographicBreakdown && analytics.geographicBreakdown.length > 0 ? (
            <div className="space-y-4">
              {analytics.geographicBreakdown.map((geo, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#FAF9F6] font-medium">
                      {geo.city}, {geo.state}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-[#A1A1AA] text-[11px]">{geo.orders} orders</span>
                      <span className="text-[#D4AF37] font-mono">{geo.share}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-[#0A0A0C] overflow-hidden rounded-none">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C378] transition-all duration-500"
                      style={{ width: geo.share }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 border border-dashed border-[#2B2A36]">
              <MapPin className="w-6 h-6 text-[#A1A1AA] mx-auto stroke-1" />
              <p className="font-serif text-sm text-[#FAF9F6]">Awaiting Shipping Addresses</p>
              <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto">
                Geographic distribution will dynamically cluster based on real recipient pin codes and cities.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Settlement Methods & Audit */}
      <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#24232C]">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="font-serif text-lg text-[#FFFFFF]">Payment Gateway Settlement Channels</h2>
          </div>
          <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-mono">
            Cashfree PG Integration
          </span>
        </div>

        {analytics && analytics.paymentMethods && analytics.paymentMethods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {analytics.paymentMethods.map((pm, idx) => (
              <div key={idx} className="p-4 bg-[#0A0A0C] border border-[#24232C] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#A1A1AA] block">
                  {pm.method.replace('_', ' ')}
                </span>
                <div className="font-serif text-xl text-[#D4AF37]">
                  ₹{pm.revenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#A1A1AA] flex justify-between pt-1 border-t border-[#24232C]/60">
                  <span>{pm.count} transactions</span>
                  <span className="text-[#FAF9F6]">{pm.share}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#A1A1AA] bg-[#0A0A0C] border border-[#24232C]">
            Standing by for live Cashfree payment settlements (UPI, Cards, Netbanking).
          </div>
        )}
      </div>
    </div>
  );
};
