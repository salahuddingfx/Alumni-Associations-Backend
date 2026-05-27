const Setting = require('../models/setting.model');
const { sendSuccess, sendError } = require('../utils/response');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const getSettingByKey = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return sendSuccess(res, 'Setting not found. Returning empty.', {});
    }
    return sendSuccess(res, 'Setting retrieved successfully', setting.value);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    return sendSuccess(res, 'Setting updated successfully', setting.value);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file provided', 400);
    }
    const url = await uploadToCloudinary(req.file.path, 'settings_photos');
    return sendSuccess(res, 'File uploaded to Cloudinary successfully', { url });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getSettingByKey,
  updateSettingByKey,
  uploadMedia,
};
