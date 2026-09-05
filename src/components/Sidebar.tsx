'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Network,
  Server,
  Code2,
  Cloud,
  Shield,
  GraduationCap,
  Sparkles,
  ChevronRight,
  BookOpenCheck,
  Plus,
  X
} from 'lucide-react';
import { useStudyHub } from '@/context/StudyHubContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP = {
  Network: Network,
  Server: Server,
  Code2: Code2,
  Cloud: Cloud,
  Shield: Shield,
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { modules, getModuleCompletion, getTotalStats, setIsAddModuleModalOpen } = useStudyHub();
  const stats = getTotalStats();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-emerald-50/90 dark:bg-slate-900 border-r border-emerald-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-transform duration-300 ease-in-out flex flex-col lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-emerald-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40">
          <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-emerald-950 dark:text-white flex items-center gap-1.5">
                Study HUB
                <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold tracking-wider rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                  Y3S1
                </span>
              </h1>
              <p className="text-xs text-emerald-700/70 dark:text-slate-400 font-mono">Computer Systems & Nets</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-emerald-900 dark:hover:text-white rounded-lg hover:bg-emerald-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
          {/* Main Menu Links */}
          <div>
            <div className="px-3 mb-2 text-xs font-bold tracking-wider text-emerald-800/60 dark:text-slate-500 uppercase">
              Main Menu
            </div>

            <div className="space-y-1">
              {/* Dashboard Link */}
              <Link
                href="/"
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  pathname === '/'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-100/80 dark:hover:bg-slate-800/70 hover:text-emerald-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard Overview</span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 opacity-90" />
              </Link>

              {/* Manage Course Materials Link (CRUD Page) */}
              <Link
                href="/materials"
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  pathname === '/materials'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-100/80 dark:hover:bg-slate-800/70 hover:text-emerald-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span>Manage Materials</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
                  CRUD
                </span>
              </Link>

              {/* Manage Modules Link (CRUD Page) */}
              <Link
                href="/manage"
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  pathname === '/manage'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-100/80 dark:hover:bg-slate-800/70 hover:text-emerald-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className="w-5 h-5" />
                  <span>Manage Modules</span>
                </div>
              </Link>

              {/* PDF Storage & UploadThing Resource Viewer */}
              <Link
                href="/resources"
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  pathname === '/resources'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-100/80 dark:hover:bg-slate-800/70 hover:text-emerald-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>PDF Storage Viewer</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Academic Modules List */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-bold tracking-wider text-emerald-800/60 dark:text-slate-500 uppercase">
                Active Modules ({modules.length})
              </span>
              <button
                onClick={() => {
                  setIsAddModuleModalOpen(true);
                  onClose();
                }}
                className="p-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 hover:bg-emerald-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                title="Add New Module"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1">
              {modules.map((mod) => {
                const IconComponent = ICON_MAP[mod.iconName] || Network;
                const isActive = pathname === `/modules/${mod.id}`;
                const completion = getModuleCompletion(mod.id);

                return (
                  <Link
                    key={mod.id}
                    href={`/modules/${mod.id}`}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-emerald-950 dark:text-white border-l-4 border-emerald-600 shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-100/70 dark:hover:bg-slate-800/50 hover:text-emerald-950 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                            : 'bg-emerald-100/60 dark:bg-slate-800 text-emerald-700 dark:text-slate-400 group-hover:text-emerald-900 group-hover:bg-emerald-200/60 dark:group-hover:bg-slate-700/50'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 shrink-0" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-xs text-emerald-800/70 dark:text-slate-400 group-hover:text-emerald-950">
                          {mod.code}
                        </div>
                        <div className="font-bold truncate text-sm leading-snug">
                          {mod.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      {completion === 100 ? (
                        <BookOpenCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-slate-800 text-emerald-800 dark:text-slate-400 border border-emerald-200/80 dark:border-slate-700/50">
                          {completion}%
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-emerald-400 dark:text-slate-600 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Progress Widget */}
        <div className="p-4 border-t border-emerald-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-emerald-200/80 dark:border-slate-700/50 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <BookOpenCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Overall Progress
              </span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-extrabold">{stats.overallProgress}%</span>
            </div>

            <div className="w-full h-2 bg-emerald-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>{stats.completedTutorialsCount} / {stats.totalTutorials} Tutorials</span>
              <span>{stats.totalLabs} Labs</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
