'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Search, Sun, Moon, Menu, Bell, BookOpen, ExternalLink, X } from 'lucide-react';
import { useStudyHub } from '@/context/StudyHubContext';
import Link from 'next/link';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { searchQuery, setSearchQuery, modules } = useStudyHub();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter search results across all materials
  const searchResults = searchQuery.trim()
    ? modules.flatMap((mod) => {
        const slidesMatches = mod.slides
          .filter(
            (s) =>
              s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .map((s) => ({ type: 'Slide', title: s.title, modCode: mod.code, modId: mod.id }));

        const tutorialMatches = mod.tutorials
          .filter(
            (t) =>
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((t) => ({ type: 'Tutorial', title: t.title, modCode: mod.code, modId: mod.id }));

        const labMatches = mod.labs
          .filter(
            (l) =>
              l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              l.environment.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((l) => ({ type: 'Lab Config', title: l.title, modCode: mod.code, modId: mod.id }));

        return [...slidesMatches, ...tutorialMatches, ...labMatches];
      })
    : [];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        {/* Left Side: Sidebar Toggle & Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors lg:hidden"
            aria-label="Toggle Sidebar Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Input Box */}
          <div className="relative flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search slides, tutorials, lab configs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Search Dropdown */}
            {isSearchFocused && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                <div className="p-2 text-xs font-semibold uppercase text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/60 flex justify-between">
                  <span>Search Results</span>
                  <span>{searchResults.length} items</span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    No matching slides, tutorials, or lab configs found.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {searchResults.slice(0, 8).map((item, idx) => (
                      <Link
                        key={idx}
                        href={`/modules/${item.modId}`}
                        className="flex items-center justify-between p-3 hover:bg-emerald-50/50 dark:hover:bg-slate-700/60 transition-colors"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                              {item.type}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {item.modCode}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mt-0.5">
                            {item.title}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          {/* Degree Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>BSc (Hons) CSNE</span>
          </div>

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors relative"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-emerald-600" />
              )}
            </button>
          )}

          {/* User Profile Avatar Mockup */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-emerald-600/20">
              CS
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Student Hub</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Semester 1</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
