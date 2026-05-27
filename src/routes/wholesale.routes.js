const express = require('express');
const router = express.Router();
const wholesaleController = require('../controllers/wholesale.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public submit inquiry endpoint
router.post('/', wholesaleController.submitInquiry);

// Admin wholesale operations
router.get('/', authMiddleware, wholesaleController.getAllInquiries);
router.put('/:id/status', authMiddleware, wholesaleController.updateInquiryStatus);

module.exports = router;
