const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  batch: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    default: '',
  },
  currentOrganization: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  bio: {
    en: { type: String, default: '' },
    bn: { type: String, default: '' },
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
