'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TOOLS_LIST, ToolInfo } from '@/components/ToolsData';
import { 
  Upload, Download, RefreshCw, Copy, Check, Code, FileText, 
  Image as ImageIcon, Languages, Sparkles, ArrowLeft, ShieldCheck, Zap
} from 'lucide-react';

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const tool = TOOLS_LIST.find(t => t.slug === slug) || TOOLS_LIST[0];

  const [file, setFile] = useState<{ file: File; preview: string; name: string; base64: string; mimeType: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // HTML to Image specific state
  const [htmlCode, setHtmlCode] = useState<string>('<div style="padding: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border-radius: 16px; font-family: sans-serif;">\n  <h1 style="font-size: 28px; margin-bottom: 10px;">Hello ToolImg AI</h1>\n  <p>Render gorgeous HTML snippets into downloadable images instantly!</p>\n</div>');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const f = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      setFile({
        file: f,
        preview: dataUrl,
        name: f.name,
        base64,
        mimeType: f.type || 'image/jpeg'
      });
      setResultText('');
    };
    reader.readAsDataURL(f);
  };

  const handleRunAi = async () => {
    if (!file && tool.slug !== 'html-to-image') return;
    setLoading(true);
    setResultText('');

    try {
      const res = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug: tool.slug,
          imageBase64: file?.base64,
          mimeType: file?.mimeType,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultText(data.result);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      <Navbar onSelectTool={(s) => router.push(`/tools/${s}`)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{tool.title}</h1>
                {tool.badge && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50">
                    {tool.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tool.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {TOOLS_LIST.map(t => (
              <button
                key={t.id}
                onClick={() => router.push(`/tools/${t.slug}`)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  tool.slug === t.slug 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Panel: Input / Upload */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <span>{tool.slug === 'html-to-image' ? 'HTML Source Code' : 'Upload Image Source'}</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">/tools/{tool.slug}</span>
              </div>

              {tool.slug === 'html-to-image' ? (
                <div className="space-y-4">
                  <textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    rows={10}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Live HTML Preview:</p>
                    <div 
                      className="bg-white rounded-xl overflow-hidden shadow-sm"
                      dangerouslySetInnerHTML={{ __html: htmlCode }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {!file ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-10 text-center bg-slate-50 dark:bg-slate-950 hover:border-indigo-500 transition-all cursor-pointer group"
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Click to upload image</p>
                      <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WebP up to 25MB</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800">
                        <img src={file.preview} alt="Upload preview" className="max-h-full max-w-full object-contain" />
                        <button
                          onClick={() => setFile(null)}
                          className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>File: <strong className="text-slate-700 dark:text-slate-300">{file.name}</strong></span>
                        <button onClick={() => fileInputRef.current?.click()} className="text-indigo-600 font-semibold hover:underline">Change Image</button>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {tool.slug !== 'html-to-image' && (
              <button
                onClick={handleRunAi}
                disabled={loading || !file}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                <span>{loading ? 'Processing with Gemini AI...' : `Run ${tool.title}`}</span>
              </button>
            )}

          </div>

          {/* Right Panel: Output Result */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>AI Result & Output</span>
                </h3>
                {resultText && (
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Output'}</span>
                  </button>
                )}
              </div>

              <div className="w-full h-80 sm:h-96 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-y-auto font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
                    <p className="text-xs font-sans">Gemini AI is analyzing your image...</p>
                  </div>
                ) : resultText ? (
                  resultText
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6">
                    <Sparkles className="w-10 h-10 mb-2 opacity-40 text-indigo-600" />
                    <p>Upload an image and click &apos;Run {tool.title}&apos; to generate AI results.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Processed securely via Google Gemini 3.8 Flash server API. No data is stored.
              </p>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
