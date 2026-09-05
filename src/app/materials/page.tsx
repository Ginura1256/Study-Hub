'use client';

import React, { useState, useMemo } from 'react';
import { useStudyHub } from '@/context/StudyHubContext';
import { SlideResource, TutorialResource, LabResource } from '@/data/modulesData';
import { SlideUploader } from '@/components/SlideUploader';
import {
  FileText,
  BookOpen,
  Terminal,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCode,
  Download,
  FolderKanban,
  Layers
} from 'lucide-react';
import Link from 'next/link';

type MaterialType = 'slide' | 'tutorial' | 'lab';

interface CombinedMaterialItem {
  id: string;
  moduleId: string;
  moduleCode: string;
  moduleTitle: string;
  type: MaterialType;
  title: string;
  description?: string;
  week?: number;
  dateAdded?: string;
  fileSize?: string;
  fileFormat?: string;
  downloadUrl?: string;
  itemRef: SlideResource | TutorialResource | LabResource;
}

export default function MaterialsCrudPage() {
  const {
    modules,
    addSlideToModule,
    updateSlideInModule,
    deleteSlideFromModule,
    addTutorialToModule,
    updateTutorialInModule,
    deleteTutorialFromModule,
    addLabToModule,
    updateLabInModule,
    deleteLabFromModule,
    openModal,
    resetToDefaultModules
  } = useStudyHub();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | MaterialType>('all');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CombinedMaterialItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<CombinedMaterialItem | null>(null);

  // Form Fields
  const [formModuleId, setFormModuleId] = useState('');
  const [formType, setFormType] = useState<MaterialType>('slide');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formWeek, setFormWeek] = useState<number>(1);
  const [formFileSize, setFormFileSize] = useState('2.5 MB');
  const [formFileFormat, setFormFileFormat] = useState('PDF');
  const [formDownloadUrl, setFormDownloadUrl] = useState('');
  const [formConfigCode, setFormConfigCode] = useState('');
  const [formEnvironment, setFormEnvironment] = useState('Linux Sandbox');
  const [formDifficulty, setFormDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [formEstimatedTime, setFormEstimatedTime] = useState('45 mins');

  // Flatten all materials across all modules into a single list
  const allMaterials = useMemo<CombinedMaterialItem[]>(() => {
    const list: CombinedMaterialItem[] = [];

    modules.forEach((mod) => {
      // Slides
      mod.slides.forEach((slide) => {
        list.push({
          id: slide.id,
          moduleId: mod.id,
          moduleCode: mod.code,
          moduleTitle: mod.title,
          type: 'slide',
          title: slide.title,
          description: slide.description,
          week: slide.week,
          dateAdded: slide.dateAdded,
          fileSize: slide.fileSize,
          fileFormat: slide.fileFormat || 'PDF',
          downloadUrl: slide.downloadUrl,
          itemRef: slide,
        });
      });

      // Tutorials
      mod.tutorials.forEach((tut) => {
        list.push({
          id: tut.id,
          moduleId: mod.id,
          moduleCode: mod.code,
          moduleTitle: mod.title,
          type: 'tutorial',
          title: tut.title,
          description: tut.description,
          week: tut.week,
          dateAdded: tut.dateAdded,
          fileSize: 'Task Sheet',
          fileFormat: 'PDF',
          itemRef: tut,
        });
      });

      // Labs
      mod.labs.forEach((lab) => {
        list.push({
          id: lab.id,
          moduleId: mod.id,
          moduleCode: mod.code,
          moduleTitle: mod.title,
          type: 'lab',
          title: lab.title,
          description: lab.description,
          week: lab.week,
          dateAdded: lab.dateAdded,
          fileSize: 'Config Code',
          fileFormat: lab.downloadFileName?.split('.').pop()?.toUpperCase() || 'TXT',
          itemRef: lab,
        });
      });
    });

    return list;
  }, [modules]);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return allMaterials.filter((item) => {
      // Search
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.moduleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.moduleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Type
      const matchesType = selectedTypeFilter === 'all' || item.type === selectedTypeFilter;

      // Module
      const matchesModule = selectedModuleFilter === 'all' || item.moduleId === selectedModuleFilter;

      return matchesSearch && matchesType && matchesModule;
    });
  }, [allMaterials, searchTerm, selectedTypeFilter, selectedModuleFilter]);

  // Counts
  const slideCount = allMaterials.filter((m) => m.type === 'slide').length;
  const tutorialCount = allMaterials.filter((m) => m.type === 'tutorial').length;
  const labCount = allMaterials.filter((m) => m.type === 'lab').length;

  // Open Form Modal for Creating
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormModuleId(modules[0]?.id || '');
    setFormType('slide');
    setFormTitle('');
    setFormDescription('');
    setFormWeek(1);
    setFormFileSize('2.5 MB');
    setFormFileFormat('PDF');
    setFormDownloadUrl('');
    setFormConfigCode('');
    setFormEnvironment('Linux Sandbox');
    setFormDifficulty('Intermediate');
    setFormEstimatedTime('45 mins');
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Editing
  const handleOpenEditModal = (item: CombinedMaterialItem) => {
    setEditingItem(item);
    setFormModuleId(item.moduleId);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormDescription(item.description || '');
    setFormWeek(item.week || 1);
    setFormFileSize(item.fileSize || '2.5 MB');
    setFormFileFormat(item.fileFormat || 'PDF');
    setFormDownloadUrl(item.downloadUrl || '');

    if (item.type === 'lab') {
      const lab = item.itemRef as LabResource;
      setFormConfigCode(lab.configCode || '');
      setFormEnvironment(lab.environment || 'Linux Sandbox');
    } else if (item.type === 'tutorial') {
      const tut = item.itemRef as TutorialResource;
      setFormDifficulty(tut.difficulty || 'Intermediate');
      setFormEstimatedTime(tut.estimatedTime || '45 mins');
    }

    setIsFormModalOpen(true);
  };

  // Handle Form Submission (Create or Update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formModuleId || !formTitle.trim()) {
      alert('Please select a target module and enter a title.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (editingItem) {
      // UPDATE EXISTING
      if (formType === 'slide') {
        updateSlideInModule(formModuleId, editingItem.id, {
          title: formTitle,
          description: formDescription,
          week: formWeek,
          fileSize: formFileSize,
          fileFormat: formFileFormat,
          downloadUrl: formDownloadUrl,
        });
      } else if (formType === 'tutorial') {
        updateTutorialInModule(formModuleId, editingItem.id, {
          title: formTitle,
          description: formDescription,
          week: formWeek,
          difficulty: formDifficulty,
          estimatedTime: formEstimatedTime,
        });
      } else if (formType === 'lab') {
        updateLabInModule(formModuleId, editingItem.id, {
          title: formTitle,
          description: formDescription,
          week: formWeek,
          environment: formEnvironment,
          configCode: formConfigCode,
        });
      }
    } else {
      // CREATE NEW
      if (formType === 'slide') {
        addSlideToModule(formModuleId, {
          title: formTitle,
          description: formDescription || `Lecture slide deck covering ${formTitle}.`,
          week: Number(formWeek),
          fileFormat: formFileFormat,
          fileSize: formFileSize,
          dateAdded: today,
          downloadUrl: formDownloadUrl || '#',
          tags: ['Academic', 'Slide Deck'],
        });
      } else if (formType === 'tutorial') {
        addTutorialToModule(formModuleId, {
          title: formTitle,
          description: formDescription || `Practice tutorial sheet for ${formTitle}.`,
          week: Number(formWeek),
          estimatedTime: formEstimatedTime,
          difficulty: formDifficulty,
          dateAdded: today,
          defaultCompleted: false,
          learningObjectives: [`Understand core concepts of ${formTitle}`],
        });
      } else if (formType === 'lab') {
        addLabToModule(formModuleId, {
          title: formTitle,
          description: formDescription || `Practical lab setup guide for ${formTitle}.`,
          week: Number(formWeek),
          environment: formEnvironment,
          dateAdded: today,
          downloadFileName: `${formTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_config.txt`,
          topologySummary: `Lab environment configuration for ${formTitle}.`,
          configCode: formConfigCode || `# ${formTitle} Lab Setup\necho "Initializing setup..."`,
          commands: ['uname -a', 'systemctl status'],
        });
      }
    }

    setIsFormModalOpen(false);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!deletingItem) return;

    if (deletingItem.type === 'slide') {
      deleteSlideFromModule(deletingItem.moduleId, deletingItem.id);
    } else if (deletingItem.type === 'tutorial') {
      deleteTutorialFromModule(deletingItem.moduleId, deletingItem.id);
    } else if (deletingItem.type === 'lab') {
      deleteLabFromModule(deletingItem.moduleId, deletingItem.id);
    }

    setDeletingItem(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              CRUD Operations Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Course Materials Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Full Create, Read, Update, and Delete control over lecture slides, tutorial sheets, and lab configurations across all active CSNE modules.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (confirm('Reset all materials and modules back to default dataset?')) {
                resetToDefaultModules();
              }
            }}
            className="p-3 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors"
            title="Reset Dataset"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Course Material</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Materials</div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {allMaterials.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across {modules.length} Modules</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Lecture Slides</div>
            <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1 font-mono">
              {slideCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">PDFs & Presentation Decks</div>
          </div>
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800/50">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tutorial Sheets</div>
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 font-mono">
              {tutorialCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Practice Exercise Papers</div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Lab Configurations</div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              {labCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Sandbox Config Snippets</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
            <Terminal className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search course materials by title, module code, or topic..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Module Select Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
              className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Modules ({modules.length})</option>
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.code} - {mod.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedTypeFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTypeFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-700'
            }`}
          >
            All Resources ({allMaterials.length})
          </button>

          <button
            onClick={() => setSelectedTypeFilter('slide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTypeFilter === 'slide'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lecture Slides ({slideCount})</span>
          </button>

          <button
            onClick={() => setSelectedTypeFilter('tutorial')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTypeFilter === 'tutorial'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tutorial Papers ({tutorialCount})</span>
          </button>

          <button
            onClick={() => setSelectedTypeFilter('lab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTypeFilter === 'lab'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Lab Configs ({labCount})</span>
          </button>
        </div>
      </div>

      {/* Materials Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredMaterials.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Layers className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
            <h3 className="font-bold text-base text-slate-700 dark:text-slate-300">No Course Materials Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or add a new material using the "+ Add Course Material" button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Material Title & Description</th>
                  <th className="py-4 px-6">Module</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Week / Size</th>
                  <th className="py-4 px-6">Date Added</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredMaterials.map((item) => {
                  let TypeIcon = FileText;
                  let typeColor = 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/50';

                  if (item.type === 'tutorial') {
                    TypeIcon = BookOpen;
                    typeColor = 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
                  } else if (item.type === 'lab') {
                    TypeIcon = Terminal;
                    typeColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
                  }

                  return (
                    <tr
                      key={`${item.moduleId}-${item.type}-${item.id}`}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${typeColor}`}>
                            <TypeIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {item.title}
                            </div>
                            {item.description && (
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 max-w-md">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Module */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <Link
                          href={`/modules/${item.moduleId}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-mono font-semibold hover:bg-emerald-100 dark:hover:bg-slate-700 transition-colors border border-emerald-200 dark:border-emerald-800"
                        >
                          <span>{item.moduleCode}</span>
                        </Link>
                      </td>

                      {/* Type Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${typeColor}`}>
                          <TypeIcon className="w-3 h-3" />
                          <span>{item.type}</span>
                        </span>
                      </td>

                      {/* Week & Size */}
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-slate-500 dark:text-slate-400">
                        Week {item.week || 1} • {item.fileSize || 'Standard'}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-slate-400">
                        {item.dateAdded || '2026-09-05'}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Preview */}
                          <button
                            onClick={() => openModal(item.type, item.title, item.itemRef)}
                            className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-xl transition-colors"
                            title="Preview Material"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Material */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            title="Edit Material Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Material */}
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors"
                            title="Delete Material"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MATERIAL MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {editingItem ? 'Edit Course Material' : 'Add New Course Material'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs">
              {/* Target Module */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Module *
                </label>
                <select
                  value={formModuleId}
                  onChange={(e) => setFormModuleId(e.target.value)}
                  disabled={!!editingItem}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} - {m.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material Type Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Resource Type *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormType('slide')}
                    disabled={!!editingItem}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold border transition-all ${
                      formType === 'slide'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Slide Deck</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormType('tutorial')}
                    disabled={!!editingItem}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold border transition-all ${
                      formType === 'tutorial'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Tutorial Sheet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormType('lab')}
                    disabled={!!editingItem}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold border transition-all ${
                      formType === 'lab'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Lab Config</span>
                  </button>
                </div>
              </div>

              {/* Title & Week */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Material Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Week 04: Advanced BGP Routing Slides"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Week Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={formWeek}
                    onChange={(e) => setFormWeek(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Topic Summary
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short description of concepts covered in this material..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Type-Specific Fields */}
              {formType === 'slide' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      File Size
                    </label>
                    <input
                      type="text"
                      value={formFileSize}
                      onChange={(e) => setFormFileSize(e.target.value)}
                      placeholder="e.g. 3.5 MB"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Format
                    </label>
                    <input
                      type="text"
                      value={formFileFormat}
                      onChange={(e) => setFormFileFormat(e.target.value)}
                      placeholder="e.g. PDF or PPTX"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {formType === 'lab' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Environment Sandbox
                    </label>
                    <input
                      type="text"
                      value={formEnvironment}
                      onChange={(e) => setFormEnvironment(e.target.value)}
                      placeholder="e.g. Cisco Packet Tracer / Linux Terminal"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Config Code Snippet
                    </label>
                    <textarea
                      rows={3}
                      value={formConfigCode}
                      onChange={(e) => setFormConfigCode(e.target.value)}
                      placeholder="Paste bash or router config commands here..."
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* UploadThing Direct Upload Integration */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Document File to UploadThing Cloud
                </label>
                <SlideUploader mode="button" />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
                >
                  {editingItem ? 'Save Changes' : 'Create Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Delete Course Material?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to remove <span className="font-bold text-slate-800 dark:text-slate-200">"{deletingItem.title}"</span> from module <span className="font-mono font-bold text-emerald-600">{deletingItem.moduleCode}</span>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-colors"
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
