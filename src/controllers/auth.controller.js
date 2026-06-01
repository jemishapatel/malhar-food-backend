import * as authService from '../services/auth.service.js';
import ApiResponse from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const sendOtp = async (req, res, next) => {
  try {
    const { mobile, name, email, password, role, countryCode } = req.body;
    if (!mobile) {
      return ApiResponse.error(res, 400, "Mobile number is required");
    }

    const result = await authService.sendOtp(mobile, name, email, password, role, countryCode);
    return ApiResponse.success(res, 200, `Verification code sent to ${mobile}`, result);
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { mobile, name, code, email, password, role, countryCode } = req.body;
    if (!mobile || !code) {
      return ApiResponse.error(res, 400, "Mobile number and verification code are required");
    }

    const user = await authService.verifyOtp(mobile, name, code, email, password, role, countryCode);
    
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

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await authService.getUserProfile(userId);
    return ApiResponse.success(res, 200, "User profile retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await authService.updateUserProfile(userId, req.body);
    return ApiResponse.success(res, 200, "User profile updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addresses = await authService.getUserAddresses(userId);
    return ApiResponse.success(res, 200, "Addresses retrieved successfully", addresses);
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const address = await authService.createUserAddress(userId, req.body);
    return ApiResponse.success(res, 201, "Address created successfully", address);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;
    const address = await authService.updateUserAddress(userId, addressId, req.body);
    return ApiResponse.success(res, 200, "Address updated successfully", address);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;
    const result = await authService.deleteUserAddress(userId, addressId);
    return ApiResponse.success(res, 200, "Address deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    return ApiResponse.success(res, 200, "Logged out successfully");
  } catch (error) {
    next(error);
  }
}

// Admin login
export const adminLogin = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 400, 'Email and password are required');
    }

    const user = await authService.getUserByEmail(email);

    if (!user) {
      return ApiResponse.error(res, 401, 'Invalid credentials');
    }

    // Compare bcrypt password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return ApiResponse.error(res, 401, 'Invalid credentials');
    }

    if (user.role !== 'admin') {
      return ApiResponse.error(res, 403, 'Admin access required');
    }

    const token = jwt.sign(
      {
        userId: user._id,
        mobile: user.mobile,
        role: user.role
      },
      process.env.JWT_SECRET || 'mysecretkey123',
      { expiresIn: '30d' }
    );

    return ApiResponse.success(
      res,
      200,
      'Admin login successful',
      { token, user }
    );

  } catch (error) {
    next(error);
  }
};
