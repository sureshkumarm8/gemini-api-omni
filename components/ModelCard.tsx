import React from 'react';
import { ModelConfig, ModelUsageStats } from '../types';
import { Activity, Zap, Clock, ShieldAlert, BarChart3, Image as ImageIcon, Mic, Video } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

interface ModelCardProps {
  config: ModelConfig;
  stats?: ModelUsageStats;
  onCheck: () => void;
  isChecking: boolean;
}

export const ModelCard: React.FC<ModelCardProps> = ({ config, stats, onCheck, isChecking }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'offline': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'checking': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-slate-400 bg-slate-800/50 border-slate-700';
    }
  };

  const getIcon = () => {
      switch(config.type) {
          case 'image': return <ImageIcon className="w-5 h-5" />;
          case 'video': return <Video className="w-5 h-5" />;
          case 'audio': return <Mic className="w-5 h-5" />;
          default: return <Zap className="w-5 h-5" />;
      }
  }

  // Mock data for the tiny chart
  const usageData = [
    { name: 'S', val: 0 },
    { name: 'M', val: Math.random() * 20 },
    { name: 'T', val: Math.random() * 40 },
    { name: 'W', val: Math.random() * 30 },
    { name: 'T', val: Math.random() * 60 },
    { name: 'F', val: stats?.requestsInSession ? stats.requestsInSession * 5 : 10 },
    { name: 'S', val: stats?.requestsInSession || 0 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-300 shadow-lg group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg bg-slate-800 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 leading-tight">{config.name}</h3>
            <span className="text-xs text-slate-500 font-mono">{config.id.split('-').slice(0, 2).join('-')}...</span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium border capitalize flex items-center gap-1.5 ${getStatusColor(stats?.status)}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${stats?.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-current'}`}></div>
          {stats?.status || 'Unknown'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Latency
          </div>
          <div className="text-lg font-mono font-medium text-slate-200">
            {stats?.latencyMs ? `${stats.latencyMs}ms` : '--'}
          </div>
        </div>
        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Session Req
          </div>
          <div className="text-lg font-mono font-medium text-slate-200">
             {stats?.requestsInSession || 0}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex justify-between text-xs">
           <span className="text-slate-500">Free RPM / RPD</span>
           <span className="text-slate-300 font-mono">{config.rpmLimitFree} / {config.rpdLimitFree}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
             className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
             style={{ width: `${Math.min(((stats?.requestsInSession || 0) / config.rpmLimitFree) * 100, 100)}%` }}
          />
        </div>
         <div className="flex justify-between text-xs">
           <span className="text-slate-500">Paid RPM / RPD</span>
           <span className="text-slate-300 font-mono">{config.rpmLimitPaid} / {config.rpdLimitPaid}</span>
        </div>
      </div>
      
      {/* Mini usage chart */}
      <div className="h-16 mb-4 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={usageData}>
             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px'}} itemStyle={{color: '#94a3b8'}} />
            <Bar dataKey="val" fill="#6366f1" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button 
        onClick={onCheck}
        disabled={isChecking}
        className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isChecking ? (
          <>
             <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
             Checking...
          </>
        ) : (
          <>
            <Activity className="w-4 h-4" />
            Test Availability
          </>
        )}
      </button>
    </div>
  );
};