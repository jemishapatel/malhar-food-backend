import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const serviceablePostcodeSchema = new mongoose.Schema({
  postcode: { type: String, required: true, unique: true, index: true },
  serviceable: { type: Boolean, default: true },
  quickDeliveryAvailable: { type: Boolean, default: false },
  estimatedMinutes: { type: String },
  deliveryCharge: { type: Number, default: 0 }
}, { timestamps: true });

const ServiceablePostcode = mongoose.model('ServiceablePostcode', serviceablePostcodeSchema);

const seedPostcodes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/malhar-food');
    
    console.log('MongoDB Connected for seeding');

    const data = [
      { postcode: '395007', serviceable: true, quickDeliveryAvailable: true, estimatedMinutes: '10-20', deliveryCharge: 0 },
      { postcode: '395008', serviceable: true, quickDeliveryAvailable: false, estimatedMinutes: null, deliveryCharge: 40 },
      { postcode: '395009', serviceable: true, quickDeliveryAvailable: true, estimatedMinutes: '10-20', deliveryCharge: 0 },
      { postcode: 'HA', serviceable: true, quickDeliveryAvailable: true, estimatedMinutes: '15-30', deliveryCharge: 0 },
      { postcode: 'NW', serviceable: true, quickDeliveryAvailable: false, estimatedMinutes: 'next day', deliveryCharge: 10 }
    ];

    for (let item of data) {
      await ServiceablePostcode.findOneAndUpdate(
        { postcode: item.postcode },
        { $set: item },
        { upsert: true, new: true }
      );
    }
    
    console.log('Postcodes seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding postcodes:', error);
    process.exit(1);
  }
};

seedPostcodes();
