'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Network,
  Server,
  Code2,
  Cloud,
  Shield,
  ArrowLeft,
  User,
  CheckCircle2,
  BookOpen,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { MODULES_DATA } from '@/data/modulesData';
import { useStudyHub } from '@/context/StudyHubContext';
import { TabNavigation, TabType } from '@/components/TabNavigation';
import { ResourceCard } from '@/components/ResourceCard';
import { TutorialItem } from '@/components/TutorialItem';
import { LabResourceCard } from '@/components/LabResourceCard';
import { AddResourceModal } from '@/components/AddResourceModal';

const ICON_MAP = {
  Network: Network,
  Server: Server,
  Code2: Code2,
  Cloud: Cloud,
  Shield: Shield,
};

interface ModulePageProps {
  params: Promise<{ id: string }>;
}

export default function ModuleDetailPage({ params }: ModulePageProps) {
  const resolvedParams = React.use(params);
  const moduleId = resolvedParams.id;

  const { modules, getModuleCompletion } = useStudyHub();
  const [activeTab, setActiveTab] = useState<TabType>('slides');
  const [filterWeek, setFilterWeek] = useState<number | 'all'>('all');
  const [moduleSearch, setModuleSearch] = useState<string>('');
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);

  const moduleData = modules.find((m) => m.id === moduleId);

  if (!moduleData) {
    notFound();
  }

  const IconComponent = ICON_MAP[moduleData.iconName] || Network;
  const completionPercentage = getModuleCompletion(moduleData.id);

  // Filter slides
  const filteredSlides = moduleData.slides.filter((slide) => {
    const matchesWeek = filterWeek === 'all' || slide.week === filterWeek;
    const matchesSearch =
      moduleSearch === '' ||
      slide.title.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      slide.description.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      slide.tags.some((t) => t.toLowerCase().includes(moduleSearch.toLowerCase()));
    return matchesWeek && matchesSearch;
  });

  // Filter tutorials
  const filteredTutorials = moduleData.tutorials.filter((tut) => {
    const matchesWeek = filterWeek === 'all' || tut.week === filterWeek;
    const matchesSearch =
      moduleSearch === '' ||
      tut.title.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      tut.description.toLowerCase().includes(moduleSearch.toLowerCase());
    return matchesWeek && matchesSearch;
  });

  // Filter labs
  const filteredLabs = moduleData.labs.filter((lab) => {
    const matchesWeek = filterWeek === 'all' || lab.week === filterWeek;
    const matchesSearch =
      moduleSearch === '' ||
      lab.title.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      lab.description.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      lab.environment.toLowerCase().includes(moduleSearch.toLowerCase());
    return matchesWeek && matchesSearch;
  });

  const availableWeeks = Array.from(
    new Set([
      ...moduleData.slides.map((s) => s.week),
      ...moduleData.tutorials.map((t) => t.week),
      ...moduleData.labs.map((l) => l.week),
    ])
  ).sort((a, b) => a - b);

  return (
    <div className="space-y-8 pb-12">
      {/* Back Navigation Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to Dashboard Overview</span>
        </Link>

        <button
          onClick={() => setIsAddResourceOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Material</span>
        </button>
      </div>

      {/* Module Banner Header */}
      <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 shrink-0">
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-sm font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  {moduleData.code}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {moduleData.category}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-mono border border-emerald-200 dark:border-emerald-800">
                  {moduleData.credits} Credits
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {moduleData.title}
              </h1>
              <p className="mt-2 text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                {moduleData.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="w-4 h-4 text-emerald-600" />
                  Instructor: {moduleData.instructor}
                </span>
              </div>
            </div>
          </div>

          {/* Module Completion Widget */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center shrink-0 min-w-[180px]">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Module Progress
            </div>
            <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {completionPercentage}%
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            slides: moduleData.slides.length,
            tutorials: moduleData.tutorials.length,
            labs: moduleData.labs.length,
          }}
        />

        {/* Filters and Search within Module */}
        <div className="flex items-center gap-3">
          {/* Week Filter */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Week:</span>
            <select
              value={filterWeek}
              onChange={(e) => setFilterWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none font-mono cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-slate-900">All Weeks</option>
              {availableWeeks.map((w) => (
                <option key={w} value={w} className="bg-white dark:bg-slate-900">
                  Week {w}
                </option>
              ))}
            </select>
          </div>

          {/* Module Specific Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter section..."
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Tab Content Panels */}
      <div>
        {/* Tab 1: Lecture Slides */}
        {activeTab === 'slides' && (
          <div>
            {filteredSlides.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                No lecture slides match your current filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSlides.map((slide) => (
                  <ResourceCard key={slide.id} slide={slide} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Tutorials */}
        {activeTab === 'tutorials' && (
          <div>
            {filteredTutorials.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                No tutorials match your current filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTutorials.map((tut) => (
                  <TutorialItem key={tut.id} tutorial={tut} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Lab Resources & Configurations */}
        {activeTab === 'labs' && (
          <div>
            {filteredLabs.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                No lab resources match your current filter.
              </div>
            ) : (
              <div className="space-y-6">
                {filteredLabs.map((lab) => (
                  <LabResourceCard key={lab.id} lab={lab} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        moduleId={moduleData.id}
        moduleCode={moduleData.code}
        defaultTab={activeTab}
      />
    </div>
  );
}
