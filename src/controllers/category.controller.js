import * as categoryService from '../services/category.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const createCategory = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    // In production, verify req.user.role === 'admin'
    const category = await categoryService.createCategory(req.body);
    return ApiResponse.success(res, 201, "Category created successfully", category);
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.fetchAllCategories();
    return ApiResponse.success(res, 200, "Categories retrieved successfully", categories);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    if (req.file) {
      // New image uploaded — use it
      req.body.image = `/uploads/${req.file.filename}`;
    } else if (req.body.existingImage) {
      // No new file — keep the existing image path sent by frontend
      req.body.image = req.body.existingImage;
    }
    const { id } = req.params; // slug/id
    const category = await categoryService.updateCategory(id, req.body);
    return ApiResponse.success(res, 200, "Category updated successfully", category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    return ApiResponse.success(res, 200, "Category deleted successfully", result);
  } catch (error) {
    next(error);
  }
};
