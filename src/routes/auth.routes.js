import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

// Public auth endpoints
router.post('/admin/login', authController.adminLogin);
router.post('/otp/send', authController.sendOtp);

router.post('/otp/verify', authController.verifyOtp);

// Authenticated user endpoints
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

// Addresses CRUD endpoints
router.get('/addresses', authMiddleware, authController.getAddresses);
router.post('/addresses', authMiddleware, authController.createAddress);
router.put('/addresses/:id', authMiddleware, authController.updateAddress);
router.delete('/addresses/:id', authMiddleware, authController.deleteAddress);

// Logout endpoint
router.post('/logout', authMiddleware, authController.logout);

export default router;
