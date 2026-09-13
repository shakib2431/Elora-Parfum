import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  CreditCard,
  Truck,
  Sparkles,
  Boxes,
  TrendingUp,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Search,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading, logout, user } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { label: 'Atelier Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Commissions (Orders)', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Patrons (Customers)', path: '/admin/customers', icon: Users },
    { label: 'Cashfree Settlements', path: '/admin/payments', icon: CreditCard },
    { label: 'Consignments (Shipments)', path: '/admin/shipments', icon: Truck },
    { label: 'Haute Parfums', path: '/admin/products', icon: Sparkles },
    { label: 'Reserve Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'House Analytics', path: '/admin/analytics', icon: TrendingUp },
    { label: 'System Integrations', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#FAF9F6] flex flex-col md:flex-row">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0E0E12] border-r border-[#24232C] shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {/* Brand header */}
        <div className="p-6 border-b border-[#24232C]">
          <Link to="/admin" className="block space-y-1">
            <span className="font-serif text-lg tracking-[0.16em] uppercase text-[#FFFFFF] block font-light">
              ELORA PARFUM
            </span>
            <span className="text-[9px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans font-medium block">
              Atelier Command Console
            </span>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs font-sans tracking-wide transition-colors ${
                  isActive
                    ? 'bg-[#181720] text-[#D4AF37] border-r-2 border-[#D4AF37] font-medium'
                    : 'text-[#A1A1AA] hover:bg-[#14141B] hover:text-[#FFFFFF]'
                }`}
              >
                <Icon className={`w-4 h-4 stroke-[1.5] ${isActive ? 'text-[#D4AF37]' : 'text-[#71717A]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-[#24232C] bg-[#0A0A0C] space-y-3">
          <div className="flex items-center justify-between text-[11px] text-[#A1A1AA]">
            <span className="truncate max-w-[140px]">{user?.email || 'owner@eloraparfum.com'}</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded">
              OWNER
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1C1B24]">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#71717A] hover:text-[#D4AF37] flex items-center space-x-1"
            >
              <span>View Boutique</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-[11px] text-[#A1A1AA] hover:text-rose-400 flex items-center space-x-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between px-4 py-3.5 bg-[#0E0E12] border-b border-[#24232C] sticky top-0 z-40">
        <div>
          <span className="font-serif text-base tracking-[0.14em] uppercase text-[#FFFFFF]">
            ELORA PARFUM
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] block">
            Atelier Console
          </span>
        </div>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 text-[#A1A1AA] hover:text-[#FFFFFF]"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)}>
          <div
            className="w-72 bg-[#0E0E12] h-full flex flex-col p-6 border-r border-[#24232C]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-6 border-b border-[#24232C]">
              <div>
                <span className="font-serif text-lg text-[#FFFFFF]">ELORA ATELIER</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] block">Admin</span>
              </div>
              <button onClick={() => setIsMobileNavOpen(false)} className="text-[#A1A1AA]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 text-sm rounded ${
                      isActive ? 'bg-[#181720] text-[#D4AF37]' : 'text-[#A1A1AA]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#24232C] space-y-3">
              <Link to="/" className="text-xs text-[#D4AF37] block">
                ← Return to Boutique
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 bg-[#0A0A0C] overflow-y-auto pb-20">
        <Outlet />
      </main>
    </div>
  );
};
