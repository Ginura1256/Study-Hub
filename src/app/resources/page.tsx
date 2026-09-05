import React from 'react';
import { UTApi } from 'uploadthing/server';
import { PdfViewerModal, PdfFileItem } from '@/components/PdfViewerModal';
import { SlideUploader } from '@/components/SlideUploader';
import { FileText, Sparkles, Cloud, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Helper to format file size in MB/KB
function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default async function UploadThingResourcesPage() {
  let pdfFiles: PdfFileItem[] = [];
  let fetchError: string | null = null;

  try {
    const utapi = new UTApi();
    const response = await utapi.listFiles();

    // Support both array return and object { files: [...] } return
    const rawFiles = Array.isArray(response)
      ? response
      : (response as any)?.files || (response as any)?.data || [];

    // Filter to ensure only .pdf files are processed
    pdfFiles = rawFiles
      .filter((file: any) => {
        const name = (file.name || file.key || '').toLowerCase();
        return name.endsWith('.pdf');
      })
      .map((file: any) => {
        const fileKey = file.key || file.id;
        const fileUrl = file.url || `https://utfs.io/f/${fileKey}`;
        const dateObj = file.createdAt ? new Date(file.createdAt) : new Date();

        return {
          id: file.id || fileKey,
          key: fileKey,
          name: file.name || `document_${fileKey}.pdf`,
          url: fileUrl,
          sizeFormatted: formatBytes(file.size),
          createdAtFormatted: dateObj.toISOString().split('T')[0],
        };
      });
  } catch (error: any) {
    console.error('Error fetching files from UploadThing UTApi:', error);
    fetchError = error?.message || 'Failed to fetch uploaded files from UploadThing.';
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            <Cloud className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                UploadThing UTApi Server Fetch
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              PDF Resource Viewer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live server-side file list fetched directly from UploadThing Cloud Storage.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Dashboard Overview</span>
        </Link>
      </div>

      {/* Upload Dropzone Section */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          Upload New PDF Lecture Slides
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload PDF files directly to UploadThing Cloud using the `courseMaterial` router.
        </p>
        <SlideUploader mode="dropzone" />
      </div>

      {/* Error Alert */}
      {fetchError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
          <span className="font-bold">UTApi Fetch Notice: </span>
          {fetchError}
        </div>
      )}

      {/* PDF List & Preview Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Uploaded PDF Lecture Slides ({pdfFiles.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">Filter: `.pdf` files only</span>
        </div>

        {pdfFiles.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-60" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No PDF files found on UploadThing yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Use the upload dropzone above to upload your first PDF slide deck directly to UploadThing Cloud.
            </p>
          </div>
        ) : (
          <PdfViewerModal files={pdfFiles} />
        )}
      </div>
    </div>
  );
}
