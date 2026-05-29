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
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  }
}, { timestamps: true });

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

committeeSchema.pre('save', async function (next) {
  if (this.isModified('name.en') || !this.slug) {
    const baseSlug = slugify(this.name.en) || 'member';
    let slug = baseSlug;
    const Committee = this.constructor;
    let isUnique = false;
    let attempt = 0;
    while (!isUnique) {
      const existing = await Committee.findOne({ slug, _id: { $ne: this._id } });
      if (!existing) {
        isUnique = true;
      } else {
        attempt++;
        slug = `${baseSlug}-${Math.floor(Date.now() / 1000)}`;
        if (attempt > 1) {
          slug = `${baseSlug}-${Date.now()}`;
        }
      }
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Committee', committeeSchema);
