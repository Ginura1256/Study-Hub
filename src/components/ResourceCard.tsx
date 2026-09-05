'use client';

import React from 'react';
import { FileText, Eye, Download, Calendar, HardDrive, Tag } from 'lucide-react';
import { SlideResource } from '@/data/modulesData';
import { useStudyHub } from '@/context/StudyHubContext';

interface ResourceCardProps {
  slide: SlideResource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ slide }) => {
  const { openModal } = useStudyHub();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (slide.fileBlobUrl) {
      const link = document.createElement('a');
      link.href = slide.fileBlobUrl;
      link.download = slide.fileName || `${slide.title}.${slide.fileFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate a mock document file download
      const content = `CSNE Academic Material: ${slide.title}\nFormat: ${slide.fileFormat}\nDate: ${slide.dateAdded}\n\nDescription:\n${slide.description}\n\nTags: ${slide.tags.join(', ')}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slide.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${slide.fileFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        {/* Format Badge & Week */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50">
            {slide.fileFormat} • Week {slide.week}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{slide.dateAdded}</span>
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-start gap-2.5">
          <FileText className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{slide.title}</span>
        </h4>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
          {slide.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5 pl-7">
          {slide.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50/60 dark:bg-slate-800 text-[11px] font-semibold text-emerald-800 dark:text-slate-300 border border-emerald-100 dark:border-slate-800"
            >
              <Tag className="w-3 h-3 text-emerald-600" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
          <span>{slide.fileSize}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal('slide', slide.title, slide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>View</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs shadow-emerald-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
