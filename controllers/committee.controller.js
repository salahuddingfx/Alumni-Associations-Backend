const Committee = require('../models/committee.model');
const mongoose = require('mongoose');
const { sendSuccess, sendError } = require('../utils/response');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

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
    // Handle image upload
    let image = '';
    if (req.files && req.files['image'] && req.files['image'][0]) {
      image = await uploadToCloudinary(req.files['image'][0].path, 'committee_photos');
    }
    // Handle banner photo upload
    let bannerPhoto = '';
    if (req.files && req.files['bannerPhoto'] && req.files['bannerPhoto'][0]) {
      bannerPhoto = await uploadToCloudinary(req.files['bannerPhoto'][0].path, 'committee_banners');
    }

    const committeeData = {
      ...req.body,
      image,
      bannerPhoto,
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

    // Handle image upload
    let image = existing.image;
    if (req.files && req.files['image'] && req.files['image'][0]) {
      image = await uploadToCloudinary(req.files['image'][0].path, 'committee_photos');
    } else if (req.body.image) {
      image = req.body.image;
    }

    // Handle banner photo upload
    let bannerPhoto = existing.bannerPhoto || '';
    if (req.files && req.files['bannerPhoto'] && req.files['bannerPhoto'][0]) {
      bannerPhoto = await uploadToCloudinary(req.files['bannerPhoto'][0].path, 'committee_banners');
    }

    const committeeData = {
      ...req.body,
      image,
      bannerPhoto,
    };

    if (typeof committeeData.name === 'string') committeeData.name = JSON.parse(committeeData.name);
    if (typeof committeeData.role === 'string') committeeData.role = JSON.parse(committeeData.role);
    if (typeof committeeData.socialLinks === 'string') committeeData.socialLinks = JSON.parse(committeeData.socialLinks);

    Object.assign(existing, committeeData);
    await existing.save();
    return sendSuccess(res, 'Committee member updated successfully', existing);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getCommitteeMemberDetail = async (req, res) => {
  try {
    const { committeeId } = req.params;
    let committee = null;

    // First try by slug (case-insensitive)
    committee = await Committee.findOne({ slug: committeeId.toLowerCase().trim() });

    // Fallback: look up by ObjectID
    if (!committee && mongoose.Types.ObjectId.isValid(committeeId)) {
      committee = await Committee.findById(committeeId);
    }

    if (!committee) {
      return sendError(res, 'Committee member not found', 404);
    }
    return sendSuccess(res, 'Committee member details retrieved successfully', committee);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getCommittees,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
  getCommitteeMemberDetail,
};
