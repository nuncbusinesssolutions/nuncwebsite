import React from 'react';
import { db } from '../../lib/database';
import { ShieldCheck, Target, Eye, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const snapshot = db.getSnapshot();
  const cms = snapshot.cms;

  return (
    <div className="space-y-20 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
          About NUNC Business Solutions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Practical Technology Solutions Engineered for Enterprise Growth
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          NUNC Business Solutions is a dedicated technology and business solutions partner helping organizations streamline operations, improve operational efficiency, and achieve sustainable scale through custom software development, intelligent automation, and customized digital architectures.
        </p>
      </div>

      {/* Mission & Vision Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Our Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {cms.mission}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Our Vision</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {cms.vision}
          </p>
        </div>
      </div>

      {/* What We Do & Our Approach */}
      <div className="bg-slate-50 p-8 sm:p-12 rounded-2xl border border-slate-200">
        <div className="max-w-3xl space-y-3 mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
            What We Do
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            A Disciplined Combination of Business Acumen and Deep Software Engineering
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Unlike agencies that deliver surface-level websites or rigid off-the-shelf templates, NUNC models your actual operational workflows, ledger rules, and user hierarchies before writing a single line of database schema.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">1. Technology & Software Development</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full-stack web applications, relational PostgreSQL databases with Row Level Security, and custom cloud ERP platforms built on modern TypeScript.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">2. Complete Business Solutions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Point of sale (POS) setups, multi-warehouse inventory systems, travel booking engines, and omnichannel customer communication inboxes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">3. IT Consulting & Digital Innovation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strategic architecture discovery, practical AI workflow automation, payment gateway onboarding, and disaster recovery planning.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
            Guiding Principles
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Our Core Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cms.coreValues.map((val, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-mono text-blue-700 font-bold">0{idx + 1}.</span>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{val.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">Discuss Your Project With Our Engineering Team</h3>
          <p className="text-xs text-slate-400 mt-1">We serve local Philippine enterprises, nationwide businesses, and international clients.</p>
        </div>
        <button
          onClick={() => navigate('contact')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shrink-0 flex items-center gap-2"
        >
          <span>Start a Project</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
