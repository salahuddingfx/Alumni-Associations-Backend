const User = require('../models/user.model');
const { sendSuccess, sendError } = require('../utils/response');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return sendSuccess(res, 'Users fetched successfully', users);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return sendError(res, 'User not found', 404);
    }
    const user = await User.findByIdAndUpdate(userId, { isApproved: !existingUser.isApproved }, { new: true }).select('-password');
    return sendSuccess(res, 'User approval status updated successfully', user);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['superadmin', 'admin', 'moderator'].includes(role)) {
      return sendError(res, 'Invalid role', 400);
    }
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, 'User role updated successfully', user);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getAllUsers,
  approveUser,
  updateUserRole,
  deleteUser,
};
