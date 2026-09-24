import { uploadImage } from '../config/cloudinary.js';

// This function validates and uploads one authenticated project image to Cloudinary.
export async function uploadProjectImage(request, response) {
  if (!request.file) return response.status(400).json({ message: 'No image file was provided.' });
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return response.status(503).json({ message: 'Cloudinary is not configured on the server.' });

  const imageUrl = await uploadImage(request.file.buffer, request.file.originalname);
  return response.status(201).json({ url: imageUrl });
}
