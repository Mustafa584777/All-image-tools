'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolWorkspace from '@/components/ToolWorkspace';
import { TOOLS_LIST, ImageTool } from '@/components/ToolsData';
import { 
  Search, Minimize2, Maximize2, Repeat, ShieldCheck, Crop, 
  RotateCw, Sliders, FileText, Code, SunMedium, Sparkles, 
  Zap, ArrowRight, CheckCircle2, Lock, Cpu, Globe
} from 'lucide-react';

export default function Home() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Compress & Resize', 'Convert & Export', 'Edit & Enhance', 'Privacy & Utils'];

  const filteredTools = TOOLS_LIST.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Minimize2': return <Minimize2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Maximize2': return <Maximize2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Repeat': return <Repeat className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Crop': return <Crop className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'RotateCw': return <RotateCw className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Sliders': return <Sliders className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'FileText': return <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Code': return <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'SunMedium': return <SunMedium className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      default: return <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  if (selectedToolId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar onSelectTool={(id) => setSelectedToolId(id)} />
        <main className="flex-1">
          <ToolWorkspace 
            initialToolId={selectedToolId} 
            onBack={() => setSelectedToolId(null)} 
            onSelectTool={(id) => setSelectedToolId(id)}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      <Navbar onSelectTool={(id) => setSelectedToolId(id)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fast & Secure Browser-Side Image Processing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
              Free Online Image Tools & <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Multi-Tool Editor</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Compress, resize, convert, watermark, crop, and enhance your photos instantly without uploading to servers. 100% private and lightning fast.
            </p>

            {/* Instant Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative flex items-center shadow-xl shadow-indigo-500/5 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for any tool (e.g. compressor, resizer, PDF...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="pr-4 text-xs font-medium text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No Registration Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>Lightning Fast Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>Works on All Devices</span>
              </div>
            </div>

          </div>
        </section>

        {/* Tools Section */}
        <section id="all-tools-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">All Image Tools</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Choose a tool below to start editing instantly</p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => setSelectedToolId(tool.id)}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      {getToolIcon(tool.iconName)}
                    </div>
                    {tool.badge && (
                      <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">No tools found matching your search query.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}

        </section>

        {/* Why Choose ToolImg Section */}
        <section className="bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Why Professionals Choose ToolImg</h2>
              <p className="text-slate-500 dark:text-slate-400">Designed for speed, security, and uncompromising image quality.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">01</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% Client-Side Privacy</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your photos are processed directly in your browser using HTML5 Canvas. They are never uploaded to any remote server or stored.
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">02</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lightning Fast Processing</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  No queue waiting or upload bandwidth limits. Enjoy instant compression, conversion, and resizing at native device speed.
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">03</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">All-in-One Multi Suite</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  From image compression and watermarking to PDF merging and Base64 encoding, all your image editing needs are in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
