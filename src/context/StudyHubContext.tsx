'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MODULES_DATA, ModuleData, SlideResource, TutorialResource, LabResource } from '@/data/modulesData';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ActiveModalState {
  type: 'slide' | 'lab' | 'tutorial';
  title: string;
  item: SlideResource | LabResource | TutorialResource;
}

export type NewModuleInput = Omit<ModuleData, 'id' | 'slides' | 'tutorials' | 'labs'>;

interface StudyHubContextType {
  modules: ModuleData[];
  addModule: (newModule: NewModuleInput) => void;
  updateModule: (moduleId: string, updatedData: Partial<NewModuleInput>) => void;
  deleteModule: (moduleId: string) => void;
  resetToDefaultModules: () => void;
  addSlideToModule: (moduleId: string, slide: Omit<SlideResource, 'id'>) => void;
  updateSlideInModule: (moduleId: string, slideId: string, updatedSlide: Partial<SlideResource>) => void;
  deleteSlideFromModule: (moduleId: string, slideId: string) => void;
  addTutorialToModule: (moduleId: string, tutorial: Omit<TutorialResource, 'id'>) => void;
  updateTutorialInModule: (moduleId: string, tutorialId: string, updatedTutorial: Partial<TutorialResource>) => void;
  deleteTutorialFromModule: (moduleId: string, tutorialId: string) => void;
  addLabToModule: (moduleId: string, lab: Omit<LabResource, 'id'>) => void;
  updateLabInModule: (moduleId: string, labId: string, updatedLab: Partial<LabResource>) => void;
  deleteLabFromModule: (moduleId: string, labId: string) => void;
  completedTutorials: Record<string, boolean>;
  toggleTutorialCompletion: (tutorialId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeModal: ActiveModalState | null;
  openModal: (type: 'slide' | 'lab' | 'tutorial', title: string, item: SlideResource | LabResource | TutorialResource) => void;
  closeModal: () => void;
  isAddModuleModalOpen: boolean;
  setIsAddModuleModalOpen: (open: boolean) => void;
  editingModule: ModuleData | null;
  setEditingModule: (mod: ModuleData | null) => void;
  getModuleCompletion: (moduleId: string) => number;
  getTotalStats: () => { totalSlides: number; totalTutorials: number; completedTutorialsCount: number; totalLabs: number; overallProgress: number };
}

const StudyHubContext = createContext<StudyHubContextType | undefined>(undefined);

export const StudyHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<ModuleData[]>(MODULES_DATA);
  const [completedTutorials, setCompletedTutorials] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ActiveModalState | null>(null);
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleData | null>(null);

  // Universal cloud sync effect (Supabase + LocalStorage fallback)
  useEffect(() => {
    try {
      const savedModules = localStorage.getItem('csne_all_modules');
      if (savedModules) {
        setModules(JSON.parse(savedModules));
      }
    } catch {
      // Fallback
    }

    const initialMap: Record<string, boolean> = {};
    MODULES_DATA.forEach((mod) => {
      mod.tutorials.forEach((tut) => {
        initialMap[tut.id] = tut.defaultCompleted;
      });
    });

    try {
      const savedCompleted = localStorage.getItem('csne_completed_tutorials');
      if (savedCompleted) {
        setCompletedTutorials({ ...initialMap, ...JSON.parse(savedCompleted) });
      } else {
        setCompletedTutorials(initialMap);
      }
    } catch {
      setCompletedTutorials(initialMap);
    }

    // Fetch universal cloud data from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const fetchUniversalData = async () => {
        try {
          const { data } = await client
            .from('study_hub_data')
            .select('modules, completed_tutorials')
            .eq('id', 'global')
            .single();

          if (data && data.modules && Array.isArray(data.modules)) {
            setModules(data.modules);
            if (data.completed_tutorials) {
              setCompletedTutorials(data.completed_tutorials);
            }
          }
        } catch (err) {
          console.warn('Supabase fetch error:', err);
        }
      };

      fetchUniversalData();

      // Subscribe to real-time changes across all connected devices & browsers
      const channel = client
        .channel('study-hub-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'study_hub_data', filter: 'id=eq.global' },
          (payload: any) => {
            if (payload.new && payload.new.modules) {
              setModules(payload.new.modules);
              if (payload.new.completed_tutorials) {
                setCompletedTutorials(payload.new.completed_tutorials);
              }
            }
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    }
  }, []);

