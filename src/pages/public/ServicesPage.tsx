import React, { useState } from 'react';
import { db } from '../../lib/database';
import { ServiceItem } from '../../lib/types';
import { CheckCircle2, ArrowRight, HelpCircle, Sparkles, Filter } from 'lucide-react';

interface ServicesPageProps {
  navigate: (route: string, subParam?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const snapshot = db.getSnapshot();
  const services = snapshot.services.filter(s => s.isPublished);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
          Tailored Engineering Services
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Comprehensive Software & Business Management Systems
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          We engineer robust digital architectures tailored to your operational workflows. We do not display generic off-the-shelf prices because every enterprise demands customized scale, integration endpoints, and database models.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-12">
        {services.map((srv, idx) => (
          <div
            key={srv.id}
            id={srv.slug}
            className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      SERVICE #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Inquiry-Based Quotation
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    {srv.name}
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {srv.detailedInfo}
                  </p>
                </div>

                {/* Key Benefits */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                    Key Business Benefits
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {srv.benefits.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Architecture Features */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                    Included Architecture & Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {srv.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service-Specific FAQs */}
                {srv.serviceFaqs && srv.serviceFaqs.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Frequently Asked About This Service</span>
                    </div>
                    {srv.serviceFaqs.map((faq, fIdx) => (
                      <div key={fIdx} className="text-xs space-y-1">
                        <p className="font-semibold text-slate-800">{faq.question}</p>
                        <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Right Column: Visual Preview & CTA Card */}
              <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                  <img
                    src={srv.imageUrl}
                    alt={srv.name}
                    className="w-full h-48 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Pricing Structure
                    </span>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">
                      Tailored Quotation
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Pricing is based on operational complexity, number of branches/users, and required integrations.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate('contact', srv.id)}
                      className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Request Quotation for This Service</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
