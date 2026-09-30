import mongoose from 'mongoose';

const serviceablePostcodeSchema = new mongoose.Schema({
  postcode: { type: String, required: true, unique: true, index: true },
  serviceable: { type: Boolean, default: true },
  quickDeliveryAvailable: { type: Boolean, default: false },
  estimatedMinutes: { type: String }, // e.g. "10-20"
  deliveryCharge: { type: Number, default: 0 }, // kept for backward compatibility
  weekdayCharge: { type: Number, default: 0 },       // Mon–Fri delivery charge
  saturdayCharge: { type: Number, default: 0 },      // Saturday delivery charge
  freeDeliveryThreshold: { type: Number, default: 40 }, // min order value for free delivery (£)
  email: { type: String, default: null }                 // optional email captured from delivery address modal
}, { timestamps: true });

export default mongoose.model('ServiceablePostcode', serviceablePostcodeSchema);