import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OneClickBuyProvider } from './context/OneClickBuyContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FavoritesOverlay } from './components/FavoritesOverlay';
import { OneClickBuyModal } from './components/OneClickBuyModal';
import { SearchModal } from './components/SearchModal';
import { MobileMenu } from './components/MobileMenu';
import { EarlyLaunchModal } from './components/EarlyLaunchModal';
import { useCart } from './context/CartContext';
import { CheckCircle2 } from 'lucide-react';

import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionPage } from './pages/CollectionPage';
import { BundleBuilderPage } from './pages/BundleBuilderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPage } from './pages/PolicyPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { OlfactoryJournalPage } from './pages/OlfactoryJournalPage';
import { PriveLoyaltyProvider } from './context/PriveLoyaltyContext';
import { AtelierInvitationModal } from './components/AtelierInvitationModal';
import { PriveRedemptionModal } from './components/PriveRedemptionModal';
import { CustomerQueryConcierge } from './components/CustomerQueryConcierge';
import { AtelierSecretAccess } from './components/AtelierSecretAccess';

// Admin Suite Imports
import { AdminAuthProvider, AdminRouteGuard, AdminGuestGuard } from './admin/AdminAuthContext';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminOrders } from './admin/AdminOrders';
import { AdminOrderDetail } from './admin/AdminOrderDetail';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminCustomerDetail } from './admin/AdminCustomerDetail';
import { AdminPayments } from './admin/AdminPayments';
import { AdminShipments } from './admin/AdminShipments';
import { AdminProducts } from './admin/AdminProducts';
import { AdminInventory } from './admin/AdminInventory';
import { AdminAnalytics } from './admin/AdminAnalytics';
import { AdminSettings } from './admin/AdminSettings';

// Helper component to restore scroll position on route transitions
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AdminRoutes: React.FC = () => {
  return (
    <AdminAuthProvider>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/login"
          element={
            <AdminGuestGuard>
              <AdminLogin />
            </AdminGuestGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="customers/:id" element={<AdminCustomerDetail />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="shipments" element={<AdminShipments />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
};

const StorefrontRoutes: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEarlyLaunchOpen, setIsEarlyLaunchOpen] = useState(false);
  const { notification } = useCart();
  const location = useLocation();

  // Auto-open Genesis Batch 001 Early Launch popup once website opens
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('elora_early_launch_dismissed_v1');
      if (dismissed) {
        const timestamp = parseInt(dismissed, 10);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    const timer = setTimeout(() => {
      setIsEarlyLaunchOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-deep-espresso text-warm-ivory font-sans selection:bg-antique-gold/30 selection:text-warm-ivory">
      <ScrollToTop />

      {/* Persistent Announcements */}
      <AnnouncementBar onOpenEarlyLaunch={() => setIsEarlyLaunchOpen(true)} />

      {/* Sticky Luxury Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main Routed Content with Framer Motion transitions */}
      <main className="flex-grow overflow-hidden flex flex-col relative bg-deep-espresso">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex-grow flex flex-col"
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/collections/:collection" element={<CollectionPage />} />
              <Route path="/collections" element={<CollectionPage />} />
              <Route path="/bundle" element={<BundleBuilderPage />} />
              <Route path="/pages/about" element={<AboutPage />} />
              <Route path="/pages/contact" element={<ContactPage />} />
              <Route path="/order-status" element={<OrderStatusPage />} />
              <Route path="/track-order" element={<OrderStatusPage />} />
              <Route path="/track" element={<OrderStatusPage />} />
              <Route path="/journal" element={<OlfactoryJournalPage />} />
              <Route path="/pages/privacy" element={<PolicyPage />} />
              <Route path="/pages/terms" element={<PolicyPage />} />
              <Route path="/pages/shipping" element={<PolicyPage />} />
              <Route path="/pages/refund" element={<PolicyPage />} />
              {/* Fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Editorial Luxury Footer */}
      <Footer />

      {/* Slide-out Cart Drawer with Live State */}
      <CartDrawer />

      {/* Private Wardrobe / Wishlist Overlay */}
      <FavoritesOverlay />

      {/* One-Click Buy Express Checkout Simulation Modal */}
      <OneClickBuyModal />

      {/* Search Overlay Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Genesis Batch 001 Early Launch FOMO Modal */}
      <EarlyLaunchModal
        isOpen={isEarlyLaunchOpen}
        onClose={() => setIsEarlyLaunchOpen(false)}
        onOpen={() => setIsEarlyLaunchOpen(true)}
      />

      {/* 45-Second Delayed Invitation to the Atelier Newsletter Modal */}
      <AtelierInvitationModal />

      {/* Elora Privé Loyalty Rewards Redemption Modal */}
      <PriveRedemptionModal />

      {/* Multi-turn Atelier Concierge & Customer Query Chatbot powered by Gemini */}
      <CustomerQueryConcierge />

      {/* Secret Atelier Owner Quick Access & Keyboard Shortcut (Ctrl+Shift+A) */}
      <AtelierSecretAccess />

      {/* Luxury Notification Toast */}
      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[#171614] text-[#F5F2EC] border border-[#D7D1C7]/30 rounded-none px-6 py-3 shadow-2xl flex items-center gap-3 text-xs font-sans tracking-[0.1em] uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#A88A5A] shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return <AdminRoutes />;
  }

  return <StorefrontRoutes />;
};

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <OneClickBuyProvider>
            <PriveLoyaltyProvider>
              <AppContent />
            </PriveLoyaltyProvider>
          </OneClickBuyProvider>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
