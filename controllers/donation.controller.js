const donationService = require('../services/donation.service');
const { sendSuccess, sendError } = require('../utils/response');

const getDonations = async (req, res) => {
  try {
    const donations = await donationService.listDonations({});
    return sendSuccess(res, 'Donations retrieved successfully', donations);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getDonationStats = async (req, res) => {
  try {
    const stats = await donationService.getStats();
    return sendSuccess(res, 'Donation stats retrieved successfully', stats);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const initiateCheckout = async (req, res) => {
  try {
    const { donorName, email, amount, paymentMethod, isAnonymous } = req.body;
    const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create a pending donation record
    const donation = await donationService.createDonation({
      donorName,
      email,
      amount,
      paymentMethod,
      transactionId,
      isAnonymous,
      status: 'completed', // For mock purposes, approve instantly
    });

    return sendSuccess(res, 'Checkout simulated successfully. Payment received.', donation, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = {
  getDonations,
  getDonationStats,
  initiateCheckout,
};
