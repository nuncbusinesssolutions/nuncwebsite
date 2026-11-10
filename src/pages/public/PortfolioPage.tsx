import React, { useState } from 'react';
import { db } from '../../lib/database';
import { PortfolioItem } from '../../lib/types';
import { ArrowRight, Layers, ExternalLink, ShieldCheck } from 'lucide-react';

interface PortfolioPageProps {
  navigate: (route: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ navigate }) => {
  const snapshot = db.getSnapshot();
  const allProjects = snapshot.portfolio.filter(p => p.isPublished);

  const categories = ['All Projects', ...Array.from(new Set(allProjects.map(p => p.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All Projects');

  const filteredProjects = selectedCategory === 'All Projects'
    ? allProjects
    : allProjects.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
          Architecture & Concepts
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Demonstration Projects & Technical Capabilities
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          To strictly preserve confidentiality and data sovereignty for our enterprise clients, proprietary client systems are never publicly displayed. Below are representative demonstration and concept architectures engineering our core capabilities.
        </p>
      </div>

      {/* Notice Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Transparency Disclosure:</span> All portfolio entries below are labeled as <strong>DEMO PROJECT</strong> or <strong>CONCEPT PROJECT</strong> to showcase real architecture patterns without disclosing confidential client workflows or database credentials.
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image Preview */}
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-md border border-slate-700 font-bold">
                  {item.demoLabel}
                </div>
              </div>

              {/* Text content */}
              <div className="p-6 sm:p-8 space-y-3">
                <span className="text-xs font-semibold text-blue-700">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.fullDescription}
                </p>

                {/* Tags */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Production-Ready Architecture
              </span>
              <button
                onClick={() => navigate('contact')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Request Similar Build</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
