// src/services/storage.service.js
import { v2 as cloudinary } from 'cloudinary';
import { safeUnlink } from '../utils/file.utils.js';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload local file to Cloudinary and delete local copy.
 * Returns secure_url.
 */
export async function uploadToCloudinary(localFilePath) {
  try {
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'resumes_ai'
    });
    await safeUnlink(localFilePath);
    return res.secure_url || res.url;
  } catch (err) {
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
}
