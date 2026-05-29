const Partner = require('../models/partner.model');
const { sendSuccess, sendError } = require('../utils/response');

const getPartners = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = {};
    if (!all) {
      filter.isActive = true;
    }
    const list = await Partner.find(filter).sort({ priority: 1, createdAt: 1 });
    return sendSuccess(res, 'Partners retrieved successfully', list);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createPartner = async (req, res) => {
  try {
    const logo = req.file ? `/uploads/${req.file.filename}` : '';
    const partnerData = {
      ...req.body,
      logo,
    };
    if (typeof partnerData.name === 'string') partnerData.name = JSON.parse(partnerData.name);
    if (partnerData.priority) partnerData.priority = Number(partnerData.priority);
    if (partnerData.isActive === 'false') partnerData.isActive = false;
    if (partnerData.isActive === 'true') partnerData.isActive = true;

    const partner = new Partner(partnerData);
    await partner.save();

    return sendSuccess(res, 'Partner created successfully', partner, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const updatePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const existing = await Partner.findById(partnerId);
    if (!existing) {
      return sendError(res, 'Partner not found', 404);
    }

    let logo = existing.logo;
    if (req.file) {
      logo = `/uploads/${req.file.filename}`;
    } else if (req.body.logo) {
      logo = req.body.logo;
    }

    const partnerData = {
      ...req.body,
      logo,
    };

    if (typeof partnerData.name === 'string') partnerData.name = JSON.parse(partnerData.name);
    if (partnerData.priority) partnerData.priority = Number(partnerData.priority);
    if (partnerData.isActive === 'false') partnerData.isActive = false;
    if (partnerData.isActive === 'true') partnerData.isActive = true;

    const partner = await Partner.findByIdAndUpdate(partnerId, partnerData, { new: true });
    return sendSuccess(res, 'Partner updated successfully', partner);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.partnerId);
    if (!partner) {
      return sendError(res, 'Partner not found', 404);
    }
    return sendSuccess(res, 'Partner deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
};
