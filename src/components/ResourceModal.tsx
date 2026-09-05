'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Download, CheckCircle2, Clock, Calendar, HardDrive, Terminal, Maximize2, Minimize2, ExternalLink, Play, Pause, ArrowDownCircle, Loader2 } from 'lucide-react';
import { useStudyHub } from '@/context/StudyHubContext';
import { SlideResource, TutorialResource, LabResource } from '@/data/modulesData';
import { CodeBlock } from './CodeBlock';

export const ResourceModal: React.FC = () => {
  const { activeModal, closeModal } = useStudyHub();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(0.25); // Range from 0 to 1, default 0.25x
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // High-precision requestAnimationFrame auto-scroll loop with sub-pixel accumulator
  useEffect(() => {
    if (!isAutoScrolling || scrollSpeed <= 0) return;

    let animId: number;
    let lastTime = performance.now();
    let subPixelAccumulator = 0;

    const speedPxPerSec = scrollSpeed * 55;

    const step = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      if (scrollContainerRef.current) {
        subPixelAccumulator += speedPxPerSec * deltaSec;

        if (subPixelAccumulator >= 1) {
          const pixelsToScroll = Math.floor(subPixelAccumulator);
          scrollContainerRef.current.scrollTop += pixelsToScroll;
          subPixelAccumulator -= pixelsToScroll;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame((now) => {
      lastTime = now;
      animId = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(animId);
  }, [isAutoScrolling, scrollSpeed]);

  const activePdfUrl = (activeModal?.item as any)?.fileBlobUrl || (activeModal?.item as any)?.url || (activeModal?.item as any)?.downloadUrl;

  // Load PDF.js and render PDF pages to HTML canvas elements
  useEffect(() => {
    if (!activeModal) return;
    const fileName = (activeModal.item as any).fileName || (activeModal.item as any).downloadFileName || activeModal.title;
    const format = ((activeModal.item as any).fileFormat || fileName.split('.').pop() || 'PDF').toUpperCase();
    const isPDF = format === 'PDF' || fileName.toLowerCase().endsWith('.pdf');

    if (!isPDF || !activePdfUrl || activePdfUrl === '#') return;

    let isMounted = true;
    setIsLoadingPdf(true);
    setRenderError(null);
    setNumPages(0);

    const loadAndRenderPdf = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument(activePdfUrl);
        const pdf = await loadingTask.promise;

        if (!isMounted) return;
        setNumPages(pdf.numPages);

        if (canvasContainerRef.current) {
          canvasContainerRef.current.innerHTML = '';
        }

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (!isMounted) break;

          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.3 });

          const wrapperDiv = document.createElement('div');
          wrapperDiv.className = 'mb-6 flex flex-col items-center shadow-lg rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800';

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.className = 'w-full max-w-4xl h-auto block';

          const renderContext = {
            canvasContext: context!,
            viewport: viewport,
          };

          wrapperDiv.appendChild(canvas);

          const pageBadge = document.createElement('div');
          pageBadge.className = 'w-full py-1.5 px-4 bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[11px] font-mono font-semibold text-center border-t border-slate-200 dark:border-slate-800';
          pageBadge.innerText = `Page ${pageNum} of ${pdf.numPages}`;
          wrapperDiv.appendChild(pageBadge);

          if (canvasContainerRef.current && isMounted) {
            canvasContainerRef.current.appendChild(wrapperDiv);
          }

          await page.render(renderContext).promise;
        }

        if (isMounted) setIsLoadingPdf(false);
      } catch (err: any) {
        console.error('PDF.js rendering fallback:', err);
        if (isMounted) {
          setRenderError(err?.message || 'Failed to render PDF canvas');
          setIsLoadingPdf(false);
        }
      }
    };

    loadAndRenderPdf();

    return () => {
      isMounted = false;
    };
  }, [activeModal, activePdfUrl]);

  if (!activeModal) return null;

  const { type, title, item } = activeModal;
  const slide = item as SlideResource;
  const fileBlobUrl = (item as any).fileBlobUrl;
  const fileName = (item as any).fileName || (item as any).downloadFileName || title;
  const format = ((item as any).fileFormat || fileName.split('.').pop() || 'PDF').toUpperCase();
  const fileTextContent = (item as any).fileTextContent;

  const handleCloseModal = () => {
    setIsAutoScrolling(false);
    setIsFullscreen(false);
    closeModal();
  };

  const triggerDownload = () => {
    if (fileBlobUrl) {
      const link = document.createElement('a');
      link.href = fileBlobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const content = `CSNE Academic Resource: ${title}\nType: ${type}\nDate: ${(item as any).dateAdded || ''}\n\nDescription:\n${(item as any).description || ''}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const isPDF = format === 'PDF' || fileName.toLowerCase().endsWith('.pdf');
  const isImage = ['PNG', 'JPG', 'JPEG', 'SVG', 'WEBP', 'GIF'].includes(format) || fileName.match(/\.(png|jpe?g|svg|webp|gif)$/i);
  const isTextOrCode = ['TXT', 'PY', 'JSON', 'YAML', 'YML', 'SH', 'CONF', 'C', 'CPP', 'MD'].includes(format) || !!fileTextContent;

  const renderDocumentViewer = () => {
    if (isImage && fileBlobUrl) {
      return (
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 flex-1">
          <img
            src={fileBlobUrl}
            alt={title}
            className="max-h-[75vh] w-auto object-contain rounded-xl shadow-lg"
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 overflow-hidden shadow-lg flex flex-col flex-1 min-h-[550px] w-full">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <span className="font-mono flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              HTML PDF Document Reader: {fileName} {numPages > 0 ? `(${numPages} Pages)` : ''}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              {activePdfUrl && (
                <a
                  href={activePdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                >
                  <span>Open in new tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div ref={scrollContainerRef} className="flex-1 relative overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col items-center bg-slate-950">
            {isAutoScrolling && (
              <div className="sticky top-0 z-30 w-full max-w-4xl px-4 py-2 mb-4 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold rounded-xl flex items-center justify-between shadow-lg">
                <span className="flex items-center gap-2 font-mono text-[11px]">
                  <ArrowDownCircle className="w-4 h-4 animate-bounce text-emerald-200" />
                  Hands-Free Auto-Scrolling Active ({scrollSpeed.toFixed(2)}x Speed)
                </span>
                <button
                  onClick={() => setIsAutoScrolling(false)}
                  className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[10px] uppercase font-bold transition-colors"
                >
                  Pause Scroll
                </button>
              </div>
            )}

            {isLoadingPdf && activePdfUrl && (
              <div className="my-auto text-center p-12 text-slate-400 flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-3" />
                <div className="font-bold text-sm text-slate-200">Rendering PDF Document...</div>
                <div className="text-xs text-slate-500 mt-1">Preparing pages for hands-free auto-scrolling reader</div>
              </div>
            )}

            {renderError || !activePdfUrl || activePdfUrl === '#' ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <FileText className="w-16 h-16 text-emerald-400 mb-3 animate-pulse" />
                <h5 className="font-bold text-base text-white">{fileName}</h5>
                <p className="text-xs text-slate-400 mt-1">
                  PDF Document ready for download ({slide.fileSize || 'Standard'})
                </p>
                <button
                  onClick={triggerDownload}
                  className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF File</span>
                </button>
              </div>
            ) : (
              <div ref={canvasContainerRef} className="w-full max-w-4xl flex flex-col items-center" />
            )}
          </div>
        </div>
      );
    }

    if (isTextOrCode && (fileTextContent || (item as LabResource).configCode)) {
      const codeText = fileTextContent || (item as LabResource).configCode || '';
      return (
        <div className="space-y-3 flex-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Uploaded Document Content Reader
          </div>
          <CodeBlock code={codeText} title={fileName} />
        </div>
      );
    }

    return (
      <div className="p-8 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 flex flex-col items-center justify-center text-center my-auto">
        <FileText className="w-16 h-16 text-emerald-400 mb-3 animate-pulse" />
        <h5 className="font-bold text-base text-white">{fileName}</h5>
        <p className="text-xs text-slate-400 mt-1">
          {format} Document ready ({slide.fileSize || 'Asset File'})
        </p>
        <button
          onClick={triggerDownload}
          className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Download Document File</span>
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/85 backdrop-blur-xs">
      <div
        className={`relative w-full bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
          isFullscreen
            ? 'w-[98vw] h-[96vh] max-w-none rounded-2xl'
            : 'w-[94vw] max-w-6xl h-[92vh] rounded-3xl'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {format}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate pr-2">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto Scroll Range Slider Controls */}
            {isPDF && (
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isAutoScrolling && scrollSpeed > 0
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                  title={isAutoScrolling ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
                >
                  {isAutoScrolling && scrollSpeed > 0 ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Auto Scroll</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 px-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">0</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={scrollSpeed}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setScrollSpeed(val);
                      if (val > 0 && !isAutoScrolling) {
                        setIsAutoScrolling(true);
                      } else if (val === 0) {
                        setIsAutoScrolling(false);
                      }
                    }}
                    className="w-24 sm:w-32 accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-400">1</span>
                </div>

                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                  {scrollSpeed.toFixed(2)}x
                </span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={isFullscreen ? 'Exit full screen' : 'Expand full screen viewer'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>

              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1 flex flex-col space-y-4">
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-medium">Week {slide.week || 1}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-400 font-mono">{slide.fileSize || '1.5 MB'}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-400 font-mono">{slide.dateAdded || '2026-09-05'}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Webpage Ready</span>
              </div>
            </div>
          </div>

          {renderDocumentViewer()}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center shrink-0">
          <button
            onClick={triggerDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs shadow-emerald-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Document ({slide.fileSize || '1.5 MB'})</span>
          </button>

          <button
            onClick={handleCloseModal}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
