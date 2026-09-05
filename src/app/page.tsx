'use client';

import React, { useState } from 'react';
import { useStudyHub } from '@/context/StudyHubContext';
import { ModuleCard } from '@/components/ModuleCard';
import {
  GraduationCap,
  BookOpen,
  CheckSquare,
  Terminal,
  FileText,
  Sparkles,
  ArrowRight,
  Clock,
  Filter,
  CheckCircle2,
  TrendingUp,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { modules, getTotalStats, completedTutorials, setIsAddModuleModalOpen } = useStudyHub();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const stats = getTotalStats();

  const categories = ['All', 'Networking', 'Systems', 'Programming', 'Cloud', 'Security'];

  const filteredModules = selectedCategory === 'All'
    ? modules
    : modules.filter((m) => m.category === selectedCategory);

  // Flatten recent slides across modules
  const recentSlides = modules.flatMap((m) =>
    m.slides.map((s) => ({ ...s, moduleCode: m.code, moduleId: m.id }))
  ).slice(0, 4);

  // Filter pending tutorials
  const pendingTutorials = modules.flatMap((m) =>
    m.tutorials
      .filter((t) => !completedTutorials[t.id])
      .map((t) => ({ ...t, moduleCode: m.code, moduleId: m.id }))
  ).slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 md:p-10 border border-emerald-500/20 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-16 w-60 h-60 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Computer Systems & Network Engineering • Y3S1</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Personal Study Hub
            </h1>
            <p className="text-sm text-emerald-50 leading-relaxed">
              Centralized repository for active semester lecture slides, hands-on lab configurations, tutorial tracking, and networking resources.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsAddModuleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold transition-all shadow-lg shadow-black/10 hover:scale-105"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Add New Module</span>
            </button>

            {/* Quick Progress Dial */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
              <div className="text-center">
                <div className="text-2xl font-black text-white font-mono">{stats.overallProgress}%</div>
                <div className="text-[11px] text-emerald-100 font-medium">Semester Target</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-300 border-t-white flex items-center justify-center font-bold text-xs text-white">
                <TrendingUp className="w-5 h-5 text-emerald-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Modules */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {modules.length}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Modules</div>
          </div>
        </div>

        {/* Lecture Slides */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800/50">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {stats.totalSlides}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Lecture Slides</div>
          </div>
        </div>

        {/* Tutorials Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {stats.completedTutorialsCount}/{stats.totalTutorials}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Tutorials Done</div>
          </div>
        </div>

        {/* Lab Configs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-800/50">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {stats.totalLabs}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Lab Guides & Configs</div>
          </div>
        </div>
      </div>

      {/* Modules Filter & Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Active Academic Modules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a module to access slides, tutorials, and router/server configs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-emerald-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddModuleModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Module</span>
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </div>

      {/* Bottom Section: Recent Slides & Pending Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Recent Slide Additions */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Recent Lecture Materials
            </h3>
            <span className="text-xs text-slate-400 font-mono">Added this semester</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentSlides.map((slide) => (
              <div
                key={slide.id}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                      {slide.moduleCode}
                    </span>
                    <span className="text-xs text-slate-400">Week {slide.week}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate mt-0.5">
                    {slide.title}
                  </h4>
                </div>

                <Link
                  href={`/modules/${slide.moduleId}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors shrink-0"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tutorial Checklist */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Next Pending Tutorials
              </h3>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                {pendingTutorials.length} remaining
              </span>
            </div>

            <div className="space-y-3">
              {pendingTutorials.length === 0 ? (
                <div className="p-6 text-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  All tutorials marked as completed! Excellent work.
                </div>
              ) : (
                pendingTutorials.map((tut) => (
                  <Link
                    key={tut.id}
                    href={`/modules/${tut.moduleId}`}
                    className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                      <span>{tut.moduleCode}</span>
                      <span className="font-mono">{tut.estimatedTime}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {tut.title}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] text-slate-400">
              Tip: Mark tutorials as completed inside module pages to update overall completion metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
