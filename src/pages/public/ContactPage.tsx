import React, { useState } from 'react';
import { db } from '../../lib/database';
import { Inquiry } from '../../lib/types';
import { Mail, Phone, Globe, Send, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface ContactPageProps {
  navigate: (route: string) => void;
  preselectedServiceId?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate, preselectedServiceId }) => {
  const snapshot = db.getSnapshot();
  const services = snapshot.services.filter(s => s.isPublished);

  const budgetOptions = [
    '₱50,000 - ₱100,000 (Small Business / Single Module)',
    '₱100,000 - ₱250,000 (Standard Business System / POS)',
    '₱250,000 - ₱500,000 (Multi-Branch ERP / Custom Cloud App)',
    '₱500,000 - ₱1,000,000 (Enterprise Workflow & Logistics Platform)',
    '₱1,000,000+ (High-Throughput Distributed Architecture)',
    '$3,000 - $8,000 USD (International Project Tier 1)',
    '$8,000 - $20,000 USD (International Project Tier 2)'
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    serviceId: preselectedServiceId || services[0]?.id || '',
    budgetRange: budgetOptions[1],
    requirements: '',
    preferredContact: 'email' as Inquiry['preferredContact']
  });

  const [submittedInquiry, setSubmittedInquiry] = useState<Inquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const srv = services.find(s => s.id === formData.serviceId);
    const serviceName = srv ? srv.name : 'Custom Enterprise System';

    setTimeout(() => {
      const created = db.createInquiry({
        fullName: formData.fullName.trim(),
        businessName: formData.businessName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceId: formData.serviceId,
        serviceName,
        budgetRange: formData.budgetRange,
        requirements: formData.requirements.trim(),
        preferredContact: formData.preferredContact
      });

      setSubmittedInquiry(created);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
          Start Your Project
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Project Inquiry & Customized Quotation Request
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Provide your operational parameters and software requirements below. Our engineering team reviews all incoming inquiries within 24 hours to prepare an itemized technical quotation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          {submittedInquiry ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                  Inquiry Successfully Received
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{submittedInquiry.fullName}</strong>. Your project inquiry has been logged in our secure database and assigned for architectural review.
                </p>
              </div>

              {/* Reference Number Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-md mx-auto text-left space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Unique Reference Code:
                </div>
                <div className="text-xl font-mono font-bold text-blue-700 tracking-wider">
                  {submittedInquiry.referenceNumber}
                </div>
                <div className="text-xs text-slate-600 pt-1 border-t border-slate-200/80">
                  Keep this reference code handy. You can use it to track your project proposal in our Client Portal or live chat.
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate('client-portal')}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm"
                >
                  Create Client Portal Account
                </button>
                <button
                  onClick={() => setSubmittedInquiry(null)}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Ramos"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Business / Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Logistics Corp."
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Business Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. david@apexlogistics.ph"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 09171234567 or +639171234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Service of Interest <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Budget Range Parameter
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {budgetOptions.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Project Description & Operational Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your current bottlenecks, branches, expected number of users, and specific features needed..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Preferred Follow-Up Contact Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['email', 'phone', 'whatsapp', 'meeting'] as const).map((method) => (
                    <label
                      key={method}
                      className={`flex items-center justify-center p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                        formData.preferredContact === method
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredContact"
                        value={method}
                        checked={formData.preferredContact === method}
                        onChange={() => setFormData({ ...formData, preferredContact: method })}
                        className="sr-only"
                      />
                      <span className="capitalize">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Recording Inquiry...' : 'Submit Inquiry & Request Quotation'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected by NUNC Enterprise Privacy & Data Protection Policy</span>
              </div>

            </form>
          )}
        </div>

        {/* Right Info Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
                Direct Contact Information
              </span>
              <h3 className="text-xl font-bold mt-1">
                NUNC Business Solutions
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Reach out directly to our leadership or schedule a discovery appointment with our system architects.
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Email Address</div>
                  <a href="mailto:nuncbusinesssolutions@gmail.com" className="text-slate-300 hover:text-white">
                    nuncbusinesssolutions@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Direct Phone</div>
                  <a href="tel:09161669188" className="text-slate-300 hover:text-white">
                    09161669188
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Official Web Portal</div>
                  <div className="text-slate-300">nuncbusinesssolutions.ph</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-white mb-2">Target Market Coverage</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Local Philippine businesses, nationwide enterprises, SMEs, and international clients with multi-currency billing requirements (PHP & USD).
              </p>
            </div>
          </div>

          {/* Consultation promo box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Need immediate technical discovery?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              If your enterprise needs a live walkthrough of system architectures, book a dedicated online or in-person session on our calendar.
            </p>
            <button
              onClick={() => navigate('consultation')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 pt-1"
            >
              <span>Schedule a Consultation Appointment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
