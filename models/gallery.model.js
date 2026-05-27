const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  url: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['reunion', 'sports', 'campus', 'seminar', 'other'],
    default: 'other',
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  album: {
    en: { type: String, default: 'General' },
    bn: { type: String, default: 'সাধারণ' },
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
