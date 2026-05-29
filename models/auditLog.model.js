const mongoose = require('mongoose');
const crypto = require('crypto');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
    default: '',
  },
  previousHash: {
    type: String,
    default: '0',
  },
  hash: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Pre-save hook to calculate SHA-256 hash block chain
auditLogSchema.pre('save', async function (next) {
  try {
    // 1. Fetch the latest audit log entry to get the previous hash
    const latestLog = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });
    
    if (latestLog) {
      this.previousHash = latestLog.hash || '0';
    } else {
      this.previousHash = '0';
    }

    // 2. Compute current SHA-256 hash
    const hashPayload = [
      this.action,
      this.adminId ? this.adminId.toString() : '',
      JSON.stringify(this.details || {}),
      this.ipAddress || '',
      this.previousHash,
    ].join('|');

    this.hash = crypto.createHash('sha256').update(hashPayload).digest('hex');
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
