'use client';

import React from 'react';
import { Image as ImageIcon, Heart, Shield, Zap, HelpCircle, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-slate-800">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">ToolImg</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The ultimate free online suite for fast image compression, resizing, conversion, cropping, and watermarking. All processing happens securely right in your browser.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Zero server uploads for client tools</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Popular Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#compressor" className="hover:text-white transition-colors">Image Compressor</a></li>
              <li><a href="#resizer" className="hover:text-white transition-colors">Image Resizer</a></li>
              <li><a href="#converter" className="hover:text-white transition-colors">PNG to JPG Converter</a></li>
              <li><a href="#watermark" className="hover:text-white transition-colors">Watermark Maker</a></li>
              <li><a href="#crop" className="hover:text-white transition-colors">Photo Cropper</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Formats & Export</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#converter" className="hover:text-white transition-colors">WEBP to PNG</a></li>
              <li><a href="#converter" className="hover:text-white transition-colors">JPG to WEBP</a></li>
              <li><a href="#pdf" className="hover:text-white transition-colors">Images to PDF</a></li>
              <li><a href="#base64" className="hover:text-white transition-colors">Base64 Encoder</a></li>
              <li><a href="#rotate" className="hover:text-white transition-colors">Rotate & Flip</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Trust & Privacy</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-400">Client-Side Security</span></li>
              <li><span className="text-slate-400">GDPR Compliant</span></li>
              <li><span className="text-slate-400">No Registration Needed</span></li>
              <li><span className="text-slate-400">100% Free Forever</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ToolImg.online. All rights reserved. Built for lightning-fast image processing.</p>
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
