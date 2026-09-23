import { Router } from 'express';
import { currentAdmin, logout, requestOtp, verifyOtp } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', requireAdmin, currentAdmin);
router.post('/logout', logout);

export default router;
