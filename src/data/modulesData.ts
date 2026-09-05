export interface SlideResource {
  id: string;
  title: string;
  description: string;
  week: number;
  fileFormat: string;
  fileSize: string;
  dateAdded: string;
  downloadUrl: string;
  tags: string[];
  fileBlobUrl?: string;
  fileName?: string;
  fileTextContent?: string;
}

export interface TutorialResource {
  id: string;
  title: string;
  description: string;
  week: number;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  dateAdded: string;
  defaultCompleted: boolean;
  learningObjectives: string[];
  fileBlobUrl?: string;
  fileName?: string;
  fileTextContent?: string;
}

export interface LabResource {
  id: string;
  title: string;
  description: string;
  week: number;
  environment: string; // e.g. "Packet Tracer", "GNS3", "Linux Ubuntu 22.04", "Docker / K8s"
  dateAdded: string;
  downloadFileName: string;
  topologySummary: string;
  configCode?: string;
  commands?: string[];
  fileBlobUrl?: string;
  fileName?: string;
  fileTextContent?: string;
}

export interface ModuleData {
  id: string;
  code: string;
  title: string;
  category: 'Networking' | 'Systems' | 'Programming' | 'Cloud' | 'Security';
  instructor: string;
  credits: number;
  semester: string;
  description: string;
  color: string; // Tailwind color key
  iconName: 'Network' | 'Server' | 'Code2' | 'Cloud' | 'Shield';
  slides: SlideResource[];
  tutorials: TutorialResource[];
  labs: LabResource[];
}

// Clean initial empty module list
export const MODULES_DATA: ModuleData[] = [];
