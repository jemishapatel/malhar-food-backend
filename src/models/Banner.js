const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },          // e.g. "Dal & Pulses, Rich Protein"
  description: { type: String, required: true },
  badge: { type: String, required: true },           // e.g. "Protein Powerhouse"
  cta: { type: String, required: true },             // e.g. "Shop Dal"
  link: { type: String, required: true },            // e.g. "/category/pulses-lentils"
  image: { type: String, required: true },           // uploaded path or URL
  order: { type: Number, default: 0 },               // display order
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
