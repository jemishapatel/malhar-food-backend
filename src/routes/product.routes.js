const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// Public catalog endpoints
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin product endpoints (in real app, add role checking middleware)
router.post('/', authMiddleware, uploadMiddleware.uploadMultiple('images'), productController.createProduct);
router.put('/:id', authMiddleware, uploadMiddleware.uploadMultiple('images'), productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
