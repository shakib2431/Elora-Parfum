import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Zap,
  CheckCircle,
  Truck,
  CreditCard,
  MapPin,
  ArrowRight,
  UserCheck,
  Lock,
  FileText,
} from 'lucide-react';
import { useOneClickBuy } from '../context/OneClickBuyContext';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';
import { saveOrder } from '../data/orderData';
import { OrderRecord } from '../types';
import { OrderEmailPreviewModal } from './OrderEmailPreviewModal';
import { usePriveLoyalty } from '../context/PriveLoyaltyContext';

export const OneClickBuyModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isOneClickModalOpen,
    activeItem,
    closeOneClickBuy,
    isRegisteredUser,
    clientProfile,
    toggleRegisteredStatus,
    updateClientProfile,
  } = useOneClickBuy();
  const { addPoints } = usePriveLoyalty();

  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(clientProfile.paymentMethod);
  const [customAddress, setCustomAddress] = useState(clientProfile.shippingAddress);
  const [orderNumber] = useState(() => `ELO-${Math.floor(10000 + Math.random() * 90000)}`);
  const [createdOrder, setCreatedOrder] = useState<OrderRecord | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  if (!isOneClickModalOpen || !activeItem) return null;

  const { product, quantity, partnerProduct, isDuo, duoTitle } = activeItem;

  // Calculate pricing
  const basePrice = product.price * quantity;
  const partnerPrice = partnerProduct ? partnerProduct.price * quantity : 0;
  const rawTotal = basePrice + partnerPrice;
  const discountAmount = isDuo ? Math.round(rawTotal * 0.15) : 0;
  const finalPrice = rawTotal - discountAmount;

  const handleAuthorizePurchase = () => {
    setIsProcessing(true);

    const items: import('../types').OrderItemRecord[] = [
      {
        productId: product.id,
        name: isDuo ? duoTitle || product.name : product.name,
        subtitle: product.subtitle,
        size: product.size,
        quantity,
        price: product.price,
        slug: product.slug,
        category: product.category,
      },
    ];

    if (partnerProduct) {
      items.push({
        productId: partnerProduct.id,
        name: partnerProduct.name,
        subtitle: partnerProduct.subtitle,
        size: partnerProduct.size,
        quantity,
        price: partnerProduct.price,
        slug: partnerProduct.slug,
        category: partnerProduct.category,
      });
    }

    const newOrder: OrderRecord = {
      orderNumber,
      placedAt: `${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      clientName: clientProfile.name,
      clientEmail: clientProfile.email,
      clientPhone: clientProfile.phone,
      shippingAddress: customAddress,
      city: clientProfile.city,
      state: clientProfile.state,
      postalCode: clientProfile.postalCode,
      items,
      subtotal: rawTotal,
      discount: discountAmount,
      giftWrap: true,
      giftWrapFee: 0,
      total: finalPrice,
      paymentMethod: selectedPayment === 'upi_direct' ? 'UPI Instant Pay' : 'Cash on Delivery (White Glove)',
      status: 'confirmed',
      statusLabel: 'VIP Priority Confirmed',
      estimatedDelivery: 'Tomorrow by 14:00 IST (Insulated Courier)',
      carrier: 'Elora Express Logistics',
      trackingNumber: `EEL-${Math.floor(10000 + Math.random() * 90000)}-EXP`,
      temperatureControlled: true,
      tamperSealNumber: `SEAL-GRS-${Math.floor(1000 + Math.random() * 9000)}-GOLD`,
      isVip: true,
      checkpoints: [
        {
          title: 'Direct Allocation Authorized',
          location: 'Elora Concierge Desk',
          timestamp: 'Just now',
          description: 'Allocation queued directly from reserve.',
          completed: true,
          current: true,
        },
        {
          title: 'Artisanal Compounding & Inspection',
          location: 'Haute Parfumerie Atelier, Grasse',
          timestamp: 'Estimated +2 Hours',
          description: '25% concentrated oil formulation hand-inspected under cleanroom conditions.',
          completed: false,
        },
        {
          title: 'Insulated Courier Handover',
          location: `${clientProfile.city}, ${clientProfile.state}`,
          timestamp: 'Tomorrow',
          description: 'Direct doorstep delivery with signature verification.',
          completed: false,
        },
      ],
    };

    saveOrder(newOrder);
    setCreatedOrder(newOrder);

    const earnedPts = Math.max(1, Math.floor(finalPrice / 10));
    addPoints(earnedPts, `VIP Allocation: Order #${orderNumber}`);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 1000);
  };

  const handleResetAndClose = () => {
    setStep('checkout');
    setIsProcessing(false);
    setIsEditingAddress(false);
    closeOneClickBuy();
  };

  const handleTrackShipment = () => {
    handleResetAndClose();
    navigate(`/order-status?order=${orderNumber}`);
  };

  return (
    <div
      id="one-click-buy-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleResetAndClose}
    >
      <div
        id="one-click-buy-modal"
        className="bg-[#FAF8F5] max-w-xl w-full border border-[#D7D1C7] shadow-2xl relative text-[#171614] my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#D7D1C7]">
          <div className="flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-[#A88A5A]" />
            <span className="font-serif text-sm tracking-[0.2em] uppercase font-normal text-[#171614]">
              Direct Express Allocation
            </span>
          </div>

          <button
            id="close-one-click-modal-btn"
            onClick={handleResetAndClose}
            className="p-1.5 text-[#68645E] hover:text-[#171614] transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {step === 'checkout' ? (
          <div className="p-8 space-y-6">
            {/* Flacon Overview */}
            <div className="flex items-center space-x-4 p-4 bg-[#F5F2EC] border border-[#D7D1C7]">
              <div className="w-16 h-20 bg-[#FAF8F5] border border-[#D7D1C7] p-1 flex-shrink-0 flex items-center justify-center">
                <EloraBottleVisualizer product={product} size="sm" showPedestal={false} />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[9.5px] uppercase tracking-[0.25em] text-[#A88A5A] font-sans font-semibold block">
                  25% Extrait de Parfum
                </span>
                <h3 className="font-serif text-lg text-[#171614] truncate">
                  {isDuo ? duoTitle : product.name}
                </h3>
                <p className="text-xs text-[#68645E] font-sans truncate">
                  {partnerProduct ? `${product.name} + ${partnerProduct.name}` : product.subtitle}
                </p>
                <div className="mt-2 flex items-center space-x-3">
                  <span className="font-sans text-sm font-semibold text-[#171614]">
                    ₹{finalPrice.toLocaleString('en-IN')}
                  </span>
                  {discountAmount > 0 && (
                    <span className="text-xs font-sans text-[#A88A5A]">
                      Privilege Savings ₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Patron Profile Info */}
            <div className="p-4 bg-[#F5F2EC] border border-[#D7D1C7] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-[#A88A5A]" />
                  <span className="text-xs font-serif uppercase tracking-wider text-[#171614]">
                    Patron Credentials
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleRegisteredStatus}
                  className="text-[10px] uppercase font-sans tracking-wider text-[#68645E] hover:text-[#171614] underline"
                >
                  {isRegisteredUser ? 'Switch Patron' : 'Use Saved VIP'}
                </button>
              </div>

              <div className="text-xs font-sans text-[#68645E] space-y-1">
                <p className="text-[#171614] font-medium">{clientProfile.name}</p>
                <p>{clientProfile.email} · {clientProfile.phone}</p>
              </div>
            </div>

            {/* Destination Address */}
            <div className="p-4 bg-[#F5F2EC] border border-[#D7D1C7] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#A88A5A]" />
                  <span className="text-xs font-serif uppercase tracking-wider text-[#171614]">
                    Dispatch Destination
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-[10px] uppercase font-sans tracking-wider text-[#171614] underline"
                >
                  {isEditingAddress ? 'Save' : 'Modify'}
                </button>
              </div>

              {isEditingAddress ? (
                <textarea
                  rows={2}
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D7D1C7] text-xs text-[#171614] outline-none font-sans"
                />
              ) : (
                <p className="text-xs text-[#68645E] font-sans">
                  {customAddress}, {clientProfile.city}, {clientProfile.state} - {clientProfile.postalCode}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#68645E] block font-sans">
                Payment Settlement
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPayment('upi_direct')}
                  className={`p-3 border text-left text-xs font-sans transition-all ${
                    selectedPayment === 'upi_direct'
                      ? 'bg-[#F5F2EC] border-[#171614] text-[#171614] font-medium'
                      : 'bg-[#FAF8F5] border-[#D7D1C7] text-[#68645E]'
                  }`}
                >
                  <span className="block font-semibold">UPI Express</span>
                  <span className="text-[10px]">Instant allocation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayment('cod')}
                  className={`p-3 border text-left text-xs font-sans transition-all ${
                    selectedPayment === 'cod'
                      ? 'bg-[#F5F2EC] border-[#171614] text-[#171614] font-medium'
                      : 'bg-[#FAF8F5] border-[#D7D1C7] text-[#68645E]'
                  }`}
                >
                  <span className="block font-semibold">Cash on Delivery</span>
                  <span className="text-[10px]">White glove handover</span>
                </button>
              </div>
            </div>

            {/* Authorize Button */}
            <button
              id="confirm-one-click-buy-btn"
              type="button"
              disabled={isProcessing}
              onClick={handleAuthorizePurchase}
              className="w-full bg-[#171614] text-[#F5F2EC] py-4 text-xs uppercase tracking-[0.24em] font-sans font-medium hover:bg-[#2D2B27] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Lock className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>
                {isProcessing
                  ? 'Authorizing Reserve Allocation...'
                  : `Authorize Commission · ₹${finalPrice.toLocaleString('en-IN')}`}
              </span>
            </button>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-full border border-[#D7D1C7] flex items-center justify-center mx-auto text-[#171614]">
              <CheckCircle className="w-7 h-7 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88A5A] font-sans font-semibold block">
                Express Allocation Confirmed
              </span>
              <h2 className="font-serif text-fluid-h2 text-[#171614]">
                ORDER #{orderNumber}
              </h2>
              <div className="w-12 h-[1px] bg-[#A88A5A] mx-auto my-3" />
              <p className="text-xs text-[#68645E] max-w-md mx-auto leading-relaxed font-sans">
                Your priority flacon has been allocated directly from Genesis Batch 001. Enclosed in temperature-guarded packaging with serialized authenticity certificate.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={handleTrackShipment}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#171614] text-[#F5F2EC] text-xs uppercase tracking-[0.2em] font-sans font-medium hover:bg-[#2D2B27] transition-colors flex items-center justify-center space-x-2"
              >
                <Truck className="w-4 h-4 stroke-[1.5]" />
                <span>Track Consignment</span>
              </button>

              {createdOrder && (
                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 border border-[#D7D1C7] text-[#171614] text-xs uppercase tracking-[0.2em] font-sans hover:border-[#171614] transition-colors flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4 stroke-[1.5]" />
                  <span>View Consignment Invoice</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {createdOrder && (
        <OrderEmailPreviewModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          order={createdOrder}
        />
      )}
    </div>
  );
};
