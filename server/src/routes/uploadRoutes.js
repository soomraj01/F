import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/auth.js';
import { uploadProjectImage } from '../controllers/uploadController.js';

const router = Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_request, file, callback) => callback(null, file.mimetype.startsWith('image/')) });

router.post('/image', requireAdmin, upload.single('image'), uploadProjectImage);

export default router;
