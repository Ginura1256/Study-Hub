'use client';

import React, { useState } from 'react';
import { Terminal, Download, Calendar, Cpu, Network, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { LabResource } from '@/data/modulesData';
import { CodeBlock } from '@/components/CodeBlock';

interface LabResourceCardProps {
  lab: LabResource;
}

export const LabResourceCard: React.FC<LabResourceCardProps> = ({ lab }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleDownload = () => {
    alert(`Downloading lab configuration topology file: ${lab.downloadFileName}`);
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-slate-700 transition-all">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
            Week {lab.week}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            {lab.environment}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Calendar className="w-3.5 h-3.5" />
          <span>{lab.dateAdded}</span>
        </div>
      </div>

      {/* Title & Description */}
      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-start gap-2.5">
        <Terminal className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <span>{lab.title}</span>
      </h4>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
        {lab.description}
      </p>

      {/* Topology Summary */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Network className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-200">Topology Layout: </span>
          {lab.topologySummary}
        </div>
      </div>

      {/* Quick Terminal Commands */}
      {lab.commands && lab.commands.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Verification Commands
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            {lab.commands.map((cmd, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <code className="text-emerald-400 truncate">$ {cmd}</code>
                <button
                  onClick={() => copyCommand(cmd)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                  title="Copy command"
                >
                  {copiedCmd === cmd ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Configuration Code */}
      {lab.configCode && (
        <div className="mt-4">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            {showConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>{showConfig ? 'Hide Configuration Snippet' : 'View Configuration Snippet'}</span>
          </button>

          {showConfig && (
            <div className="mt-3">
              <CodeBlock code={lab.configCode} title={`Configuration (${lab.downloadFileName})`} />
            </div>
          )}
        </div>
      )}

      {/* Download Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400 truncate max-w-[200px]">
          {lab.downloadFileName}
        </span>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs shadow-emerald-600/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Lab Asset</span>
        </button>
      </div>
    </div>
  );
};
