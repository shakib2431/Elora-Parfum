import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, RefreshCw, CheckCircle, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { Payment } from '../types/ecommerce';

export const AdminPayments: React.FC = () => {
  const { token } = useAdminAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load settlement logs');
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (err: any) {
      setError(err?.message || 'Error loading payments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token]);

  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24232C] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans font-medium block">
            Payment Gateway Infrastructure
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] tracking-[0.04em] uppercase font-normal">
            CASHFREE SETTLEMENTS
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Real-time Cashfree PG transactions, webhook acknowledgments, and captured settlements
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="self-start sm:self-auto px-3.5 py-2 border border-[#24232C] bg-[#14141B] text-xs text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-[#D4AF37] transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Gateway</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#14141B] border border-[#24232C] p-5">
          <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block mb-1">
            Total Gateway Revenue Captured
          </span>
          <span className="font-serif text-2xl text-[#D4AF37]">
            ₹{totalPaid.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#14141B] border border-[#24232C] p-5">
          <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block mb-1">
            Settled Transactions
          </span>
          <span className="font-serif text-2xl text-[#FFFFFF]">
            {payments.filter((p) => p.status === 'PAID').length}
          </span>
        </div>

        <div className="bg-[#14141B] border border-[#24232C] p-5">
          <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block mb-1">
            Gateway Security Protocol
          </span>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Cashfree PG Webhook Verification Active</span>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#14141B] border border-[#24232C] shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#A1A1AA] flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
            <span>Loading settlement records...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-400 text-xs">{error}</div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-[#2E2D3B] mx-auto" />
            <p className="text-xs text-[#A1A1AA]">No payment settlements recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-[#A1A1AA] bg-[#0E0E12] border-b border-[#24232C]">
                  <th className="py-3.5 px-4 font-normal">Provider / Order ID</th>
                  <th className="py-3.5 px-4 font-normal">Internal Order #</th>
                  <th className="py-3.5 px-4 font-normal">Patron</th>
                  <th className="py-3.5 px-4 font-normal">Amount</th>
                  <th className="py-3.5 px-4 font-normal">Status</th>
                  <th className="py-3.5 px-4 font-normal">Method</th>
                  <th className="py-3.5 px-4 font-normal">Date & Time</th>
                  <th className="py-3.5 px-4 text-right font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1B24]">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#181722] transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-mono text-[#D4AF37] font-medium">{p.provider_order_id}</div>
                      <div className="font-mono text-[10px] text-[#71717A]">
                        {p.provider_payment_id || 'Cashfree Session'}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-[#FFFFFF]">
                      {p.order_number || p.order_id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[#FFFFFF]">{p.customer_name || 'Guest Patron'}</div>
                      <div className="text-[10px] text-[#A1A1AA]">{p.customer_email}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[#FFFFFF] font-medium">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border font-medium ${
                          p.status === 'PAID'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950/60 text-amber-300 border-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#A1A1AA] text-[11px]">
                      {p.payment_method || 'UPI / NetBanking'}
                    </td>
                    <td className="py-4 px-4 text-[#71717A] text-[11px]">
                      {new Date(p.created_at).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {p.order_id && (
                        <Link
                          to={`/admin/orders/${p.order_id}`}
                          className="text-[11px] text-[#D4AF37] hover:underline"
                        >
                          View Order →
                        </Link>
                      )}
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
