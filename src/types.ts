export interface ResumeAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  atsOptimization: {
    tip: string;
    details: string;
  }[];
  suggestedSkills: string[];
  betterDescriptions: {
    original: string;
    suggested: string;
    reason: string;
  }[];
}

export interface ReviewRequest {
  resumeText: string;
}

export interface ResumeVersion {
  id: string;
  userId: string;
  fileName: string;
  resumeText: string;
  analysis: ResumeAnalysis;
  targetJob?: string;
  createdAt: any;
}
