const User = require('../models/user.model');
const { generateTokens } = require('../utils/generateToken');

const registerUser = async (email, password, username, phone) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }, { phone }]
  });
  if (existingUser) {
    throw new Error('Email, Username, or Phone is already registered');
  }

  // Create user
  const user = new User({
    email,
    username,
    phone,
    password,
    isApproved: true,
  });

  await user.save();
  return user;
};

const loginUser = async (identifier, password) => {
  const user = await User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier.toLowerCase() },
      { phone: identifier }
    ]
  });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const tokens = generateTokens(user);
  return { user, ...tokens };
};

const updateUserProfile = async (userId, updateData) => {
  const { email, password, username, phone } = updateData;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (username && username.toLowerCase() !== (user.username || '').toLowerCase()) {
    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) throw new Error('Username already taken');
    user.username = username.toLowerCase();
  }
  if (phone && phone !== user.phone) {
    const existing = await User.findOne({ phone });
    if (existing) throw new Error('Phone number already registered');
    user.phone = phone;
  }
  if (email && email.toLowerCase() !== user.email.toLowerCase()) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw new Error('Email already registered');
    user.email = email.toLowerCase();
  }
  if (password) {
    user.password = password;
  }

  await user.save();
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
};
