'use client';

import React from 'react';
import Link from 'next/link';
import {
  Network,
  Server,
  Code2,
  Cloud,
  Shield,
  FileText,
  CheckSquare,
  Terminal,
  ArrowRight,
  User,
  CheckCircle2
} from 'lucide-react';
import { ModuleData } from '@/data/modulesData';
import { useStudyHub } from '@/context/StudyHubContext';

interface ModuleCardProps {
  module: ModuleData;
}

const ICON_MAP = {
  Network: Network,
  Server: Server,
  Code2: Code2,
  Cloud: Cloud,
  Shield: Shield,
};

const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string; accent: string; ring: string }> = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    accent: 'bg-emerald-500',
    ring: 'ring-emerald-500/20'
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800/60',
    accent: 'bg-cyan-500',
    ring: 'ring-cyan-500/20'
  },
  violet: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    accent: 'bg-emerald-600',
    ring: 'ring-emerald-500/20'
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/60',
    accent: 'bg-amber-500',
    ring: 'ring-amber-500/20'
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/60',
    accent: 'bg-rose-500',
    ring: 'ring-rose-500/20'
  }
};

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const { getModuleCompletion, completedTutorials } = useStudyHub();
  const IconComponent = ICON_MAP[module.iconName] || Network;
  const colorTheme = COLOR_CLASSES[module.color] || COLOR_CLASSES.emerald;
  const completionPercentage = getModuleCompletion(module.id);

  const completedTutorialsCount = module.tutorials.filter((t) => completedTutorials[t.id]).length;

  return (
    <div className="group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-600/60 transition-all duration-300">
      <div>
        {/* Top Bar with Icon & Code */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${colorTheme.bg} ${colorTheme.text} ${colorTheme.border} border shadow-xs group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-block font-mono text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {module.code}
              </span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {module.category}
              </span>
            </div>
          </div>

          {/* Completion Ring Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            {completionPercentage === 100 ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Done
              </span>
            ) : (
              <span className="text-slate-700 dark:text-slate-300 font-mono">
                {completionPercentage}%
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
          {module.title}
        </h3>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {module.description}
        </p>

        {/* Instructor */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>{module.instructor}</span>
        </div>
      </div>

      {/* Footer Metrics & Action Link */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Tutorial Completion</span>
            <span>{completedTutorialsCount} of {module.tutorials.length} completed</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <FileText className="w-3.5 h-3.5 mx-auto text-teal-600 mb-1" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{module.slides.length}</div>
            <div className="text-[10px] text-slate-400">Slides</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <CheckSquare className="w-3.5 h-3.5 mx-auto text-emerald-600 mb-1" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{module.tutorials.length}</div>
            <div className="text-[10px] text-slate-400">Tutorials</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <Terminal className="w-3.5 h-3.5 mx-auto text-emerald-700 mb-1" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{module.labs.length}</div>
            <div className="text-[10px] text-slate-400">Labs</div>
          </div>
        </div>

        {/* View Module Button */}
        <Link
          href={`/modules/${module.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs shadow-emerald-600/20"
        >
          <span>View Academic Materials</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
