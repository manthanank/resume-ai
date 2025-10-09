export interface ReviewInterface {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  improvement: string;
}

export interface ResumeInterface {
  _id: string;
  filename: string;
  fileUrl: string;
  extractedText: string;
  questions: string[];
  createdAt: string;
}

export interface InterviewSessionInterface {
  _id: string;
  resumeId: string;
  questions: string[];
  answers: string[];
  reviews: ReviewInterface[];
  overallScore: number | null;
  createdAt: string;
}

export interface UploadResponseInterface {
  success: boolean;
  sessionId: string;
  resumeId: string;
  currentQuestion: string;
  currentIndex: number;
  remaining: number;
}

export interface AnswerResponseInterface {
  success: boolean;
  nextQuestion?: string;
  currentIndex?: number;
  remaining?: number;
  message?: string;
  overallScore?: number;
  reviews?: ReviewInterface[];
}

export interface ApiErrorInterface {
  error: string;
}

export interface ResultsData {
  sessionId: string;
  overallScore: number;
  reviews: ReviewInterface[];
}
