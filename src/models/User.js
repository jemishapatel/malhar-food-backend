const mongoose = require('mongoose');

// Address subdocument schema
const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, default: 'London' },
  postcode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

// User schema with additional fields: email, password, countryCode
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // optional email
  password: { type: String }, // password hash, optional for now
  countryCode: { type: String, default: '+44' }, // default country code
  mobile: { type: String, required: true, unique: true, index: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: [addressSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
