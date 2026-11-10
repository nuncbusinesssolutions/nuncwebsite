import React, { useState } from 'react';
import { db } from '../../lib/database';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQPageProps {
  navigate: (route: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ navigate }) => {
  const snapshot = db.getSnapshot();
  const allFaqs = snapshot.faqs.filter(f => f.isPublished);

  const categories = [
    'All Questions',
    'General Information',
    'Services',
    'Project Development',
    'Payments',
    'Quotations',
    'Consultations',
    'Client Support'
  ];

  const [selectedCategory, setSelectedCategory] = useState('All Questions');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(allFaqs[0]?.id || null);

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All Questions' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
          Knowledge Base & Clarity
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Detailed information on how we handle customized quotations, milestone payments, source code ownership, and enterprise onboarding.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-lg mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. quotation, payments, source code)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
          />
        </div>
      </div>

      {/* Category Pills/Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            No questions found matching your filter criteria. Try a different search term or category.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                      {faq.category}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {faq.question}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-3">
        <h4 className="text-sm font-bold text-slate-900">Have a specific question about your system?</h4>
        <p className="text-xs text-slate-600">Our senior engineering team is ready to review your requirements.</p>
        <div className="pt-1 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('contact')}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
          >
            Send an Inquiry
          </button>
          <button
            onClick={() => navigate('consultation')}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
          >
            Book a Meeting
          </button>
        </div>
      </div>

    </div>
  );
};
