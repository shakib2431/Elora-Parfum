import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Clock, Check, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    topic: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="bg-[#F5F2EC] text-[#171614] min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.32em] text-[#68645E] font-sans font-medium block">
            Olfactory Concierge
          </span>
          <h1 className="font-serif text-fluid-h1 text-[#171614] tracking-[0.06em] uppercase font-normal">
            ATELIER CONCIERGE
          </h1>
          <div className="w-12 h-[1px] bg-[#A88A5A] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#68645E] font-sans font-light leading-relaxed">
            Our client advisors are at your service to assist with scent consultations, bespoke gifting, private commissions, and consignment tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8 bg-[#FAF8F5] border border-[#D7D1C7] p-8 shadow-[0_8px_30px_rgba(23,22,20,0.03)]">
            <h2 className="font-serif text-2xl text-[#171614] tracking-[0.04em] uppercase font-normal border-b border-[#D7D1C7] pb-3">
              Direct Inquiries
            </h2>

            <div className="space-y-6 text-xs text-[#68645E] font-sans">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A88A5A] block">
                  Concierge Desk
                </span>
                <p className="text-sm font-serif text-[#171614]">concierge@eloraparfum.com</p>
                <p className="text-[11px] text-[#68645E]">Responses dispatched within 4 atelier hours.</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#D7D1C7]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A88A5A] block">
                  Boutique Salons
                </span>
                <p className="text-sm font-serif text-[#171614]">Paris: 12 Place Vendôme, 75001</p>
                <p className="text-sm font-serif text-[#171614]">Mumbai: Apollo Bunder, Colaba</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#D7D1C7]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A88A5A] block">
                  Atelier Hours
                </span>
                <p className="text-[#171614]">Monday – Saturday: 10:00 – 19:00 IST</p>
                <p className="text-[#68645E]">Private evening appointments upon prior reservation.</p>
              </div>

              {/* Instant Concierge Query Access */}
              <div className="pt-4 border-t border-[#D7D1C7] space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A88A5A] block font-medium">
                  Instant Digital Concierge (24/7)
                </span>
                <p className="text-xs text-[#68645E]">
                  Seek immediate assistance regarding notes, order consignments, or 30-day discovery trials.
                </p>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-concierge-chat'))}
                  className="w-full mt-2 px-4 py-3 bg-[#171614] hover:bg-[#2A2825] text-[#FAF8F5] text-[11px] uppercase tracking-[0.2em] font-sans transition-colors flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Launch Instant Concierge</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#D7D1C7] p-8 shadow-[0_8px_30px_rgba(23,22,20,0.03)]">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-10 h-10 rounded-full border border-[#171614] flex items-center justify-center mx-auto text-[#171614]">
                  <Check className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-2xl tracking-wide uppercase text-[#171614]">
                  Message Dispatched
                </h3>
                <p className="text-xs text-[#68645E] font-sans max-w-md mx-auto">
                  Thank you for reaching out to the House of Elora. A dedicated fragrance advisor has received your correspondence and will reply promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block font-sans">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F2EC] border border-[#D7D1C7] text-xs text-[#171614] outline-none focus:border-[#171614] font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block font-sans">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F2EC] border border-[#D7D1C7] text-xs text-[#171614] outline-none focus:border-[#171614] font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block font-sans">
                      Nature of Inquiry
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F2EC] border border-[#D7D1C7] text-xs text-[#171614] outline-none focus:border-[#171614] font-sans"
                    >
                      <option value="general">Fragrance Recommendation</option>
                      <option value="order">Order Tracking & Consignment</option>
                      <option value="gifting">Bespoke Gifting & Corporate</option>
                      <option value="press">Press & Editorial</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block font-sans">
                      Order Reference (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ELORA-9842"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F2EC] border border-[#D7D1C7] text-xs text-[#171614] outline-none focus:border-[#171614] font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block font-sans">
                    Your Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 bg-[#F5F2EC] border border-[#D7D1C7] text-xs text-[#171614] outline-none focus:border-[#171614] font-sans leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#171614] text-[#F5F2EC] hover:bg-[#2D2B27] text-xs uppercase tracking-[0.24em] font-sans transition-all duration-300"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
