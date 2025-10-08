// src/services/ai.service.js
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * NOTE:
 * - The SDK and model names may change; if you get SDK errors update model name or SDK version.
 * - The code below attempts to parse JSON returned by the model; if parsing fails it falls back.
 */

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function tryParseJSON(raw) {
  try {
    const first = raw.indexOf('{');
    const last = raw.lastIndexOf('}');
    const jsonStr = first >= 0 && last > first ? raw.slice(first, last + 1) : raw;
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

function extractTextFromResponse(resp) {
  // Try multiple possible fields the SDK might return
  if (!resp) return '';
  if (typeof resp === 'string') return resp;
  if (resp?.text) return resp.text;
  if (Array.isArray(resp?.candidates) && resp.candidates[0]?.content?.[0]?.text) {
    return resp.candidates[0].content[0].text;
  }
  if (Array.isArray(resp?.output) && resp.output[0]?.content?.[0]?.text) {
    return resp.output[0].content[0].text;
  }
  return JSON.stringify(resp);
}

export async function generateQuestionsFromText(resumeText) {
  const prompt = `
You are an expert interviewer. Read the resume text below and generate 10 interview questions tailored to the candidate.
Return ONLY valid JSON in this exact shape:
{"questions": ["Question 1?", "Question 2?", ...]}

Resume:
"""${resumeText}"""
`;

  const resp = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  const raw = extractTextFromResponse(resp);
  const parsed = tryParseJSON(raw);
  if (parsed?.questions && Array.isArray(parsed.questions)) return parsed.questions;

  // fallback: lines that end with '?'
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const qs = lines.filter(l => l.endsWith('?')).slice(0, 12);
  if (qs.length >= 6) return qs;

  throw new Error('AI did not return parseable questions. Raw: ' + raw.slice(0, 500));
}

export async function reviewAnswers(questions = [], answers = [], resumeText = '') {
  const pairs = questions.map((q, i) => ({ question: q, answer: answers[i] || '' }));

  const prompt = `
You are an expert interviewer and teacher.

Given this resume context and the question/answer pairs, evaluate each answer. For each pair produce:
- score (integer 1 to 10)
- concise feedback explaining correctness and completeness
- one-line improvement suggestion

Return ONLY valid JSON with this exact shape:
{
  "reviews": [
    {
      "question": "...",
      "answer": "...",
      "score": 8,
      "feedback": "...",
      "improvement": "..."
    }
  ],
  "overallScore": 78
}

Resume (context):
"""${resumeText}"""

QuestionAnswerPairs:
${JSON.stringify(pairs, null, 2)}
`;

  const resp = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  const raw = extractTextFromResponse(resp);
  const parsed = tryParseJSON(raw);
  if (parsed?.reviews && Array.isArray(parsed.reviews) && typeof parsed.overallScore === 'number') {
    return parsed;
  }

  // Fallback: return raw as a single feedback blob (parsing failed)
  return {
    reviews: pairs.map(p => ({
      question: p.question,
      answer: p.answer,
      score: null,
      feedback: raw,
      improvement: ''
    })),
    overallScore: null,
    _raw: raw
  };
}
