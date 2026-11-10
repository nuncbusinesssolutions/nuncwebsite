import React, { useState } from 'react';
import { db } from '../../lib/database';
import { ShieldAlert, FileText, Calendar, Lock } from 'lucide-react';

interface LegalCenterPageProps {
  initialSlug?: string;
  navigate: (route: string) => void;
}

export const LegalCenterPage: React.FC<LegalCenterPageProps> = ({ initialSlug, navigate }) => {
  const snapshot = db.getSnapshot();
  const legalPages = snapshot.legalPages;

  const [activeSlug, setActiveSlug] = useState(initialSlug || legalPages[0]?.slug || 'privacy-policy');
  const activePage = legalPages.find(p => p.slug === activeSlug) || legalPages[0];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
          Governance & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          NUNC Corporate Legal Center
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Review our corporate policies, data protection guidelines, milestone payment terms, and master service agreements.
        </p>
      </div>

      {/* Compliance / Draft Notice Banner (§28) */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Draft Legal Notice:</span> The policies in this Legal Center represent initial enterprise operating templates. While aligned with standard Philippine and international IT service practices (including the Data Privacy Act of 2012), they require formal audit by NUNC’s qualified legal counsel prior to binding enforcement.
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Policy Selector (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-3 space-y-1 shadow-xs sticky top-24">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 mb-1">
            Corporate Policies
          </div>
          {legalPages.map((page) => (
            <button
              key={page.slug}
              onClick={() => setActiveSlug(page.slug)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                activeSlug === page.slug
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className={`w-4 h-4 ${activeSlug === page.slug ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>{page.title}</span>
              </div>
              {page.isDraft && (
                <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  Draft
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right Column: Policy Document Body (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {activePage.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last Updated: {activePage.lastUpdated}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activePage.isDraft ? (
                <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded">
                  DRAFT STATUS — PENDING AUDIT
                </span>
              ) : (
                <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  PUBLISHED & ENFORCED
                </span>
              )}
            </div>
          </div>

          {/* Formatted Markdown-like Content */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line font-sans">
            {activePage.content}
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>NUNC Business Solutions Compliance Office</span>
            <span>nuncbusinesssolutions.ph</span>
          </div>

        </div>

      </div>

    </div>
  );
};
