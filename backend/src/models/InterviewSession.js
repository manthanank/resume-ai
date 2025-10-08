// src/models/InterviewSession.js
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  question: String,
  answer: String,
  score: Number,
  feedback: String,
  improvement: String
}, { _id: false });

const SessionSchema = new mongoose.Schema({
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null },
  questions: [String],
  answers: [String],
  reviews: [ReviewSchema],
  overallScore: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('InterviewSession', SessionSchema);
