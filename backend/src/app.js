// src/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import interviewRoutes from './routes/interview.routes.js';

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many requests, please slow down.'
}));

app.use('/api', interviewRoutes);

app.get('/', (req, res) => res.json({
  message: 'Resume-AI Backend (Gemini + Cloudinary)',
  status: 'running',
  timestamp: new Date().toISOString()
}));

app.get('/health', (req, res) => res.json({
  status: 'healthy',
  timestamp: new Date().toISOString()
}));

export default app;
