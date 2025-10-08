// src/services/extractText.service.js
import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath);
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return (data.text || '').trim();
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return (result.value || '').trim();
  }

  throw new Error('Unsupported file type. Only .pdf and .docx are supported.');
}
