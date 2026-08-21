import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g. "1kg", "5kg"
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true }
});

const nutritionRowSchema = new mongoose.Schema({
  label: { type: String },
  value: { type: String },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categorySlug: { type: String, required: true, index: true },
  subCategory: { type: String },
  isOrganic: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  origin: { type: String },
  shelfLife: { type: String },
  storage: { type: String },
  packaging: { type: String },
  dietaryInfo: { type: String },
  netWeight: { type: String },
  batchNo: { type: String },
  bestBeforeEnd: { type: String },
  ingredients: [{ type: String }],
  nutrition: {
    rows: { type: [nutritionRowSchema], default: undefined }
  },
  badge: { type: String, enum: ['none', 'New', 'Sale', 'Popular'], default: 'none' },
  inStock: { type: Boolean, default: true },
  images: [{ type: String }],
  variants: [variantSchema]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
