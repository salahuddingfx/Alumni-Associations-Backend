const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['bKash', 'Nagad', 'SSLCommerz', 'Bank'],
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
