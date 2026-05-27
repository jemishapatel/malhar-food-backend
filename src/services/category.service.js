const Category = require('../models/Category');

exports.createCategory = async (categoryData) => {
  const { name, image, subCategories } = categoryData;
  const slug = categoryData.slug || name.toLowerCase().replace(/\s+/g, '-');

  // Ensure subCategories is an array; if a comma‑separated string is provided, split it
  let subCategoriesArray = [];
  if (Array.isArray(subCategories)) {
    subCategoriesArray = subCategories;
  } else if (typeof subCategories === 'string' && subCategories.trim().length > 0) {
    subCategoriesArray = subCategories.split(',').map(s => s.trim()).filter(Boolean);
  }

  const existing = await Category.findOne({ $or: [{ slug }, { name }] });
  if (existing) {
    throw new Error('Category name or slug already exists');
  }

  const category = new Category({
    slug,
    name,
    image,
    // Always store an array (empty if none provided)
    subCategories: subCategoriesArray
  });

  return await category.save();
};

exports.fetchAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

exports.updateCategory = async (slug, updateData) => {
  const category = await Category.findOneAndUpdate({ slug }, updateData, { new: true });
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

exports.deleteCategory = async (slug) => {
  const category = await Category.findOneAndDelete({ slug });
  if (!category) {
    throw new Error('Category not found');
  }
  return { success: true };
};
