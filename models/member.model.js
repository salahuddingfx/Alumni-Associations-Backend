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
  pscBatch: {
    type: String,
    default: '',
  },
  hscBatch: {
    type: String,
    default: '',
  },
  higherEducation: {
    type: String,
    default: '',
  },
  bloodGroup: {
    type: String,
    default: '',
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
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male',
  },
  totpSecret: {
    type: String,
    default: '',
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

memberSchema.pre('save', async function (next) {
  if (this.isModified('name.en') || !this.slug) {
    const baseSlug = slugify(this.name.en) || 'member';
    let slug = baseSlug;
    const Member = this.constructor;
    let isUnique = false;
    let attempt = 0;
    while (!isUnique) {
      const existing = await Member.findOne({ slug, _id: { $ne: this._id } });
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

module.exports = mongoose.model('Member', memberSchema);
