
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
  credibilityScore?: number; // 0-100
  sourceType?: 'news' | 'social' | 'official' | 'blog' | 'other';
}

export interface MediaAnalysis {
  isAIGenerated: boolean;
  probability: number;
  anomalies: string[];
}

export interface TrendingSignal {
  id: string;
  claim: string;
  source: string;
  reach: string;
  category: 'Social' | 'News' | 'Flash';
  intensity: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
}

export interface AuditResult {
  text: string;
  sources: GroundingChunk[];
  verdict: string;
  mediaAnalysis?: MediaAnalysis;
  timestamp: string;
}

export enum VerificationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
