const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  content: {
    en: { type: String, required: true },
    bn: { type: String, required: true },
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'news',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  readTime: {
    type: Number,
    default: 3,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
