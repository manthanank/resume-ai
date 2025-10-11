// src/routes/interview.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractText } from '../services/extractText.service.js';
import { uploadToCloudinary } from '../services/storage.service.js';
import { generateQuestionsFromText, reviewAnswers, analyzeResume } from '../services/ai.service.js';
import Resume from '../models/Resume.js';
import InterviewSession from '../models/InterviewSession.js';
import { safeUnlink } from '../utils/file.utils.js';

const router = express.Router();
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// ensure uploads dir exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024) },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

/**
 * Upload resume -> extract -> generate questions -> create interview session
 * POST /api/upload
 */
router.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Resume file (.pdf or .docx) is required.' });

  const localPath = req.file.path;
  try {
    const text = await extractText(localPath);
    const questions = await generateQuestionsFromText(text);
    const fileUrl = await uploadToCloudinary(localPath);

    const resumeDoc = await Resume.create({
      filename: req.file.originalname,
      fileUrl,
      extractedText: text,
      questions
    });

    const session = await InterviewSession.create({
      resumeId: resumeDoc._id,
      questions,
      answers: [],
      reviews: []
    });

    return res.json({
      success: true,
      sessionId: session._id.toString(),
      resumeId: resumeDoc._id.toString(),
      currentQuestion: questions[0],
      currentIndex: 0,
      remaining: questions.length - 1
    });
  } catch (err) {
    await safeUnlink(localPath);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

/**
 * Answer a question -> save -> return next question OR review all if last
 * POST /api/interview/answer
 * body: { sessionId, answer }
 */
router.post('/interview/answer', async (req, res) => {
  try {
    const { sessionId, answer } = req.body;
    if (!sessionId || (typeof answer !== 'string')) {
      return res.status(400).json({ error: 'sessionId and answer (string) are required' });
    }

    const session = await InterviewSession.findById(sessionId).populate('resumeId');
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const currentIndex = session.answers.length;
    session.answers.push(answer);
    await session.save();

    const nextIndex = currentIndex + 1;
    if (nextIndex < session.questions.length) {
      return res.json({
        success: true,
        nextQuestion: session.questions[nextIndex],
        currentIndex: nextIndex,
        remaining: session.questions.length - nextIndex - 1
      });
    }

    // All answered -> call AI for review
    const resumeText = session.resumeId?.extractedText || '';
    const aiResult = await reviewAnswers(session.questions, session.answers, resumeText);

    session.reviews = aiResult.reviews || [];
    session.overallScore = aiResult.overallScore ?? null;
    await session.save();

    return res.json({
      success: true,
      message: 'Interview complete',
      overallScore: aiResult.overallScore,
      reviews: aiResult.reviews
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

/**
 * Analyze resume -> provide detailed feedback and suggestions
 * POST /api/resume/analyze
 * body: { resumeId }
 */
router.post('/resume/analyze', async (req, res) => {
  try {
    const { resumeId } = req.body;
    if (!resumeId) {
      return res.status(400).json({ error: 'resumeId is required' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Check if analysis already exists
    if (resume.analysis) {
      return res.json({
        success: true,
        analysis: resume.analysis
      });
    }

    // Perform AI analysis
    const analysis = await analyzeResume(resume.extractedText);

    // Update resume with analysis
    resume.analysis = analysis;
    await resume.save();

    return res.json({
      success: true,
      resumeId: resume._id,
      analysis
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

/**
 * Get resume analysis (if exists)
 * GET /api/resume/:id/analysis
 */
router.get('/resume/:id/analysis', async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!resume.analysis) {
      // Auto-trigger analysis if it doesn't exist
      try {
        const analysis = await analyzeResume(resume.extractedText);
        resume.analysis = analysis;
        await resume.save();

        return res.json({
          success: true,
          resumeId: resume._id,
          analysis
        });
      } catch (analysisError) {
        return res.status(500).json({
          error: 'Failed to analyze resume: ' + (analysisError.message || 'Unknown error')
        });
      }
    }

    return res.json({
      success: true,
      resumeId: resume._id,
      analysis: resume.analysis
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

export default router;
