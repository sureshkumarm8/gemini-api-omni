import { ModelConfig } from './types';

export const CORE_MODELS: ModelConfig[] = [
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Next-gen multimodal model with superior performance.',
    rpmLimitFree: 10,
    rpmLimitPaid: 2000,
    tpmLimitFree: 1000000,
    tpmLimitPaid: 4000000,
    rpdLimitFree: 1500,
    rpdLimitPaid: 'Unlimited',
    type: 'text'
  },
  {
    id: 'gemini-2.0-flash-lite-preview-02-05',
    name: 'Gemini 2.0 Flash Lite',
    description: 'Optimized for cost-efficiency and low latency.',
    rpmLimitFree: 30,
    rpmLimitPaid: 2000,
    tpmLimitFree: 1000000,
    tpmLimitPaid: 4000000,
    rpdLimitFree: 1500,
    rpdLimitPaid: 'Unlimited',
    type: 'text'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast, cost-efficient multimodal model.',
    rpmLimitFree: 15,
    rpmLimitPaid: 2000,
    tpmLimitFree: 1000000,
    tpmLimitPaid: 4000000,
    rpdLimitFree: 1500,
    rpdLimitPaid: 'Unlimited',
    type: 'text'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Mid-size multimodal model for complex tasks.',
    rpmLimitFree: 2,
    rpmLimitPaid: 360,
    tpmLimitFree: 32000,
    tpmLimitPaid: 2000000,
    rpdLimitFree: 50,
    rpdLimitPaid: 'Unlimited',
    type: 'text'
  },
  {
    id: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash-8B',
    description: 'High volume, low intelligence tasks.',
    rpmLimitFree: 15,
    rpmLimitPaid: 4000,
    tpmLimitFree: 1000000,
    tpmLimitPaid: 4000000,
    rpdLimitFree: 1500,
    rpdLimitPaid: 'Unlimited',
    type: 'text'
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3.0 Flash',
    description: 'Experimental next-gen flash model.',
    rpmLimitFree: 15,
    rpmLimitPaid: 1000,
    tpmLimitFree: 1000000,
    tpmLimitPaid: 4000000,
    rpdLimitFree: 1500,
    rpdLimitPaid: 'Unlimited', // Assuming similar to others
    type: 'text'
  },
   {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3.0 Pro',
    description: 'Experimental next-gen pro model.',
    rpmLimitFree: 2,
    rpmLimitPaid: 360,
    tpmLimitFree: 32000,
    tpmLimitPaid: 2000000,
    rpdLimitFree: 50,
    rpdLimitPaid: 'Unlimited',
    type: 'text'
  }
];

export const MOCK_PROJECTS_KEY = 'gemini-omni-view-projects';