const Member = require('../models/member.model');
const { sendSuccess, sendError } = require('../utils/response');
const getPaginationOptions = require('../utils/pagination');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const getMembers = async (req, res) => {
  try {
    const { batch, profession, search } = req.query;
    const { limit, skip } = getPaginationOptions(req.query);

    const filter = { isApproved: true };

    if (batch) {
      filter.batch = batch;
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
    const members = await Member.find({ isApproved: false });
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

module.exports = {
  getMembers,
  getMemberDetail,
  createMemberProfile,
  getPendingMembers,
  approveMember,
  deleteMember,
};
