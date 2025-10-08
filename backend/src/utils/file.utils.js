// src/utils/file.utils.js
import fs from 'fs/promises';

export async function safeUnlink(p) {
  try {
    await fs.unlink(p);
  } catch (e) {
    // ignore
  }
}
