import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, RefreshCw, Eye, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { Customer } from '../types/ecommerce';

export const AdminCustomers: React.FC = () => {
  const { token } = useAdminAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams();
      if (search.trim()) q.set('search', search.trim());

      const res = await fetch(`/api/admin/customers?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load patron records');
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err: any) {
      setError(err?.message || 'Error loading patrons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24232C] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans font-medium block">
            Clientele Archive
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] tracking-[0.04em] uppercase font-normal">
            PATRONS (CUSTOMERS)
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Captured automatically upon guest checkout with deduplication by email & phone
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="self-start sm:self-auto px-3.5 py-2 border border-[#24232C] bg-[#14141B] text-xs text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-[#D4AF37] transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#14141B] border border-[#24232C] p-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by patron name, email address, or phone number..."
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

      {/* Customers Table */}
      <div className="bg-[#14141B] border border-[#24232C] shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#A1A1AA] flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
            <span>Loading patron profiles...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-400 text-xs">{error}</div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-8 h-8 text-[#2E2D3B] mx-auto" />
            <p className="text-xs text-[#A1A1AA]">No patrons captured yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-[#A1A1AA] bg-[#0E0E12] border-b border-[#24232C]">
                  <th className="py-3.5 px-4 font-normal">Patron</th>
                  <th className="py-3.5 px-4 font-normal">Contact Information</th>
                  <th className="py-3.5 px-4 font-normal">Total Orders</th>
                  <th className="py-3.5 px-4 font-normal">Lifetime Spend (LTV)</th>
                  <th className="py-3.5 px-4 font-normal">Last Commission Date</th>
                  <th className="py-3.5 px-4 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1B24]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#181722] transition-colors">
                    <td className="py-4 px-4 font-serif text-[#FFFFFF] font-medium text-sm">
                      {c.full_name}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs text-[#E4E4E7]">{c.email}</div>
                      <div className="text-[11px] font-mono text-[#D4AF37]">{c.phone}</div>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-[#FFFFFF]">
                      {c.total_orders} {c.total_orders === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="py-4 px-4 font-mono text-[#D4AF37] font-semibold">
                      ₹{c.total_spent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-[#A1A1AA] text-[11px]">
                      {c.last_order_at
                        ? new Date(c.last_order_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Pending checkout'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/admin/customers/${c.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#1C1B24] border border-[#2B2A36] text-[#D4AF37] hover:border-[#D4AF37] transition-colors rounded text-[11px]"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Profile</span>
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
