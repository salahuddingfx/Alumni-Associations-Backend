const Member = require('../models/member.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');
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

    const members = await Member.find(filter).populate('user', 'username').skip(skip).limit(limit).sort({ createdAt: -1 });
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
    const { memberId } = req.params;
    let member = null;

    // First try to look up by slug (case-insensitive)
    member = await Member.findOne({ slug: memberId.toLowerCase().trim() }).populate('user', 'username');

    // Fallback: look up by ObjectID
    if (!member && mongoose.Types.ObjectId.isValid(memberId)) {
      member = await Member.findById(memberId).populate('user', 'username');
    }

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

    // Notify administrators of pending profile approval
    const { sendPendingMemberEmail } = require('../utils/email');
    sendPendingMemberEmail(member).catch((err) => {
      console.error(`Failed to send admin notification email for pending member profile ${member._id}:`, err.message);
    });

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
    const { logActivity } = require('../utils/logger');
    const existing = await Member.findById(req.params.memberId);
    if (!existing) {
      return sendError(res, 'Member not found', 404);
    }
    const newStatus = !existing.isApproved;
    const member = await Member.findByIdAndUpdate(req.params.memberId, { isApproved: newStatus }, { new: true });
    await logActivity(req, newStatus ? 'MEMBER_APPROVED' : 'MEMBER_SUSPENDED', { memberId: member._id, name: member.name.en, batch: member.batch });
    return sendSuccess(res, `Member ${newStatus ? 'approved' : 'suspended'} successfully`, member);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteMember = async (req, res) => {
  try {
    const { logActivity } = require('../utils/logger');
    const member = await Member.findByIdAndDelete(req.params.memberId);
    if (!member) {
      return sendError(res, 'Member not found', 404);
    }
    await logActivity(req, 'MEMBER_DELETED', { memberId: member._id, name: member.name.en, batch: member.batch });
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
    // With upload.fields(), files are in req.files[fieldname][0]
    let profilePhoto = req.body.profilePhoto || '';
    if (req.files && req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
      profilePhoto = await uploadToCloudinary(req.files['profilePhoto'][0].path, 'member_profiles');
    }

    let bannerPhoto = req.body.bannerPhoto || '';
    if (req.files && req.files['bannerPhoto'] && req.files['bannerPhoto'][0]) {
      bannerPhoto = await uploadToCloudinary(req.files['bannerPhoto'][0].path, 'member_banners');
    }

    const isSpecialRole = ['superadmin', 'admin', 'moderator'].includes(req.user.role);

    const memberData = {
      ...req.body,
      user: req.user.id,
      email: req.user.email,
    };

    if (isSpecialRole) {
      memberData.isApproved = true;
    }

    if (profilePhoto) {
      memberData.profilePhoto = profilePhoto;
    }

    if (bannerPhoto) {
      memberData.bannerPhoto = bannerPhoto;
    }

    if (typeof memberData.name === 'string') memberData.name = JSON.parse(memberData.name);
    if (typeof memberData.bio === 'string') memberData.bio = JSON.parse(memberData.bio);
    if (typeof memberData.socialLinks === 'string') memberData.socialLinks = JSON.parse(memberData.socialLinks);

    let member = await Member.findOne({ user: req.user.id });
    if (!member) {
      member = new Member({ user: req.user.id, email: req.user.email });
    }
    Object.assign(member, memberData);
    await member.save();

    // Promote 'user' role to 'member' upon profile completion
    if (req.user.role === 'user') {
      const User = require('../models/user.model');
      await User.findByIdAndUpdate(req.user.id, { role: 'member' });
      req.user.role = 'member';
    }

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

const getMyIdCard = async (req, res) => {
  try {
    const { generateSecret, generateTOTP } = require('../utils/totp');
    let member = await Member.findOne({ user: req.user.id });
    if (!member) {
      return sendError(res, 'Member profile not found. Please create a profile first.', 404);
    }
    
    if (!member.totpSecret) {
      member.totpSecret = generateSecret();
      await member.save();
    }
    
    const token = generateTOTP(member.totpSecret);
    const timeStep = 30;
    const expiresIn = timeStep - (Math.floor(Date.now() / 1000) % timeStep);
    
    const verificationUrl = `https://practonalumni.org/verify-id?id=${member._id}&token=${token}`;
    
    return sendSuccess(res, 'ID Card data retrieved successfully', {
      member: {
        _id: member._id,
        name: member.name,
        batch: member.batch,
        pscBatch: member.pscBatch,
        profilePhoto: member.profilePhoto,
        profession: member.profession,
        bloodGroup: member.bloodGroup,
        gender: member.gender,
        isApproved: member.isApproved,
      },
      totpToken: token,
      expiresIn,
      verificationUrl
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const downloadPkpass = async (req, res) => {
  try {
    let member = await Member.findOne({ user: req.user.id });
    if (!member) {
      return res.status(404).send('Member profile not found.');
    }
    
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename=idcard_${member._id}.pkpass`);
    
    const passData = {
      formatVersion: 1,
      passTypeIdentifier: "pass.org.practon.alumni",
      serialNumber: member._id.toString(),
      teamIdentifier: "PRACTONALUM",
      organizationName: "Practon Alumni Association",
      description: "Virtual Alumni ID Card",
      logoText: "প্রাক্তন পরিষদ",
      foregroundColor: "rgb(255, 255, 255)",
      backgroundColor: "rgb(0, 59, 115)",
      labelColor: "rgb(249, 168, 38)",
      generic: {
        primaryFields: [
          { key: "name", label: "ALUMNUS", value: member.name.en }
        ],
        secondaryFields: [
          { key: "batch", label: "BATCH", value: member.batch }
        ],
        auxiliaryFields: [
          { key: "blood", label: "BLOOD", value: member.bloodGroup || "N/A" }
        ],
        backFields: [
          { key: "phone", label: "Phone", value: member.phone || "N/A" },
          { key: "email", label: "Email", value: member.email }
        ]
      }
    };
    
    return res.send(Buffer.from(JSON.stringify(passData, null, 2)));
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getAllMembersAdmin = async (req, res) => {
  try {
    const filter = {};

    // Batch representative scoped filter for moderators
    if (req.user && req.user.role === 'moderator' && Array.isArray(req.user.allowedBatches) && req.user.allowedBatches.length > 0) {
      filter.batch = { $in: req.user.allowedBatches };
    }

    const members = await Member.find(filter).populate('user', 'username').sort({ createdAt: -1 });
    return sendSuccess(res, 'All members retrieved for admin successfully', members);
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
  getMyProfile,
  updateMyProfile,
  getMyIdCard,
  downloadPkpass,
  getAllMembersAdmin,
};
