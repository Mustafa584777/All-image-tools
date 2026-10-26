'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TOOLS_LIST, ToolInfo } from '@/components/ToolsData';
import { 
  Search, Code, FileText, Image as ImageIcon, Languages, 
  Sparkles, Zap, ArrowRight, CheckCircle2, Lock, Cpu, Globe, ShieldCheck
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = TOOLS_LIST.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'FileText': return <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Image': return <ImageIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Languages': return <Languages className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      default: return <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      <Navbar onSelectTool={(slug) => router.push(`/tools/${slug}`)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Google Gemini 3.8 Flash AI Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
              AI Image & Text Hub with <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Exact Slugs</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Convert design mockups into code, transcribe handwritten English & Hindi notes, render HTML to images, and generate AI prompt engineering effortlessly.
            </p>

            {/* Instant Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative flex items-center shadow-xl shadow-indigo-500/5 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tools (e.g. image to code, handwriting, HTML...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Exact ToolImg Slugs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Secure Server API</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>Gemini 3.8 Flash</span>
              </div>
            </div>

          </div>
        </section>

        {/* Tools Section */}
        <section id="tools-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Featured AI & Image Tools</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Select any tool to open its dedicated workspace slug</p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => router.push(`/tools/${tool.slug}`)}
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
                    <span className="inline-block mt-3 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                      /tools/{tool.slug}
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Launch Tool Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
