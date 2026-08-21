import express from 'express';
const router = express.Router();
import * as productController from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import * as uploadMiddleware from '../middlewares/upload.middleware.js';

// Public catalog endpoints (no auth required - anyone can browse products)
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin product endpoints (auth required)
router.post('/', uploadMiddleware.uploadMultiple('images'), productController.createProduct);
router.put('/:id', uploadMiddleware.uploadMultiple('images'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
