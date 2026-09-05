'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Calendar,
  Eye,
  Check
} from 'lucide-react';
import { TutorialResource } from '@/data/modulesData';
import { useStudyHub } from '@/context/StudyHubContext';

interface TutorialItemProps {
  tutorial: TutorialResource;
}

const DIFFICULTY_STYLES = {
  Beginner: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
  Intermediate: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/50',
  Advanced: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50',
};

export const TutorialItem: React.FC<TutorialItemProps> = ({ tutorial }) => {
  const { completedTutorials, toggleTutorialCompletion, openModal } = useStudyHub();
  const [isExpanded, setIsExpanded] = useState(false);

  const isCompleted = !!completedTutorials[tutorial.id];

  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isCompleted
          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/60'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Completion Toggle Checkbox + Title */}
        <div className="flex items-start gap-4 flex-1">
          {/* Interactive Checkbox */}
          <button
            onClick={() => toggleTutorialCompletion(tutorial.id)}
            className={`mt-1 flex items-center justify-center w-6 h-6 rounded-lg border transition-all ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs scale-105'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-transparent hover:border-emerald-500'
            }`}
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            aria-label={`Toggle completion for ${tutorial.title}`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-slate-400">
                Week {tutorial.week}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${
                  DIFFICULTY_STYLES[tutorial.difficulty]
                }`}
              >
                {tutorial.difficulty}
              </span>

              {/* Status Badge */}
              <button
                onClick={() => toggleTutorialCompletion(tutorial.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5" />
                    <span>Pending</span>
                  </>
                )}
              </button>
            </div>

            {/* Tutorial Title */}
            <h4
              className={`text-base font-bold transition-colors ${
                isCompleted
                  ? 'text-slate-500 dark:text-slate-400 line-through'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {tutorial.title}
            </h4>

            {/* Tutorial Description */}
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {tutorial.description}
            </p>
          </div>
        </div>

        {/* Right Side Info & Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {tutorial.estimatedTime}
            </span>
            <span className="flex items-center gap-1 hidden sm:flex">
              <Calendar className="w-3.5 h-3.5" />
              {tutorial.dateAdded}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => openModal('tutorial', tutorial.title, tutorial)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Details</span>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Objectives"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Objectives */}
      {isExpanded && tutorial.learningObjectives && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 pl-10">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Learning Objectives
          </div>
          <ul className="space-y-1.5">
            {tutorial.learningObjectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
