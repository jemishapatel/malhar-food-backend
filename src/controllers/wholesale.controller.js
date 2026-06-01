import * as wholesaleService from '../services/wholesale.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const submitInquiry = async (req, res, next) => {
  try {
    const inquiry = await wholesaleService.createInquiry(req.body);
    return ApiResponse.success(res, 201, "Wholesale inquiry submitted successfully", inquiry);
  } catch (error) {
    next(error);
  }
};

export const getAllInquiries = async (req, res, next) => {
  try {
    const inquiries = await wholesaleService.fetchAllInquiries();
    return ApiResponse.success(res, 200, "Wholesale inquiries retrieved successfully", inquiries);
  } catch (error) {
    next(error);
  }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return ApiResponse.error(res, 400, "Status parameter is required");
    }
    const inquiry = await wholesaleService.updateInquiryStatus(id, status);
    return ApiResponse.success(res, 200, `Inquiry status updated to ${status} successfully`, inquiry);
  } catch (error) {
    next(error);
  }
};
