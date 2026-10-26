'use client';

import React from 'react';
import { Image as ImageIcon, Shield } from 'lucide-react';
import { TOOLS_LIST } from './ToolsData';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">ToolImg AI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Advanced AI image-to-code, OCR transcription, handwriting conversion, and prompt engineering tools powered by Google Gemini.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Secure Server-Side AI Processing</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">AI Tools Hub</h4>
            <ul className="space-y-2.5 text-sm">
              {TOOLS_LIST.map(tool => (
                <li key={tool.id}>
                  <a href={`/tools/${tool.slug}`} className="hover:text-white transition-colors">
                    {tool.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Privacy & Security</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-400">Enterprise AI Security</span></li>
              <li><span className="text-slate-400">No Data Retention</span></li>
              <li><span className="text-slate-400">Powered by Gemini 3.8 Flash</span></li>
              <li><span className="text-slate-400">100% Free & Fast</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ToolImg.online. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Contact Us</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
