export interface Project {
  id: string;
  name: string;
  apiKey: string;
  createdAt: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  rpmLimitFree: number;
  rpmLimitPaid: number;
  tpmLimitFree: number;
  tpmLimitPaid: number;
  rpdLimitFree: number;
  rpdLimitPaid: number | 'Unlimited';
  type: 'text' | 'image' | 'video' | 'audio';
}

export interface ModelUsageStats {
  modelId: string;
  projectId: string;
  latencyMs: number | null;
  status: 'online' | 'offline' | 'checking' | 'unknown';
  requestsInSession: number;
  tokensInSession: number;
  lastCheck: number;
}

export interface GlobalStats {
  totalRequests: number;
  totalTokens: number;
  avgLatency: number;
}