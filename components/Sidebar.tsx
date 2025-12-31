import React from 'react';
import { Project } from '../types';
import { LayoutDashboard, Plus, Trash2, Key, Layers, Upload, Table, LayoutList } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  viewMode: 'detail' | 'matrix';
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
  onImportProjects: (file: File) => void;
  onDeleteProject: (id: string) => void;
  onChangeViewMode: (mode: 'detail' | 'matrix') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  viewMode,
  onSelectProject,
  onAddProject,
  onImportProjects,
  onDeleteProject,
  onChangeViewMode
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportProjects(file);
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-indigo-400 mb-1">
          <Layers className="w-6 h-6" />
          <h1 className="font-bold text-xl tracking-tight text-white">Gemini Omni</h1>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-9">Multi-Project Manager</p>
      </div>

      <div className="p-4 border-b border-slate-800">
         <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button 
               onClick={() => onChangeViewMode('detail')}
               className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'detail' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
               <LayoutList className="w-3.5 h-3.5" />
               Detail
            </button>
            <button 
               onClick={() => onChangeViewMode('matrix')}
               className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'matrix' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
               <Table className="w-3.5 h-3.5" />
               Matrix
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
          Projects
        </div>
        
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
              activeProjectId === project.id && viewMode === 'detail'
                ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-100'
                : 'bg-transparent border-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => {
                onSelectProject(project.id);
                if (viewMode === 'matrix') onChangeViewMode('detail');
            }}
          >
            <div className={`w-2 h-8 rounded-full ${activeProjectId === project.id && viewMode === 'detail' ? 'bg-indigo-500' : 'bg-slate-700 group-hover:bg-slate-600'}`}></div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{project.name}</div>
              <div className="text-xs text-slate-500 truncate font-mono">
                {project.apiKey.substring(0, 4)}...{project.apiKey.substring(project.apiKey.length - 4)}
              </div>
            </div>
            
            <button
               onClick={(e) => {
                 e.stopPropagation();
                 onDeleteProject(project.id);
               }}
               className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all"
             >
               <Trash2 className="w-4 h-4" />
             </button>
          </div>
        ))}

        <div className="space-y-2 mt-4">
          <button
            onClick={onAddProject}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-slate-700 text-slate-500 hover:border-indigo-500 hover:text-indigo-400 hover:bg-slate-800/50 transition-all duration-200 group"
          >
            <div className="bg-slate-800 group-hover:bg-indigo-500/20 p-1 rounded-md transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Add Project</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-slate-700 text-slate-500 hover:border-emerald-500 hover:text-emerald-400 hover:bg-slate-800/50 transition-all duration-200 group"
          >
            <div className="bg-slate-800 group-hover:bg-emerald-500/20 p-1 rounded-md transition-colors">
              <Upload className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Import CSV</span>
          </button>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.txt"
          className="hidden" 
        />
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <div className="p-2 bg-slate-800 rounded-lg">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-200 font-medium">Dashboard</div>
            <div className="text-xs text-slate-500">v1.2.0 • React 18</div>
          </div>
        </div>
      </div>
    </div>
  );
};