'use client';

import React, { useState } from 'react';
import { UploadDropzone, UploadButton } from '@/utils/uploadthing';
import { Sparkles, AlertCircle, CloudUpload } from 'lucide-react';

interface SlideUploaderProps {
  onUploadSuccess?: (res: { name: string; url: string; size?: string }[]) => void;
  mode?: 'dropzone' | 'button';
}

export const SlideUploader: React.FC<SlideUploaderProps> = ({
  onUploadSuccess,
  mode = 'dropzone',
}) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <div className="w-full space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">UploadThing Error: </span>
            {errorMessage}
            <p className="mt-1 text-[11px] opacity-90">
              Check your <code className="font-mono bg-rose-100 dark:bg-rose-900/50 px-1 py-0.5 rounded">.env.local</code> file to ensure your <code className="font-mono">UPLOADTHING_TOKEN</code> is set to your real token from <a href="https://uploadthing.com/dashboard" target="_blank" rel="noreferrer" className="underline font-bold">uploadthing.com/dashboard</a>.
            </p>
          </div>
        </div>
      )}

      {mode === 'dropzone' ? (
        <div className="rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/80 bg-slate-50 dark:bg-slate-900/60 p-6 text-center transition-all hover:border-emerald-500">
          <UploadDropzone
            endpoint="courseMaterial"
            onClientUploadComplete={(res) => {
              console.log('Files uploaded successfully to UploadThing:', res);
              setErrorMessage(null);
              const fileCount = res?.length || 0;
              const successMsg = `Successfully uploaded ${fileCount} file(s) to UploadThing!`;
              setUploadStatus(successMsg);
              alert(`🎉 Upload Complete! ${fileCount} file(s) saved to UploadThing CDN.`);

              if (onUploadSuccess && res) {
                onUploadSuccess(res.map((f) => ({ name: f.name, url: f.url })));
              }
            }}
            onUploadError={(error: Error) => {
              console.error('UploadThing Error:', error);
              setErrorMessage(error.message);
              setUploadStatus(`Error: ${error.message}`);
            }}
            onUploadBegin={(name) => {
              console.log('UploadThing upload started for:', name);
              setErrorMessage(null);
              setUploadStatus(`Uploading ${name} to UploadThing...`);
            }}
            appearance={{
              container: 'border-0 bg-transparent p-0',
              label: 'text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600',
              allowedContent: 'text-[11px] font-mono text-slate-400',
              button: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-md transition-colors ut-uploading:cursor-not-allowed cursor-pointer',
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <UploadButton
            endpoint="courseMaterial"
            onClientUploadComplete={(res) => {
              setErrorMessage(null);
              alert(`🎉 Upload Complete! ${res?.length || 0} file(s) saved to UploadThing.`);
              if (onUploadSuccess && res) {
                onUploadSuccess(res.map((f) => ({ name: f.name, url: f.url })));
              }
            }}
            onUploadError={(error: Error) => {
              setErrorMessage(error.message);
            }}
            appearance={{
              button: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer',
              allowedContent: 'text-[11px] font-mono text-slate-400',
            }}
          />
        </div>
      )}

      {uploadStatus && !errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}
    </div>
  );
};
