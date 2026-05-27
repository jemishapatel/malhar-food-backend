const mongoose = require('mongoose');

const wholesaleInquirySchema = new mongoose.Schema({
  inquiryId: { type: String, required: true, unique: true }, // e.g. WHS-2026-0001
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  vatNumber: { type: String }, // Optional
  companyReg: { type: String }, // Optional
  country: { type: String, default: 'United Kingdom' },
  city: { type: String, required: true },
  postcode: { type: String, required: true },
  address: { type: String, required: true },
  productsInterested: { type: String, required: true },
  monthlyVolume: { type: String, required: true },
  deliveryRequirements: { type: String }, // Optional
  additionalNotes: { type: String }, // Optional
  status: { 
    type: String, 
    enum: ['New Inquiry', 'Contacted', 'Negotiation', 'Approved', 'Rejected'], 
    default: 'New Inquiry' 
  }
}, { timestamps: true });

module.exports = mongoose.model('WholesaleInquiry', wholesaleInquirySchema);
