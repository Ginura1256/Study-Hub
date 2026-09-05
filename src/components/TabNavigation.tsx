'use client';

import React from 'react';
import { FileText, CheckSquare, Terminal } from 'lucide-react';

export type TabType = 'slides' | 'tutorials' | 'labs';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: {
    slides: number;
    tutorials: number;
    labs: number;
  };
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs = [
    {
      id: 'slides' as TabType,
      label: 'Lecture Slides',
      icon: FileText,
      count: counts.slides,
      activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20',
    },
    {
      id: 'tutorials' as TabType,
      label: 'Tutorials',
      icon: CheckSquare,
      count: counts.tutorials,
      activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20',
    },
    {
      id: 'labs' as TabType,
      label: 'Lab Resources & Configs',
      icon: Terminal,
      count: counts.labs,
      activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20',
    },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-x-auto whitespace-nowrap custom-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? tab.activeClass
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <span
              className={`ml-1 px-2 py-0.5 text-xs font-mono rounded-full ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
