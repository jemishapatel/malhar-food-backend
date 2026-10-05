import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/order.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import optionalAuthMiddleware from '../middlewares/optionalAuth.middleware.js';

// Public/Guest & Authenticated Order placement
router.get('/check-postcode/:postcode', orderController.checkPostcode);
router.post('/serviceable-postcodes', orderController.addServiceablePostcode);
router.post('/', optionalAuthMiddleware, orderController.placeOrder);
router.post('/address', optionalAuthMiddleware, orderController.saveAddress);
router.put('/:id/address', optionalAuthMiddleware, orderController.updateAddress);

// Customer order history
router.get('/my-orders', authMiddleware, orderController.getMyOrders);

// Admin stats & profile details (registered under /api/orders/admin/...)
router.get('/admin/stats', authMiddleware, orderController.getAdminStats);
router.get('/admin/customers', authMiddleware, orderController.getCustomersList);
router.get('/admin/customers/:mobile', authMiddleware, orderController.getCustomerDetailByMobile);
router.get('/admin', authMiddleware, orderController.getAllOrders);

// Individual order query & status update
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);

export default router;
