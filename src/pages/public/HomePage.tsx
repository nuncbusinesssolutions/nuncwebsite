import React from 'react';
import { db } from '../../lib/database';
import {
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  BarChart3,
  CheckCircle2,
  Calendar,
  Sparkles,
  Building2,
  ArrowUpRight
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string, subParam?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const snapshot = db.getSnapshot();
  const cms = snapshot.cms;
  const services = snapshot.services.filter(s => s.isPublished).slice(0, 6);
  const portfolio = snapshot.portfolio.filter(p => p.isPublished).slice(0, 3);
  const faqs = snapshot.faqs.filter(f => f.isPublished).slice(0, 4);

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Technology & Software Solutions</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                {cms.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {cms.heroSubtext}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('contact')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>{cms.ctaSecondaryText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('services')}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {cms.ctaPrimaryText}
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <div className="font-bold text-slate-900 text-base">Inquiry-Based</div>
                  <div className="text-[11px] text-slate-500">Customized Quotations</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">30/40/30</div>
                  <div className="text-[11px] text-slate-500">Milestone Payments</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">Full Ownership</div>
                  <div className="text-[11px] text-slate-500">Code & Database Rights</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero High-Fidelity Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
                <img
                  src="/src/assets/images/hero_corporate_tech_1794241101462.jpg"
                  alt="NUNC Business Solutions Enterprise Headquarters"
                  className="w-full h-[400px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-300">
                      Manila Technology Operations
                    </span>
                    <p className="text-sm font-medium mt-1">
                      Digital Transformation Architecture & Software Engineering
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Company Introduction */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
              Who We Are
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Technology and Business Solutions Combined
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              NUNC Business Solutions is a dedicated technology partner helping Philippine and international enterprises transition from fragmented spreadsheets and manual bottlenecks to unified, high-reliability business systems.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Custom Software Engineering
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bespoke ERPs, cloud databases, and web applications built specifically for your exact business logic and approval matrices.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Intelligent Automation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Streamline document reconciliations, transactional notifications, e-wallet payment verifications, and cross-platform integrations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                IT Consulting & Innovation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strategic technology roadmap discovery, infrastructure audits, and secure database architecture with Row Level Security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
              Our Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              End-to-End Business Solutions
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              We engineer custom solutions across 10 specialized domains. Every project receives an itemized, inquiry-based quotation tailored to your operational scale.
            </p>
          </div>
          <button
            onClick={() => navigate('services')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>View All 10 Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div>
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  0{idx + 1}.
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2 group-hover:text-blue-700 transition-colors">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {srv.shortDescription}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                  {srv.benefits.slice(0, 2).map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">
                  Inquiry-Based Pricing
                </span>
                <button
                  onClick={() => navigate('contact', srv.id)}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Demonstration Projects Showcase */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
                Proven Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Selected Demonstration Projects
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Showcasing our technical architectures without exposing proprietary client records or confidential business processes.
              </p>
            </div>
            <button
              onClick={() => navigate('portfolio')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>Explore All Concepts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/80 rounded-xl border border-slate-700 overflow-hidden flex flex-col justify-between group hover:border-slate-500 transition-all"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border border-slate-700">
                      {item.demoLabel}
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-xs text-blue-400 font-medium">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Development Approach & Why Choose NUNC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
              Our Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Disciplined, Milestone-Driven Engineering
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We reject black-box development. From day one, you have visibility into your project timeline, database schema models, staging deployments, and milestone approvals.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Discovery & Schema Architecture</h4>
                  <p className="text-xs text-slate-600">Deep review of your operational workflows and database relationships before writing code.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Milestone Releases & Staging</h4>
                  <p className="text-xs text-slate-600">Iterative delivery with live testing so you can evaluate features as they are built.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Handover & 90-Day Warranty</h4>
                  <p className="text-xs text-slate-600">Complete source code rights, master database credentials, staff onboarding, and warranty.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-6">
              Our Core Business Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cms.coreValues.map((val, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-blue-700">{val.title}</span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Preview */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Clear, transparent answers about our quotations, payment terms, and technical procedures.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900">{faq.question}</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('faq')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800"
          >
            Browse all categorized FAQs &rarr;
          </button>
        </div>
      </section>

      {/* 7. Consultation CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-700 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-blue-200">
              Ready to Upgrade Your Operations?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Schedule a Discovery Consultation With Our Architects
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Book an Online (Google Meet) or In-Person session to review your operational bottlenecks, discuss feature requirements, and obtain an actionable roadmap.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('consultation')}
                className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Consultation</span>
              </button>
              <button
                onClick={() => navigate('contact')}
                className="px-6 py-3 bg-blue-800 text-white hover:bg-blue-900 text-xs font-semibold rounded-lg transition-colors border border-blue-600"
              >
                Submit Project Inquiry
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
