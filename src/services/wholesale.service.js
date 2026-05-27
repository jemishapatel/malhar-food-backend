const WholesaleInquiry = require('../models/WholesaleInquiry');

exports.createInquiry = async (inquiryData) => {
  const count = await WholesaleInquiry.countDocuments();
  const year = new Date().getFullYear();
  const index = String(count + 1).padStart(4, '0');
  const inquiryId = `WHS-${year}-${index}`;

  const inquiry = new WholesaleInquiry({
    ...inquiryData,
    inquiryId
  });

  return await inquiry.save();
};

exports.fetchAllInquiries = async () => {
  return await WholesaleInquiry.find().sort({ createdAt: -1 });
};

exports.updateInquiryStatus = async (id, status) => {
  const query = id.startsWith('WHS-') ? { inquiryId: id } : { _id: id };
  const inquiry = await WholesaleInquiry.findOneAndUpdate(query, { status }, { new: true });
  if (!inquiry) {
    throw new Error('Wholesale inquiry not found');
  }
  return inquiry;
};
