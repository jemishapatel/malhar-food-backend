import express from 'express';
const router = express.Router();
import * as categoryController from '../controllers/category.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import * as uploadMiddleware from '../middlewares/upload.middleware.js';

// Public category endpoints
router.get('/', categoryController.getAllCategories);

// Admin category endpoints
router.post('/', authMiddleware, uploadMiddleware.uploadSingle('image'), categoryController.createCategory);
router.put('/:id', authMiddleware, uploadMiddleware.uploadSingle('image'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

export default router;
