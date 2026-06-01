import Banner from '../models/Banner.js';

export const createBanner = async (data) => {
  const banner = new Banner(data);
  return await banner.save();
};

export const fetchAllBanners = async () => {
  return await Banner.find().sort({ order: 1, createdAt: 1 });
};

export const fetchActiveBanners = async () => {
  return await Banner.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
};

export const updateBanner = async (id, updateData) => {
  const banner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
  if (!banner) throw new Error('Banner not found');
  return banner;
};

export const deleteBanner = async (id) => {
  const banner = await Banner.findByIdAndDelete(id);
  if (!banner) throw new Error('Banner not found');
  return { success: true };
};
