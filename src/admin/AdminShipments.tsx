import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, RefreshCw, ExternalLink, Package, Clock, CheckCircle } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { Shipment } from '../types/ecommerce';

export const AdminShipments: React.FC = () => {
  const { token } = useAdminAuth();
  const [shipments, setShipments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShipments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/shipments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load logistics consignments');
      const data = await res.json();
      setShipments(data.shipments || []);
    } catch (err: any) {
      setError(err?.message || 'Error loading shipments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [token]);

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24232C] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans font-medium block">
            Automated Fulfillment Network
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] tracking-[0.04em] uppercase font-normal">
            SHIPROCKET CONSIGNMENTS
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Automated courier generation, AWB dispatch manifests, and live carrier tracking
          </p>
        </div>

        <button
          onClick={fetchShipments}
          className="self-start sm:self-auto px-3.5 py-2 border border-[#24232C] bg-[#14141B] text-xs text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-[#D4AF37] transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Logistics</span>
        </button>
      </div>

      {/* Logistics Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#14141B] border border-[#24232C] p-5">
          <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block mb-1">
            Total Manifested Shipments
          </span>
          <span className="font-serif text-2xl text-[#FFFFFF]">{shipments.length}</span>
        </div>

        <div className="bg-[#14141B] border border-[#24232C] p-5">
          <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block mb-1">
            Express Air Courier Partners
          </span>
          <span className="text-xs text-[#D4AF37] font-medium block mt-1">
            BlueDart Express Air · Delhivery Luxury
          </span>
        </div>

        <div className="bg-[#14141B] border border-[#24232C] p-5">
          <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block mb-1">
            Cold-Chain Integrity
          </span>
          <span className="text-xs text-emerald-400 font-medium block mt-1">
            Insulated 18°C Packaging Active
          </span>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-[#14141B] border border-[#24232C] shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#A1A1AA] flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
            <span>Loading consignments...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-400 text-xs">{error}</div>
        ) : shipments.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Truck className="w-8 h-8 text-[#2E2D3B] mx-auto" />
            <p className="text-xs text-[#A1A1AA]">No Shiprocket consignments created yet.</p>
            <p className="text-[11px] text-[#71717A]">
              Create shipments directly from the individual order detail screen.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-[#A1A1AA] bg-[#0E0E12] border-b border-[#24232C]">
                  <th className="py-3.5 px-4 font-normal">AWB Number</th>
                  <th className="py-3.5 px-4 font-normal">Order #</th>
                  <th className="py-3.5 px-4 font-normal">Patron & Destination</th>
                  <th className="py-3.5 px-4 font-normal">Courier Partner</th>
                  <th className="py-3.5 px-4 font-normal">Status</th>
                  <th className="py-3.5 px-4 font-normal">Est. Delivery</th>
                  <th className="py-3.5 px-4 text-right font-normal">Direct Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1B24]">
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-[#181722] transition-colors">
                    <td className="py-4 px-4 font-mono font-medium text-[#D4AF37]">
                      {s.awb_code}
                    </td>
                    <td className="py-4 px-4 font-mono text-[#FFFFFF]">
                      <Link
                        to={`/admin/orders/${s.order_id}`}
                        className="hover:text-[#D4AF37] underline"
                      >
                        {s.order_number || s.order_id}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[#FFFFFF]">{s.customer_name || 'Guest Patron'}</div>
                      <div className="text-[10px] text-[#A1A1AA]">
                        {s.shipping_city}, {s.shipping_state}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[#FFFFFF] font-medium">{s.courier_name}</div>
                      <div className="text-[10px] text-[#71717A]">Air Express Cargo</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-[#3D3A4B] bg-[#1A1924] text-amber-300 font-medium">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#A1A1AA] text-[11px]">
                      {s.estimated_delivery_date
                        ? new Date(s.estimated_delivery_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : '2–3 Days'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {s.tracking_url && (
                        <a
                          href={s.tracking_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#1C1B24] border border-[#2B2A36] text-[#D4AF37] hover:border-[#D4AF37] transition-colors rounded text-[11px]"
                        >
                          <span>Track</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
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