  const saveModulesToStorage = async (updatedModules: ModuleData[], updatedCompleted?: Record<string, boolean>) => {
    try {
      localStorage.setItem('csne_all_modules', JSON.stringify(updatedModules));
      if (updatedCompleted) {
        localStorage.setItem('csne_completed_tutorials', JSON.stringify(updatedCompleted));
      }
    } catch {
      // Storage error handle
    }

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      try {
        await client.from('study_hub_data').upsert({
          id: 'global',
          modules: updatedModules,
          completed_tutorials: updatedCompleted || completedTutorials,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase universal update error:', err);
      }
    }
  };

  const addModule = (newModuleInput: NewModuleInput) => {
    const newId = `csne-${Date.now().toString().slice(-4)}`;
    const fullModule: ModuleData = {
      ...newModuleInput,
      id: newId,
      slides: [
        {
          id: `${newId}-s1`,
          title: `Week 01: Introduction to ${newModuleInput.title}`,
          description: `Core concepts, syllabus overview, and foundational setup for ${newModuleInput.code}.`,
          week: 1,
          fileFormat: 'PDF',
          fileSize: '3.5 MB',
          dateAdded: new Date().toISOString().split('T')[0],
          downloadUrl: '#',
          tags: ['Syllabus', newModuleInput.category, 'Fundamentals']
        }
      ],
      tutorials: [
        {
          id: `${newId}-t1`,
          title: `Tutorial 01: Getting Started with ${newModuleInput.title}`,
          description: `First practical problem sheet covering foundational principles of ${newModuleInput.code}.`,
          week: 1,
          estimatedTime: '45 mins',
          difficulty: 'Beginner',
          dateAdded: new Date().toISOString().split('T')[0],
          defaultCompleted: false,
          learningObjectives: [
            `Understand core principles of ${newModuleInput.title}`,
            `Set up environment tools and workspace`
          ]
        }
      ],
      labs: [
        {
          id: `${newId}-l1`,
          title: `Lab 01: ${newModuleInput.title} Environment Setup`,
          description: `Initial environment configuration guide and verification steps for ${newModuleInput.code}.`,
          week: 1,
          environment: `${newModuleInput.category} Sandbox`,
          dateAdded: new Date().toISOString().split('T')[0],
          downloadFileName: `${newModuleInput.code.toLowerCase().replace(/\s+/g, '')}_lab1_config.txt`,
          topologySummary: `Lab topology setup for ${newModuleInput.title} practical exercises.`,
          configCode: `# ${newModuleInput.code} - Initial Lab Config\n# Created on ${new Date().toISOString().split('T')[0]}\n\necho "Initializing ${newModuleInput.title} environment..."\nsudo systemctl status networking`,
          commands: ['echo "Environment ready"', 'uname -a']
        }
      ]
    };

    setModules((prev) => {
      const updated = [...prev, fullModule];
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const updateModule = (moduleId: string, updatedData: Partial<NewModuleInput>) => {
    setModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id === moduleId) {
          return { ...mod, ...updatedData };
        }
        return mod;
      });
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const deleteModule = (moduleId: string) => {
    setModules((prev) => {
      const updated = prev.filter((mod) => mod.id !== moduleId);
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const resetToDefaultModules = () => {
    setModules(MODULES_DATA);
    try {
      localStorage.removeItem('csne_all_modules');
    } catch {
      // Storage reset handle
    }
  };

  const addSlideToModule = (moduleId: string, slideInput: Omit<SlideResource, 'id'>) => {
    setModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id === moduleId) {
          const newSlide: SlideResource = {
            ...slideInput,
            id: `${moduleId}-s${Date.now().toString().slice(-4)}`
          };
          return { ...mod, slides: [...mod.slides, newSlide] };
        }
        return mod;
      });
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const updateSlideInModule = (moduleId: string, slideId: string, updatedSlide: Partial<SlideResource>) => {
    setModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            slides: mod.slides.map((s) => (s.id === slideId ? { ...s, ...updatedSlide } : s)),
          };
        }
        return mod;
      });
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const deleteSlideFromModule = (moduleId: string, slideId: string) => {
    setModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            slides: mod.slides.filter((s) => s.id !== slideId),
          };
        }
        return mod;
      });
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const addTutorialToModule = (moduleId: string, tutorialInput: Omit<TutorialResource, 'id'>) => {
    setModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id === moduleId) {
          const newTut: TutorialResource = {
            ...tutorialInput,
            id: `${moduleId}-t${Date.now().toString().slice(-4)}`
          };
          return { ...mod, tutorials: [...mod.tutorials, newTut] };
        }
        return mod;
      });
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const updateTutorialInModule = (moduleId: string, tutorialId: string, updatedTutorial: Partial<TutorialResource>) => {
    setModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            tutorials: mod.tutorials.map((t) => (t.id === tutorialId ? { ...t, ...updatedTutorial } : t)),
          };
        }
        return mod;
      });
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const deleteTutorialFromModule = (moduleId: string, tutorialId: string) => {
    setModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            tutorials: mod.tutorials.filter((t) => t.id !== tutorialId),
          };
        }
        return mod;
      });
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const addLabToModule = (moduleId: string, labInput: Omit<LabResource, 'id'>) => {
    setModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id === moduleId) {
          const newLab: LabResource = {
            ...labInput,
            id: `${moduleId}-l${Date.now().toString().slice(-4)}`
          };
          return { ...mod, labs: [...mod.labs, newLab] };
        }
        return mod;
      });
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const updateLabInModule = (moduleId: string, labId: string, updatedLab: Partial<LabResource>) => {
    setModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            labs: mod.labs.map((l) => (l.id === labId ? { ...l, ...updatedLab } : l)),
          };
        }
        return mod;
      });
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const deleteLabFromModule = (moduleId: string, labId: string) => {
    setModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            labs: mod.labs.filter((l) => l.id !== labId),
          };
        }
        return mod;
      });
      saveModulesToStorage(updated);
      return updated;
    });
  };

  const toggleTutorialCompletion = (tutorialId: string) => {
    setCompletedTutorials((prev) => {
      const updated = { ...prev, [tutorialId]: !prev[tutorialId] };
      saveModulesToStorage(modules, updated);
      return updated;
    });
  };

  const openModal = (type: 'slide' | 'lab' | 'tutorial', title: string, item: SlideResource | LabResource | TutorialResource) => {
    setActiveModal({ type, title, item });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getModuleCompletion = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module || module.tutorials.length === 0) return 0;

    const completedCount = module.tutorials.filter((t) => completedTutorials[t.id]).length;
    return Math.round((completedCount / module.tutorials.length) * 100);
  };

  const getTotalStats = () => {
    let totalSlides = 0;
    let totalTutorials = 0;
    let completedTutorialsCount = 0;
    let totalLabs = 0;

    modules.forEach((mod) => {
      totalSlides += mod.slides.length;
      totalTutorials += mod.tutorials.length;
      totalLabs += mod.labs.length;
      mod.tutorials.forEach((tut) => {
        if (completedTutorials[tut.id]) {
          completedTutorialsCount++;
        }
      });
    });

    const overallProgress = totalTutorials > 0 ? Math.round((completedTutorialsCount / totalTutorials) * 100) : 0;

    return {
      totalSlides,
      totalTutorials,
      completedTutorialsCount,
      totalLabs,
      overallProgress,
    };
  };

  return (
    <StudyHubContext.Provider
      value={{
        modules,
        addModule,
        updateModule,
        deleteModule,
        resetToDefaultModules,
        addSlideToModule,
        updateSlideInModule,
        deleteSlideFromModule,
        addTutorialToModule,
        updateTutorialInModule,
        deleteTutorialFromModule,
        addLabToModule,
        updateLabInModule,
        deleteLabFromModule,
        completedTutorials,
        toggleTutorialCompletion,
        searchQuery,
        setSearchQuery,
        activeModal,
        openModal,
        closeModal,
        isAddModuleModalOpen,
        setIsAddModuleModalOpen,
        editingModule,
        setEditingModule,
        getModuleCompletion,
        getTotalStats,
      }}
    >
      {children}
    </StudyHubContext.Provider>
  );
};

export const useStudyHub = () => {
  const context = useContext(StudyHubContext);
  if (!context) {
    throw new Error('useStudyHub must be used within a StudyHubProvider');
  }
  return context;
};
