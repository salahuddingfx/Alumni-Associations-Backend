const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  banner: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['reunion', 'seminar', 'sports', 'cultural', 'social', 'other'],
    default: 'reunion',
  },
  registerLink: {
    type: String,
    default: '',
  },
  capacity: {
    type: Number,
    default: 0, // 0 for unlimited
  },
  rsvpCount: {
    type: Number,
    default: 0,
  },
  qrCode: {
    type: String,
    default: '',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
