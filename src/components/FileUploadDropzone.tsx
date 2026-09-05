'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileCheck, X, FileText, AlertCircle } from 'lucide-react';

export interface UploadedFileDetails {
  file: File;
  name: string;
  sizeFormatted: string;
  extension: string;
  dataUrl: string;
  textContent?: string;
}

interface FileUploadDropzoneProps {
  onFileSelect: (details: UploadedFileDetails | null) => void;
  accept?: string;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileSelect,
  accept = '.pdf,.pptx,.docx,.txt,.pkt,.gns3,.py,.zip,.yaml,.json,.png,.jpg,.jpeg',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFileDetails | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      // If text/code file, also read text content for inline reading
      const isTextFile = ['TXT', 'PY', 'JSON', 'YAML', 'YML', 'SH', 'CONF', 'C', 'CPP', 'MD'].includes(ext);

      if (isTextFile) {
        const textReader = new FileReader();
        textReader.onload = (textEvt) => {
          const textContent = textEvt.target?.result as string;
          const details: UploadedFileDetails = {
            file,
            name: file.name,
            sizeFormatted: formatFileSize(file.size),
            extension: ext,
            dataUrl,
            textContent,
          };
          setSelectedFile(details);
          onFileSelect(details);
        };
        textReader.readAsText(file);
      } else {
        const details: UploadedFileDetails = {
          file,
          name: file.name,
          sizeFormatted: formatFileSize(file.size),
          extension: ext,
          dataUrl,
        };
        setSelectedFile(details);
        onFileSelect(details);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 bg-slate-50 dark:bg-slate-800/40'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drag & drop document
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Supports PDF, PPTX, DOCX, TXT, Images, PKT, GNS3, Python (up to 50MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs shrink-0">
              {selectedFile.extension}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {selectedFile.name}
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {selectedFile.sizeFormatted} • Document ready for webpage viewing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800 transition-colors ml-2 shrink-0"
            title="Remove selected file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
