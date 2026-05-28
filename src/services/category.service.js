const Category = require('../models/Category');

// Shared helper — parses subCategories from any format the frontend may send
const parseSubCategories = (subCategories) => {
  if (Array.isArray(subCategories)) return subCategories;
  if (typeof subCategories === 'string' && subCategories.trim().length > 0) {
    const trimmed = subCategories.trim();
    if (trimmed.startsWith('[')) {
      // JSON array string e.g. '["Basmati","Brown Rice"]'
      try { return JSON.parse(trimmed); } catch { return []; }
    }
    // Comma-separated string e.g. "Basmati, Brown Rice"
    return trimmed.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

exports.createCategory = async (categoryData) => {
  const { name, image, subCategories } = categoryData;
  const slug = categoryData.slug || name.toLowerCase().replace(/\s+/g, '-');

  const existing = await Category.findOne({ $or: [{ slug }, { name }] });
  if (existing) {
    throw new Error('Category name or slug already exists');
  }

  const category = new Category({
    slug,
    name,
    image,
    subCategories: parseSubCategories(subCategories),
  });

  return await category.save();
};

exports.fetchAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

exports.updateCategory = async (slug, updateData) => {
  // Parse subCategories using the same helper
  if (updateData.subCategories !== undefined) {
    updateData.subCategories = parseSubCategories(updateData.subCategories);
  }

  // Remove helper field sent by frontend (not a schema field)
  delete updateData.existingImage;

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
