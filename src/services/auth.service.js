const User = require('../models/User');
const Otp = require('../models/Otp');
const otpUtil = require('../utils/otp.util');

exports.sendOtp = async (mobile, name, email, password, role, countryCode) => {
  // Generate a real 6-digit OTP
  const code = otpUtil.generateOtp();

  // Save/Update OTP in DB (Upsert ensures we overwrite any existing valid code for this mobile)
  await Otp.findOneAndUpdate(
    { mobile },
    { code, createdAt: Date.now() },
    { upsert: true, new: true }
  );

  // Send SMS via Utility
  await otpUtil.sendSms(mobile, code);

  // For testing convenience locally, we return the code. In true production, this should be removed.
  return { mobile, code };
};

exports.verifyOtp = async (mobile, name, code, email, password, role, countryCode) => {
  // Verify against Otp collection
  const otpRecord = await Otp.findOne({ mobile });

  if (!otpRecord) {
    const error = new Error('OTP has expired or does not exist');
    error.statusCode = 400;
    throw error;
  }

  if (otpRecord.code !== code.toString()) {
    const error = new Error('Invalid verification code');
    error.statusCode = 400;
    throw error;
  }

  // OTP verified successfully. Delete the OTP document.
  await Otp.deleteOne({ _id: otpRecord._id });

  // Find user by mobile
  let user = await User.findOne({ mobile });
  if (!user) {
    // Create new user with optional fields
    user = new User({
      name: name || 'Guest User',
      mobile,
      role: role || 'customer',
      email: email || undefined,
      password: password || undefined,
      countryCode: countryCode || undefined,
    });
    await user.save();
  } else {
    // Update existing user with any provided optional fields
    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = password;
    if (role) updates.role = role;
    if (countryCode) updates.countryCode = countryCode;
    if (Object.keys(updates).length > 0) {
      await User.updateOne({ _id: user._id }, { $set: updates });
      // Refresh user object
      user = await User.findById(user._id);
    }
  }

  return user;
};

// Find user by email — used for admin login
exports.getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};
exports.getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

exports.updateUserProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

exports.getUserAddresses = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.addresses;
};

exports.createUserAddress = async (userId, addressData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // If new address is default, unset existing default addresses
  if (addressData.isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  user.addresses.push(addressData);
  await user.save();
  return user.addresses[user.addresses.length - 1];
};

exports.updateUserAddress = async (userId, addressId, addressData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    throw new Error('Address not found');
  }

  if (addressData.isDefault) {
    user.addresses.forEach(addr => {
      if (addr.id !== addressId) {
        addr.isDefault = false;
      }
    });
  }

  address.set(addressData);
  await user.save();
  return address;
};

exports.deleteUserAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    throw new Error('Address not found');
  }

  address.deleteOne();
  await user.save();
  return { success: true };
};
