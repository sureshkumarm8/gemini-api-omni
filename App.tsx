import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ModelCard } from './components/ModelCard';
import { ProjectMatrix } from './components/ProjectMatrix';
import { AddProjectModal } from './components/AddProjectModal';
import { Project, ModelUsageStats } from './types';
import { CORE_MODELS, MOCK_PROJECTS_KEY } from './constants';
import { checkModelConnection } from './services/geminiService';
import { Search, Info, ExternalLink, Table as TableIcon, Activity } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  // Default to matrix view for "Tabular view" preference
  const [viewMode, setViewMode] = useState<'detail' | 'matrix'>('matrix');
  const [stats, setStats] = useState<Record<string, ModelUsageStats>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  // checkingModels now stores "projectId-modelId" strings to track individual cell loading states
  const [checkingModels, setCheckingModels] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Load projects on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem(MOCK_PROJECTS_KEY);
    const initialProjects: Project[] = savedProjects ? JSON.parse(savedProjects) : [];
    setProjects(initialProjects);
    if (initialProjects.length > 0 && !activeProjectId) {
      setActiveProjectId(initialProjects[0].id);
    }
  }, []); // Only run on mount

  // Persist projects
  useEffect(() => {
    localStorage.setItem(MOCK_PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = (name: string, apiKey: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      apiKey,
      createdAt: Date.now(),
    };
    setProjects(prev => [...prev, newProject]);
    if (viewMode === 'detail') {
      setActiveProjectId(newProject.id);
    }
  };
  
  const handleImportProjects = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/);
      const newProjects: Project[] = [];
      let successCount = 0;

      lines.forEach(line => {
        if (!line.trim()) return;

        // Determine delimiter: supports "Name:Key", "Name,Key", "Name;Key"
        let parts: string[] = [];
        if (line.includes(':')) {
           parts = line.split(':');
        } else if (line.includes(',')) {
           parts = line.split(',');
        } else if (line.includes(';')) {
           parts = line.split(';');
        } else {
           // Fallback to tab or space if simple 2 columns
           parts = line.split(/\t/);
        }

        if (parts.length >= 2) {
          const name = parts[0].trim();
          const apiKey = parts.slice(1).join('').trim();

          // Basic validation
          if (name.toLowerCase().includes('name') && apiKey.toLowerCase().includes('key')) return;
          if (apiKey.length < 10) return;

          newProjects.push({
            id: crypto.randomUUID(),
            name: name || `Project ${Date.now()}`,
            apiKey: apiKey,
            createdAt: Date.now()
          });
          successCount++;
        }
      });

      if (successCount > 0) {
        setProjects(prev => [...prev, ...newProjects]);
        // If no active project, select the first imported one
        if (!activeProjectId && newProjects.length > 0) {
           setActiveProjectId(newProjects[0].id);
        }
        alert(`Successfully imported ${successCount} projects.`);
      } else {
        alert('No valid projects found. Please use a text/CSV file with "Project Name : API Key" format.');
      }

    } catch (error) {
      console.error('Import failed', error);
      alert('Failed to read the file.');
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(projects.find(p => p.id !== id)?.id || null);
    }
  };

  const checkModel = async (modelId: string, projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Key used for checking state and stats map
    const compositeKey = `${projectId}-${modelId}`;

    setCheckingModels(prev => new Set(prev).add(compositeKey));
    
    const result = await checkModelConnection(project.apiKey, modelId, project.id);
    
    setStats(prev => {
      const existing: ModelUsageStats = prev[compositeKey] || { 
        modelId, 
        projectId: projectId, 
        requestsInSession: 0, 
        tokensInSession: 0,
        latencyMs: null,
        status: 'unknown',
        lastCheck: 0
      };

      return {
        ...prev,
        [compositeKey]: {
          ...existing,
          ...result,
          lastCheck: Date.now(),
          requestsInSession: existing.requestsInSession + 1,
        }
      };
    });

    setCheckingModels(prev => {
      const next = new Set(prev);
      next.delete(compositeKey);
      return next;
    });
  };

  const handleGlobalCheck = () => {
      if (viewMode === 'detail' && activeProjectId) {
         CORE_MODELS.forEach(model => checkModel(model.id, activeProjectId));
      } else if (viewMode === 'matrix') {
         // In matrix mode, check ALL projects for ALL models as requested
         projects.forEach(p => {
             CORE_MODELS.forEach(m => checkModel(m.id, p.id));
         });
      }
  };

  const filteredModels = CORE_MODELS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProject = projects.find(p => p.id === activeProjectId);

  // Stats aggregation for Detail View
  const projectStats = Object.values(stats).filter(s => s.projectId === activeProjectId);
  const totalLatency = projectStats.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0);
  const onlineCount = projectStats.filter(s => s.status === 'online').length;
  const avgLatency = projectStats.length ? Math.round(totalLatency / projectStats.length) : 0;
  const totalSessionRequests = projectStats.reduce((acc, curr) => acc + curr.requestsInSession, 0);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        viewMode={viewMode}
        onSelectProject={setActiveProjectId}
        onAddProject={() => setIsModalOpen(true)}
        onImportProjects={handleImportProjects}
        onDeleteProject={handleDeleteProject}
        onChangeViewMode={setViewMode}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
             {viewMode === 'detail' ? (
                <>
                    <h2 className="font-semibold text-lg text-white">
                    {activeProject ? activeProject.name : 'Select a Project'}
                    </h2>
                </>
             ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-indigo-500/10 rounded-md">
                        <TableIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="font-semibold text-lg text-white">Global Matrix View</h2>
                  </div>
                  <button 
                    onClick={handleGlobalCheck}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Activity className="w-3 h-3" /> Check All Projects
                  </button>
                </div>
             )}
          </div>

          <div className="flex items-center gap-6">
             <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter models..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
                />
             </div>
             <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <ExternalLink className="w-5 h-5" />
             </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
           
           {/* DETAIL VIEW RENDER */}
           {viewMode === 'detail' && activeProject && (
             <>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                 <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                   <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Status</div>
                   <div className="text-2xl font-bold text-white flex items-center gap-2">
                     {onlineCount} <span className="text-slate-500 text-sm font-normal">/ {CORE_MODELS.length} Online</span>
                   </div>
                 </div>
                 <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                   <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Avg Latency</div>
                   <div className="text-2xl font-bold text-white">
                     {avgLatency}<span className="text-sm font-normal text-slate-500">ms</span>
                   </div>
                 </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                   <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Session Requests</div>
                   <div className="text-2xl font-bold text-emerald-400">
                     {totalSessionRequests}
                   </div>
                 </div>
                 <button 
                  onClick={handleGlobalCheck}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center font-medium transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
                 >
                   Run Global Health Check
                 </button>
               </div>
               
               <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
                  <Info className="w-4 h-4" />
                  <span>Showing session-based usage. Real-time API quota limits are enforced by Google Cloud.</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                 {filteredModels.map(model => (
                   <ModelCard
                     key={model.id}
                     config={model}
                     stats={stats[`${activeProject.id}-${model.id}`]}
                     onCheck={() => checkModel(model.id, activeProject.id)}
                     isChecking={checkingModels.has(`${activeProject.id}-${model.id}`)}
                   />
                 ))}
               </div>
             </>
           )}

           {/* DETAIL VIEW EMPTY STATE */}
           {viewMode === 'detail' && !activeProject && (
             <div className="flex flex-col items-center justify-center h-full text-slate-500">
               <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                 <Search className="w-8 h-8 opacity-50" />
               </div>
               <p>Select or create a project to view metrics</p>
             </div>
           )}

           {/* MATRIX VIEW RENDER */}
           {viewMode === 'matrix' && (
              <ProjectMatrix 
                 projects={projects}
                 models={filteredModels}
                 stats={stats}
                 checkingModels={checkingModels}
                 onCheckModel={checkModel}
                 onRunAll={handleGlobalCheck}
              />
           )}
        </main>
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProject}
      />
    </div>
  );
};

export default App;