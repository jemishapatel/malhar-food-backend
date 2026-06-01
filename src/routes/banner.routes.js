import express from 'express';
const router = express.Router();
import * as bannerController from '../controllers/banner.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import * as uploadMiddleware from '../middlewares/upload.middleware.js';

// Public — homepage fetches active banners
router.get('/', bannerController.getActiveBanners);

// Admin — full CRUD
router.get('/admin', authMiddleware, bannerController.getAllBanners);
router.post('/', authMiddleware, uploadMiddleware.uploadSingle('image'), bannerController.createBanner);
router.put('/:id', authMiddleware, uploadMiddleware.uploadSingle('image'), bannerController.updateBanner);
router.delete('/:id', authMiddleware, bannerController.deleteBanner);

export default router;
