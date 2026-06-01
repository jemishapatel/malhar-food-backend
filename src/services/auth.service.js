import User from '../models/User.js';
import Otp from '../models/Otp.js';
import * as otpUtil from '../utils/otp.util.js';
import bcrypt from 'bcrypt';

export const sendOtp = async (mobile, name, email, password, role, countryCode) => {
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

// export const verifyOtp = async (mobile, name, code, email, password, role, countryCode) => {
//   // Verify against Otp collection
//   const otpRecord = await Otp.findOne({ mobile });

//   if (!otpRecord) {
//     const error = new Error('OTP has expired or does not exist');
//     error.statusCode = 400;
//     throw error;
//   }

//   if (otpRecord.code !== code.toString()) {
//     const error = new Error('Invalid verification code');
//     error.statusCode = 400;
//     throw error;
//   }

//   // OTP verified successfully. Delete the OTP document.
//   await Otp.deleteOne({ _id: otpRecord._id });

//   // Find user by mobile
//   let user = await User.findOne({ mobile });
//   if (!user) {
//     // Create new user with optional fields
//     user = new User({
//       name: name || 'Guest User',
//       mobile,
//       role: role || 'customer',
//       email: email || undefined,
//       password: password || undefined,
//       countryCode: countryCode || undefined,
//     });
//     await user.save();
//   } else {
//     // Update existing user with any provided optional fields
//     const updates = {};
//     if (email) updates.email = email;
//     if (password) updates.password = password;
//     if (role) updates.role = role;
//     if (countryCode) updates.countryCode = countryCode;
//     if (Object.keys(updates).length > 0) {
//       await User.updateOne({ _id: user._id }, { $set: updates });
//       // Refresh user object
//       user = await User.findById(user._id);
//     }
//   }

//   return user;
// };

// Find user by email — used for admin login

export const verifyOtp = async (
  mobile,
  name,
  code,
  email,
  password,
  role,
  countryCode
) => {

  const otpRecord = await Otp.findOne({ mobile });

  if (!otpRecord) {
    throw new Error('OTP expired');
  }

  if (otpRecord.code !== code.toString()) {
    throw new Error('Invalid OTP');
  }

  await Otp.deleteOne({ _id: otpRecord._id });

  let user = await User.findOne({ mobile });

  // CREATE USER
  if (!user) {

    const userData = {
      name: name || 'Guest User',
      mobile,
      role: role || 'admin',
      countryCode: countryCode || '+91',
    };

    if (email && email.trim() !== '') {
      userData.email = email;
    }

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
    }

    user = new User(userData);

    await user.save();
  }

  // UPDATE USER
  else {

    if (name) {
      user.name = name;
    }

    if (email && email.trim() !== '') {
      user.email = email;
    }

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (role) {
      user.role = role;
    }

    if (countryCode) {
      user.countryCode = countryCode;
    }

    await user.save();
  }

  return user;
};

export const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const getUserAddresses = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.addresses;
};

export const createUserAddress = async (userId, addressData) => {
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

export const updateUserAddress = async (userId, addressId, addressData) => {
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

export const deleteUserAddress = async (userId, addressId) => {
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
