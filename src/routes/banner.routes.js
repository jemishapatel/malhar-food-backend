const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// Public — homepage fetches active banners
router.get('/', bannerController.getActiveBanners);

// Admin — full CRUD
router.get('/admin', authMiddleware, bannerController.getAllBanners);
router.post('/', authMiddleware, uploadMiddleware.uploadSingle('image'), bannerController.createBanner);
router.put('/:id', authMiddleware, uploadMiddleware.uploadSingle('image'), bannerController.updateBanner);
router.delete('/:id', authMiddleware, bannerController.deleteBanner);

module.exports = router;
