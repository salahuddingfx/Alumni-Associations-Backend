const Member = require('../models/member.model');
const { sendSuccess, sendError } = require('../utils/response');
const getPaginationOptions = require('../utils/pagination');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const getMembers = async (req, res) => {
  try {
    const { batch, pscBatch, bloodGroup, profession, search } = req.query;
    const { limit, skip } = getPaginationOptions(req.query);

    const filter = { isApproved: true };

    if (batch) {
      filter.batch = batch;
    }
    if (pscBatch) {
      filter.pscBatch = pscBatch;
    }
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }
    if (profession) {
      filter.profession = new RegExp(profession, 'i');
    }
    if (search) {
      filter.$or = [
        { 'name.en': new RegExp(search, 'i') },
        { 'name.bn': new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const members = await Member.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Member.countDocuments(filter);

    return sendSuccess(res, 'Members retrieved successfully', {
      members,
      total,
      limit,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getMemberDetail = async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId);
    if (!member) {
      return sendError(res, 'Member not found', 404);
    }
    return sendSuccess(res, 'Member details retrieved successfully', member);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createMemberProfile = async (req, res) => {
  try {
    let profilePhoto = '';
    if (req.file) {
      profilePhoto = await uploadToCloudinary(req.file.path, 'member_profiles');
    }
    const memberData = {
      ...req.body,
      profilePhoto,
    };
    if (typeof memberData.name === 'string') memberData.name = JSON.parse(memberData.name);
    if (typeof memberData.bio === 'string') memberData.bio = JSON.parse(memberData.bio);
    if (typeof memberData.socialLinks === 'string') memberData.socialLinks = JSON.parse(memberData.socialLinks);

    const member = new Member(memberData);
    await member.save();

    return sendSuccess(res, 'Member profile submitted for approval', member, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const getPendingMembers = async (req, res) => {
  try {
    const filter = { isApproved: false };

    // Batch representative scoped filter
    if (req.user && req.user.role === 'moderator' && Array.isArray(req.user.allowedBatches) && req.user.allowedBatches.length > 0) {
      filter.batch = { $in: req.user.allowedBatches };
    }

    const members = await Member.find(filter);
    return sendSuccess(res, 'Pending members fetched successfully', members);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const approveMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.memberId, { isApproved: true }, { new: true });
    if (!member) {
      return sendError(res, 'Member not found', 404);
    }
    return sendSuccess(res, 'Member approved successfully', member);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.memberId);
    if (!member) {
      return sendError(res, 'Member not found', 404);
    }
    return sendSuccess(res, 'Member deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getMyProfile = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user.id });
    if (!member) {
      return sendSuccess(res, 'No profile created yet', null);
    }
    return sendSuccess(res, 'Profile retrieved successfully', member);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateMyProfile = async (req, res) => {
  try {
    let profilePhoto = req.body.profilePhoto || '';
    if (req.file) {
      profilePhoto = await uploadToCloudinary(req.file.path, 'member_profiles');
    }

    const memberData = {
      ...req.body,
      user: req.user.id,
      email: req.user.email,
    };

    if (profilePhoto) {
      memberData.profilePhoto = profilePhoto;
    }

    if (typeof memberData.name === 'string') memberData.name = JSON.parse(memberData.name);
    if (typeof memberData.bio === 'string') memberData.bio = JSON.parse(memberData.bio);
    if (typeof memberData.socialLinks === 'string') memberData.socialLinks = JSON.parse(memberData.socialLinks);

    const member = await Member.findOneAndUpdate(
      { user: req.user.id },
      { ...memberData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Sync phone number to User if it was updated
    if (memberData.phone && memberData.phone !== req.user.phone) {
      const User = require('../models/user.model');
      const existingUser = await User.findOne({ phone: memberData.phone, _id: { $ne: req.user.id } });
      if (existingUser) {
        return sendError(res, 'Phone number is already registered by another account', 400);
      }
      await User.findByIdAndUpdate(req.user.id, { phone: memberData.phone });
    }

    return sendSuccess(res, 'Profile updated successfully', member);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = {
  getMembers,
  getMemberDetail,
  createMemberProfile,
  getPendingMembers,
  approveMember,
  deleteMember,
  getMyProfile,
  updateMyProfile,
};
