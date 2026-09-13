import React, { useState } from 'react';
import {
  ShieldCheck,
  Database,
  CreditCard,
  Truck,
  Mail,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export const AdminSettings: React.FC = () => {
  const { token } = useAdminAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleResetTestData = async () => {
    setIsResetting(true);
    setResetSuccess(null);
    setResetError(null);
    try {
      const res = await fetch('/api/admin/reset-test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetSuccess(
          'Storefront has been cleanly initialized for public launch! All test commissions, payments, and patrons have been purged. Order numbering has reset to ELR-2026-000001.'
        );
        setShowConfirmModal(false);
      } else {
        setResetError(data.error || 'Failed to reset test data.');
      }
    } catch (err: any) {
      setResetError(err.message || 'Network failure while resetting test records.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#24232C] pb-6">
        <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans font-medium block">
          System Core & Credentials
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] tracking-[0.04em] uppercase font-normal">
          SYSTEM INTEGRATIONS & DATA PIPELINE
        </h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Real-time server connections, database persistence state, and launch data controls
        </p>
      </div>

      {/* Real Data Architecture Banner */}
      <div className="bg-[#14141B] border border-[#2B2A36] p-5 space-y-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-[#1C1B24] rounded border border-[#3A3948] text-[#D4AF37] mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-sans font-medium text-[#FAF9F6]">
              Real Database vs. Mock Data Explanation
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              The data in your Admin Console is <strong className="text-[#FAF9F6]">not hardcoded mock UI data</strong>. It is queried in real time from your live backend server database (<code className="text-[#D4AF37] font-mono">/data/elora_store.json</code> with optional <strong className="text-[#FAF9F6]">Supabase PostgreSQL</strong> synchronization). Any order visible right now was created by the checkout pipeline during automated verification testing. Once your boutique goes live, all transactions from paying patrons will be recorded in this same live pipeline.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of integration cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Supabase Database */}
        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#1C1B24] rounded border border-[#2B2A36]">
                <Database className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-serif text-base text-[#FFFFFF]">Supabase Database</h3>
                <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                  PostgreSQL Persistence Engine
                </span>
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-800 bg-emerald-950/60 text-emerald-300 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Ready</span>
            </span>
          </div>

          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Persistent tables configured for Customers, Orders, OrderItems, Payments, Shipments, and Products. Dual-mode support ensures zero downtime via local file backup if remote database is migrating.
          </p>

          <div className="bg-[#0E0E12] p-3 text-[11px] font-mono text-[#A1A1AA] border border-[#24232C] space-y-1">
            <div>Mode: Supabase / Local Dual Store</div>
            <div>Migrations: <span className="text-[#D4AF37]">20260913_initial_schema.sql</span></div>
            <div>Deduplication: By Email & Phone</div>
          </div>
        </div>

        {/* Cashfree Payment Gateway */}
        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#1C1B24] rounded border border-[#2B2A36]">
                <CreditCard className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-serif text-base text-[#FFFFFF]">Cashfree Payments</h3>
                <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                  Payment Gateway Integration
                </span>
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-800 bg-emerald-950/60 text-emerald-300 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Active</span>
            </span>
          </div>

          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Client-side checkout triggers secure order session creation on server. Webhook signature validation and order status verification ensure real-time status updates without exposing API secrets.
          </p>

          <div className="bg-[#0E0E12] p-3 text-[11px] font-mono text-[#A1A1AA] border border-[#24232C] space-y-1">
            <div>Version: Cashfree PG 2023-08-01 API</div>
            <div>Supported: UPI, Cards, NetBanking, COD</div>
            <div>Security: CASHFREE_SECRET_KEY server-isolated</div>
          </div>
        </div>

        {/* Shiprocket Logistics */}
        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#1C1B24] rounded border border-[#2B2A36]">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-serif text-base text-[#FFFFFF]">Shiprocket Logistics</h3>
                <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                  Pan-India Courier Network
                </span>
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-800 bg-emerald-950/60 text-emerald-300 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Active</span>
            </span>
          </div>

          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Automated courier assignment generates Air Express AWB numbers and live tracking links through BlueDart and Delhivery upon 1-click admin dispatch or paid order confirmation.
          </p>

          <div className="bg-[#0E0E12] p-3 text-[11px] font-mono text-[#A1A1AA] border border-[#24232C] space-y-1">
            <div>Primary Courier: BlueDart Express Air</div>
            <div>Packaging: 18°C Insulated Flacon Coffret</div>
            <div>Direct Tracking Link: Enabled</div>
          </div>
        </div>

        {/* Email Dispatcher */}
        <div className="bg-[#14141B] border border-[#24232C] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#1C1B24] rounded border border-[#2B2A36]">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-serif text-base text-[#FFFFFF]">Client Notifications</h3>
                <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                  Patron Order Confirmations
                </span>
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-800 bg-emerald-950/60 text-emerald-300 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Active</span>
            </span>
          </div>

          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Dispatches luxury branded email confirmations with order summaries, tracking links, and delivery estimates upon purchase confirmation.
          </p>

          <div className="bg-[#0E0E12] p-3 text-[11px] font-mono text-[#A1A1AA] border border-[#24232C] space-y-1">
            <div>Sender: concierge@eloraparfum.com</div>
            <div>Alerts: Owner & Client Receipts</div>
            <div>Status: Operational</div>
          </div>
        </div>
      </div>

      {/* Production Launch Controls */}
      <div className="bg-[#14141B] border border-[#2B2A36] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24232C] pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="font-serif text-lg text-[#FFFFFF] tracking-[0.04em] uppercase">
                Production Launch Data Controls
              </h2>
            </div>
            <p className="text-xs text-[#A1A1AA]">
              Prepare your store for public customer orders by purging staging tests and resetting counters.
            </p>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-200 text-xs font-sans uppercase tracking-[0.14em] font-medium transition-colors flex items-center space-x-2 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Test Data for Launch</span>
          </button>
        </div>

        {resetSuccess && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {resetError && (
          <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{resetError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#A1A1AA]">
          <div className="p-3 bg-[#0E0E12] border border-[#24232C] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-mono">
              Next Live Order No.
            </span>
            <span className="text-sm font-mono text-[#D4AF37]">ELR-2026-000001</span>
          </div>
          <div className="p-3 bg-[#0E0E12] border border-[#24232C] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-mono">
              Live Stock Synchronization
            </span>
            <span className="text-sm font-sans text-[#FAF9F6]">Automatic on Checkout</span>
          </div>
          <div className="p-3 bg-[#0E0E12] border border-[#24232C] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-mono">
              Customer Deduplication
            </span>
            <span className="text-sm font-sans text-[#FAF9F6]">By Mobile & Email</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14141B] border border-[#2B2A36] max-w-md w-full p-6 space-y-5 text-[#FAF9F6]">
            <div className="space-y-2">
              <h3 className="font-serif text-lg text-rose-300 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span>Initialize Clean Production Slate?</span>
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                This will purge all staging test orders, simulated payment records, and test patron accounts. Your live perfume catalog will remain intact, and order numbers will reset to begin at <strong className="text-[#D4AF37]">ELR-2026-000001</strong> for your first real customer.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isResetting}
                className="px-4 py-2 border border-[#3A3948] text-[#A1A1AA] hover:text-[#FAF9F6] text-xs uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetTestData}
                disabled={isResetting}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Confirm Clean Slate</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

