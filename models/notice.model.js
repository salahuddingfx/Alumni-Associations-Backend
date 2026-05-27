const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  content: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  fileUrl: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  isSticky: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
