import React, { useState } from 'react';
import { X, Copy, Check, Download, Mail, Smartphone, Monitor, Code, Eye, ExternalLink } from 'lucide-react';
import { OrderRecord } from '../types';
import { generateOrderConfirmationEmailHtml } from '../utils/orderEmailTemplate';

interface OrderEmailPreviewModalProps {
  order: OrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderEmailPreviewModal: React.FC<OrderEmailPreviewModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !order) return null;

  const htmlContent = generateOrderConfirmationEmailHtml(order);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `elora-order-confirmation-${order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0E0E12] border border-[#24232C] shadow-2xl flex flex-col overflow-hidden text-[#FAF9F6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#24232C] flex flex-wrap items-center justify-between gap-3 bg-[#14141B]">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-[#FFFFFF]">
                  Consignment Confirmation Dispatch
                </h3>
                <span className="text-[10px] uppercase font-sans font-semibold bg-[#0A0A0C] text-[#D4AF37] px-2 py-0.5 border border-[#24232C]">
                  {order.orderNumber}
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] font-sans">
                Official patron dispatch documentation and consignment receipt
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Toggle: Preview vs Code */}
            <div className="flex items-center bg-[#0A0A0C] border border-[#24232C]">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 text-xs font-sans transition-colors flex items-center space-x-1 ${
                  activeTab === 'preview'
                    ? 'bg-[#D4AF37] text-[#0A0A0C] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 text-xs font-sans transition-colors flex items-center space-x-1 ${
                  activeTab === 'code'
                    ? 'bg-[#D4AF37] text-[#0A0A0C] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">HTML Source</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#A1A1AA] hover:text-[#FFFFFF]"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-[#14141B] border-b border-[#24232C] flex items-center justify-between text-xs font-sans text-[#A1A1AA]">
          <div className="flex items-center space-x-2">
            {activeTab === 'preview' && (
              <div className="flex items-center space-x-1 bg-[#0A0A0C] border border-[#24232C]">
                <button
                  type="button"
                  onClick={() => setDeviceView('desktop')}
                  className={`px-2.5 py-1 text-xs transition-colors flex items-center space-x-1 ${
                    deviceView === 'desktop'
                      ? 'bg-[#D4AF37] text-[#0A0A0C] font-semibold'
                      : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('mobile')}
                  className={`px-2.5 py-1 text-xs transition-colors flex items-center space-x-1 ${
                    deviceView === 'mobile'
                      ? 'bg-[#D4AF37] text-[#0A0A0C] font-semibold'
                      : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mobile (380px)</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1 bg-[#0A0A0C] border border-[#24232C] hover:border-[#D4AF37] text-[#FAF9F6] flex items-center space-x-1.5 transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy HTML'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1 bg-[#0A0A0C] border border-[#24232C] hover:border-[#D4AF37] text-[#FAF9F6] flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0A0A0C] flex items-center justify-center">
          {activeTab === 'preview' ? (
            <div
              className={`bg-white shadow-xl transition-all duration-300 overflow-hidden ${
                deviceView === 'mobile' ? 'w-[380px] max-w-full rounded-2xl border border-[#24232C]' : 'w-full max-w-2xl border border-[#24232C]'
              }`}
            >
              <iframe
                title="Elora Parfum Consignment Confirmation"
                srcDoc={htmlContent}
                className="w-full h-[65vh] border-0"
              />
            </div>
          ) : (
            <pre className="w-full h-[65vh] p-4 bg-[#14141B] border border-[#24232C] text-xs font-mono text-[#D4D4D8] overflow-auto whitespace-pre-wrap selection:bg-[#D4AF37] selection:text-[#0A0A0C]">
              {htmlContent}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
