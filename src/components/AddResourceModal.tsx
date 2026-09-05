'use client';

import React, { useState } from 'react';
import { X, Plus, FileText, CheckSquare, Terminal, CloudUpload, CheckCircle2, HardDrive, AlertCircle } from 'lucide-react';
import { useStudyHub } from '@/context/StudyHubContext';
import { TabType } from './TabNavigation';
import { UploadDropzone, UploadButton } from '@/utils/uploadthing';
import { FileUploadDropzone, UploadedFileDetails } from './FileUploadDropzone';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  moduleCode: string;
  defaultTab: TabType;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  moduleId,
  moduleCode,
  defaultTab,
}) => {
  const { addSlideToModule, addTutorialToModule, addLabToModule } = useStudyHub();
  const [resourceType, setResourceType] = useState<TabType>(defaultTab);
  const [uploadMethod, setUploadMethod] = useState<'cloud' | 'local'>('cloud');

  // Local Upload State
  const [uploadedLocalFile, setUploadedLocalFile] = useState<UploadedFileDetails | null>(null);

  // UploadThing Cloud Result State
  const [uploadedCloudFile, setUploadedCloudFile] = useState<{ url: string; name: string; size?: string } | null>(null);
  const [cloudError, setCloudError] = useState<string | null>(null);

  // Common Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [week, setWeek] = useState<number>(1);

  // Slide Specific
  const [fileFormat, setFileFormat] = useState('PDF');
  const [fileSize, setFileSize] = useState('4.5 MB');
  const [tags, setTags] = useState('Lecture, Architecture');

  // Tutorial Specific
  const [estimatedTime, setEstimatedTime] = useState('45 mins');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [objectives, setObjectives] = useState('');

  // Lab Specific
  const [environment, setEnvironment] = useState('Cisco Packet Tracer / Linux');
  const [topologySummary, setTopologySummary] = useState('');
  const [configCode, setConfigCode] = useState('');

  if (!isOpen) return null;

  const handleLocalFileSelect = (details: UploadedFileDetails | null) => {
    setUploadedLocalFile(details);
    if (details) {
      if (!title.trim()) {
        const nameWithoutExt = details.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }
      setFileFormat(details.extension);
      setFileSize(details.sizeFormatted);
      if (details.textContent && !configCode.trim()) {
        setConfigCode(details.textContent);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dateAdded = new Date().toISOString().split('T')[0];

    // Priority: UploadThing Cloud URL -> Local File Data URL -> Default
    const blobUrl = uploadedCloudFile?.url || uploadedLocalFile?.dataUrl;
    const fileName = uploadedCloudFile?.name || uploadedLocalFile?.name;
    const textContent = uploadedLocalFile?.textContent;
    const finalSize = uploadedCloudFile?.size || uploadedLocalFile?.sizeFormatted || fileSize;
    const finalFormat = uploadedCloudFile
      ? (uploadedCloudFile.name.split('.').pop()?.toUpperCase() || fileFormat)
      : (uploadedLocalFile?.extension || fileFormat);

    if (resourceType === 'slides') {
      addSlideToModule(moduleId, {
        title: title.trim(),
        description: description.trim() || `Lecture slides document for ${moduleCode} Week ${week}.`,
        week,
        fileFormat: finalFormat,
        fileSize: finalSize,
        dateAdded,
        downloadUrl: blobUrl || '#',
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        fileBlobUrl: blobUrl,
        fileName,
        fileTextContent: textContent,
      });
    } else if (resourceType === 'tutorials') {
      addTutorialToModule(moduleId, {
        title: title.trim(),
        description: description.trim() || `Tutorial problem sheet for ${moduleCode} Week ${week}.`,
        week,
        estimatedTime,
        difficulty,
        dateAdded,
        defaultCompleted: false,
        learningObjectives: objectives.split('\n').map((o) => o.trim()).filter(Boolean),
        fileBlobUrl: blobUrl,
        fileName,
        fileTextContent: textContent,
      });
    } else if (resourceType === 'labs') {
      addLabToModule(moduleId, {
        title: title.trim(),
        description: description.trim() || `Lab guide document for ${moduleCode} Week ${week}.`,
        week,
        environment,
        dateAdded,
        downloadFileName: fileName || `${moduleCode.toLowerCase().replace(/\s+/g, '')}_w${week}_lab.txt`,
        topologySummary: topologySummary.trim() || `Lab topology configuration for Week ${week}.`,
        configCode: configCode.trim() || textContent || `# ${title.trim()} Configuration\n# Saved on ${dateAdded}\n\necho "Running lab setup..."`,
        commands: ['echo "Verification complete"'],
        fileBlobUrl: blobUrl,
        fileName,
        fileTextContent: textContent,
      });
    }

    onClose();
    // Reset Form
    setTitle('');
    setDescription('');
    setUploadedLocalFile(null);
    setUploadedCloudFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-slate-950/40">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CloudUpload className="w-5 h-5 text-emerald-600" />
              Upload Material ({moduleCode})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload PDF or PPTX files to UploadThing Cloud
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resource Type Selector */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setResourceType('slides')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl border transition-all ${
              resourceType === 'slides'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs shadow-emerald-600/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Slide</span>
          </button>
          <button
            type="button"
            onClick={() => setResourceType('tutorials')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl border transition-all ${
              resourceType === 'tutorials'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs shadow-emerald-600/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tutorial</span>
          </button>
          <button
            type="button"
            onClick={() => setResourceType('labs')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl border transition-all ${
              resourceType === 'labs'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs shadow-emerald-600/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Lab Config</span>
          </button>
        </div>

        {/* Upload Method Selector Tabs */}
        <div className="px-6 pt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setUploadMethod('cloud')}
            className={`flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              uploadMethod === 'cloud'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>UploadThing Cloud API</span>
          </button>

          <button
            type="button"
            onClick={() => setUploadMethod('local')}
            className={`flex-1 py-1.5 px-3 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              uploadMethod === 'local'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Local File Reader (Fallback)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          {/* Method 1: UploadThing Cloud Storage */}
          {uploadMethod === 'cloud' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                UploadThing Cloud Dropzone *
              </label>

              {cloudError && (
                <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">UploadThing Auth Error: </span>
                    {cloudError}
                    <p className="mt-1 text-[11px] leading-relaxed opacity-90">
                      Ensure your real API token from <a href="https://uploadthing.com/dashboard" target="_blank" rel="noreferrer" className="underline font-bold">uploadthing.com/dashboard</a> is pasted into <code className="font-mono bg-rose-100 dark:bg-rose-900/50 px-1 py-0.5 rounded">.env.local</code>.
                    </p>
                  </div>
                </div>
              )}

              {uploadedCloudFile ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {uploadedCloudFile.name}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                        Uploaded to UploadThing CDN ({uploadedCloudFile.url})
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadedCloudFile(null)}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                  >
                    Change File
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/80 bg-slate-50 dark:bg-slate-800/40 p-4 text-center">
                  <UploadDropzone
                    endpoint="courseMaterial"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setCloudError(null);
                        const fileObj = res[0];
                        setUploadedCloudFile({
                          url: fileObj.url,
                          name: fileObj.name,
                          size: `${(fileObj.size / (1024 * 1024)).toFixed(2)} MB`,
                        });
                        if (!title.trim()) {
                          setTitle(fileObj.name.replace(/\.[^/.]+$/, ''));
                        }
                        setFileFormat(fileObj.name.split('.').pop()?.toUpperCase() || 'PDF');
                        alert(`🎉 UploadThing Cloud Success! Stored at ${fileObj.url}`);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setCloudError(error.message);
                      alert(`❌ UploadThing API Error: ${error.message}`);
                    }}
                    appearance={{
                      container: 'border-0 bg-transparent p-1',
                      label: 'text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600',
                      allowedContent: 'text-[11px] font-mono text-slate-400',
                      button: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-xs cursor-pointer',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Method 2: Instant Local File Reader Upload */}
          {uploadMethod === 'local' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Select File Document *
              </label>
              <FileUploadDropzone onFileSelect={handleLocalFileSelect} />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Week 02: BGP Path Manipulation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Week Number
              </label>
              <input
                type="number"
                min={1}
                max={16}
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {resourceType === 'slides' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Format
                </label>
                <input
                  type="text"
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 uppercase"
                />
              </div>
            )}

            {resourceType === 'tutorials' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Est. Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 45 mins"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            )}

            {resourceType === 'labs' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Environment
                </label>
                <input
                  type="text"
                  placeholder="e.g. GNS3 / Wireshark"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of document content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {resourceType === 'labs' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Configuration Code / Command
              </label>
              <textarea
                rows={3}
                placeholder="! Cisco or Linux command snippets..."
                value={configCode}
                onChange={(e) => setConfigCode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Save & Publish Resource</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
