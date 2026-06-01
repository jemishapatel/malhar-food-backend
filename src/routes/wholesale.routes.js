import express from 'express';
const router = express.Router();
import * as wholesaleController from '../controllers/wholesale.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

// Public submit inquiry endpoint (no auth required - anyone can submit a wholesale inquiry)
router.post('/', wholesaleController.submitInquiry);

// Admin wholesale operations (auth required)
router.get('/', authMiddleware, wholesaleController.getAllInquiries);
router.put('/:id/status', authMiddleware, wholesaleController.updateInquiryStatus);

export default router;
