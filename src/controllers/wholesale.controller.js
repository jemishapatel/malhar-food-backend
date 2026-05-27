const wholesaleService = require('../services/wholesale.service');
const ApiResponse = require('../utils/apiResponse');

exports.submitInquiry = async (req, res, next) => {
  try {
    const inquiry = await wholesaleService.createInquiry(req.body);
    return ApiResponse.success(res, 201, "Wholesale inquiry submitted successfully", inquiry);
  } catch (error) {
    next(error);
  }
};

exports.getAllInquiries = async (req, res, next) => {
  try {
    const inquiries = await wholesaleService.fetchAllInquiries();
    return ApiResponse.success(res, 200, "Wholesale inquiries retrieved successfully", inquiries);
  } catch (error) {
    next(error);
  }
};

exports.updateInquiryStatus = async (req, res, next) => {
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
