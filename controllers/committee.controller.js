const Committee = require('../models/committee.model');
const { sendSuccess, sendError } = require('../utils/response');

const getCommittees = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;

    const list = await Committee.find(filter).sort({ priority: 1, createdAt: 1 });
    return sendSuccess(res, 'Committee members retrieved successfully', list);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createCommitteeMember = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const committeeData = {
      ...req.body,
      image,
    };
    if (typeof committeeData.name === 'string') committeeData.name = JSON.parse(committeeData.name);
    if (typeof committeeData.role === 'string') committeeData.role = JSON.parse(committeeData.role);
    if (typeof committeeData.socialLinks === 'string') committeeData.socialLinks = JSON.parse(committeeData.socialLinks);

    const committee = new Committee(committeeData);
    await committee.save();

    return sendSuccess(res, 'Committee member created successfully', committee, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const deleteCommitteeMember = async (req, res) => {
  try {
    const committee = await Committee.findByIdAndDelete(req.params.committeeId);
    if (!committee) {
      return sendError(res, 'Committee member not found', 404);
    }
    return sendSuccess(res, 'Committee member deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateCommitteeMember = async (req, res) => {
  try {
    const { committeeId } = req.params;
    const existing = await Committee.findById(committeeId);
    if (!existing) {
      return sendError(res, 'Committee member not found', 404);
    }

    let image = existing.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const committeeData = {
      ...req.body,
      image,
    };

    if (typeof committeeData.name === 'string') committeeData.name = JSON.parse(committeeData.name);
    if (typeof committeeData.role === 'string') committeeData.role = JSON.parse(committeeData.role);
    if (typeof committeeData.socialLinks === 'string') committeeData.socialLinks = JSON.parse(committeeData.socialLinks);

    const committee = await Committee.findByIdAndUpdate(committeeId, committeeData, { new: true });
    return sendSuccess(res, 'Committee member updated successfully', committee);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getCommittees,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
};
