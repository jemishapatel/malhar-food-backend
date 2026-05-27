const orderService = require('../services/order.service');
const ApiResponse = require('../utils/apiResponse');

exports.placeOrder = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.user ? req.user._id : null
    };
    const order = await orderService.createOrder(orderData);
    return ApiResponse.success(res, 201, "Order placed successfully", order);
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const mobile = req.user ? req.user.mobile : req.query.mobile;
    if (!mobile) {
      return ApiResponse.error(res, 400, "Mobile number is required to fetch orders");
    }
    const orders = await orderService.fetchMyOrders(mobile);
    return ApiResponse.success(res, 200, "Order history retrieved successfully", orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.fetchOrderById(id);
    return ApiResponse.success(res, 200, "Order details retrieved successfully", order);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    // In production, check req.user.role === 'admin'
    const orders = await orderService.fetchAllOrders();
    return ApiResponse.success(res, 200, "All orders retrieved successfully", orders);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return ApiResponse.error(res, 400, "Status is required");
    }
    const order = await orderService.updateOrderStatus(id, status);
    return ApiResponse.success(res, 200, `Order status updated to ${status} successfully`, order);
  } catch (error) {
    next(error);
  }
};

exports.getAdminStats = async (req, res, next) => {
  try {
    const stats = await orderService.getAdminStats();
    return ApiResponse.success(res, 200, "Admin stats metrics compiled successfully", stats);
  } catch (error) {
    next(error);
  }
};

exports.getCustomersList = async (req, res, next) => {
  try {
    const customers = await orderService.fetchCustomersList();
    return ApiResponse.success(res, 200, "Customer list compiled successfully", customers);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerDetailByMobile = async (req, res, next) => {
  try {
    const { mobile } = req.params;
    const detail = await orderService.fetchCustomerDetailByMobile(mobile);
    return ApiResponse.success(res, 200, "Customer details compiled successfully", detail);
  } catch (error) {
    next(error);
  }
};
