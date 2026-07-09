import express from 'express';
const router = express.Router();
import {
  createPaymentIntent,
  confirmPayment,
  stripeWebhook,
} from '../controllers/payment.controller.js';

/**
 * Stripe webhook requires raw body — must be registered BEFORE express.json()
 * We expose the raw-body route here and mount it specially in server.js
 */

// POST /api/payments/create-payment-intent  — Create a PaymentIntent
router.post('/create-payment-intent', createPaymentIntent);

// POST /api/payments/confirm  — Confirm & record payment after Stripe success
router.post('/confirm', confirmPayment);

// POST /api/payments/webhook  — Stripe webhook (raw body, see server.js)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
