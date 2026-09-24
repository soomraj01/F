import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'node:crypto';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// This function uploads an in-memory image directly to Cloudinary and returns its public URL.
export function uploadImage(buffer, originalName) {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream({
      folder: 'soom-raj-portfolio',
      resource_type: 'image',
      public_id: `${originalName.replace(/[^a-z0-9-_]/gi, '-').toLowerCase()}-${randomUUID()}`,
      overwrite: true,
    }, (error, result) => error ? reject(error) : resolve(result.secure_url));
    upload.end(buffer);
  });
}
