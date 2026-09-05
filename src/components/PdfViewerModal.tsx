'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Download, Eye, ExternalLink, Maximize2, Minimize2, Play, Pause, ArrowDownCircle, Loader2 } from 'lucide-react';

export interface PdfFileItem {
  id: string;
  key: string;
  name: string;
  url: string;
  sizeFormatted: string;
  createdAtFormatted: string;
}

interface PdfViewerModalProps {
  files: PdfFileItem[];
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<PdfFileItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(0.25); // Range from 0 to 1, default 0.25x
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // High-precision requestAnimationFrame auto-scroll loop with sub-pixel accumulator
  useEffect(() => {
    if (!isAutoScrolling || scrollSpeed <= 0) return;

    let animId: number;
    let lastTime = performance.now();
    let subPixelAccumulator = 0;

    // Continuous scroll speed: 0 = 0px/s, 0.25 = 13.75px/s, 1 = 55px/s
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

  // Load PDF.js and render PDF pages to HTML canvas elements
  useEffect(() => {
    if (!selectedFile) return;

    let isMounted = true;
    setIsLoadingPdf(true);
    setRenderError(null);
    setNumPages(0);

    const loadAndRenderPdf = async () => {
      try {
        // Load PDF.js library if not already loaded
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

        const loadingTask = pdfjsLib.getDocument(selectedFile.url);
        const pdf = await loadingTask.promise;

        if (!isMounted) return;
        setNumPages(pdf.numPages);

        if (canvasContainerRef.current) {
          canvasContainerRef.current.innerHTML = '';
        }

        // Render each page into a canvas element
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

          // Page Number Badge
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
        console.error('PDF.js rendering fallback to iframe:', err);
        if (isMounted) {
          setRenderError(err?.message || 'Failed to render HTML PDF canvas');
          setIsLoadingPdf(false);
        }
      }
    };

    loadAndRenderPdf();

    return () => {
      isMounted = false;
    };
  }, [selectedFile]);

  const handleClose = () => {
    setIsAutoScrolling(false);
    setIsFullscreen(false);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* PDF Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => (
          <div
            key={file.id || file.key}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-600/60 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50 font-mono">
                  PDF Document
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                {file.name}
              </h3>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Size: {file.sizeFormatted}</span>
                <span>{file.createdAtFormatted}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setSelectedFile(file)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs shadow-emerald-600/20 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>View PDF</span>
              </button>

              <a
                href={file.url}
                download={file.name}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                title="Download PDF File"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Viewer Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/85 backdrop-blur-xs">
          <div
            className={`relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
              isFullscreen
                ? 'w-[98vw] h-[96vh] max-w-none rounded-2xl'
                : 'w-[94vw] max-w-6xl h-[92vh] rounded-3xl'
            }`}
          >
            {/* Modal Header Bar with Auto-Scroll Feature Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-slate-950/40 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200">
                  PDF Reader {numPages > 0 ? `(${numPages} Pages)` : ''}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate pr-2">
                  {selectedFile.name}
                </h3>
              </div>

              {/* AUTO-SCROLL FEATURE RANGE SLIDER CONTROL BAR */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isAutoScrolling && scrollSpeed > 0
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                    title={isAutoScrolling ? 'Pause Auto Scroll' : 'Start Hands-Free Auto Scroll'}
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

                  {/* Interactive Range Slider (0 to 1) */}
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

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={isFullscreen ? 'Exit full screen' : 'Full screen PDF reader'}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={handleClose}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Container with HTML Rendered PDF Pages */}
            <div
              ref={scrollContainerRef}
              className="flex-1 bg-slate-950 relative overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col items-center"
            >
              {/* Active Auto Scroll Status Banner */}
              {isAutoScrolling && scrollSpeed > 0 && (
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

              {isLoadingPdf && (
                <div className="my-auto text-center p-12 text-slate-400 flex flex-col items-center">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-3" />
                  <div className="font-bold text-sm text-slate-200">Rendering PDF Document...</div>
                  <div className="text-xs text-slate-500 mt-1">Preparing pages for hands-free auto-scrolling reader</div>
                </div>
              )}

              {/* Render Error Fallback to standard iframe */}
              {renderError ? (
                <div className="w-full h-full flex flex-col">
                  <div className="p-3 mb-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-xl">
                    Standard iframe viewer mode enabled.
                  </div>
                  <iframe
                    src={selectedFile.url}
                    className="w-full flex-1 border-0 bg-white rounded-xl min-h-[600px]"
                    title={selectedFile.name}
                  />
                </div>
              ) : (
                /* Container holding all PDF canvas page elements */
                <div ref={canvasContainerRef} className="w-full max-w-4xl flex flex-col items-center" />
              )}
            </div>

            {/* Modal Footer Controls & Fallback Download */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <a
                  href={selectedFile.url}
                  download={selectedFile.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF ({selectedFile.sizeFormatted})</span>
                </a>

                <a
                  href={selectedFile.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>Open PDF in new tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
