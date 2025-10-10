export interface ResumeImprovement {
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  examples: string[];
}

export interface ATSCompatibility {
  score: number;
  issues: string[];
  suggestions: string[];
}

export interface StructureAnalysis {
  sections: string[];
  missingSections: string[];
  recommendations: string[];
}

export interface KeywordOptimization {
  currentKeywords: string[];
  suggestedKeywords: string[];
  industryKeywords: string[];
}

export interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  improvements: ResumeImprovement[];
  atsCompatibility: ATSCompatibility;
  structureAnalysis: StructureAnalysis;
  keywordOptimization: KeywordOptimization;
  formattingSuggestions: string[];
  analyzedAt?: Date;
}

export interface AnalysisResponse {
  success: boolean;
  resumeId: string;
  analysis: ResumeAnalysis;
}
