'use client';

import React, { useState } from 'react';
import { X, Plus, BookOpen, Network, Server, Code2, Cloud, Shield, Check } from 'lucide-react';
import { useStudyHub, NewModuleInput } from '@/context/StudyHubContext';

export const AddModuleModal: React.FC = () => {
  const { isAddModuleModalOpen, setIsAddModuleModalOpen, addModule } = useStudyHub();

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Networking' | 'Systems' | 'Programming' | 'Cloud' | 'Security'>('Networking');
  const [instructor, setInstructor] = useState('');
  const [credits, setCredits] = useState<number>(3);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<'emerald' | 'cyan' | 'teal' | 'amber' | 'rose'>('emerald');
  const [iconName, setIconName] = useState<'Network' | 'Server' | 'Code2' | 'Cloud' | 'Shield'>('Network');

  if (!isAddModuleModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    const newModuleData: NewModuleInput = {
      code: code.trim().toUpperCase(),
      title: title.trim(),
      category,
      instructor: instructor.trim() || 'Staff Lecturer',
      credits,
      semester: 'Y3S1',
      description: description.trim() || `Course syllabus and study resources for ${title.trim()}.`,
      color,
      iconName,
    };

    addModule(newModuleData);
    setIsAddModuleModalOpen(false);

    // Reset Form
    setCode('');
    setTitle('');
    setDescription('');
    setInstructor('');
  };

  const iconsList = [
    { name: 'Network' as const, label: 'Network', Icon: Network },
    { name: 'Server' as const, label: 'Server', Icon: Server },
    { name: 'Code2' as const, label: 'Programming', Icon: Code2 },
    { name: 'Cloud' as const, label: 'Cloud', Icon: Cloud },
    { name: 'Shield' as const, label: 'Security', Icon: Shield },
  ];

  const colorsList = [
    { key: 'emerald' as const, bg: 'bg-emerald-500' },
    { key: 'cyan' as const, bg: 'bg-cyan-500' },
    { key: 'teal' as const, bg: 'bg-teal-500' },
    { key: 'amber' as const, bg: 'bg-amber-500' },
    { key: 'rose' as const, bg: 'bg-rose-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add New Academic Module
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a new subject module for your CSNE semester hub
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModuleModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Module Code */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Module Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CSNE 306"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              >
                <option value="Networking">Networking</option>
                <option value="Systems">Systems</option>
                <option value="Programming">Programming</option>
                <option value="Cloud">Cloud</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          {/* Module Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Module Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wireless & Mobile Networks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Instructor */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Instructor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Ruwan Silva"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Credits */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Credits
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief overview of key topics covered in this module..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Select Icon */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Module Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {iconsList.map((item) => {
                const IconComponent = item.Icon;
                const isSelected = iconName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIconName(item.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs shadow-emerald-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Color Theme */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Accent Color
            </label>
            <div className="flex gap-3">
              {colorsList.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setColor(item.key)}
                  className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center text-white transition-transform ${
                    color === item.key ? 'ring-4 ring-emerald-500/40 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                >
                  {color === item.key && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModuleModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Module</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
