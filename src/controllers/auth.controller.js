const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');
const jwt = require('jsonwebtoken');

exports.sendOtp = async (req, res, next) => {
  try {
    const { mobile, name } = req.body;
    if (!mobile) {
      return ApiResponse.error(res, 400, "Mobile number is required");
    }

    const result = await authService.sendOtp(mobile, name);
    return ApiResponse.success(res, 200, `Verification code sent to ${mobile}`, result);
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { mobile, name, code } = req.body;
    if (!mobile || !code) {
      return ApiResponse.error(res, 400, "Mobile number and verification code are required");
    }

    const user = await authService.verifyOtp(mobile, name, code);
    
    const token = jwt.sign(
      { userId: user._id, mobile: user.mobile, role: user.role },
      process.env.JWT_SECRET || 'mysecretkey123',
      { expiresIn: '30d' }
    );

    return ApiResponse.success(res, 200, "OTP verified successfully", { token, user });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await authService.getUserProfile(userId);
    return ApiResponse.success(res, 200, "User profile retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await authService.updateUserProfile(userId, req.body);
    return ApiResponse.success(res, 200, "User profile updated successfully", user);
  } catch (error) {
    next(error);
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addresses = await authService.getUserAddresses(userId);
    return ApiResponse.success(res, 200, "Addresses retrieved successfully", addresses);
  } catch (error) {
    next(error);
  }
};

exports.createAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const address = await authService.createUserAddress(userId, req.body);
    return ApiResponse.success(res, 201, "Address created successfully", address);
  } catch (error) {
    next(error);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;
    const address = await authService.updateUserAddress(userId, addressId, req.body);
    return ApiResponse.success(res, 200, "Address updated successfully", address);
  } catch (error) {
    next(error);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;
    const result = await authService.deleteUserAddress(userId, addressId);
    return ApiResponse.success(res, 200, "Address deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    return ApiResponse.success(res, 200, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};
