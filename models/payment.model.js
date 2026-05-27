const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  rawResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
