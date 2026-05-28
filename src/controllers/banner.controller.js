const bannerService = require('../services/banner.service');
const ApiResponse = require('../utils/apiResponse');

// Public — homepage slider
exports.getActiveBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.fetchActiveBanners();
    return ApiResponse.success(res, 200, "Active banners retrieved successfully", banners);
  } catch (error) {
    next(error);
  }
};

// Admin — all banners
exports.getAllBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.fetchAllBanners();
    return ApiResponse.success(res, 200, "All banners retrieved successfully", banners);
  } catch (error) {
    next(error);
  }
};

// Admin — create
exports.createBanner = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    const banner = await bannerService.createBanner(req.body);
    return ApiResponse.success(res, 201, "Banner created successfully", banner);
  } catch (error) {
    next(error);
  }
};

// Admin — update
exports.updateBanner = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    } else if (req.body.existingImage) {
      req.body.image = req.body.existingImage;
    }
    delete req.body.existingImage;
    const { id } = req.params;
    const banner = await bannerService.updateBanner(id, req.body);
    return ApiResponse.success(res, 200, "Banner updated successfully", banner);
  } catch (error) {
    next(error);
  }
};

// Admin — delete
exports.deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await bannerService.deleteBanner(id);
    return ApiResponse.success(res, 200, "Banner deleted successfully", result);
  } catch (error) {
    next(error);
  }
};
