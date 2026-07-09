import Stripe from 'stripe';
import ApiResponse from '../utils/apiResponse.js';
import Order from '../models/Order.js';

// Lazily instantiate Stripe so missing env in test/import contexts doesn't crash
let _stripe = null;
const getStripe = () => {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
};

/**
 * POST /api/payments/create-payment-intent
 * Creates a Stripe PaymentIntent for the given amount (in GBP pence).
 * Body: { amount: number (pence), currency?: string, orderId?: string }
 */
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'gbp', orderId } = req.body;

    if (!amount || amount <= 0) {
      return ApiResponse.error(res, 400, 'A valid amount in pence is required');
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(amount), // amount in smallest currency unit (pence)
      currency,
      metadata: {
        orderId: orderId || '',
        source: 'malharfood-web',
      },
      automatic_payment_methods: { enabled: true },
    });

    return ApiResponse.success(res, 200, 'Payment intent created', {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/confirm
 * Called after Stripe confirms payment on the frontend.
 * Updates the order paymentStatus and paymentIntentId.
 * Body: { orderId: string, paymentIntentId: string }
 */
export const confirmPayment = async (req, res, next) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    if (!orderId || !paymentIntentId) {
      return ApiResponse.error(res, 400, 'orderId and paymentIntentId are required');
    }

    // Verify with Stripe that the payment actually succeeded
    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return ApiResponse.error(res, 400, `Payment not yet succeeded. Status: ${paymentIntent.status}`);
    }

    // Update the order record
    const query = orderId.startsWith('ORD-') ? { orderId } : { _id: orderId };
    const order = await Order.findOneAndUpdate(
      query,
      { paymentIntentId, paymentStatus: 'paid', paymentMethod: 'stripe' },
      { new: true }
    );

    if (!order) {
      return ApiResponse.error(res, 404, 'Order not found');
    }

    return ApiResponse.success(res, 200, 'Payment confirmed and order updated', order);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/webhook
 * Stripe webhook handler for server-side payment events.
 * Register this endpoint in your Stripe dashboard.
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        const query = orderId.startsWith('ORD-') ? { orderId } : { _id: orderId };
        await Order.findOneAndUpdate(query, {
          paymentIntentId: paymentIntent.id,
          paymentStatus: 'paid',
          paymentMethod: 'stripe',
        });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        const query = orderId.startsWith('ORD-') ? { orderId } : { _id: orderId };
        await Order.findOneAndUpdate(query, { paymentStatus: 'failed' });
      }
      break;
    }
    default:
      // Unhandled event type — ignore
      break;
  }

  res.json({ received: true });
};
