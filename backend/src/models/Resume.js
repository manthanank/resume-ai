// src/models/Resume.js
import mongoose from 'mongoose';

const ImprovementSchema = new mongoose.Schema({
  category: String,
  title: String,
  description: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  examples: [String]
}, { _id: false });

const ATSCompatibilitySchema = new mongoose.Schema({
  score: Number,
  issues: [String],
  suggestions: [String]
}, { _id: false });

const StructureAnalysisSchema = new mongoose.Schema({
  sections: [String],
  missingSections: [String],
  recommendations: [String]
}, { _id: false });

const KeywordOptimizationSchema = new mongoose.Schema({
  currentKeywords: [String],
  suggestedKeywords: [String],
  industryKeywords: [String]
}, { _id: false });

const ResumeAnalysisSchema = new mongoose.Schema({
  overallScore: Number,
  strengths: [String],
  weaknesses: [String],
  improvements: [ImprovementSchema],
  atsCompatibility: ATSCompatibilitySchema,
  structureAnalysis: StructureAnalysisSchema,
  keywordOptimization: KeywordOptimizationSchema,
  formattingSuggestions: [String],
  analyzedAt: { type: Date, default: Date.now }
}, { _id: false });

const ResumeSchema = new mongoose.Schema({
  filename: String,
  fileUrl: String,
  extractedText: String,
  questions: [String],
  analysis: ResumeAnalysisSchema,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Resume', ResumeSchema);
