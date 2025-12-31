import React from 'react';
import { Project, ModelConfig, ModelUsageStats } from '../types';
import { Activity, Play, RefreshCw, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface ProjectMatrixProps {
  projects: Project[];
  models: ModelConfig[];
  stats: Record<string, ModelUsageStats>;
  onCheckModel: (modelId: string, projectId: string) => void;
  checkingModels: Set<string>; // Set of "projectId-modelId" strings
  onRunAll: () => void;
}

export const ProjectMatrix: React.FC<ProjectMatrixProps> = ({
  projects,
  models,
  stats,
  onCheckModel,
  checkingModels,
  onRunAll
}) => {
  const getStatusCell = (projectId: string, modelId: string) => {
    const key = `${projectId}-${modelId}`;
    const stat = stats[key];
    const isChecking = checkingModels.has(key);

    if (isChecking) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!stat) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-800"></div>
        </div>
      );
    }

    if (stat.status === 'online') {
      return (
        <div className="flex flex-col items-center justify-center text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
             <span className="font-mono">{stat.latencyMs}ms</span>
          </div>
        </div>
      );
    }

    if (stat.status === 'offline') {
      return (
         <div className="flex items-center justify-center">
            <div className="text-red-400 bg-red-400/10 p-1 rounded-md border border-red-400/20" title="Offline / Error">
              <AlertCircle className="w-4 h-4" />
            </div>
         </div>
      );
    }
    
    return <span className="text-slate-600">-</span>;
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow-xl pb-20">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800">
              <th className="sticky left-0 z-20 bg-slate-900 p-4 font-semibold text-slate-300 text-sm whitespace-nowrap min-w-[200px] border-r border-slate-800 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.5)]">
                Project Name
              </th>
              {models.map((model) => (
                <th key={model.id} className="group relative p-4 font-medium text-slate-400 text-xs whitespace-nowrap text-center min-w-[140px]">
                  <div className="flex flex-col items-center gap-1 cursor-help">
                    <div className="flex items-center gap-1">
                      <span>{model.name}</span>
                      <Info className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">{model.type}</span>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-slate-950 border border-slate-700 p-4 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-left">
                     <div className="text-xs font-semibold text-white mb-1">{model.name}</div>
                     <div className="text-[10px] text-slate-400 mb-3 leading-relaxed border-b border-slate-800 pb-2">{model.description}</div>
                     <div className="grid grid-cols-2 gap-3 text-[10px]">
                         <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                             <div className="text-slate-500 mb-0.5">Free RPM / RPD</div>
                             <div className="text-emerald-400 font-mono">{model.rpmLimitFree} / {model.rpdLimitFree}</div>
                         </div>
                         <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                             <div className="text-slate-500 mb-0.5">Paid RPM / RPD</div>
                             <div className="text-indigo-400 font-mono">{model.rpmLimitPaid} / {model.rpdLimitPaid}</div>
                         </div>
                         <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                             <div className="text-slate-500 mb-0.5">Free TPM</div>
                             <div className="text-emerald-400 font-mono">{model.tpmLimitFree > 0 ? (model.tpmLimitFree / 1000) + 'k' : '-'}</div>
                         </div>
                          <div className="bg-slate-900 border border-slate-800 p-2 rounded">
                             <div className="text-slate-500 mb-0.5">Paid TPM</div>
                             <div className="text-indigo-400 font-mono">{model.tpmLimitPaid > 0 ? (model.tpmLimitPaid / 1000000).toFixed(1) + 'M' : '-'}</div>
                         </div>
                     </div>
                  </div>
                </th>
              ))}
              <th className="p-4 font-semibold text-slate-300 text-sm whitespace-nowrap text-center w-24">
                <button 
                  onClick={onRunAll}
                  className="flex items-center justify-center gap-1 text-xs bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white px-2 py-1 rounded transition-colors w-full"
                  title="Run check for ALL projects"
                >
                  <Play className="w-3 h-3" /> All
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {projects.map((project) => (
              <tr key={project.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="sticky left-0 z-10 bg-slate-900 group-hover:bg-slate-800 p-4 text-sm font-medium text-slate-200 border-r border-slate-800 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.5)]">
                  <div className="flex flex-col">
                    <span className="truncate max-w-[180px]" title={project.name}>{project.name}</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {project.apiKey.substring(0, 4)}...{project.apiKey.substring(project.apiKey.length - 4)}
                    </span>
                  </div>
                </td>
                {models.map((model) => (
                  <td 
                    key={model.id} 
                    className="p-3 text-center cursor-pointer hover:bg-slate-800/50 transition-colors"
                    onClick={() => onCheckModel(model.id, project.id)}
                  >
                    {getStatusCell(project.id, model.id)}
                  </td>
                ))}
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                       models.forEach(m => onCheckModel(m.id, project.id));
                    }}
                    className="p-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                    title="Run all checks for this project"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={models.length + 2} className="p-8 text-center text-slate-500">
                  No projects available. Add or import projects to view the matrix.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};