import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const createProduct = async (productData) => {
  console.log('Create Product Data:', productData);
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

  // Parse nutrition JSON string if sent as a string
  if (typeof productData.nutrition === 'string' && productData.nutrition.trim()) {
    try {
      productData.nutrition = JSON.parse(productData.nutrition);
    } catch (e) {
      delete productData.nutrition;
    }
  }

  // Parse ingredients JSON string if sent as a string
  if (typeof productData.ingredients === 'string' && productData.ingredients.trim()) {
    try {
      const parsed = JSON.parse(productData.ingredients);
      productData.ingredients = Array.isArray(parsed) ? parsed : [productData.ingredients];
    } catch (e) {
      productData.ingredients = productData.ingredients ? [productData.ingredients] : [];
    }
  }

  // Ensure nutrition.rows is a plain array (not a string)
  if (productData.nutrition && typeof productData.nutrition.rows === 'string') {
    try {
      productData.nutrition.rows = JSON.parse(productData.nutrition.rows);
    } catch (e) {
      productData.nutrition.rows = [];
    }
  }

  const product = new Product(productData);
  // Ensure nutrition.rows is explicitly set, as Mongoose can strip nested subdocuments
  if (productData.nutrition && Array.isArray(productData.nutrition.rows)) {
    product.set('nutrition.rows', productData.nutrition.rows);
  }
  
  return await product.save();
};

export const fetchProducts = async (filters) => {
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

export const fetchProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  console.log('Updated Product:', product); return product;
};

export const updateProduct = async (id, updateData) => {
  console.log('Update Product Data:', updateData);
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

  // Ensure variants is an array of objects. Accept JSON string as well.
  if (updateData.variants !== undefined) {
    if (typeof updateData.variants === 'string' && updateData.variants.trim()) {
      try {
        const parsed = JSON.parse(updateData.variants);
        if (Array.isArray(parsed)) {
          updateData.variants = parsed;
        } else {
          updateData.variants = [];
        }
      } catch (e) {
        updateData.variants = [];
      }
    } else if (!Array.isArray(updateData.variants)) {
      updateData.variants = [];
    }
  }

  // Parse nutrition JSON string if sent as a string
  if (typeof updateData.nutrition === 'string' && updateData.nutrition.trim()) {
    try {
      updateData.nutrition = JSON.parse(updateData.nutrition);
    } catch (e) {
      delete updateData.nutrition;
    }
  }

  // Parse ingredients JSON string if sent as a string
  if (typeof updateData.ingredients === 'string' && updateData.ingredients.trim()) {
    try {
      const parsed = JSON.parse(updateData.ingredients);
      updateData.ingredients = Array.isArray(parsed) ? parsed : [updateData.ingredients];
    } catch (e) {
      updateData.ingredients = updateData.ingredients ? [updateData.ingredients] : [];
    }
  }

  // Build a flat $set object using dot-notation for nested fields
  // This ensures nutrition.rows and ingredients are written correctly by MongoDB
  const setPayload = { ...updateData };

  // If nutrition has rows, set via dot-notation to avoid Mongoose stripping the sub-document
  if (updateData.nutrition && Array.isArray(updateData.nutrition.rows)) {
    setPayload['nutrition.rows'] = updateData.nutrition.rows;
    delete setPayload.nutrition;
  }

  console.log('Set Payload:', setPayload); const product = await Product.findByIdAndUpdate(
    id,
    { $set: setPayload },
    { new: true, runValidators: false }
  );
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return { success: true };
};
