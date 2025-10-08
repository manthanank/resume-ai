// src/models/Resume.js
import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  filename: String,
  fileUrl: String,
  extractedText: String,
  questions: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Resume', ResumeSchema);
