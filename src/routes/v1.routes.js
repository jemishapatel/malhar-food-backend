import express from 'express';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

/**
 * Versioned v1 routes
 * POST /api/v1/serviceable-postcodes
 * GET  /api/v1/serviceable-postcodes/:postcode
 */
router.post('/serviceable-postcodes', orderController.addServiceablePostcode);
router.get('/serviceable-postcodes/:postcode', orderController.checkPostcode);

export default router;
