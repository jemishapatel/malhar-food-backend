const Product = require('../models/Product');
const Category = require('../models/Category');

exports.createProduct = async (productData) => {
  // Validate category if provided
  if (productData.categorySlug) {
    const category = await Category.findOne({ slug: productData.categorySlug });
    if (!category) {
      const error = new Error(`Category with slug '${productData.categorySlug}' does not exist.`);
      error.statusCode = 400;
      throw error;
    }
    if (productData.subCategory && !category.subCategories.includes(productData.subCategory)) {
      const error = new Error(`SubCategory '${productData.subCategory}' does not exist in category '${category.name}'.`);
      error.statusCode = 400;
      throw error;
    }
  }

  // Ensure variants is an array of objects. Accept JSON string as well.
  let variantsArray = [];
  if (Array.isArray(productData.variants)) {
    variantsArray = productData.variants;
  } else if (typeof productData.variants === 'string' && productData.variants.trim()) {
    try {
      const parsed = JSON.parse(productData.variants);
      if (Array.isArray(parsed)) {
        variantsArray = parsed;
      }
    } catch (e) {
      // Keep empty array if parsing fails
    }
  }
  productData.variants = variantsArray;

  const product = new Product(productData);
  return await product.save();
};

exports.fetchProducts = async (filters) => {
  const query = {};

  if (filters.category) {
    query.categorySlug = filters.category;
  }
  if (filters.subCategory) {
    query.subCategory = filters.subCategory;
  }
  if (filters.search) {
    query.name = { $regex: filters.search, $options: 'i' };
  }
  if (filters.organic === 'true' || filters.organic === true) {
    query.isOrganic = true;
  }
  if (filters.vegan === 'true' || filters.vegan === true) {
    query.isVegan = true;
  }
  if (filters.glutenFree === 'true' || filters.glutenFree === true) {
    query.isGlutenFree = true;
  }
  if (filters.badge && filters.badge !== 'none') {
    query.badge = filters.badge;
  }
  if (filters.inStock === 'true' || filters.inStock === true) {
    query.inStock = true;
  }

  return await Product.find(query).sort({ createdAt: -1 });
};

exports.fetchProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

exports.updateProduct = async (id, updateData) => {
  if (updateData.categorySlug || updateData.subCategory) {
    const categorySlug = updateData.categorySlug || (await Product.findById(id)).categorySlug;
    const category = await Category.findOne({ slug: categorySlug });
    
    if (!category) {
      const error = new Error(`Category with slug '${categorySlug}' does not exist.`);
      error.statusCode = 400;
      throw error;
    }
    
    if (updateData.subCategory && !category.subCategories.includes(updateData.subCategory)) {
      const error = new Error(`SubCategory '${updateData.subCategory}' does not exist in category '${category.name}'.`);
      error.statusCode = 400;
      throw error;
    }
  }

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return { success: true };
};
