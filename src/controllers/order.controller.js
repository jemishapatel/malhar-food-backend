import * as orderService from '../services/order.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const placeOrder = async (req, res, next) => {
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

export const saveAddress = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.user ? req.user._id : null
    };
    const order = await orderService.createDraftOrder(orderData);
    return ApiResponse.success(res, 201, "Draft order address saved successfully", order);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addressData = {
      ...req.body,
      userId: req.user ? req.user._id : null
    };
    const order = await orderService.updateDraftAddress(id, addressData);
    return ApiResponse.success(res, 200, "Draft order address updated successfully", order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
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

export const checkPostcode = async (req, res, next) => {
  try {
    const { postcode } = req.params;
    const result = await orderService.validatePostcodeServiceability(postcode);
    return ApiResponse.success(res, 200, "Postcode checked", result);
  } catch (error) {
    next(error);
  }
};

export const addServiceablePostcode = async (req, res, next) => {
  try {
    console.log("========== SERVICEABLE POSTCODE API HIT ==========");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Body:", req.body);

    const newArea = await orderService.addServiceablePostcode(req.body);

    console.log("========== SERVICEABLE POSTCODE RESULT ==========");
    console.log("Result:", newArea);

    return ApiResponse.success(
      res,
      201,
      "Serviceable postcode added successfully",
      newArea
    );
  } catch (error) {
    console.error("========== SERVICEABLE POSTCODE ERROR ==========");
    console.error(error);

    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.fetchOrderById(id);
    return ApiResponse.success(res, 200, "Order details retrieved successfully", order);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    // In production, check req.user.role === 'admin'
    const orders = await orderService.fetchAllOrders();
    return ApiResponse.success(res, 200, "All orders retrieved successfully", orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
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

export const getAdminStats = async (req, res, next) => {
  try {
    const stats = await orderService.getAdminStats();
    return ApiResponse.success(res, 200, "Admin stats metrics compiled successfully", stats);
  } catch (error) {
    next(error);
  }
};

export const getCustomersList = async (req, res, next) => {
  try {
    const customers = await orderService.fetchCustomersList();
    return ApiResponse.success(res, 200, "Customer list compiled successfully", customers);
  } catch (error) {
    next(error);
  }
};

export const getCustomerDetailByMobile = async (req, res, next) => {
  try {
    const { mobile } = req.params;
    const detail = await orderService.fetchCustomerDetailByMobile(mobile);
    return ApiResponse.success(res, 200, "Customer details compiled successfully", detail);
  } catch (error) {
    next(error);
  }
};
