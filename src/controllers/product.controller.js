const productService = require('../services/product.service');
const ApiResponse = require('../utils/apiResponse');

exports.createProduct = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    const product = await productService.createProduct(req.body);
    return ApiResponse.success(res, 201, "Product created successfully", product);
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await productService.fetchProducts(req.query);
    return ApiResponse.success(res, 200, "Products retrieved successfully", products);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.fetchProductById(id);
    return ApiResponse.success(res, 200, "Product details retrieved successfully", product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);
    return ApiResponse.success(res, 200, "Product updated successfully", product);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);
    return ApiResponse.success(res, 200, "Product deleted successfully", result);
  } catch (error) {
    next(error);
  }
};
