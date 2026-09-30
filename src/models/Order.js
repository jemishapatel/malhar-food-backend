import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: String }, // Variant size or unique identifier
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true } // Captured purchase-time price
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // e.g. ORD-UK-1001
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String },
  mobile: { type: String, index: true },
  countryCode: { type: String, default: '+44' }, // country code for mobile number
  email: { type: String, default: null },        // optional email from delivery address form
  address: { type: String },
  city: { type: String, default: 'London' },
  postcode: { type: String },
  amount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Draft', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Draft'
  },
  deliveryOption: { type: String, enum: ['normal', 'quick'], default: 'normal' },
  deliverySlot: { 
    date: { type: String },
    time: { type: String }
  },
  paymentMethod: { type: String, enum: ['COD', 'stripe'], default: 'COD' },
  paymentIntentId: { type: String, default: null }, // Stripe PaymentIntent ID
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  items: [orderItemSchema]
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
