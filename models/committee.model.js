const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  role: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  priority: {
    type: Number,
    default: 10,
  },
  type: {
    type: String,
    enum: ['president', 'secretary', 'advisor', 'executive', 'former'],
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Committee', committeeSchema);
