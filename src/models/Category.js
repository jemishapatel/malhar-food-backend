import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true }, // e.g. "rice", "flour-grains"
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  subCategories: [{ type: String }] // e.g. ["Basmati", "Jasmine"]
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
