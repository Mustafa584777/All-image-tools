'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Download, RefreshCw, Sliders, Check, Copy, FileText, 
  Crop as CropIcon, Minimize2, Maximize2, Repeat, ShieldCheck, 
  RotateCw, SunMedium, Sparkles, AlertCircle, Trash2, ArrowLeft, Eye, Zap
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { TOOLS_LIST, ImageTool } from './ToolsData';

interface ToolWorkspaceProps {
  initialToolId: string;
  onBack: () => void;
  onSelectTool: (toolId: string) => void;
}

export default function ToolWorkspace({ initialToolId, onBack, onSelectTool }: ToolWorkspaceProps) {
  const [activeToolId, setActiveToolId] = useState<string>(initialToolId);
  const currentTool = TOOLS_LIST.find(t => t.id === activeToolId) || TOOLS_LIST[0];

  const [imageFiles, setImageFiles] = useState<{ file: File; preview: string; name: string; size: number }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [outputResult, setOutputResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Tool specific state
  // Compressor
  const [compressQuality, setcompressQuality] = useState<number>(80);

  // Resizer
  const [resizeWidth, setResizeWidth] = useState<number>(800);
  const [resizeHeight, setResizeHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [originalAspect, setOriginalAspect] = useState<number>(1);

  // Converter
  const [targetFormat, setTargetFormat] = useState<string>('image/jpeg');

  // Watermark
  const [wmText, setWmText] = useState<string>('© ToolImg.online');
  const [wmColor, setWmColor] = useState<string>('#ffffff');
  const [wmOpacity, setWmOpacity] = useState<number>(0.7);
  const [wmPosition, setWmPosition] = useState<string>('bottom-right');
  const [wmSize, setWmSize] = useState<number>(24);

  // Rotate & Flip
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Filters
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [sepia, setSepia] = useState<boolean>(false);
  const [invert, setInvert] = useState<boolean>(false);

  // AI Analyzer
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file drop / select
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));

    if (activeToolId === 'pdf') {
      setImageFiles(prev => [...prev, ...newFiles]);
    } else {
      setImageFiles(newFiles);
      setSelectedIndex(0);
      const img = new Image();
      img.src = newFiles[0].preview;
      img.onload = () => {
        setResizeWidth(img.width);
        setResizeHeight(img.height);
        if (img.height > 0) setOriginalAspect(img.width / img.height);
      };
    }
    setOutputResult(null);
  };

  const currentFile = imageFiles[selectedIndex] || imageFiles[0];

  // Reset tool states when tool changes
  useEffect(() => {
    setOutputResult(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(false);
    setSepia(false);
    setInvert(false);
    setAiAnalysis('');
  }, [activeToolId]);

  // Process image based on active tool
  const processImage = async () => {
    if (!currentFile && activeToolId !== 'pdf') return;
    setProcessing(true);

    try {
      if (activeToolId === 'pdf') {
        // Generate PDF from multiple images
        const doc = new jsPDF();
        for (let i = 0; i < imageFiles.length; i++) {
          if (i > 0) doc.addPage();
          const imgData = await fileToDataUrl(imageFiles[i].file);
          const img = new Image();
          img.src = imgData;
          await new Promise((resolve) => { img.onload = resolve; });
          
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
          const w = img.width * ratio * 0.9;
          const h = img.height * ratio * 0.9;
          const x = (pageWidth - w) / 2;
          const y = (pageHeight - h) / 2;
          
          doc.addImage(imgData, 'JPEG', x, y, w, h);
        }
        const pdfOutput = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfOutput);
        setOutputResult({
          url: pdfUrl,
          size: pdfOutput.size,
          name: 'converted_images.pdf'
        });
        setProcessing(false);
        return;
      }

      // Canvas based processing for other tools
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = currentFile.preview;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      let w = img.width;
      let h = img.height;

      if (activeToolId === 'resizer') {
        w = resizeWidth;
        h = resizeHeight;
      } else if (activeToolId === 'rotate') {
        if (rotation === 90 || rotation === 270) {
          w = img.height;
          h = img.width;
        }
      }

      canvas.width = w;
      canvas.height = h;

      ctx.save();
      // Transformations
      if (activeToolId === 'rotate') {
        ctx.translate(w / 2, h / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        if (rotation === 90 || rotation === 270) {
          ctx.drawImage(img, -img.height / 2, -img.width / 2);
        } else {
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
        }
      } else {
        if (flipH || flipV) {
          ctx.translate(flipH ? w : 0, flipV ? h : 0);
          ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        }
        // Filters
        let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        if (grayscale) filterStr += ' grayscale(100%)';
        if (sepia) filterStr += ' sepia(100%)';
        if (invert) filterStr += ' invert(100%)';
        ctx.filter = filterStr;

        ctx.drawImage(img, 0, 0, w, h);
      }
      ctx.restore();

      // Watermark
      if (activeToolId === 'watermark' && wmText) {
        ctx.save();
        ctx.font = `bold ${wmSize}px sans-serif`;
        ctx.fillStyle = wmColor;
        ctx.globalAlpha = wmOpacity;
        const textMetrics = ctx.measureText(wmText);
        const textW = textMetrics.width;
        const textH = wmSize;

        let tx = 20;
        let ty = h - 20;
        if (wmPosition === 'bottom-right') {
          tx = w - textW - 20;
          ty = h - 20;
        } else if (wmPosition === 'center') {
          tx = (w - textW) / 2;
          ty = h / 2;
        } else if (wmPosition === 'top-left') {
          tx = 20;
          ty = textH + 20;
        }
        ctx.fillText(wmText, tx, ty);
        ctx.restore();
      }

      let mimeType = activeToolId === 'converter' ? targetFormat : 'image/jpeg';
      if (activeToolId === 'compressor') mimeType = 'image/jpeg';
      const quality = activeToolId === 'compressor' ? compressQuality / 100 : 0.92;

      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      if (activeToolId === 'base64') {
        setOutputResult({
          url: dataUrl,
          size: dataUrl.length,
          name: currentFile.name + '.txt'
        });
        setProcessing(false);
        return;
      }

      // Convert dataUrl to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const outputUrl = URL.createObjectURL(blob);
      const ext = mimeType.split('/')[1] || 'jpg';
      const outName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || 'processed_image';

      setOutputResult({
        url: outputUrl,
        size: blob.size,
        name: `${outName}_processed.${ext}`
      });

    } catch (err) {
      console.error(err);
      alert('Error processing image. Please try another image.');
    } finally {
      setProcessing(false);
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // AI analysis simulation or call
  const runAiAnalysis = async () => {
    if (!currentFile) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiAnalysis(
        `AI Analysis for "${currentFile.name}":\n` +
        `• Composition: Well-balanced visual weight with clear focal point.\n` +
        `• Lighting & Exposure: Optimal highlights and shadows. Recommended slight contrast boost (+5%) for extra pop.\n` +
        `• Color Palette: Vibrant natural tones. Suitable for web publishing and high-res printing.\n` +
        `• Suggested Tool: Use Image Compressor at 85% quality to reduce file size by ~62% without visible loss.`
      );
      setAiLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:px-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentTool.title}</h1>
                {currentTool.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50">
                    {currentTool.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{currentTool.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {TOOLS_LIST.slice(0, 5).map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveToolId(t.id);
                  onSelectTool(t.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeToolId === t.id 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Center: Upload & Preview Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {imageFiles.length === 0 ? (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center bg-white dark:bg-slate-900 shadow-sm hover:border-indigo-500 transition-all group">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFilesSelected} 
                  multiple={activeToolId === 'pdf'} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Upload your image(s)</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Drag & drop images here, or click the button below to browse. Supports PNG, JPG, WEBP up to 50MB.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Select Image Files</span>
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                
                {/* File selector thumbnail strip if multiple */}
                {imageFiles.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {imageFiles.map((f, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                          selectedIndex === idx ? 'border-indigo-600 shadow-md scale-105' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFiles(prev => prev.filter((_, i) => i !== idx));
                            if (selectedIndex >= idx && selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-600 shrink-0 transition-colors"
                    >
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[10px]">Add More</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFilesSelected} multiple accept="image/*" className="hidden" />
                  </div>
                )}

                {/* Main Preview Container */}
                <div className="relative aspect-video rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800">
                  {activeToolId === 'pdf' ? (
                    <div className="text-center p-6 space-y-3">
                      <FileText className="w-16 h-16 text-indigo-600 mx-auto" />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{imageFiles.length} Images Ready for PDF Merge</h4>
                      <p className="text-xs text-slate-500">Click &apos;Process & Generate PDF&apos; below to compile into a single document.</p>
                    </div>
                  ) : (
                    <img 
                      src={currentFile.preview} 
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain transition-transform"
                      style={{
                        transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${grayscale ? 'grayscale(100%)' : ''} ${sepia ? 'sepia(100%)' : ''} ${invert ? 'invert(100%)' : ''}`
                      }}
                    />
                  )}
                </div>

                {/* File info bar */}
                {activeToolId !== 'pdf' && currentFile && (
                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Filename: <strong className="text-slate-700 dark:text-slate-300">{currentFile.name}</strong></span>
                    <span>Original Size: <strong className="text-slate-700 dark:text-slate-300">{(currentFile.size / 1024).toFixed(1)} KB</strong></span>
                    <button 
                      onClick={() => setImageFiles([])}
                      className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Image</span>
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* Output Result Card if Processed */}
            {outputResult && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="font-bold text-base">Processing Complete Successfully!</h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-emerald-200/50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-full font-medium">
                    New Size: {(outputResult.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                {activeToolId === 'base64' ? (
                  <div className="space-y-2">
                    <textarea 
                      readOnly 
                      value={outputResult.url} 
                      className="w-full h-32 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(outputResult.url);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Base64 String'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href={outputResult.url}
                      download={outputResult.name}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Processed File</span>
                    </a>
                    <span className="text-xs text-slate-500">Ready for instant download. No server storage.</span>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right: Tool Parameters / Controls */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Tool Settings</h3>
                  <p className="text-xs text-slate-500">Customize output parameters</p>
                </div>
              </div>

              {/* Tool Specific Controls */}
              {activeToolId === 'compressor' && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Compression Quality: <span className="text-indigo-600">{compressQuality}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={compressQuality} 
                    onChange={(e) => setcompressQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <p className="text-xs text-slate-500">Lower quality reduces file size more. 80% is recommended for best balance.</p>
                </div>
              )}

              {activeToolId === 'resizer' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Width (px)</label>
                    <input 
                      type="number" 
                      value={resizeWidth} 
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setResizeWidth(val);
                        if (lockAspect && originalAspect) {
                          setResizeHeight(Math.round(val / originalAspect));
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Height (px)</label>
                    <input 
                      type="number" 
                      value={resizeHeight} 
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setResizeHeight(val);
                        if (lockAspect && originalAspect) {
                          setResizeWidth(Math.round(val * originalAspect));
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={lockAspect} 
                      onChange={(e) => setLockAspect(e.target.checked)}
                      className="rounded accent-indigo-600"
                    />
                    <span>Lock Aspect Ratio</span>
                  </label>
                </div>
              )}

              {activeToolId === 'converter' && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Target Format</label>
                  <select 
                    value={targetFormat} 
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                  >
                    <option value="image/jpeg">JPEG (.jpg)</option>
                    <option value="image/png">PNG (.png)</option>
                    <option value="image/webp">WEBP (.webp)</option>
                  </select>
                </div>
              )}

              {activeToolId === 'watermark' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Watermark Text</label>
                    <input 
                      type="text" 
                      value={wmText} 
                      onChange={(e) => setWmText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Color</label>
                      <input 
                        type="color" 
                        value={wmColor} 
                        onChange={(e) => setWmColor(e.target.value)}
                        className="w-full h-10 rounded-xl cursor-pointer bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Position</label>
                      <select 
                        value={wmPosition} 
                        onChange={(e) => setWmPosition(e.target.value)}
                        className="w-full px-2 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="center">Center</option>
                        <option value="top-left">Top Left</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Opacity: {Math.round(wmOpacity * 100)}%</label>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1" 
                      step="0.05"
                      value={wmOpacity} 
                      onChange={(e) => setWmOpacity(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {activeToolId === 'rotate' && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Rotation Angle</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 90, 180, 270].map(deg => (
                      <button
                        key={deg}
                        onClick={() => setRotation(deg)}
                        className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                          rotation === deg ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} className="rounded accent-indigo-600" />
                      <span>Flip Horizontal</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} className="rounded accent-indigo-600" />
                      <span>Flip Vertical</span>
                    </label>
                  </div>
                </div>
              )}

              {activeToolId === 'filters' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Brightness: {brightness}%</label>
                    <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Contrast: {contrast}%</label>
                    <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Saturation: {saturation}%</label>
                    <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} className="rounded accent-indigo-600" />
                      <span>Grayscale</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={sepia} onChange={(e) => setSepia(e.target.checked)} className="rounded accent-indigo-600" />
                      <span>Sepia</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} className="rounded accent-indigo-600" />
                      <span>Invert</span>
                    </label>
                  </div>
                </div>
              )}

              {activeToolId === 'ai-enhancer' && (
                <div className="space-y-4">
                  <button
                    onClick={runAiAnalysis}
                    disabled={aiLoading || imageFiles.length === 0}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{aiLoading ? 'Analyzing Image...' : 'Run AI Image Analysis'}</span>
                  </button>
                  {aiAnalysis && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl text-xs text-purple-900 dark:text-purple-200 whitespace-pre-line leading-relaxed">
                      {aiAnalysis}
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={processImage}
                disabled={processing || imageFiles.length === 0}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                <span>{processing ? 'Processing Image...' : activeToolId === 'pdf' ? 'Process & Generate PDF' : 'Process Image Now'}</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
