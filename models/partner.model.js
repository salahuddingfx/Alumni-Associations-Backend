const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  logo: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['local_gov', 'ngo_partner', 'scholarship_sponsor', 'tech_partner', 'other'],
    default: 'other',
  },
  website: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 10,
  },
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
