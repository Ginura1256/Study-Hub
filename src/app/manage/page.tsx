'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  BookOpen,
  User,
  CheckCircle2,
  FileText,
  Terminal,
  CheckSquare,
  Network,
  Server,
  Code2,
  Cloud,
  Shield
} from 'lucide-react';
import { useStudyHub } from '@/context/StudyHubContext';
import { ModuleData } from '@/data/modulesData';

const ICON_MAP = {
  Network: Network,
  Server: Server,
  Code2: Code2,
  Cloud: Cloud,
  Shield: Shield,
};

export default function ManageModulesPage() {
  const {
    modules,
    setIsAddModuleModalOpen,
    setEditingModule,
    deleteModule,
    resetToDefaultModules,
    getModuleCompletion,
  } = useStudyHub();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = ['All', 'Networking', 'Systems', 'Programming', 'Cloud', 'Security'];

  const filteredModules = modules.filter((mod) => {
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      mod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCredits = modules.reduce((sum, m) => sum + m.credits, 0);

  const handleDeleteConfirmed = () => {
    if (deleteConfirmId) {
      deleteModule(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const targetDeleteModule = modules.find((m) => m.id === deleteConfirmId);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            <FolderKanban className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Module Management & CRUD Operations
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Create, read, update, and delete academic modules for your CSNE degree curriculum.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all modules back to defaults?')) {
                resetToDefaultModules();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            title="Reset dataset to default CSNE modules"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => setIsAddModuleModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Module</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Modules</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono mt-1">
            {modules.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active in curriculum</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Credit Hours</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {totalCredits} Credits
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Y3S1 Semester</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Resources</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono mt-1">
            {modules.reduce((acc, m) => acc + m.slides.length + m.tutorials.length + m.labs.length, 0)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Slides, Tutorials, & Labs</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Categories</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {Array.from(new Set(modules.map((m) => m.category))).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Disciplines Covered</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code, title, or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CRUD Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50/50 dark:bg-slate-800/60 border-b border-emerald-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Module</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Instructor</th>
                <th className="py-4 px-4 text-center">Credits</th>
                <th className="py-4 px-4 text-center">Materials</th>
                <th className="py-4 px-4 text-center">Progress</th>
                <th className="py-4 px-6 text-right">Actions (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredModules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No modules match your search filter. Click "+ Create New Module" to add one!
                  </td>
                </tr>
              ) : (
                filteredModules.map((mod) => {
                  const IconComponent = ICON_MAP[mod.iconName] || Network;
                  const completion = getModuleCompletion(mod.id);

                  return (
                    <tr key={mod.id} className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Module Code & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 shrink-0">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                              {mod.code}
                            </div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                              {mod.title}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {mod.category}
                        </span>
                      </td>

                      {/* Instructor */}
                      <td className="py-4 px-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {mod.instructor}
                      </td>

                      {/* Credits */}
                      <td className="py-4 px-4 text-center font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                        {mod.credits}
                      </td>

                      {/* Materials Count */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span title="Slides" className="flex items-center gap-0.5">
                            <FileText className="w-3.5 h-3.5 text-teal-600" />
                            {mod.slides.length}
                          </span>
                          <span title="Tutorials" className="flex items-center gap-0.5">
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                            {mod.tutorials.length}
                          </span>
                          <span title="Labs" className="flex items-center gap-0.5">
                            <Terminal className="w-3.5 h-3.5 text-emerald-700" />
                            {mod.labs.length}
                          </span>
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {completion}%
                        </span>
                      </td>

                      {/* CRUD Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Read / View */}
                          <Link
                            href={`/modules/${mod.id}`}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            title="View Module Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Update / Edit */}
                          <button
                            onClick={() => setEditingModule(mod)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors"
                            title="Edit Module Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(mod.id)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                            title="Delete Module"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && targetDeleteModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Delete Module?
                </h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-slate-100 font-mono">{targetDeleteModule.code}: {targetDeleteModule.title}</strong>? All associated lecture slides, tutorials, and lab resources will be removed.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
