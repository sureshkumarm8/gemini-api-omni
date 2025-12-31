import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, key: string) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && key) {
      onAdd(name, key);
      setName('');
      setKey('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Add New Project</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex gap-3 text-indigo-300 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>
              Your API key is stored locally in your browser session and is used directly to communicate with Google's servers.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Marketing Bot"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-mono"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Connect Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};