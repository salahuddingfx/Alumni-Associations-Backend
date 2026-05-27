const Setting = require('../models/setting.model');
const { sendSuccess, sendError } = require('../utils/response');

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

module.exports = {
  getSettingByKey,
  updateSettingByKey,
};
