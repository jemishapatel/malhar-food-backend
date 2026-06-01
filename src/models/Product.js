import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g. "1kg", "5kg"
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categorySlug: { type: String, required: true, index: true }, // references Category.slug
  subCategory: { type: String }, // e.g. "Basmati"
  isOrganic: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  origin: { type: String },
  shelfLife: { type: String },
  storage: { type: String },
  packaging: { type: String },
  dietaryInfo: { type: String },
  badge: { type: String, enum: ['none', 'New', 'Sale', 'Popular'], default: 'none' },
  inStock: { type: Boolean, default: true },
  images: [{ type: String }], // Array of image URLs (first is primary)
  variants: [variantSchema]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
