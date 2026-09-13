import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

export const PolicyPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const path = location.pathname;

  let title = 'Orders & Shipping';
  let icon = Truck;
  let content = null;

  if (path.includes('privacy')) {
    title = 'Privacy Policy';
    icon = ShieldCheck;
    content = (
      <div className="space-y-6 text-xs sm:text-sm text-[#68645E] font-sans leading-relaxed">
        <p>
          At <strong className="text-[#171614]">ELORA PARFUM</strong>, discretion and the safeguarding of patron privacy are fundamental tenets of our maison. This Privacy Statement outlines how personal data is received, preserved, and safeguarded.
        </p>

        <h3 className="font-serif text-xl text-[#171614] pt-4">1. Information We Collect</h3>
        <p>
          When you commission a fragrance or enter our private client directory, we receive essential consignment details: patron name, billing address, shipping destination, encrypted payment tokens, and direct contact details. Complete financial credit card numbers are never retained on our internal servers.
        </p>

        <h3 className="font-serif text-xl text-[#171614] pt-4">2. Utilization of Data</h3>
        <p>
          Your information is utilized strictly to formulate orders, coordinate secure climate-guarded dispatch, and convey consignment updates. We never monetize or distribute client data to external promotional agencies.
        </p>

        <h3 className="font-serif text-xl text-[#171614] pt-4">3. Data Security</h3>
        <p>
          We employ 256-bit TLS encryption across our entire digital infrastructure, adhering to rigorous financial and privacy standards.
        </p>
      </div>
    );
  } else if (path.includes('terms')) {
    title = 'Terms & Conditions';
    icon = FileText;
    content = (
      <div className="space-y-6 text-xs sm:text-sm text-[#68645E] font-sans leading-relaxed">
        <p>
          Welcome to <strong className="text-[#171614]">ELORA PARFUM</strong>. By accessing our atelier portal, acquiring our artisanal extraits, or entering our patron programs, you agree to the following terms.
        </p>

        <h3 className="font-serif text-xl text-[#171614] pt-4">1. Artisanal Formulations</h3>
        <p>
          Every Elora Parfum flacon is formulated at a concentrated 25% fragrance oil ratio using natural botanicals and rare absolutes. Subtle aromatic variances between harvests reflect the authenticity of botanical terroir and do not indicate deviation from formula specifications.
        </p>

        <h3 className="font-serif text-xl text-[#171614] pt-4">2. Intellectual Property</h3>
        <p>
          All flacon architectural silhouettes, visual representations, typography, scent compositions, and nomenclature are the exclusive intellectual property of ELORA PARFUM.
        </p>
      </div>
    );
  } else if (path.includes('refund')) {
    title = 'Cancellation & Refund Protocol';
    icon = RotateCcw;
    content = (
      <div className="space-y-6 text-xs sm:text-sm text-[#68645E] font-sans leading-relaxed">
        <p>
          We strive for perfection in every flacon dispatched from our atelier. Because fine fragrances are intimate formulations, strict hygienic and regulatory protocols govern returns.
        </p>

        <h3 className="font-serif text-xl text-[#171614] pt-4">1. Discovery Vial Seal Guarantee</h3>
        <p>
          Each 100ml flacon is accompanied by a complimentary 2ml discovery vial. Patrons are invited to test the fragrance on skin using this sample. If the scent does not harmonize with your chemistry, the unopened, wax-sealed full presentation box may be returned for a full refund within 14 days of delivery.
        </p>

        <h3 className="font-serif text-xl text-[#171614] pt-4">2. Damaged in Transit</h3>
        <p>
          Should any flacon incur transit damage, please contact our concierge within 48 hours of receipt. A complimentary replacement will be dispatched via priority express courier immediately.
        </p>
      </div>
    );
  } else {
    // shipping
    title = 'Orders & Shipping Protocol';
    icon = Truck;
    content = (
      <div className="space-y-6 text-xs sm:text-sm text-[#68645E] font-sans leading-relaxed">
        <p>
          Each Elora Parfum order is hand-assembled, inspected for structural integrity, and packed in temperature-guarded diplomatic packaging before dispatch.
        </p>

        <h3 className="font-serif text-xl text-[#171614] pt-4">1. Dispatch Timelines</h3>
        <p>
          Orders confirmed prior to 14:00 IST are dispatched the same day from our fulfillment reserve. Pan-India delivery typically completes within 2–4 business days via express air courier.
        </p>

        <h3 className="font-serif text-xl text-[#171614] pt-4">2. Complimentary Courier</h3>
        <p>
          All orders within India receive complimentary express courier transit. Consignments are tracked in real-time with signature verification upon delivery.
        </p>
      </div>
    );
  }

  const Icon = icon;

  return (
    <div id="policy-page" className="bg-[#F5F2EC] text-[#171614] min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Navigation tabs */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 pb-6 border-b border-[#D7D1C7]">
          <Link
            to="/pages/shipping"
            className={`text-xs uppercase tracking-[0.2em] font-sans transition-colors relative py-1 ${
              path.includes('shipping')
                ? 'text-[#171614] font-semibold'
                : 'text-[#68645E] hover:text-[#171614]'
            }`}
          >
            Orders & Shipping
            {path.includes('shipping') && (
              <span className="absolute -bottom-6 left-0 w-full h-[1.5px] bg-[#171614]" />
            )}
          </Link>
          <Link
            to="/pages/refund"
            className={`text-xs uppercase tracking-[0.2em] font-sans transition-colors relative py-1 ${
              path.includes('refund')
                ? 'text-[#171614] font-semibold'
                : 'text-[#68645E] hover:text-[#171614]'
            }`}
          >
            Cancellation & Refund
            {path.includes('refund') && (
              <span className="absolute -bottom-6 left-0 w-full h-[1.5px] bg-[#171614]" />
            )}
          </Link>
          <Link
            to="/pages/privacy"
            className={`text-xs uppercase tracking-[0.2em] font-sans transition-colors relative py-1 ${
              path.includes('privacy')
                ? 'text-[#171614] font-semibold'
                : 'text-[#68645E] hover:text-[#171614]'
            }`}
          >
            Privacy Policy
            {path.includes('privacy') && (
              <span className="absolute -bottom-6 left-0 w-full h-[1.5px] bg-[#171614]" />
            )}
          </Link>
          <Link
            to="/pages/terms"
            className={`text-xs uppercase tracking-[0.2em] font-sans transition-colors relative py-1 ${
              path.includes('terms')
                ? 'text-[#171614] font-semibold'
                : 'text-[#68645E] hover:text-[#171614]'
            }`}
          >
            Terms & Conditions
            {path.includes('terms') && (
              <span className="absolute -bottom-6 left-0 w-full h-[1.5px] bg-[#171614]" />
            )}
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="w-10 h-10 rounded-full border border-[#D7D1C7] flex items-center justify-center mx-auto text-[#171614]">
            <Icon className="w-4 h-4 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171614] tracking-[0.06em] uppercase font-normal">
            {title}
          </h1>
          <div className="w-12 h-[1px] bg-[#A88A5A] mx-auto my-3" />
        </div>

        {/* Content Box */}
        <div className="bg-[#FAF8F5] border border-[#D7D1C7] p-8 sm:p-12 shadow-[0_8px_30px_rgba(23,22,20,0.03)]">
          {content}
        </div>
      </div>
    </div>
  );
};
