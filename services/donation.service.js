const Donation = require('../models/donation.model');

const listDonations = async (filter = {}) => {
  return await Donation.find(filter).sort({ date: -1 });
};

const createDonation = async (donationData) => {
  const donation = new Donation(donationData);
  return await donation.save();
};

const getStats = async () => {
  const donations = await Donation.find({ status: 'completed' });
  const totalAmount = donations.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCount = donations.length;

  return {
    totalAmount,
    totalCount,
  };
};

module.exports = {
  listDonations,
  createDonation,
  getStats,
};
