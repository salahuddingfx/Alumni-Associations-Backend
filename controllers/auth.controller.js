const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response');
const { setTokenCookies, clearTokenCookies } = require('../utils/generateToken');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const register = async (req, res, next) => {
  try {
    const { email, password, username, phone } = req.body;
    const user = await authService.registerUser(email, password, username, phone);
    return sendSuccess(res, 'Registration successful', { email: user.email }, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;
    const loginIdentifier = identifier || email; // Support both names
    const { user, accessToken, refreshToken } = await authService.loginUser(loginIdentifier, password);

    setTokenCookies(res, accessToken, refreshToken);

    return sendSuccess(res, 'Login successful', {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        role: user.role,
        fullName: user.fullName || '',
        profilePhoto: user.profilePhoto || '',
      },
      accessToken,
    });
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const logout = async (req, res, next) => {
  try {
    clearTokenCookies(res);
    return sendSuccess(res, 'Logout successful');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    return sendSuccess(res, 'User detail retrieved successfully', {
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        phone: req.user.phone,
        role: req.user.role,
        fullName: req.user.fullName || '',
        profilePhoto: req.user.profilePhoto || '',
      },
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const { email, password, username, phone, fullName } = req.body;
    let profilePhoto = req.body.profilePhoto || '';
    if (req.file) {
      profilePhoto = await uploadToCloudinary(req.file.path, 'user_profiles');
    }

    const updateData = { email, password, username, phone, fullName };
    if (profilePhoto) {
      updateData.profilePhoto = profilePhoto;
    }

    const updated = await authService.updateUserProfile(req.user._id, updateData);
    return sendSuccess(res, 'Profile updated successfully', {
      user: {
        id: updated._id,
        email: updated.email,
        username: updated.username,
        phone: updated.phone,
        role: updated.role,
        fullName: updated.fullName || '',
        profilePhoto: updated.profilePhoto || '',
      }
    });
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateMe,
};
