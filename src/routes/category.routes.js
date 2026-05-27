const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// Public category endpoints
router.get('/', categoryController.getAllCategories);

// Admin category endpoints
router.post('/', authMiddleware, uploadMiddleware.uploadSingle('image'), categoryController.createCategory);
router.put('/:id', authMiddleware, uploadMiddleware.uploadSingle('image'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;
