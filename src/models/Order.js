const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: String }, // Variant size or unique identifier
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true } // Captured purchase-time price
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // e.g. ORD-UK-1001
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  mobile: { type: String, required: true, index: true },
  countryCode: { type: String, default: '+44' }, // country code for mobile number
  address: { type: String, required: true },
  city: { type: String, default: 'London' },
  postcode: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  items: [orderItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
