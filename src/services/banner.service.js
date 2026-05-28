const Banner = require('../models/Banner');

exports.createBanner = async (data) => {
  const banner = new Banner(data);
  return await banner.save();
};

exports.fetchAllBanners = async () => {
  return await Banner.find().sort({ order: 1, createdAt: 1 });
};

exports.fetchActiveBanners = async () => {
  return await Banner.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
};

exports.updateBanner = async (id, updateData) => {
  const banner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
  if (!banner) throw new Error('Banner not found');
  return banner;
};

exports.deleteBanner = async (id) => {
  const banner = await Banner.findByIdAndDelete(id);
  if (!banner) throw new Error('Banner not found');
  return { success: true };
};
